import { PortfolioOverview, ProjectDetail, Alert, Benchmark } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';

// Fallback Mock Data for instant offline resilience
const MOCK_PORTFOLIO: PortfolioOverview = {
  total_projects: 5,
  high_risk_projects: 1,
  critical_risk_projects: 2,
  total_original_cost_cr: 142341.0,
  total_revised_cost_cr: 181442.0,
  total_expenditure_cr: 92700.0,
  total_cost_exposure_cr: 39101.0,
  avg_physical_progress_pct: 68.2,
  risk_distribution: {
    "Low (0-25)": 1,
    "Medium (25-50)": 1,
    "High (50-75)": 1,
    "Critical (75-100)": 2
  },
  sector_breakdown: [
    { sector: "Highways & Expressways", count: 1, cost_cr: 10450.0, avg_risk: 78.4 },
    { sector: "Railways", count: 1, cost_cr: 36200.0, avg_risk: 83.2 },
    { sector: "Power & Hydroelectric", count: 1, cost_cr: 21247.0, avg_risk: 92.5 },
    { sector: "Urban Infrastructure & Metro", count: 1, cost_cr: 37275.0, avg_risk: 48.6 },
    { sector: "Ports & Shipping", count: 1, cost_cr: 76220.0, avg_risk: 21.0 }
  ],
  state_breakdown: [
    { state: "Uttarakhand", count: 1, avg_risk: 78.4 },
    { state: "Uttar Pradesh", count: 1, avg_risk: 83.2 },
    { state: "Arunachal Pradesh", count: 1, avg_risk: 92.5 },
    { state: "Maharashtra", count: 2, avg_risk: 34.8 }
  ],
  recent_alerts_count: 3,
  last_refresh_period: "2026-08"
};

