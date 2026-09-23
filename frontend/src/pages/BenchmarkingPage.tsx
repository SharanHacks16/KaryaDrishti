import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { BarChart3, Users, Building, Scale } from 'lucide-react';

export const BenchmarkingPage: React.FC = () => {
  const peerGroups = [
    { sector: "Highways & Expressways", cost_band: "> 5,000 Cr", avg_cost_overrun: "25.8%", avg_delay: "18.5 mos", progress_rate: "1.4% / mo", sample: 64 },
    { sector: "Railways", cost_band: "> 10,000 Cr", avg_cost_overrun: "32.4%", avg_delay: "28.0 mos", progress_rate: "1.1% / mo", sample: 42 },
    { sector: "Power & Hydroelectric", cost_band: "> 5,000 Cr", avg_cost_overrun: "140.2%", avg_delay: "64.0 mos", progress_rate: "0.8% / mo", sample: 28 },
    { sector: "Urban Infrastructure & Metro", cost_band: "> 10,000 Cr", avg_cost_overrun: "41.5%", avg_delay: "22.0 mos", progress_rate: "1.6% / mo", sample: 35 }
  ];

  return (
    <AppShell title="Peer Benchmarking" subtitle="Compare Project Trajectories Against Peer Groups">
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#00A896]">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Transparent Sector Peer Groups</h2>
          </div>
          <p className="text-xs text-gray-300">
            Compare project milestone pace against historical infrastructure averages within similar cost bands and sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peerGroups.map((pg, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-sm font-bold text-white">{pg.sector}</h3>
                <span className="text-xs font-mono text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded">{pg.cost_band}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-[#0B132B]">
                  <div className="text-gray-400 text-[10px]">Avg Cost Overrun</div>
                  <div className="font-bold text-[#F4A261] mt-1">{pg.avg_cost_overrun}</div>
                </div>
                <div className="p-2 rounded bg-[#0B132B]">
                  <div className="text-gray-400 text-[10px]">Avg Schedule Delay</div>
                  <div className="font-bold text-[#E63946] mt-1">{pg.avg_delay}</div>
                </div>
                <div className="p-2 rounded bg-[#0B132B]">
                  <div className="text-gray-400 text-[10px]">Physical Pace</div>
                  <div className="font-bold text-[#00A896] mt-1">{pg.progress_rate}</div>
                </div>
              </div>
              <div className="text-[11px] text-gray-500 text-right">Based on {pg.sample} historical projects</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};
