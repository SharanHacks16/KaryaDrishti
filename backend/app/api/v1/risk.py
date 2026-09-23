from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user_payload
from app.models.domain import Project

router = APIRouter()

@router.get("/ranking")
def get_risk_ranking(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    projects = db.query(Project).order_by(Project.risk_score.desc()).all()
    
    ranked = []
    for p in projects:
        cost_esc = p.revised_cost_cr - p.original_cost_cr
        ranked.append({
            "project_id": p.id,
            "name": p.name,
            "ministry": p.ministry,
            "sector": p.sector,
            "state": p.state,
            "risk_score": p.risk_score,
            "cost_overrun_risk_pct": p.cost_overrun_risk_pct,
            "schedule_overrun_risk_pct": p.schedule_overrun_risk_pct,
            "revised_cost_cr": p.revised_cost_cr,
            "financial_exposure_cr": round(cost_esc, 2),
            "status": p.status
        })
    return {"total": len(ranked), "rankings": ranked}
