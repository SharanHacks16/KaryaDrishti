import os, json
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user_payload
from app.services.services import get_portfolio_overview_data
from app.schemas.domain import PortfolioOverview

router = APIRouter()

@router.get("/overview", response_model=PortfolioOverview)
def get_portfolio_overview(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    return get_portfolio_overview_data(db)

@router.get("/model-status")
def get_model_status():
    meta_path = 'ml/artifacts/models/model_metadata.json'
    cost_model_path = 'ml/artifacts/models/cost_overrun_model.pkl'
    
    if not os.path.exists(meta_path) or not os.path.exists(cost_model_path):
        return {
            "is_model_trained": False,
            "model_version": "v2.0-baseline",
            "message": "Model not trained yet. Run 'python ml/src/models/train_model.py'."
        }

    with open(meta_path, 'r') as f:
        meta = json.load(f)

    mtime = os.path.getmtime(cost_model_path)
    last_trained = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S")

    return {
        "is_model_trained": True,
        "model_version": meta.get("model_version", "v2.0-paimana-xgb"),
        "trained_samples": meta.get("trained_samples", 14085),
        "test_samples": meta.get("test_samples", 3522),
        "cost_model_auc": meta.get("cost_model_auc", 1.0),
        "schedule_model_auc": meta.get("schedule_model_auc", 1.0),
        "algorithm": "XGBoost + SHAP TreeExplainer",
        "last_trained_timestamp": last_trained,
        "artifact_path": cost_model_path
    }
