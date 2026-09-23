import React, { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { fetchAlerts } from '../services/api';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts().then(res => {
      setAlerts(res.alerts);
      setIsLoading(false);
    });
  }, []);

  const handleAcknowledge = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "Acknowledged" } : a));
  };

  return (
    <AppShell title="Early Warning Center" subtitle="Automated Deterioration & Risk Alerts">
      <div className="space-y-6">

        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#E63946]">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold">Active Early Warning Alert Queue</h2>
          </div>
          <p className="text-xs text-gray-300">
            Alerts are generated when project trajectories exhibit accelerating cost overruns, milestone slippage, or ROW delays.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading Alert Queue...</div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alt) => (
              <div key={alt.id} className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 flex flex-wrap items-start justify-between gap-4 shadow-lg">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30">
                      {alt.severity}
                    </span>
                    <span className="text-xs font-mono text-gray-400">Period: {alt.reporting_period}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      alt.status === 'Acknowledged' ? 'bg-[#00A896]/20 text-[#00A896]' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {alt.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{alt.project_name}</h3>
                  <p className="text-xs text-gray-300"><b>Trigger Reason:</b> {alt.trigger_reason}</p>
                  <p className="text-xs text-gray-400"><b>Evidence:</b> {alt.supporting_evidence}</p>
                </div>

                <div className="flex flex-col space-y-2 shrink-0">
                  {alt.status !== 'Acknowledged' && (
                    <button
                      onClick={() => handleAcknowledge(alt.id)}
                      className="px-4 py-2 rounded bg-[#00A896] hover:bg-[#008f80] text-white text-xs font-bold transition-all shadow"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  <Link
                    to={`/projects/${alt.project_id}`}
                    className="px-4 py-2 rounded bg-[#0B132B] hover:bg-[#253258] border border-gray-700 text-xs font-semibold text-[#00A896] text-center transition-colors"
                  >
                    Inspect Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppShell>
  );
};
