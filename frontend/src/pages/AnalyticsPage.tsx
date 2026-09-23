import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { LineChart, PieChart, TrendingUp, BarChart2 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <AppShell title="Portfolio Analytics" subtitle="Macro Cost Escalation & Temporal Trends">
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#00A896]">
            <LineChart className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Macro Infrastructure Analytics</h2>
          </div>
          <p className="text-xs text-gray-300">
            Temporal cost escalation patterns across central ministries and state executing agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#1C2541] border border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Cost Overrun vs Sector Age</h3>
            <p className="text-xs text-gray-400">Projects operating beyond 5 years demonstrate an average cost escalation factor of 1.48x compared to sanctioned outlay.</p>
          </div>

          <div className="p-6 rounded-xl bg-[#1C2541] border border-gray-800 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">State-Level Execution Efficiency</h3>
            <p className="text-xs text-gray-400">Maharashtra and Uttar Pradesh represent the highest volume of mega-infrastructure investments currently monitored in PAIMANA.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
