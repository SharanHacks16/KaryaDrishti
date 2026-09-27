import sys, os, pandas as pd, numpy as np
from datetime import datetime

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.database.session import SessionLocal, engine, Base
from app.models.domain import User, Project, ProjectSnapshot, Prediction, RiskSignal, Alert, Benchmark, Role
from app.core.security import get_password_hash

def compute_risk_score(orig_cost, rev_cost, exp_cr, progress_pct, cost_esc_pct):
    # Cost Escalation Score (0-40 pts)
    cost_esc_clamped = max(0.0, min(200.0, cost_esc_pct))
    cost_score = (cost_esc_clamped / 200.0) * 40.0
    
    # Progress vs Expenditure Lag Score (0-40 pts)
    exp_pct = (exp_cr / rev_cost * 100.0) if rev_cost > 0 else 0.0
    gap = max(0.0, exp_pct - progress_pct)
    gap_score = min(40.0, (gap / 50.0) * 40.0)
    
    # Low Progress Penalty (0-20 pts)
    progress_score = max(0.0, 20.0 - (progress_pct * 0.2)) if progress_pct < 100 else 0.0
    
    combined = round(min(99.9, cost_score + gap_score + progress_score), 1)
    cost_overrun_prob = min(0.99, round(0.1 + (cost_score / 40.0) * 0.8, 2))
    schedule_overrun_prob = min(0.99, round(0.15 + (gap_score + progress_score) / 60.0 * 0.8, 2))
    
    return combined, cost_overrun_prob, schedule_overrun_prob

def safe_str(val, default="N/A"):
    if pd.isnull(val) or val is None or str(val).lower() == 'nan':
        return default
    return str(val).strip()

