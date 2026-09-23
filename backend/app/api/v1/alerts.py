from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user_payload
from app.models.domain import Alert, Project

router = APIRouter()

@router.get("")
def list_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    q = db.query(Alert)
    if severity:
        q = q.filter(Alert.severity == severity)
    if status:
        q = q.filter(Alert.status == status)
    
    alerts = q.order_by(Alert.created_at.desc()).all()
    
    result = []
    for a in alerts:
        p = db.query(Project).filter(Project.id == a.project_id).first()
        result.append({
            "id": a.id,
            "project_id": a.project_id,
            "project_name": p.name if p else "Unknown Project",
            "ministry": p.ministry if p else "",
            "sector": p.sector if p else "",
            "alert_type": a.alert_type,
            "severity": a.severity,
            "trigger_reason": a.trigger_reason,
            "supporting_evidence": a.supporting_evidence,
            "reporting_period": a.reporting_period,
            "status": a.status,
            "created_at": a.created_at
        })
    return {"total": len(result), "alerts": result}

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    a = db.query(Alert).filter(Alert.id == alert_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Alert not found")
    a.status = "Acknowledged"
    db.commit()
    return {"message": "Alert status updated to Acknowledged", "alert_id": alert_id}