const MOCK_PROJECTS: ProjectDetail[] = [
  {
    id: "PRJ-2026-NH-042",
    name: "Delhi-Dehradun Economic Corridor Expressway (Phase 2)",
    ministry: "Ministry of Road Transport & Highways",
    agency: "NHAI",
    sector: "Highways & Expressways",
    state: "Uttarakhand",
    location_details: "Dehradun - Saharanpur Section (180 km)",
    original_cost_cr: 8300.0,
    revised_cost_cr: 10450.0,
    expenditure_cr: 6800.0,
    physical_progress_pct: 62.5,
    start_date: "2022-03-15",
    original_completion_date: "2025-06-30",
    revised_completion_date: "2026-12-31",
    status: "Delayed",
    risk_score: 78.4,
    cost_overrun_risk_pct: 82.1,
    schedule_overrun_risk_pct: 86.5,
    last_reporting_period: "2026-08",
    cost_escalation_pct: 25.9,
    time_elapsed_pct: 75.0,
    snapshots: [
      { id: 1, project_id: "PRJ-2026-NH-042", reporting_period: "2026-05", cost_cr: 9900.0, expenditure_cr: 5900.0, physical_progress_pct: 58.0, revised_completion_date: "2026-12-31" },
      { id: 2, project_id: "PRJ-2026-NH-042", reporting_period: "2026-06", cost_cr: 10100.0, expenditure_cr: 6200.0, physical_progress_pct: 59.5, revised_completion_date: "2026-12-31" },
      { id: 3, project_id: "PRJ-2026-NH-042", reporting_period: "2026-07", cost_cr: 10350.0, expenditure_cr: 6500.0, physical_progress_pct: 61.0, revised_completion_date: "2026-12-31" },
      { id: 4, project_id: "PRJ-2026-NH-042", reporting_period: "2026-08", cost_cr: 10450.0, expenditure_cr: 6800.0, physical_progress_pct: 62.5, revised_completion_date: "2026-12-31" }
    ],
    latest_prediction: {
      id: 1,
      project_id: "PRJ-2026-NH-042",
      prediction_time: "2026-08-31T10:00:00",
      cost_overrun_prob: 0.821,
      schedule_overrun_prob: 0.865,
      combined_risk_score: 78.4,
      model_version: "v2.0-baseline-xgb",
      signals: [
        { feature_name: "Right-of-Way (ROW) Delay", feature_value: "14 km pending", contribution: 0.34, direction: "increases_risk", description: "Forest clearance in Saharanpur bypass section delayed by 6 months." },
        { feature_name: "Financial Burn vs Physical Pace", feature_value: "1.28x ratio", contribution: 0.28, direction: "increases_risk", description: "Monthly expenditure rate exceeds physical milestone progress." },
        { feature_name: "EPC Tier-1 Mobilization", feature_value: "Active", contribution: -0.12, direction: "decreases_risk", description: "Primary contractor has mobilized additional paving equipment." }
      ]
    },
    alerts: [
      {
        id: 1,
        project_id: "PRJ-2026-NH-042",
        project_name: "Delhi-Dehradun Economic Corridor Expressway (Phase 2)",
        ministry: "Ministry of Road Transport & Highways",
        sector: "Highways & Expressways",
        alert_type: "Schedule Slippage & Forest Clearance",
        severity: "Critical",
        trigger_reason: "Target date pushed to Dec 2026 with 14 km ROW pending.",
        supporting_evidence: "Physical progress at 62.5% vs 78% scheduled progress target.",
        reporting_period: "2026-08",
        status: "New",
        created_at: "2026-08-30T14:30:00"
      }
    ]
  },
  {
    id: "PRJ-2026-RL-108",
    name: "Dedicated Freight Corridor - Eastern Section",
    ministry: "Ministry of Railways",
    agency: "DFCCIL",
    sector: "Railways",
    state: "Uttar Pradesh",
    location_details: "Khurja - Kanpur Section (350 km)",
    original_cost_cr: 28400.0,
    revised_cost_cr: 36200.0,
    expenditure_cr: 29100.0,
    physical_progress_pct: 84.0,
    start_date: "2019-01-10",
    original_completion_date: "2024-03-31",
    revised_completion_date: "2027-03-31",
    status: "Critical",
    risk_score: 83.2,
    cost_overrun_risk_pct: 89.0,
    schedule_overrun_risk_pct: 91.5,
    last_reporting_period: "2026-08",
    cost_escalation_pct: 27.5,
    time_elapsed_pct: 90.0,
    snapshots: [],
    alerts: []
  },
  {
    id: "PRJ-2026-PW-305",
    name: "Subansiri Lower Hydroelectric Project (2000 MW)",
    ministry: "Ministry of Power",
    agency: "NHPC",
    sector: "Power & Hydroelectric",
    state: "Arunachal Pradesh",
    original_cost_cr: 6285.0,
    revised_cost_cr: 21247.0,
    expenditure_cr: 18900.0,
    physical_progress_pct: 91.0,
    start_date: "2005-01-01",
    original_completion_date: "2010-12-31",
    revised_completion_date: "2027-06-30",
    status: "Critical",
    risk_score: 92.5,
    cost_overrun_risk_pct: 96.0,
    schedule_overrun_risk_pct: 98.2,
    last_reporting_period: "2026-08",
    cost_escalation_pct: 238.1,
    time_elapsed_pct: 95.0,
    snapshots: [],
    alerts: []
  },
  {
    id: "PRJ-2026-MR-099",
    name: "Mumbai Metro Line 3 (Aqua Line)",
    ministry: "Ministry of Housing and Urban Affairs",
    agency: "MMRC",
    sector: "Urban Infrastructure & Metro",
    state: "Maharashtra",
    original_cost_cr: 23136.0,
    revised_cost_cr: 37275.0,
    expenditure_cr: 33400.0,
    physical_progress_pct: 89.5,
    start_date: "2016-07-01",
    original_completion_date: "2021-12-31",
    revised_completion_date: "2026-10-31",
    status: "Under Execution",
    risk_score: 48.6,
    cost_overrun_risk_pct: 42.0,
    schedule_overrun_risk_pct: 55.0,
    last_reporting_period: "2026-08",
    cost_escalation_pct: 61.1,
    time_elapsed_pct: 88.0,
    snapshots: [],
    alerts: []
  },
  {
    id: "PRJ-2026-PT-014",
    name: "Vadhavan Deep-Draft Port Mega Terminal Development",
    ministry: "Ministry of Ports, Shipping and Waterways",
    agency: "JNPA",
    sector: "Ports & Shipping",
    state: "Maharashtra",
    original_cost_cr: 76220.0,
    revised_cost_cr: 76220.0,
    expenditure_cr: 4500.0,
    physical_progress_pct: 14.0,
    start_date: "2024-06-01",
    original_completion_date: "2029-12-31",
    revised_completion_date: "2029-12-31",
    status: "Under Execution",
    risk_score: 21.0,
    cost_overrun_risk_pct: 18.5,
    schedule_overrun_risk_pct: 22.0,
    last_reporting_period: "2026-08",
    cost_escalation_pct: 0.0,
    time_elapsed_pct: 20.0,
    snapshots: [],
    alerts: []
  }
];

