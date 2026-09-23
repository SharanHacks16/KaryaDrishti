from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.domain import User, Project, ProjectSnapshot, Prediction, RiskSignal, Alert, Benchmark, AuditLog
from app.schemas.domain import PortfolioOverview, ProjectDetailSchema

def get_portfolio_overview_data(db: Session) -> PortfolioOverview:
    projects = db.query(Project).all()
    if not projects:
        # Fallback default empty or initial state
        return PortfolioOverview(
            total_projects=0,
            high_risk_projects=0,
            critical_risk_projects=0,
            total_original_cost_cr=0.0,
            total_revised_cost_cr=0.0,
            total_expenditure_cr=0.0,
            total_cost_exposure_cr=0.0,
            avg_physical_progress_pct=0.0,
            risk_distribution={"Low": 0, "Medium": 0, "High": 0, "Critical": 0},
            sector_breakdown=[],
            state_breakdown=[],
            recent_alerts_count=0,
            last_refresh_period="2026-08"
        )
    
    total_projects = len(projects)
    high_risk = sum(1 for p in projects if 50.0 <= p.risk_score < 75.0)
    critical_risk = sum(1 for p in projects if p.risk_score >= 75.0)
    
    total_orig = sum(p.original_cost_cr for p in projects)
    total_rev = sum(p.revised_cost_cr for p in projects)
    total_exp = sum(p.expenditure_cr for p in projects)
    total_exposure = max(0.0, total_rev - total_orig)
    avg_progress = sum(p.physical_progress_pct for p in projects) / total_projects if total_projects > 0 else 0
    
    risk_dist = {
        "Low (0-25)": sum(1 for p in projects if p.risk_score < 25.0),
        "Medium (25-50)": sum(1 for p in projects if 25.0 <= p.risk_score < 50.0),
        "High (50-75)": sum(1 for p in projects if 50.0 <= p.risk_score < 75.0),
        "Critical (75-100)": sum(1 for p in projects if p.risk_score >= 75.0),
    }

    # Sector breakdown
    sectors: Dict[str, Dict[str, Any]] = {}
    for p in projects:
        if p.sector not in sectors:
            sectors[p.sector] = {"sector": p.sector, "count": 0, "cost_cr": 0.0, "avg_risk": 0.0}
        sectors[p.sector]["count"] += 1
        sectors[p.sector]["cost_cr"] += p.revised_cost_cr
        sectors[p.sector]["avg_risk"] += p.risk_score
    
    sector_list = []
    for s_name, data in sectors.items():
        data["avg_risk"] = round(data["avg_risk"] / data["count"], 1)
        sector_list.append(data)

    # State breakdown
    states: Dict[str, Dict[str, Any]] = {}
    for p in projects:
        if p.state not in states:
            states[p.state] = {"state": p.state, "count": 0, "avg_risk": 0.0}
        states[p.state]["count"] += 1
        states[p.state]["avg_risk"] += p.risk_score
    
    state_list = []
    for st_name, data in states.items():
        data["avg_risk"] = round(data["avg_risk"] / data["count"], 1)
        state_list.append(data)

    recent_alerts = db.query(Alert).count()

    return PortfolioOverview(
        total_projects=total_projects,
        high_risk_projects=high_risk,
        critical_risk_projects=critical_risk,
        total_original_cost_cr=round(total_orig, 2),
        total_revised_cost_cr=round(total_rev, 2),
        total_expenditure_cr=round(total_exp, 2),
        total_cost_exposure_cr=round(total_exposure, 2),
        avg_physical_progress_pct=round(avg_progress, 1),
        risk_distribution=risk_dist,
        sector_breakdown=sector_list,
        state_breakdown=state_list,
        recent_alerts_count=recent_alerts,
        last_refresh_period="2026-08"
    )

def filter_projects(
    db: Session,
    query: Optional[str] = None,
    ministry: Optional[str] = None,
    state: Optional[str] = None,
    sector: Optional[str] = None,
    risk_level: Optional[str] = None,
    sort_by: Optional[str] = "id_asc",
    skip: int = 0,
    limit: int = 50
):
    q = db.query(Project)
    if query:
        search_fmt = f"%{query}%"
        q = q.filter((Project.name.ilike(search_fmt)) | (Project.id.ilike(search_fmt)) | (Project.agency.ilike(search_fmt)))
    if ministry:
        q = q.filter(Project.ministry == ministry)
    if state:
        q = q.filter(Project.state == state)
    if sector:
        q = q.filter(Project.sector == sector)
    if risk_level:
        if risk_level == "Critical":
            q = q.filter(Project.risk_score >= 75.0)
        elif risk_level == "High":
            q = q.filter(Project.risk_score >= 50.0, Project.risk_score < 75.0)
        elif risk_level == "Medium":
            q = q.filter(Project.risk_score >= 25.0, Project.risk_score < 50.0)
        elif risk_level == "Low":
            q = q.filter(Project.risk_score < 25.0)

    total = q.count()

    if sort_by == "risk_desc":
        q = q.order_by(Project.risk_score.desc())
    elif sort_by == "risk_asc":
        q = q.order_by(Project.risk_score.asc())
    elif sort_by == "cost_desc":
        q = q.order_by(Project.revised_cost_cr.desc())
    elif sort_by == "progress_desc":
        q = q.order_by(Project.physical_progress_pct.desc())
    elif sort_by == "name_asc":
        q = q.order_by(Project.name.asc())
    else:
        q = q.order_by(Project.id.asc())

    projects = q.offset(skip).limit(limit).all()
    
    res = []
    for p in projects:
        cost_esc = round(((p.revised_cost_cr - p.original_cost_cr) / p.original_cost_cr) * 100, 1) if p.original_cost_cr > 0 else 0
        p_dict = ProjectDetailSchema(
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
            time_elapsed_pct=65.0, # Computed demo time elapsed
            snapshots=[],
            alerts=[]
        )
        res.append(p_dict)
    
    return {"total": total, "page": (skip // limit) + 1, "size": limit, "projects": res}
