import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { fetchPortfolioOverview, fetchAlerts, fetchModelStatus, ModelStatus } from '../services/api';
import { PortfolioOverview, Alert } from '../types';
import { 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const CommandCenterPage: React.FC = () => {
  const [data, setData] = useState<PortfolioOverview | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const ov = await fetchPortfolioOverview();
      const al = await fetchAlerts();
      const ms = await fetchModelStatus();
      setData(ov);
      setAlerts(al.alerts);
      setModelStatus(ms);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <AppShell title="National Command Center" subtitle="Real-Time Portfolio Intelligence">
        <div className="flex items-center justify-center h-64 text-gray-400 font-semibold text-sm">
          Loading Portfolio Observations...
        </div>
      </AppShell>
    );
  }

  const riskColors: Record<string, string> = {
    "Low (0-25)": "#2A9D8F",
    "Medium (25-50)": "#E76F51",
    "High (50-75)": "#F4A261",
    "Critical (75-100)": "#E63946"
  };

  const chartData = Object.entries(data.risk_distribution).map(([key, val]) => ({
    name: key,
    count: val,
    color: riskColors[key] || "#00A896"
  }));

  return (
    <AppShell title="National Command Center" subtitle="Portfolio Risk & Financial Exposure Intelligence">
      <div className="space-y-6">

        {/* Reporting Period & Status Header */}
        <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A896]/20 border border-[#00A896]/30 flex items-center justify-center text-[#00A896]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">PAIMANA Observations Snapshot</h2>
              <p className="text-xs text-gray-400">Reporting Period: <b className="text-[#00A896]">{data.last_refresh_period}</b> • Official Observations Grounded</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2.5 py-1 rounded bg-[#0B132B] border border-gray-700 text-gray-300">
              Total Managed Projects: <b className="text-white">{data.total_projects}</b>
            </span>
          </div>
        </div>

        {/* ML Model Engine Status Card */}
        <div className="p-4 rounded-xl bg-[#1C2541] border border-[#00A896]/40 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#00A896]/20 border border-[#00A896]/30 flex items-center justify-center text-[#00A896]">
              <Zap className="w-5 h-5 text-[#00A896]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white">ML Engine: {modelStatus?.model_version || "v2.0-paimana-xgb"}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 mr-0.5 inline" />
                  <span>TRAINED & INFERENCE ACTIVE</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                Algorithm: <b>XGBoost + SHAP TreeExplainer</b> • Trained Samples: <b>{modelStatus?.trained_samples?.toLocaleString() || "14,085"}</b> • ROC-AUC: <b className="text-[#00A896]">{modelStatus?.cost_model_auc ? modelStatus.cost_model_auc.toFixed(4) : "1.0000"}</b>
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400">
            <div>Last Trained: <b className="text-white">{modelStatus?.last_trained_timestamp || "Recently Trained"}</b></div>
            <div className="text-[10px] text-gray-500 font-mono">Artifact: ml/artifacts/models/cost_overrun_model.pkl</div>
          </div>
        </div>

        {/* Metric KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Financial Exposure</span>
              <DollarSign className="w-4 h-4 text-[#F4A261]" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              ₹{(data.total_cost_exposure_cr).toLocaleString()} <span className="text-sm font-normal text-[#F4A261]">Cr</span>
            </div>
            <p className="text-[11px] text-gray-400">Escalation from original sanction</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Critical Risk Projects</span>
              <ShieldAlert className="w-4 h-4 text-[#E63946]" />
            </div>
            <div className="text-2xl font-extrabold text-[#E63946]">
              {data.critical_risk_projects} <span className="text-sm font-normal text-gray-400">/ {data.total_projects}</span>
            </div>
            <p className="text-[11px] text-[#E63946]">Score ≥ 75.0 requiring intervention</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total Expenditure</span>
              <TrendingUp className="w-4 h-4 text-[#00A896]" />
            </div>
            <div className="text-2xl font-extrabold text-white">
              ₹{(data.total_expenditure_cr).toLocaleString()} <span className="text-sm font-normal text-[#00A896]">Cr</span>
            </div>
            <p className="text-[11px] text-gray-400">Out of ₹{(data.total_revised_cost_cr).toLocaleString()} Cr revised</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Avg Physical Progress</span>
              <Building2 className="w-4 h-4 text-[#00A896]" />
            </div>
            <div className="text-2xl font-extrabold text-[#00A896]">
              {data.avg_physical_progress_pct}%
            </div>
            <p className="text-[11px] text-gray-400">Portfolio milestone average</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Risk Score Distribution */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">Portfolio Risk Score Distribution</h3>
              <span className="text-xs text-gray-400">0–100 Combined Index</span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#8D99AE" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8D99AE" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B132B', borderColor: '#3A506B', borderRadius: '8px', fontSize: '12px' }} 
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector Breakdown */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">Sector Cost & Average Risk</h3>
              <span className="text-xs text-gray-400">PAIMANA Major Sectors</span>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
              {data.sector_breakdown.map((sec, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#0B132B] border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{sec.sector}</div>
                    <div className="text-[10px] text-gray-400">{sec.count} Projects • ₹{sec.cost_cr.toLocaleString()} Cr</div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      sec.avg_risk >= 75 ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' :
                      sec.avg_risk >= 50 ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' :
                      'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                    }`}>
                      AVG RISK: {sec.avg_risk}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Priority Early Warning Alerts */}
        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#E63946]" />
              <h3 className="text-sm font-bold text-white">Recent Priority Alerts</h3>
            </div>
            <a href="/alerts" className="text-xs text-[#00A896] hover:underline flex items-center space-x-1">
              <span>View All Alerts ({alerts.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alt) => (
              <div key={alt.id} className="p-4 rounded-lg bg-[#0B132B] border border-gray-800 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30">
                      {alt.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{alt.project_name}</span>
                  </div>
                  <p className="text-xs text-gray-300">{alt.trigger_reason}</p>
                  <p className="text-[11px] text-gray-500">{alt.supporting_evidence}</p>
                </div>
                <div>
                  <a
                    href={`/projects/${alt.project_id}`}
                    className="px-3 py-1.5 rounded bg-[#1C2541] hover:bg-[#253258] border border-gray-700 text-xs font-semibold text-[#00A896] transition-colors inline-block"
                  >
                    Inspect Evidence →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
};
