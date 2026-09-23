from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(100), default="Portfolio/Ministry Officer", nullable=False)
    department = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    permissions = Column(JSON, default=[])

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(50), primary_key=True, index=True) # e.g. PRJ-2026-NH-042
    name = Column(String(255), index=True, nullable=False)
    ministry = Column(String(255), index=True, nullable=False)
    agency = Column(String(255), index=True, nullable=False)
    sector = Column(String(100), index=True, nullable=False) # e.g. Highways, Railways, Power
    state = Column(String(100), index=True, nullable=False)
    location_details = Column(String(255), nullable=True)
    original_cost_cr = Column(Float, nullable=False)
    revised_cost_cr = Column(Float, nullable=False)
    expenditure_cr = Column(Float, nullable=False)
    physical_progress_pct = Column(Float, nullable=False)
    start_date = Column(String(20), nullable=False)
    original_completion_date = Column(String(20), nullable=False)
    revised_completion_date = Column(String(20), nullable=False)
    status = Column(String(50), default="Under Execution") # Under Execution, Delayed, Critical, Completed
    risk_score = Column(Float, default=0.0) # 0-100 score
    cost_overrun_risk_pct = Column(Float, default=0.0)
    schedule_overrun_risk_pct = Column(Float, default=0.0)
    last_reporting_period = Column(String(20), nullable=False) # e.g. 2026-08
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    snapshots = relationship("ProjectSnapshot", back_populates="project", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="project", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="project", cascade="all, delete-orphan")

class ProjectSnapshot(Base):
    __tablename__ = "project_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), index=True, nullable=False)
    reporting_period = Column(String(20), nullable=False, index=True) # YYYY-MM
    cost_cr = Column(Float, nullable=False)
    expenditure_cr = Column(Float, nullable=False)
    physical_progress_pct = Column(Float, nullable=False)
    revised_completion_date = Column(String(20), nullable=False)
    source_document = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="snapshots")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), index=True, nullable=False)
    prediction_time = Column(DateTime, default=datetime.utcnow)
    cost_overrun_prob = Column(Float, nullable=False)
    schedule_overrun_prob = Column(Float, nullable=False)
    combined_risk_score = Column(Float, nullable=False)
    model_version = Column(String(50), nullable=False, default="v2.0-baseline")
    
    project = relationship("Project", back_populates="predictions")
    signals = relationship("RiskSignal", back_populates="prediction", cascade="all, delete-orphan")

class RiskSignal(Base):
    __tablename__ = "risk_signals"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), index=True, nullable=False)
    feature_name = Column(String(100), nullable=False)
    feature_value = Column(String(100), nullable=False)
    contribution = Column(Float, nullable=False) # SHAP contribution value
    direction = Column(String(20), nullable=False) # 'increases_risk' or 'decreases_risk'
    description = Column(Text, nullable=False)

    prediction = relationship("Prediction", back_populates="signals")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(50), ForeignKey("projects.id"), index=True, nullable=False)
    alert_type = Column(String(100), nullable=False) # Cost Escalation, Schedule Slippage, Deteriorating Trajectory, Data Quality Warning
    severity = Column(String(20), nullable=False) # High, Medium, Low, Critical
    trigger_reason = Column(Text, nullable=False)
    supporting_evidence = Column(Text, nullable=False)
    reporting_period = Column(String(20), nullable=False)
    status = Column(String(50), default="New") # New, Acknowledged, Under Review, Resolved, Dismissed
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="alerts")

class Benchmark(Base):
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    sector = Column(String(100), index=True, nullable=False)
    cost_band = Column(String(50), nullable=False) # e.g., > 1000 Cr
    avg_cost_overrun_pct = Column(Float, nullable=False)
    avg_schedule_delay_months = Column(Float, nullable=False)
    avg_progress_rate_pct_month = Column(Float, nullable=False)
    sample_project_count = Column(Integer, nullable=False)

class ScenarioResult(Base):
    __tablename__ = "scenario_results"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(50), nullable=False)
    scenario_name = Column(String(100), nullable=False)
    delay_months_input = Column(Integer, default=0)
    expenditure_change_pct_input = Column(Float, default=0.0)
    projected_cost_cr = Column(Float, nullable=False)
    projected_risk_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataQualityEvent(Base):
    __tablename__ = "data_quality_events"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(50), nullable=False)
    issue_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False)
    details = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    resource = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    version_tag = Column(String(50), unique=True, nullable=False)
    model_type = Column(String(100), nullable=False) # Cost Overrun, Schedule Delay
    trained_at = Column(DateTime, default=datetime.utcnow)
    metrics_json = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
