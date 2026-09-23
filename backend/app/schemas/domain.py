from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    email: str
    full_name: str
    department: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: Optional[str] = "Portfolio/Ministry Officer"
    department: Optional[str] = "Ministry of Infrastructure"

class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Portfolio Schemas
class PortfolioOverview(BaseModel):
    total_projects: int
    high_risk_projects: int
    critical_risk_projects: int
    total_original_cost_cr: float
    total_revised_cost_cr: float
    total_expenditure_cr: float
    total_cost_exposure_cr: float
    avg_physical_progress_pct: float
    risk_distribution: dict
    sector_breakdown: List[dict]
    state_breakdown: List[dict]
    recent_alerts_count: int
    last_refresh_period: str

# Project Schemas
class ProjectSnapshotSchema(BaseModel):
    id: int
    project_id: str
    reporting_period: str
    cost_cr: float
    expenditure_cr: float
    physical_progress_pct: float
    revised_completion_date: str
    source_document: Optional[str] = None

    class Config:
        from_attributes = True

class RiskSignalSchema(BaseModel):
    id: int
    feature_name: str
    feature_value: str
    contribution: float
    direction: str
    description: str

    class Config:
        from_attributes = True

class PredictionSchema(BaseModel):
    id: int
    project_id: str
    prediction_time: datetime
    cost_overrun_prob: float
    schedule_overrun_prob: float
    combined_risk_score: float
    model_version: str
    signals: List[RiskSignalSchema] = []

    class Config:
        from_attributes = True

class AlertSchema(BaseModel):
    id: int
    project_id: str
    alert_type: str
    severity: str
    trigger_reason: str
    supporting_evidence: str
    reporting_period: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectDetailSchema(BaseModel):
    id: str
    name: str
    ministry: str
    agency: str
    sector: str
    state: str
    location_details: Optional[str] = None
    original_cost_cr: float
    revised_cost_cr: float
    expenditure_cr: float
    physical_progress_pct: float
    start_date: str
    original_completion_date: str
    revised_completion_date: str
    status: str
    risk_score: float
    cost_overrun_risk_pct: float
    schedule_overrun_risk_pct: float
    last_reporting_period: str
    cost_escalation_pct: float
    time_elapsed_pct: float
    
    snapshots: List[ProjectSnapshotSchema] = []
    latest_prediction: Optional[PredictionSchema] = None
    alerts: List[AlertSchema] = []

    class Config:
        from_attributes = True

class ProjectListResponse(BaseModel):
    total: int
    page: int
    size: int
    projects: List[ProjectDetailSchema]

class BenchmarkSchema(BaseModel):
    sector: str
    cost_band: str
    avg_cost_overrun_pct: float
    avg_schedule_delay_months: float
    avg_progress_rate_pct_month: float
    sample_project_count: int

class WhatChangedResponse(BaseModel):
    project_id: str
    current_period: str
    previous_period: str
    cost_change_cr: float
    expenditure_change_cr: float
    progress_change_pct: float
    date_extended_days: int
    highlights: List[str]