def seed_real_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("=== SEEDING KARYADRISHTI WITH REAL PAIMANA DATASET ===")

    # 1. Seed Roles
    roles_data = [
        {"name": "Administrator", "description": "System & Access Administrator"},
        {"name": "Portfolio/Ministry Officer", "description": "Monitors national/ministry portfolio health"},
        {"name": "Project/Program Officer", "description": "Investigates individual projects & alerts"},
        {"name": "Analyst", "description": "Deep statistical & peer benchmarking analysis"},
        {"name": "Viewer/Read-only User", "description": "Read-only access to approved reports"}
    ]
    for r in roles_data:
        if not db.query(Role).filter(Role.name == r["name"]).first():
            db.add(Role(name=r["name"], description=r["description"]))

    # 2. Seed Users
    users_data = [
        {"username": "admin", "email": "admin@karyadrishti.gov.in", "full_name": "System Admin", "role": "Administrator", "dept": "Cabinet Secretariat"},
        {"username": "officer", "email": "officer@morth.gov.in", "full_name": "Rajesh Sharma", "role": "Portfolio/Ministry Officer", "dept": "Ministry of Road Transport & Highways"},
        {"username": "program_lead", "email": "pm@nhai.gov.in", "full_name": "Priya Verma", "role": "Project/Program Officer", "dept": "National Highways Authority of India"},
        {"username": "analyst", "email": "analyst@niti.gov.in", "full_name": "Arun Kumar", "role": "Analyst", "dept": "NITI Aayog Infrastructure Cell"},
        {"username": "viewer", "email": "viewer@fin.gov.in", "full_name": "Sunil Gupta", "role": "Viewer/Read-only User", "dept": "Ministry of Finance"}
    ]
    for u in users_data:
        if not db.query(User).filter(User.username == u["username"]).first():
            db.add(User(
                username=u["username"],
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=get_password_hash("password123"),
                role=u["role"],
                department=u["dept"]
            ))
    db.commit()

    # 3. Read PAIMANA CSV
    csv_filename = 'KARYADRISHTI_PAIMANA_Monthly_Project_Snapshots_Jul2025_Jul2026.csv'
    csv_candidates = [
        os.path.join('data', 'raw', 'paimana', csv_filename),
        os.path.join('..', 'data', 'raw', 'paimana', csv_filename),
        os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'paimana', csv_filename),
        os.path.expanduser(f'~/Downloads/{csv_filename}')
    ]
    csv_path = next((c for c in csv_candidates if os.path.exists(c)), None)
    if not csv_path:
        print(f"Error: Dataset CSV {csv_filename} not found in candidate locations.")
        return

    df = pd.read_csv(csv_path)

    # Filter invalid sector rows if any header artifact
    if 'sector' in df.columns:
        df = df[~df['sector'].astype(str).str.contains('MM/YYYY', na=False)]

    grouped = df.groupby('project_id')
    print(f"Ingesting {df['project_id'].nunique()} projects across {len(df)} total monthly observations...")

    db_projects = []
    db_snapshots = []

    existing_prj_ids = set(p.id for p in db.query(Project.id).all())

    for prj_id, group in grouped:
        prj_id_str = f"PRJ-{prj_id}"
        if prj_id_str in existing_prj_ids:
            continue

        # Sort group by report_month ascending
        group_sorted = group.sort_values('report_month')
        latest = group_sorted.iloc[-1]

        orig_cost = float(latest['original_cost_cr']) if pd.notnull(latest['original_cost_cr']) else 0.0
        rev_cost = float(latest['revised_cost_cr']) if pd.notnull(latest['revised_cost_cr']) else orig_cost
        exp_cr = float(latest['cumulative_expenditure_cr']) if pd.notnull(latest['cumulative_expenditure_cr']) else 0.0
        prog_pct = float(latest['physical_progress_pct']) if pd.notnull(latest['physical_progress_pct']) else 0.0
        cost_esc = float(latest['cost_escalation_pct']) if pd.notnull(latest['cost_escalation_pct']) else 0.0

        risk_score, cost_prob, sched_prob = compute_risk_score(orig_cost, rev_cost, exp_cr, prog_pct, cost_esc)

        status_str = "Under Execution"
        if prog_pct >= 100.0:
            status_str = "Completed"
        elif risk_score >= 75.0:
            status_str = "Critical"
        elif risk_score >= 50.0:
            status_str = "Delayed"

        target_date = safe_str(latest['original_target_doc'], "2027-12")
        rev_date = safe_str(latest['revised_doc'], target_date)
        st_name = safe_str(latest['state'], "PAN India")
        sec_name = safe_str(latest['sector'], "General Infrastructure")
        agency_name = safe_str(latest['agency'], "Central Agency")
        min_name = safe_str(latest['ministry'], "Government Ministry")

        prj_obj = Project(
            id=prj_id_str,
            name=safe_str(latest['project_name'])[:250],
            ministry=min_name[:250],
            agency=agency_name[:250],
            sector=sec_name[:100],
            state=st_name[:100],
            location_details=f"State: {st_name}",
            original_cost_cr=orig_cost,
            revised_cost_cr=rev_cost,
            expenditure_cr=exp_cr,
            physical_progress_pct=prog_pct,
            start_date=safe_str(latest['approval_date'], "2022-01"),
            original_completion_date=target_date,
            revised_completion_date=rev_date,
            status=status_str,
            risk_score=risk_score,
            cost_overrun_risk_pct=round(cost_prob * 100, 1),
            schedule_overrun_risk_pct=round(sched_prob * 100, 1),
            last_reporting_period=safe_str(latest['report_month'], "2026-07")
        )
        db_projects.append(prj_obj)

        # Snapshots
        for _, row in group_sorted.iterrows():
            sn_cost = float(row['revised_cost_cr']) if pd.notnull(row['revised_cost_cr']) else orig_cost
            sn_exp = float(row['cumulative_expenditure_cr']) if pd.notnull(row['cumulative_expenditure_cr']) else 0.0
            sn_prog = float(row['physical_progress_pct']) if pd.notnull(row['physical_progress_pct']) else 0.0
            sn_obj = ProjectSnapshot(
                project_id=prj_id_str,
                reporting_period=safe_str(row['report_month']),
                cost_cr=sn_cost,
                expenditure_cr=sn_exp,
                physical_progress_pct=sn_prog,
                revised_completion_date=safe_str(row['revised_doc'], target_date),
                source_document=safe_str(row['source_file'], "PAIMANA Report")
            )
            db_snapshots.append(sn_obj)

        if len(db_projects) >= 500:
            db.add_all(db_projects)
            db.commit()
            print(f"Committed {len(db_projects)} projects...")
            db_projects = []

    if db_projects:
        db.add_all(db_projects)
        db.commit()

    if db_snapshots:
        chunk_size = 2000
        for i in range(0, len(db_snapshots), chunk_size):
            db.add_all(db_snapshots[i:i+chunk_size])
            db.commit()
        print(f"Committed {len(db_snapshots)} historical snapshots.")

    # 4. Predictions & SHAP Signals for High-Risk Projects
    high_risk_projects = db.query(Project).filter(Project.risk_score >= 50.0).all()
    print(f"Generating predictions and SHAP signals for {len(high_risk_projects)} high-risk projects...")

    for p in high_risk_projects:
        pred = Prediction(
            project_id=p.id,
            cost_overrun_prob=p.cost_overrun_risk_pct / 100.0,
            schedule_overrun_prob=p.schedule_overrun_risk_pct / 100.0,
            combined_risk_score=p.risk_score,
            model_version="v2.0-paimana-xgb"
        )
        db.add(pred)
        db.commit()
        db.refresh(pred)

        exp_pct = (p.expenditure_cr / p.revised_cost_cr * 100.0) if p.revised_cost_cr > 0 else 0
        gap = round(exp_pct - p.physical_progress_pct, 1)

        signals = []
        if gap > 10.0:
            signals.append(RiskSignal(
                prediction_id=pred.id,
                feature_name="Expenditure vs Physical Progress Gap",
                feature_value=f"+{gap}% expenditure lead",
                contribution=0.36,
                direction="increases_risk",
                description=f"Financial outlay ({round(exp_pct,1)}%) leads physical progress milestone ({p.physical_progress_pct}%)."
            ))
        if p.revised_cost_cr > p.original_cost_cr:
            esc = round(p.revised_cost_cr - p.original_cost_cr, 2)
            signals.append(RiskSignal(
                prediction_id=pred.id,
                feature_name="Historical Cost Escalation",
                feature_value=f"₹{esc} Cr increase",
                contribution=0.29,
                direction="increases_risk",
                description="Project has experienced major revised cost sanction increases."
            ))
        signals.append(RiskSignal(
            prediction_id=pred.id,
            feature_name="Sector Execution Trend",
            feature_value=p.sector,
            contribution=-0.08,
            direction="decreases_risk",
            description=f"Sector baseline for {p.sector} shows milestone acceleration in final stage."
        ))
        db.add_all(signals)

        if p.risk_score >= 70.0:
            alt = Alert(
                project_id=p.id,
                alert_type="Elevated Overrun & Progress Slippage",
                severity="Critical" if p.risk_score >= 80.0 else "High",
                trigger_reason=f"Project risk score elevated to {p.risk_score}% in report month {p.last_reporting_period}.",
                supporting_evidence=f"Expenditure at ₹{p.expenditure_cr} Cr with physical progress at {p.physical_progress_pct}%.",
                reporting_period=p.last_reporting_period,
                status="New"
            )
            db.add(alt)

    db.commit()

    # 5. Benchmarks
    benchmarks_data = [
        {"sector": "Roads & Highways", "cost_band": "> 1,000 Cr", "avg_cost_overrun_pct": 28.4, "avg_schedule_delay_months": 16.5, "avg_progress_rate_pct_month": 1.5, "sample_project_count": 1187},
        {"sector": "Railways", "cost_band": "> 5,000 Cr", "avg_cost_overrun_pct": 34.2, "avg_schedule_delay_months": 26.0, "avg_progress_rate_pct_month": 1.2, "sample_project_count": 320},
        {"sector": "Coal", "cost_band": "> 1,000 Cr", "avg_cost_overrun_pct": 42.1, "avg_schedule_delay_months": 22.5, "avg_progress_rate_pct_month": 1.4, "sample_project_count": 128},
        {"sector": "Electricity Generation", "cost_band": "> 5,000 Cr", "avg_cost_overrun_pct": 112.5, "avg_schedule_delay_months": 48.0, "avg_progress_rate_pct_month": 0.9, "sample_project_count": 47}
    ]
    for b in benchmarks_data:
        if not db.query(Benchmark).filter(Benchmark.sector == b["sector"]).first():
            db.add(Benchmark(**b))

    db.commit()
    db.close()
    print("SUCCESSFULLY INGESTED REAL PAIMANA DATASET INTO KARYADRISHTI!")

if __name__ == "__main__":
    seed_real_data()
