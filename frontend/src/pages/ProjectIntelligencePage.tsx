import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { fetchProjectById } from '../services/api';
import { ProjectDetail } from '../types';
import { 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  ArrowLeft,
  FileCheck,
  Zap,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProjectIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await fetchProjectById(id);
        setProject(res);
      } catch (err) {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (isLoading || !project) {
    return (
      <AppShell title="Project Intelligence" subtitle="Loading Project Portfolio Record">
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
          <div className="w-10 h-10 border-4 border-[#00A896] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold">Loading PAIMANA Project Intelligence...</p>
        </div>
      </AppShell>
    );
  }

  const timelineData = project.snapshots.map(s => ({
    period: s.reporting_period,
    cost: s.cost_cr,
    expenditure: s.expenditure_cr,
    progress: s.physical_progress_pct
  }));

  return (
    <AppShell title={`Project Intelligence: ${project.id}`} subtitle={`${project.name}`}>
      <div className="space-y-6">

        {/* Top Back Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link to="/projects" className="inline-flex items-center space-x-2 text-xs text-[#00A896] hover:underline font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Project Explorer</span>
          </Link>
          <span className="text-xs text-gray-400">
            Observation Snapshot: <b className="text-white">{project.last_reporting_period}</b>
          </span>
        </div>

        {/* Project Master Header Banner */}
        <div className="p-6 rounded-2xl bg-[#1C2541] border border-gray-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded border border-[#00A896]/30">
                  {project.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  project.status === 'Critical' ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' :
                  project.status === 'Delayed' ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' :
                  'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                }`}>
                  STATUS: {project.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>{project.agency} ({project.ministry})</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>{project.state} • {project.location_details || project.sector}</span>
                </span>
              </div>
            </div>

            {/* Combined Risk Score Badge */}
            <div className="p-4 rounded-xl bg-[#0B132B] border border-gray-700 text-center min-w-[180px] space-y-1">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Combined Risk Score</div>
              <div className={`text-4xl font-extrabold ${
                project.risk_score >= 75 ? 'text-[#E63946]' :
                project.risk_score >= 50 ? 'text-[#F4A261]' :
                'text-[#00A896]'
              }`}>
                {project.risk_score}%
              </div>
              <div className="text-[10px] text-gray-400">Decision-Support Index</div>
            </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 space-y-1">
            <div className="text-xs text-gray-400">Sanctioned vs Revised Cost</div>
            <div className="text-lg font-bold text-white">₹{project.revised_cost_cr.toLocaleString()} Cr</div>
            <div className="text-xs text-[#F4A261]">
              Sanctioned: ₹{project.original_cost_cr.toLocaleString()} Cr (+{project.cost_escalation_pct}%)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 space-y-1">
            <div className="text-xs text-gray-400">Total Expenditure</div>
            <div className="text-lg font-bold text-white">₹{project.expenditure_cr.toLocaleString()} Cr</div>
            <div className="text-xs text-gray-400">
              {roundPct((project.expenditure_cr / project.revised_cost_cr) * 100)}% of revised cost spent
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 space-y-1">
            <div className="text-xs text-gray-400">Physical Progress</div>
            <div className="text-lg font-bold text-[#00A896]">{project.physical_progress_pct}%</div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#00A896] h-full" style={{ width: `${project.physical_progress_pct}%` }}></div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 space-y-1">
            <div className="text-xs text-gray-400">Target Completion</div>
            <div className="text-lg font-bold text-white">{project.revised_completion_date}</div>
            <div className="text-xs text-gray-400">Original: {project.original_completion_date}</div>
          </div>
        </div>

        {/* Explainability & SHAP Signals Section */}
        {project.latest_prediction && (
          <div className="p-6 rounded-2xl bg-[#1C2541] border border-[#00A896]/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#00A896]" />
                <h2 className="text-base font-bold text-white">Predictive SHAP Risk Signals</h2>
              </div>
              <span className="text-xs text-gray-400 font-mono">Model Engine: {project.latest_prediction.model_version}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-300">Cost Overrun Probability:</span>
                <span className="text-sm font-bold text-[#F4A261]">{roundPct(project.latest_prediction.cost_overrun_prob * 100)}%</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-300">Schedule Overrun Probability:</span>
                <span className="text-sm font-bold text-[#E63946]">{roundPct(project.latest_prediction.schedule_overrun_prob * 100)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Predictive Signals Attribution (Explainability):</h3>
              {project.latest_prediction.signals.map((sig, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0B132B] border border-gray-800 flex items-start space-x-3">
                  <div className={`p-2 rounded-lg text-xs font-bold shrink-0 ${
                    sig.direction === 'increases_risk' ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' : 'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                  }`}>
                    {sig.direction === 'increases_risk' ? `+${sig.contribution}` : `${sig.contribution}`}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{sig.feature_name}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">Val: {sig.feature_value}</span>
                    </div>
                    <p className="text-xs text-gray-300">{sig.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Trajectory Chart */}
        {timelineData.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#1C2541] border border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">Historical Trajectory & Expenditure Growth</h3>
              <span className="text-xs text-gray-400">Monthly Snapshots</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#253258" />
                  <XAxis dataKey="period" stroke="#8D99AE" fontSize={11} />
                  <YAxis stroke="#8D99AE" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#3A506B', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="cost" name="Revised Cost (Cr)" stroke="#F4A261" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenditure" name="Expenditure (Cr)" stroke="#00A896" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
};

function roundPct(num: number): number {
  return Math.round(num * 10) / 10;
}
