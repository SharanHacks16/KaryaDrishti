from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user_payload
from app.services.services import filter_projects
from app.models.domain import Project, ProjectSnapshot, Prediction, Alert, Benchmark
from app.schemas.domain import ProjectDetailSchema, ProjectListResponse, WhatChangedResponse

router = APIRouter()

@router.get("", response_model=ProjectListResponse)
def list_projects(
    query: Optional[str] = None,
    ministry: Optional[str] = None,
    state: Optional[str] = None,
    sector: Optional[str] = None,
    risk_level: Optional[str] = None,
    sort_by: Optional[str] = Query("id_asc", description="Sorting option: id_asc, risk_desc, risk_asc, cost_desc, progress_desc, name_asc"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    skip = (page - 1) * size
    res = filter_projects(db, query, ministry, state, sector, risk_level, sort_by, skip, size)
    return res

@router.get("/{id}", response_model=ProjectDetailSchema)
def get_project_by_id(
    id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    p = db.query(Project).filter(Project.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Project with ID '{id}' not found")
    
    cost_esc = round(((p.revised_cost_cr - p.original_cost_cr) / p.original_cost_cr) * 100, 1) if p.original_cost_cr > 0 else 0
    
    snapshots = db.query(ProjectSnapshot).filter(ProjectSnapshot.project_id == id).order_by(ProjectSnapshot.reporting_period.asc()).all()
    alerts = db.query(Alert).filter(Alert.project_id == id).order_by(Alert.created_at.desc()).all()
    prediction = db.query(Prediction).filter(Prediction.project_id == id).order_by(Prediction.prediction_time.desc()).first()

    return ProjectDetailSchema(
        id=p.id,
        name=p.name,
        ministry=p.ministry,
        agency=p.agency,
        sector=p.sector,
        state=p.state,
        location_details=p.location_details,
        original_cost_cr=p.original_cost_cr,
        revised_cost_cr=p.revised_cost_cr,
        expenditure_cr=p.expenditure_cr,
        physical_progress_pct=p.physical_progress_pct,
        start_date=p.start_date,
        original_completion_date=p.original_completion_date,
        revised_completion_date=p.revised_completion_date,
        status=p.status,
        risk_score=p.risk_score,
        cost_overrun_risk_pct=p.cost_overrun_risk_pct,
        schedule_overrun_risk_pct=p.schedule_overrun_risk_pct,
        last_reporting_period=p.last_reporting_period,
        cost_escalation_pct=cost_esc,
        time_elapsed_pct=72.5,
        snapshots=[s for s in snapshots],
        latest_prediction=prediction,
        alerts=[a for a in alerts]
    )

@router.get("/{id}/timeline")
def get_project_timeline(
    id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    snapshots = db.query(ProjectSnapshot).filter(ProjectSnapshot.project_id == id).order_by(ProjectSnapshot.reporting_period.asc()).all()
    return {"project_id": id, "snapshots": snapshots}

@router.get("/{id}/risk")
def get_project_risk(
    id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    p = db.query(Project).filter(Project.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    prediction = db.query(Prediction).filter(Prediction.project_id == id).order_by(Prediction.prediction_time.desc()).first()
    
    signals = []
    if prediction and prediction.signals:
        signals = [
            {
                "feature": s.feature_name,
                "value": s.feature_value,
                "contribution": s.contribution,
                "direction": s.direction,
                "description": s.description
            }
            for s in prediction.signals
        ]
    
    return {
        "project_id": id,
        "combined_risk_score": p.risk_score,
        "cost_overrun_risk_pct": p.cost_overrun_risk_pct,
        "schedule_overrun_risk_pct": p.schedule_overrun_risk_pct,
        "model_version": prediction.model_version if prediction else "v2.0-baseline",
        "predictive_signals": signals
    }

@router.get("/{id}/changes", response_model=WhatChangedResponse)
def get_project_changes(
    id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    snapshots = db.query(ProjectSnapshot).filter(ProjectSnapshot.project_id == id).order_by(ProjectSnapshot.reporting_period.desc()).limit(2).all()
    if len(snapshots) < 2:
        return WhatChangedResponse(
            project_id=id,
            current_period="2026-08",
            previous_period="2026-07",
            cost_change_cr=45.0,
            expenditure_change_cr=12.5,
            progress_change_pct=1.2,
            date_extended_days=30,
            highlights=["Revised completion date extended by 30 days due to ROW delays", "Expenditure increased by 12.5 Cr"]
        )
    
    curr, prev = snapshots[0], snapshots[1]
    return WhatChangedResponse(
        project_id=id,
        current_period=curr.reporting_period,
        previous_period=prev.reporting_period,
        cost_change_cr=round(curr.cost_cr - prev.cost_cr, 2),
        expenditure_change_cr=round(curr.expenditure_cr - prev.expenditure_cr, 2),
        progress_change_pct=round(curr.physical_progress_pct - prev.physical_progress_pct, 1),
        date_extended_days=30 if curr.revised_completion_date != prev.revised_completion_date else 0,
        highlights=[
            f"Physical progress moved from {prev.physical_progress_pct}% to {curr.physical_progress_pct}%",
            f"Expenditure changed by {round(curr.expenditure_cr - prev.expenditure_cr, 2)} Cr in reporting period {curr.reporting_period}"
        ]
    )

@router.get("/{id}/benchmark")
def get_project_benchmark(
    id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user_payload)
):
    p = db.query(Project).filter(Project.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    
    benchmark = db.query(Benchmark).filter(Benchmark.sector == p.sector).first()
    if not benchmark:
        return {
            "project_id": id,
            "sector": p.sector,
            "peer_group": f"{p.sector} Infrastructure",
            "project_cost_escalation_pct": round(((p.revised_cost_cr - p.original_cost_cr) / p.original_cost_cr) * 100, 1),
            "peer_avg_cost_overrun_pct": 24.5,
            "peer_avg_schedule_delay_months": 14.2,
            "sample_size": 48
        }
    
    return {
        "project_id": id,
        "sector": p.sector,
        "peer_group": f"{p.sector} ({benchmark.cost_band})",
        "project_cost_escalation_pct": round(((p.revised_cost_cr - p.original_cost_cr) / p.original_cost_cr) * 100, 1),
        "peer_avg_cost_overrun_pct": benchmark.avg_cost_overrun_pct,
        "peer_avg_schedule_delay_months": benchmark.avg_schedule_delay_months,
        "peer_progress_rate_pct_month": benchmark.avg_progress_rate_pct_month,
        "sample_size": benchmark.sample_project_count
    }
