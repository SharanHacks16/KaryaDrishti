import sys, os, pickle, json, pandas as pd, numpy as np
from datetime import datetime

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.database.session import SessionLocal, engine
from app.models.domain import Project, Prediction, RiskSignal, Alert
import xgboost as xgb
import shap

def run_ml_inference_and_update_db():
    print("=== EXECUTING TRAINED XGBOOST + SHAP INFERENCE ON ALL 2,243 PROJECTS ===")
    
    artifact_dir = 'ml/artifacts/models'
    cost_model_path = os.path.join(artifact_dir, 'cost_overrun_model.pkl')
    sched_model_path = os.path.join(artifact_dir, 'schedule_overrun_model.pkl')
    meta_path = os.path.join(artifact_dir, 'model_metadata.json')

    if not os.path.exists(cost_model_path) or not os.path.exists(sched_model_path):
        print("Error: Trained model artifacts not found. Run 'python ml/src/models/train_model.py' first.")
        return

    with open(cost_model_path, 'rb') as f:
        cost_model = pickle.load(f)

    with open(sched_model_path, 'rb') as f:
        sched_model = pickle.load(f)

    with open(meta_path, 'r') as f:
        metadata = json.load(f)

    feature_cols = metadata['feature_names']
    explainer_cost = shap.TreeExplainer(cost_model)

    db = SessionLocal()
    projects = db.query(Project).all()
    print(f"Loaded {len(projects)} projects from database for ML inference...")

    # Load sectors for dummy alignment
    all_sectors = set(p.sector for p in projects if p.sector)

    predictions_to_add = []
    signals_to_add = []

    for p in projects:
        orig_cost = p.original_cost_cr
        rev_cost = p.revised_cost_cr
        exp_cr = p.expenditure_cr
        prog_pct = p.physical_progress_pct
        cost_esc = round(((rev_cost - orig_cost) / orig_cost) * 100, 2) if orig_cost > 0 else 0.0

        exp_ratio = (exp_cr / rev_cost) if rev_cost > 0 else 0.0
        prog_ratio = prog_pct / 100.0
        exp_prog_gap = exp_ratio - prog_ratio
        cost_rev_ratio = (rev_cost / orig_cost) if orig_cost > 0 else 1.0

        # Build feature dict matching training columns
        feat_dict = {
            'original_cost_cr': orig_cost,
            'revised_cost_cr': rev_cost,
            'cumulative_expenditure_cr': exp_cr,
            'physical_progress_pct': prog_pct,
            'cost_escalation_pct': cost_esc,
            'expenditure_ratio': exp_ratio,
            'progress_ratio': prog_ratio,
            'expenditure_progress_gap': exp_prog_gap,
            'cost_revision_ratio': cost_rev_ratio
        }

        # Sector dummy columns
        for col in feature_cols:
            if col.startswith('sec_'):
                sec_name = col[4:]
                feat_dict[col] = 1.0 if p.sector == sec_name else 0.0

        feat_df = pd.DataFrame([feat_dict])[feature_cols]

        # Predict ML probabilities
        cost_prob = float(cost_model.predict_proba(feat_df)[0, 1])
        sched_prob = float(sched_model.predict_proba(feat_df)[0, 1])

        # Combined Decision Score (0-100)
        combined_score = round(min(99.9, (cost_prob * 45.0) + (sched_prob * 45.0) + max(0.0, exp_prog_gap * 10.0)), 1)

        # Update Project record with ML outputs
        p.risk_score = combined_score
        p.cost_overrun_risk_pct = round(cost_prob * 100, 1)
        p.schedule_overrun_risk_pct = round(sched_prob * 100, 1)
        
        if prog_pct >= 100.0:
            p.status = "Completed"
        elif combined_score >= 75.0:
            p.status = "Critical"
        elif combined_score >= 50.0:
            p.status = "Delayed"
        else:
            p.status = "Under Execution"

        # Compute True SHAP Feature Attributions
        shap_vals = explainer_cost.shap_values(feat_df)[0]

        # Create Prediction record
        pred = Prediction(
            project_id=p.id,
            cost_overrun_prob=cost_prob,
            schedule_overrun_prob=sched_prob,
            combined_risk_score=combined_score,
            model_version="v2.0-paimana-xgb"
        )
        db.add(pred)
        db.commit()
        db.refresh(pred)

        # Extract top SHAP signals
        top_shap_idx = np.argsort(np.abs(shap_vals))[-3:][::-1]
        for idx in top_shap_idx:
            feat_name = feature_cols[idx]
            val_num = feat_df.iloc[0, idx]
            contrib = round(float(shap_vals[idx]), 3)

            if abs(contrib) < 0.001:
                continue

            direction = "increases_risk" if contrib > 0 else "decreases_risk"

            # Clean display label
            display_name = feat_name.replace('_', ' ').title()
            if feat_name == 'expenditure_progress_gap':
                display_name = "Expenditure vs Physical Progress Gap"
                desc = f"Financial outlay ratio leads physical milestone completion rate by {round(val_num * 100, 1)}%."
            elif feat_name == 'cost_escalation_pct':
                display_name = "Cost Escalation Percentage"
                desc = f"Historical revised cost sanction has escalated by {round(val_num, 1)}%."
            elif feat_name == 'physical_progress_pct':
                display_name = "Physical Progress Completion"
                desc = f"Reported milestone completion is at {val_num}%."
            else:
                desc = f"Feature '{display_name}' value is {val_num}."

            sig = RiskSignal(
                prediction_id=pred.id,
                feature_name=display_name,
                feature_value=str(round(val_num, 2)),
                contribution=contrib,
                direction=direction,
                description=desc
            )
            db.add(sig)

    db.commit()
    db.close()
    print("=== ML INFERENCE COMPLETE! DATABASE UPDATED WITH TRUE XGBOOST & SHAP OUTPUTS ===")

if __name__ == "__main__":
    run_ml_inference_and_update_db()
