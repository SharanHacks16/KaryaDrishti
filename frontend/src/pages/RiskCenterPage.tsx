import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { fetchProjects } from '../services/api';
import { ProjectDetail } from '../types';
import { ShieldAlert, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RiskCenterPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then(res => {
      // Sort by risk score descending
      const sorted = [...res.projects].sort((a, b) => b.risk_score - a.risk_score);
      setProjects(sorted);
      setIsLoading(false);
    });
  }, []);

  return (
    <AppShell title="Risk Center" subtitle="Portfolio Financial Exposure & Critical Ranking">
      <div className="space-y-6">

        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#E63946]">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-base font-bold">Priority Risk Ranking</h2>
          </div>
          <p className="text-xs text-gray-300">
            Projects ranked by combined decision-support risk index. High risk score indicates elevated cost escalation probability or severe milestone slippage.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading Risk Center Data...</div>
        ) : (
          <div className="bg-[#1C2541] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0B132B] text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Project & Agency</th>
                  <th className="py-3 px-4 text-center">Combined Risk Score</th>
                  <th className="py-3 px-4 text-center">Cost Overrun Risk</th>
                  <th className="py-3 px-4 text-center">Schedule Overrun Risk</th>
                  <th className="py-3 px-4 text-right">Financial Exposure</th>
                  <th className="py-3 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {projects.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#0B132B]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-400">#{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[10px] text-gray-400">{p.agency} • {p.sector}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${
                        p.risk_score >= 75 ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' :
                        p.risk_score >= 50 ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' :
                        'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                      }`}>
                        {p.risk_score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#F4A261]">
                      {p.cost_overrun_risk_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#E63946]">
                      {p.schedule_overrun_risk_pct}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      ₹{(p.revised_cost_cr - p.original_cost_cr).toLocaleString()} Cr
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link to={`/projects/${p.id}`} className="text-[#00A896] hover:underline font-semibold text-xs">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </AppShell>
  );
};
