import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Sliders, Play, RefreshCw, AlertCircle } from 'lucide-react';

export const ScenariosPage: React.FC = () => {
  const [delayMonths, setDelayMonths] = useState<number>(6);
  const [costEscalationPct, setCostEscalationPct] = useState<number>(10);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);

  const handleSimulate = () => {
    // What-if calculation estimate
    const base = 78.4;
    const added = (delayMonths * 1.5) + (costEscalationPct * 0.8);
    setSimulatedScore(Math.min(99.5, roundNum(base + added)));
  };

  return (
    <AppShell title="Scenario Simulator" subtitle="What-If Assumption Testing">
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-[#1C2541] border border-gray-800 space-y-2">
          <div className="flex items-center space-x-2 text-[#00A896]">
            <Sliders className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">What-If Project Trajectory Simulation</h2>
          </div>
          <p className="text-xs text-gray-300">
            Simulate the impact of further right-of-way delays or material expenditure changes on project risk score. Results are clearly labeled as scenario estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[#1C2541] border border-gray-800 space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Simulation Parameters</h3>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-semibold flex justify-between">
                <span>Hypothetical Schedule Delay:</span>
                <b className="text-[#00A896]">{delayMonths} Months</b>
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={delayMonths}
                onChange={(e) => setDelayMonths(parseInt(e.target.value))}
                className="w-full accent-[#00A896]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-semibold flex justify-between">
                <span>Additional Cost Escalation:</span>
                <b className="text-[#F4A261]">{costEscalationPct}%</b>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={costEscalationPct}
                onChange={(e) => setCostEscalationPct(parseInt(e.target.value))}
                className="w-full accent-[#F4A261]"
              />
            </div>

            <button
              onClick={handleSimulate}
              className="w-full py-3 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow"
            >
              <Play className="w-4 h-4" />
              <span>Run Scenario Simulation</span>
            </button>
          </div>

          <div className="p-6 rounded-xl bg-[#1C2541] border border-gray-800 flex flex-col justify-center items-center text-center space-y-4">
            {simulatedScore !== null ? (
              <>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Projected Scenario Risk Score</div>
                <div className="text-5xl font-extrabold text-[#E63946]">{simulatedScore}%</div>
                <p className="text-xs text-gray-300 max-w-xs">
                  Scenario estimate based on +{delayMonths} months delay and +{costEscalationPct}% cost change.
                </p>
              </>
            ) : (
              <div className="text-xs text-gray-400">Set simulation parameters and click Run Scenario.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

function roundNum(val: number): number {
  return Math.round(val * 10) / 10;
}
