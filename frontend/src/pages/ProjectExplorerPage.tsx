import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { fetchProjects } from '../services/api';
import { ProjectDetail } from '../types';
import { Search, Filter, ShieldAlert, ArrowRight, Building, MapPin } from 'lucide-react';

export const ProjectExplorerPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [query, setQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (riskFilter) params.risk_level = riskFilter;
      if (sectorFilter) params.sector = sectorFilter;

      const res = await fetchProjects(params);
      setProjects(res.projects);
      setIsLoading(false);
    };
    loadProjects();
  }, [query, riskFilter, sectorFilter]);

  return (
    <AppShell title="Project Explorer" subtitle="Search & Filter PAIMANA Monitored Projects">
      <div className="space-y-6">

        {/* Search & Filter Control Panel */}
        <div className="p-4 rounded-xl bg-[#1C2541] border border-gray-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by project name, ID (e.g. PRJ-2026), or agency..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Risk Filter */}
            <div className="md:col-span-3">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#00A896]"
              >
                <option value="">All Risk Bands</option>
                <option value="Critical">Critical Risk (≥ 75)</option>
                <option value="High">High Risk (50–75)</option>
                <option value="Medium">Medium Risk (25–50)</option>
                <option value="Low">Low Risk (&lt; 25)</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div className="md:col-span-3">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#00A896]"
              >
                <option value="">All Major Sectors</option>
                <option value="Highways & Expressways">Highways & Expressways</option>
                <option value="Railways">Railways</option>
                <option value="Power & Hydroelectric">Power & Hydroelectric</option>
                <option value="Urban Infrastructure & Metro">Urban Infrastructure & Metro</option>
                <option value="Ports & Shipping">Ports & Shipping</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            Filtering Projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-xl bg-[#1C2541] border border-gray-800 text-center text-gray-400 space-y-2">
            <Filter className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="font-semibold text-white">No projects found matching current criteria.</p>
            <p className="text-xs">Try clearing search filters or changing the risk band.</p>
          </div>
        ) : (
          <div className="bg-[#1C2541] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0B132B] text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Project ID & Name</th>
                    <th className="py-3.5 px-4 font-bold">Sector / State</th>
                    <th className="py-3.5 px-4 font-bold text-center">Risk Score</th>
                    <th className="py-3.5 px-4 font-bold text-right">Sanctioned / Revised Cost</th>
                    <th className="py-3.5 px-4 font-bold text-center">Progress</th>
                    <th className="py-3.5 px-4 font-bold text-[#00A896]">Target Completion</th>
                    <th className="py-3.5 px-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#0B132B]/60 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-mono text-[#00A896] bg-[#00A896]/10 px-1.5 py-0.5 rounded border border-[#00A896]/30">
                          {p.id}
                        </span>
                        <div className="font-bold text-white text-sm mt-1">{p.name}</div>
                        <div className="text-[11px] text-gray-400 flex items-center space-x-2 mt-0.5">
                          <Building className="w-3 h-3 text-gray-500" />
                          <span>{p.agency} ({p.ministry})</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-200">{p.sector}</div>
                        <div className="text-[11px] text-gray-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span>{p.state}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded text-xs font-extrabold inline-block ${
                          p.risk_score >= 75 ? 'bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30' :
                          p.risk_score >= 50 ? 'bg-[#F4A261]/20 text-[#F4A261] border border-[#F4A261]/30' :
                          p.risk_score >= 25 ? 'bg-[#E76F51]/20 text-[#E76F51] border border-[#E76F51]/30' :
                          'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                        }`}>
                          {p.risk_score}%
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="font-bold text-white">₹{p.revised_cost_cr.toLocaleString()} Cr</div>
                        <div className="text-[11px] text-[#F4A261]">
                          Original: ₹{p.original_cost_cr.toLocaleString()} Cr
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="font-extrabold text-[#00A896]">{p.physical_progress_pct}%</div>
                        <div className="w-20 bg-gray-800 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div className="bg-[#00A896] h-full" style={{ width: `${p.physical_progress_pct}%` }}></div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center text-xs font-mono text-gray-300">
                        {p.revised_completion_date}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <Link
                          to={`/projects/${p.id}`}
                          className="px-3 py-1.5 rounded bg-[#00A896]/10 hover:bg-[#00A896] text-[#00A896] hover:text-white font-semibold text-xs border border-[#00A896]/30 transition-all inline-flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
};
