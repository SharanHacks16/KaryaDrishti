export type UserRole = 
  | "Administrator"
  | "Portfolio/Ministry Officer"
  | "Project/Program Officer"
  | "Analyst"
  | "Viewer/Read-only User";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  created_at: string;
}

export interface PortfolioOverview {
  total_projects: number;
  high_risk_projects: number;
  critical_risk_projects: number;
  total_original_cost_cr: number;
  total_revised_cost_cr: number;
  total_expenditure_cr: number;
  total_cost_exposure_cr: number;
  avg_physical_progress_pct: number;
  risk_distribution: Record<string, number>;
  sector_breakdown: Array<{
    sector: string;
    count: number;
    cost_cr: number;
    avg_risk: number;
  }>;
  state_breakdown: Array<{
    state: string;
    count: number;
    avg_risk: number;
  }>;
  recent_alerts_count: number;
  last_refresh_period: string;
}

export interface ProjectSnapshot {
  id: number;
  project_id: string;
  reporting_period: string;
  cost_cr: number;
  expenditure_cr: number;
  physical_progress_pct: number;
  revised_completion_date: string;
  source_document?: string;
}

export interface RiskSignal {
  id?: number;
  feature_name: string;
  feature_value: string;
  contribution: number;
  direction: "increases_risk" | "decreases_risk";
  description: string;
}

export interface Prediction {
  id: number;
  project_id: string;
  prediction_time: string;
  cost_overrun_prob: number;
  schedule_overrun_prob: number;
  combined_risk_score: number;
  model_version: string;
  signals: RiskSignal[];
}

export interface Alert {
  id: number;
  project_id: string;
  project_name?: string;
  ministry?: string;
  sector?: string;
  alert_type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  trigger_reason: string;
  supporting_evidence: string;
  reporting_period: string;
  status: "New" | "Acknowledged" | "Under Review" | "Resolved" | "Dismissed";
  created_at: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  ministry: string;
  agency: string;
  sector: string;
  state: string;
  location_details?: string;
  original_cost_cr: number;
  revised_cost_cr: number;
  expenditure_cr: number;
  physical_progress_pct: number;
  start_date: string;
  original_completion_date: string;
  revised_completion_date: string;
  status: "Under Execution" | "Delayed" | "Critical" | "Completed";
  risk_score: number;
  cost_overrun_risk_pct: number;
  schedule_overrun_risk_pct: number;
  last_reporting_period: string;
  cost_escalation_pct: number;
  time_elapsed_pct: number;
  snapshots: ProjectSnapshot[];
  latest_prediction?: Prediction;
  alerts: Alert[];
}

export interface Benchmark {
  sector: string;
  cost_band: string;
  avg_cost_overrun_pct: number;
  avg_schedule_delay_months: number;
  avg_progress_rate_pct_month: number;
  sample_project_count: number;
}