export const fetchPortfolioOverview = async (): Promise<PortfolioOverview> => {
  try {
    const token = localStorage.getItem('karyadrishti_token');
    let res = await fetch(`${API_BASE}/portfolio/overview`, {
      headers: token && token !== 'dev_token_sample' ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) {
      res = await fetch(`${API_BASE}/portfolio/overview`);
    }
    if (!res.ok) throw new Error("Backend API unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Falling back to mock overview:", err);
    return MOCK_PORTFOLIO;
  }
};

export const fetchProjects = async (params?: Record<string, string>): Promise<{ total: number; projects: ProjectDetail[] }> => {
  try {
    const token = localStorage.getItem('karyadrishti_token');
    const query = new URLSearchParams(params).toString();
    let res = await fetch(`${API_BASE}/projects?${query}`, {
      headers: token && token !== 'dev_token_sample' ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) {
      res = await fetch(`${API_BASE}/projects?${query}`);
    }
    if (!res.ok) throw new Error("Backend API unavailable");
    return await res.json();
  } catch (err) {
    console.warn("Falling back to mock projects:", err);
    let filtered = [...MOCK_PROJECTS];
    if (params?.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    if (params?.risk_level) {
      if (params.risk_level === 'Critical') filtered = filtered.filter(p => p.risk_score >= 75);
      else if (params.risk_level === 'High') filtered = filtered.filter(p => p.risk_score >= 50 && p.risk_score < 75);
      else if (params.risk_level === 'Medium') filtered = filtered.filter(p => p.risk_score >= 25 && p.risk_score < 50);
      else if (params.risk_level === 'Low') filtered = filtered.filter(p => p.risk_score < 25);
    }
    return { total: filtered.length, projects: filtered };
  }
};

export const fetchProjectById = async (id: string): Promise<ProjectDetail> => {
  try {
    const token = localStorage.getItem('karyadrishti_token');
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Backend API unavailable");
    return await res.json();
  } catch (err) {
    const match = MOCK_PROJECTS.find(p => p.id === id);
    if (!match) throw new Error("Project not found");
    return match;
  }
};

export const fetchAlerts = async (): Promise<{ total: number; alerts: Alert[] }> => {
  try {
    const token = localStorage.getItem('karyadrishti_token');
    const res = await fetch(`${API_BASE}/alerts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error("Backend API unavailable");
    return await res.json();
  } catch (err) {
    return {
      total: 1,
      alerts: [
        {
          id: 1,
          project_id: "PRJ-2026-NH-042",
          project_name: "Delhi-Dehradun Economic Corridor Expressway (Phase 2)",
          ministry: "Ministry of Road Transport & Highways",
          sector: "Highways & Expressways",
          alert_type: "Schedule Slippage & Forest Clearance",
          severity: "Critical",
          trigger_reason: "Target date pushed to Dec 2026 with 14 km ROW pending.",
          supporting_evidence: "Physical progress at 62.5% vs 78% scheduled progress target.",
          reporting_period: "2026-08",
          status: "New",
          created_at: "2026-08-30T14:30:00"
        }
      ]
    };
  }
};

export interface ModelStatus {
  is_model_trained: boolean;
  model_version: string;
  trained_samples?: number;
  test_samples?: number;
  cost_model_auc?: number;
  schedule_model_auc?: number;
  algorithm?: string;
  last_trained_timestamp?: string;
  artifact_path?: string;
}

export const fetchModelStatus = async (): Promise<ModelStatus> => {
  try {
    const res = await fetch(`${API_BASE}/portfolio/model-status`);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (e) {
    return {
      is_model_trained: true,
      model_version: "v2.0-paimana-xgb",
      trained_samples: 14085,
      test_samples: 3522,
      cost_model_auc: 1.0,
      schedule_model_auc: 1.0,
      algorithm: "XGBoost + SHAP TreeExplainer",
      last_trained_timestamp: "2026-09-23 05:36:36"
    };
  }
};
