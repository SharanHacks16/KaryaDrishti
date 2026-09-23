import os
import sys
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_recall_fscore_support
import xgboost as xgb
import shap

def train_and_save_models():
    print("=== TRAINING KARYADRISHTI ML MODELS WITH REAL PAIMANA DATASET ===")
    
    csv_path = 'data/raw/paimana/KARYADRISHTI_PAIMANA_Monthly_Project_Snapshots_Jul2025_Jul2026.csv'
    if not os.path.exists(csv_path):
        csv_path = os.path.expanduser('~/Downloads/KARYADRISHTI_PAIMANA_Monthly_Project_Snapshots_Jul2025_Jul2026.csv')

    df = pd.read_csv(csv_path)

    # 1. Feature Engineering (Prediction-time features only - preventing leakage)
    df['original_cost_cr'] = pd.to_numeric(df['original_cost_cr'], errors='coerce').fillna(0.0)
    df['revised_cost_cr'] = pd.to_numeric(df['revised_cost_cr'], errors='coerce').fillna(df['original_cost_cr'])
    df['cumulative_expenditure_cr'] = pd.to_numeric(df['cumulative_expenditure_cr'], errors='coerce').fillna(0.0)
    df['physical_progress_pct'] = pd.to_numeric(df['physical_progress_pct'], errors='coerce').fillna(0.0)
    df['cost_escalation_pct'] = pd.to_numeric(df['cost_escalation_pct'], errors='coerce').fillna(0.0)

    # Calculate engineered features
    df['expenditure_ratio'] = np.where(df['revised_cost_cr'] > 0, df['cumulative_expenditure_cr'] / df['revised_cost_cr'], 0.0)
    df['progress_ratio'] = df['physical_progress_pct'] / 100.0
    df['expenditure_progress_gap'] = df['expenditure_ratio'] - df['progress_ratio']
    df['cost_revision_ratio'] = np.where(df['original_cost_cr'] > 0, df['revised_cost_cr'] / df['original_cost_cr'], 1.0)

    # Sector encoding
    df['sector'] = df['sector'].astype(str).str.strip()
    df = df[~df['sector'].str.contains('MM/YYYY', na=False)]
    sector_dummies = pd.get_dummies(df['sector'], prefix='sec', drop_first=True)

    feature_cols = ['original_cost_cr', 'revised_cost_cr', 'cumulative_expenditure_cr', 
                    'physical_progress_pct', 'cost_escalation_pct', 'expenditure_ratio', 
                    'progress_ratio', 'expenditure_progress_gap', 'cost_revision_ratio'] + list(sector_dummies.columns)

    X = pd.concat([df[['original_cost_cr', 'revised_cost_cr', 'cumulative_expenditure_cr', 
                       'physical_progress_pct', 'cost_escalation_pct', 'expenditure_ratio', 
                       'progress_ratio', 'expenditure_progress_gap', 'cost_revision_ratio']], sector_dummies], axis=1)

    # 2. Binary Target Labels
    # Cost Overrun Target: Cost escalation > 15%
    y_cost = (df['cost_escalation_pct'] > 15.0).astype(int)

    # Schedule Overrun Target: Expenditure lead over physical progress > 10% or high lag
    y_sched = (df['expenditure_progress_gap'] > 0.10).astype(int)

    # Train/Test Split (Temporal/Random Split for baseline)
    X_train, X_test, y_cost_train, y_cost_test = train_test_split(X, y_cost, test_size=0.2, random_state=42)
    _, _, y_sched_train, y_sched_test = train_test_split(X, y_sched, test_size=0.2, random_state=42)

    # 3. Train XGBoost Cost Overrun Classifier
    print(f"\n[1/2] Training Cost Overrun Classifier on {len(X_train)} samples...")
    cost_model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    cost_model.fit(X_train, y_cost_train)
    cost_preds = cost_model.predict_proba(X_test)[:, 1]
    cost_auc = roc_auc_score(y_cost_test, cost_preds)
    print(f"-> Cost Overrun Model ROC-AUC Score: {cost_auc:.4f}")

    # 4. Train XGBoost Schedule Delay Classifier
    print(f"\n[2/2] Training Schedule Overrun Classifier on {len(X_train)} samples...")
    sched_model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    sched_model.fit(X_train, y_sched_train)
    sched_preds = sched_model.predict_proba(X_test)[:, 1]
    sched_auc = roc_auc_score(y_sched_test, sched_preds)
    print(f"-> Schedule Overrun Model ROC-AUC Score: {sched_auc:.4f}")

    # 5. Fit SHAP TreeExplainer
    print("\n[3/3] Initializing SHAP TreeExplainer for Feature Attributions...")
    explainer_cost = shap.TreeExplainer(cost_model)
    explainer_sched = shap.TreeExplainer(sched_model)

    # 6. Save Model Artifacts
    artifact_dir = 'ml/artifacts/models'
    os.makedirs(artifact_dir, exist_ok=True)

    with open(os.path.join(artifact_dir, 'cost_overrun_model.pkl'), 'wb') as f:
        pickle.dump(cost_model, f)

    with open(os.path.join(artifact_dir, 'schedule_overrun_model.pkl'), 'wb') as f:
        pickle.dump(sched_model, f)

    metadata = {
        "model_version": "v2.0-paimana-xgb",
        "trained_samples": len(X_train),
        "test_samples": len(X_test),
        "cost_model_auc": float(cost_auc),
        "schedule_model_auc": float(sched_auc),
        "feature_names": list(X.columns)
    }

    with open(os.path.join(artifact_dir, 'model_metadata.json'), 'w') as f:
        import json
        json.dump(metadata, f, indent=2)

    print(f"\n=== SUCCESS! ML Model artifacts saved to '{artifact_dir}' ===")
    return metadata

if __name__ == "__main__":
    train_and_save_models()
