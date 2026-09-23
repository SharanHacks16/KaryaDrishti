import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  FileCheck, 
  ArrowRight, 
  Activity, 
  Database,
  Lock,
  BarChart2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B132B] text-[#E0E1DD] flex flex-col selection:bg-[#00A896] selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00A896]/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C2541] border border-[#00A896]/40 text-[#00A896] text-xs font-semibold tracking-wide">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>SIH 2026 • SIH26103 National Infrastructure Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                See What’s Ahead.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A896] via-teal-300 to-[#F4A261]">
                  Act Before It’s Late.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
                KARYADRISHTI transforms historical and current PAIMANA project observations into explainable early warnings, predictive risk signals, and decision-support intelligence for government officers.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm flex items-center space-x-2 transition-all shadow-lg shadow-[#00A896]/25 group"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>Access Institutional Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#capabilities"
                  className="px-6 py-3.5 rounded-lg bg-[#1C2541] hover:bg-[#253258] text-gray-200 border border-gray-700 font-semibold text-sm transition-all"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Trust Callout */}
              <div className="pt-6 border-t border-gray-800/80 flex items-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-[#00A896]" />
                  <span>PAIMANA Observation Grounded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#00A896]" />
                  <span>Auditable Risk Framework</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Mock */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-[#1C2541] border border-gray-700/80 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded border border-[#00A896]/30">
                    NATIONAL COMMAND CENTER
                  </span>
                </div>

                {/* Card preview */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Delhi-Dehradun Expressway</div>
                      <div className="text-[10px] text-gray-400">NHAI • Highways Sector</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30">
                        RISK: 78.4%
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Eastern Dedicated Freight Corridor</div>
                      <div className="text-[10px] text-gray-400">DFCCIL • Railways Sector</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E63946]/20 text-[#E63946] border border-[#E63946]/30">
                        RISK: 83.2%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#00A896]/10 border border-[#00A896]/30 flex items-center space-x-3 text-xs text-gray-200">
                    <Activity className="w-5 h-5 text-[#00A896] shrink-0" />
                    <span>Explainable Signals expose land-acquisition & expenditure pace bottlenecks before overrun occurs.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Capability Strip */}
      <section id="capabilities" className="py-20 bg-[#0B132B] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-extrabold text-[#00A896] uppercase tracking-widest">Pillars of Foresight</h2>
            <h3 className="text-3xl font-bold text-white">Five Integrated Capabilities</h3>
            <p className="text-sm text-gray-400">Engineered to move officers from passive reporting to actionable early intervention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: TrendingUp, title: "Predict", desc: "Estimate cost overrun & schedule delay probability with zero target leakage." },
              { icon: Search, title: "Explain", desc: "SHAP predictive feature attributions expose why a project score is elevated." },
              { icon: BarChart2, title: "Compare", desc: "Benchmark progress against sector peer groups and cost bands." },
              { icon: AlertTriangle, title: "Alert", desc: "Automated early warning triggers when trajectory deteriorates." },
              { icon: FileCheck, title: "Report", desc: "Generate auditable project intelligence PDF summaries instantly." },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="p-6 rounded-xl bg-[#1C2541] border border-gray-800 hover:border-[#00A896]/50 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#00A896]/10 border border-[#00A896]/30 flex items-center justify-center text-[#00A896] mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{cap.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Methodology */}
      <section id="methodology" className="py-20 bg-[#1C2541]/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold text-[#00A896] uppercase tracking-widest">Evidence-Based Governance</h2>
              <h3 className="text-3xl font-bold text-white">Grounded in Verified PAIMANA Observations</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                KARYADRISHTI does not generate synthetic forecasts or unbacked LLM claims. Every risk score is calculated from historical project observations, official expenditure statements, and physical progress milestones.
              </p>
              <ul className="space-y-3 pt-2 text-xs text-gray-300">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#00A896]"></div>
                  <span>Strict temporal ordering & leakage prevention in model design.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#00A896]"></div>
                  <span>Role-based access control ensuring restricted government project privacy.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#00A896]"></div>
                  <span>Full audit log compliance for logins, report downloads, and actions.</span>
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-[#1C2541] border border-gray-700 shadow-xl space-y-6 text-center">
              <Shield className="w-16 h-16 text-[#00A896] mx-auto" />
              <h4 className="text-xl font-bold text-white">Ready to Inspect Portfolio Health?</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Authorized officers can log in using their departmental credentials to access the command center.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-8 py-3 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm transition-all shadow-lg"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Command Center</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0B132B] text-xs text-gray-500 text-center border-t border-gray-800">
        <p>© 2026 KARYADRISHTI • SIH 2026 Problem Statement SIH26103 • Ministry of Statistics & Programme Implementation</p>
      </footer>
    </div>
  );
};
