import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Activity, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PublicNavbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0B132B]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A896] to-[#1C2541] flex items-center justify-center border border-[#00A896]/40 shadow-lg shadow-[#00A896]/10">
            <Shield className="w-5 h-5 text-[#E0E1DD] group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white">KARYADRISHTI</span>
            <span className="block text-[10px] text-[#00A896] font-semibold uppercase tracking-widest">SIH26103 • Govt Intelligence Portal</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#capabilities" className="hover:text-[#00A896] transition-colors">Capabilities</a>
          <a href="#methodology" className="hover:text-[#00A896] transition-colors">Trust & Methodology</a>
          <a href="#architecture" className="hover:text-[#00A896] transition-colors">PAIMANA Integration</a>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#00A896] hover:bg-[#008f80] rounded-md flex items-center space-x-2 transition-all shadow-md shadow-[#00A896]/20"
            >
              <span>Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#1C2541] hover:bg-[#253258] border border-gray-700 hover:border-[#00A896] rounded-md flex items-center space-x-2 transition-all"
            >
              <Lock className="w-4 h-4 text-[#00A896]" />
              <span>Official Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
