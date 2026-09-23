import React, { useState, useEffect } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { fetchProjects, fetchPortfolioOverview, fetchProjectById } from '../services/api';
import { ProjectDetail, PortfolioOverview } from '../types';
import { 
  FileText, 
  Download, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle, 
  Building, 
  MapPin,
  Printer,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [projRes, ovRes] = await Promise.all([
          fetchProjects({ size: '50' }),
          fetchPortfolioOverview()
        ]);
        setProjects(projRes.projects);
        setOverview(ovRes);
      } catch (err) {
        console.error("Error loading reports data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    try {
      const res = await fetchProjects({ query, size: '50' });
      setProjects(res.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerDownloadNotice = (msg: string) => {
    setDownloadSuccess(msg);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const downloadCSVReport = (projList: ProjectDetail[], filename: string) => {
    const headers = [
      "Project ID", "Project Name", "Ministry", "Agency", "Sector", "State", 
      "Original Cost (Cr)", "Revised Cost (Cr)", "Expenditure (Cr)", "Physical Progress (%)",
      "Status", "Combined Risk Score (%)", "Cost Overrun Risk (%)", "Schedule Overrun Risk (%)"
    ];
    
    const rows = projList.map(p => [
      `"${p.id}"`,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.ministry || '').replace(/"/g, '""')}"`,
      `"${(p.agency || '').replace(/"/g, '""')}"`,
      `"${(p.sector || '').replace(/"/g, '""')}"`,
      `"${(p.state || '').replace(/"/g, '""')}"`,
      p.original_cost_cr || 0,
      p.revised_cost_cr || 0,
      p.expenditure_cr || 0,
      p.physical_progress_pct || 0,
      `"${p.status || ''}"`,
      p.risk_score || 0,
      p.cost_overrun_risk_pct || 0,
      p.schedule_overrun_risk_pct || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerDownloadNotice(`Downloaded dataset report (${filename}) containing ${projList.length} projects.`);
  };

  const downloadProjectPDFReport = async (projId: string) => {
    setDownloadingId(projId);
    try {
      let p: ProjectDetail;
      const existing = projects.find(item => item.id === projId);
      if (existing && existing.latest_prediction) {
        p = existing;
      } else {
        p = await fetchProjectById(projId);
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>KARYADRISHTI Audit Briefing - ${p.id}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; background: #0B132B; color: #F8F9FA; line-height: 1.5; }
            .card { background: #1C2541; border: 1px solid #3A506B; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            .header { border-bottom: 2px solid #00A896; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-size: 20px; font-weight: bold; color: #FFFFFF; margin-top: 4px; }
            .badge { background: #00A896; color: #fff; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block; }
            .badge-danger { background: #E63946; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 10px; }
            .stat-label { font-size: 11px; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.5px; }
            .stat-val { font-size: 16px; font-weight: bold; color: #FFFFFF; margin-top: 2px; }
            .signal { background: #0B132B; border-left: 4px solid #E63946; padding: 12px; margin-top: 10px; border-radius: 6px; }
            .signal-green { border-left-color: #00A896; }
            .footer { margin-top: 30px; font-size: 10px; color: #8D99AE; text-align: center; border-top: 1px solid #3A506B; padding-top: 12px; }
          </style>
        </head>
        <body>
          <div id="pdf-content">
            <div class="header">
              <div>
                <div style="color: #00A896; font-weight: bold; font-size: 12px; letter-spacing: 1px;">KARYADRISHTI • PAIMANA MONITORED PROJECT AUDIT BRIEFING</div>
                <div class="title">${p.name}</div>
                <div style="font-size: 12px; color: #8D99AE; margin-top: 4px;">Ref ID: <strong>${p.id}</strong> | Ministry: ${p.ministry} | Agency: ${p.agency}</div>
              </div>
              <div style="text-align: right;">
                <div class="badge ${p.risk_score >= 75 ? 'badge-danger' : ''}">Risk Score: ${p.risk_score}%</div>
                <div style="font-size: 11px; color: #8D99AE; margin-top: 6px;">Status: <strong>${p.status}</strong></div>
              </div>
            </div>

            <div class="card">
              <h3 style="margin-top:0; color: #00A896; font-size: 15px;">1. Financial & Physical Execution Snapshot</h3>
              <div class="grid">
                <div><div class="stat-label">Sanctioned Cost</div><div class="stat-val">₹${p.original_cost_cr.toLocaleString()} Cr</div></div>
                <div><div class="stat-label">Revised Cost</div><div class="stat-val">₹${p.revised_cost_cr.toLocaleString()} Cr</div></div>
                <div><div class="stat-label">Cost Escalation</div><div class="stat-val" style="color:#F4A261">+${p.cost_escalation_pct}%</div></div>
                <div><div class="stat-label">Total Expenditure</div><div class="stat-val">₹${p.expenditure_cr.toLocaleString()} Cr</div></div>
                <div><div class="stat-label">Physical Progress</div><div class="stat-val" style="color:#00A896">${p.physical_progress_pct}%</div></div>
                <div><div class="stat-label">Target Completion</div><div class="stat-val">${p.revised_completion_date}</div></div>
              </div>
            </div>

            ${p.latest_prediction ? `
            <div class="card">
              <h3 style="margin-top:0; color: #00A896; font-size: 15px;">2. Machine Learning Predictive Risk Signals (XGBoost + SHAP TreeExplainer)</h3>
              <div style="font-size: 12px; color: #8D99AE; margin-bottom: 10px;">
                Model Version: <strong>${p.latest_prediction.model_version}</strong> | Cost Overrun Prob: <strong>${Math.round(p.latest_prediction.cost_overrun_prob * 100)}%</strong> | Schedule Overrun Prob: <strong>${Math.round(p.latest_prediction.schedule_overrun_prob * 100)}%</strong>
              </div>
              ${p.latest_prediction.signals.map(s => `
                <div class="signal ${s.direction === 'decreases_risk' ? 'signal-green' : ''}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: ${s.direction === 'increases_risk' ? '#E63946' : '#00A896'};">${s.feature_name}</strong>
                    <span style="font-size:10px; background:#1C2541; padding:2px 8px; border-radius:4px; border:1px solid #3A506B;">Contribution: ${s.contribution > 0 ? '+' : ''}${s.contribution}</span>
                  </div>
                  <div style="font-size: 11px; margin-top: 4px; color: #E0E1DD;">Observation Value: ${s.feature_value}</div>
                  <p style="margin: 4px 0 0 0; font-size: 11px; color: #A3CEF1;">${s.description}</p>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <div class="footer">
              Official Audit Briefing Document • Generated by KARYADRISHTI Predictive Platform (SIH26103) • Monitored Database (${p.last_reporting_period})
            </div>
          </div>

          <script>
            window.onload = function() {
              const el = document.getElementById('pdf-content');
              const opt = {
                margin:       0.3,
                filename:     'KARYADRISHTI_Briefing_${p.id}.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, backgroundColor: '#0B132B' },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
              };
              html2pdf().set(opt).from(el).save().then(function() {
                setTimeout(function() { window.close(); }, 1200);
              });
            };
          </script>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `KARYADRISHTI_Briefing_${p.id}.html`;
        a.click();
      }
      triggerDownloadNotice(`Downloading PDF report (KARYADRISHTI_Briefing_${p.id}.pdf)...`);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <AppShell title="Intelligence Reports" subtitle="Auditable PDF Briefings & Export Utilities for 2,243 Monitored Projects">
      <div className="space-y-6">

        {/* Success Toast Notice */}
        {downloadSuccess && (
          <div className="p-4 rounded-xl bg-[#00A896]/20 border border-[#00A896]/50 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-[#00A896]" />
              <span>{downloadSuccess}</span>
            </div>
          </div>
        )}

        {/* Top Feature Card */}
        <div className="p-6 rounded-2xl bg-[#1C2541] border border-gray-800 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center space-x-2 text-[#00A896]">
                <FileText className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Generate Monitored Project Briefings</h2>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Download structured project executive briefings and portfolio CSV exports containing sanctioned costs, expenditure burn rate, SHAP feature attributions, and official PAIMANA audit timestamps across all <strong>{overview?.total_projects || 2243} monitored projects</strong>.
              </p>
            </div>

            {/* Quick Portfolio Export Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => downloadCSVReport(projects, `KARYADRISHTI_Portfolio_Export_${new Date().toISOString().slice(0,10)}.csv`)}
                className="px-4 py-2.5 rounded-xl bg-[#00A896] hover:bg-[#008f80] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Full Portfolio (CSV)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Selector Bar */}
        <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by project name, ID (e.g., PRJ-188000), or ministry..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0B132B] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896]"
            />
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Showing <b className="text-white">{projects.length}</b> projects from database query
          </div>
        </div>

        {/* Reports Table / List */}
        <div className="bg-[#1C2541] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-[#0B132B]/60">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#00A896]" />
              <span>Project Audit Briefing Catalog</span>
            </div>
            <span className="text-[11px] text-gray-400 font-mono">XGBoost ML Inferences Active</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 space-y-3">
              <Loader2 className="w-8 h-8 text-[#00A896] animate-spin" />
              <p className="text-xs">Fetching project records for report generation...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <AlertTriangle className="w-8 h-8 text-[#F4A261] mx-auto" />
              <p className="text-sm font-semibold">No projects match the current search query.</p>
              <p className="text-xs text-gray-500">Try searching for different keywords or clear the filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {projects.map((p) => (
                <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0B132B]/50 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded border border-[#00A896]/30">
                        {p.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.risk_score >= 75 ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' :
                        p.risk_score >= 50 ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' :
                        'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                      }`}>
                        Risk Score: {p.risk_score}%
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white line-clamp-1">{p.name}</div>
                    <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
                      <span><Building className="w-3 h-3 inline mr-1 text-gray-500" />{p.ministry}</span>
                      <span><MapPin className="w-3 h-3 inline mr-1 text-gray-500" />{p.state}</span>
                      <span>Cost: <b className="text-white">₹{p.revised_cost_cr?.toLocaleString()} Cr</b></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => downloadProjectPDFReport(p.id)}
                      disabled={downloadingId === p.id}
                      className="px-3.5 py-2 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow disabled:opacity-50"
                    >
                      {downloadingId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download PDF Brief</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
};

