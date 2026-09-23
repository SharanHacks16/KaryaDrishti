import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle, 
  ShieldAlert, 
  BarChart3, 
  LineChart, 
  FileText, 
  Sliders, 
  User, 
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Command Center', path: '/app', icon: LayoutDashboard },
    { label: 'Project Explorer', path: '/projects', icon: FolderKanban },
    { label: 'Risk Center', path: '/risk', icon: ShieldAlert },
    { label: 'Early Warning Center', path: '/alerts', icon: AlertTriangle, badge: '3' },
    { label: 'Benchmarking', path: '/benchmarking', icon: BarChart3 },
    { label: 'Analytics', path: '/analytics', icon: LineChart },
    { label: 'Intelligence Reports', path: '/reports', icon: FileText },
    { label: 'Scenario Simulator', path: '/scenarios', icon: Sliders },
    { label: 'Profile & Session', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0B132B] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00A896] to-[#1C2541] flex items-center justify-center border border-[#00A896]/40 shadow-md shadow-[#00A896]/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-wider text-white">KARYADRISHTI</span>
          <span className="block text-[9px] text-[#00A896] font-semibold uppercase tracking-widest">Govt Decision Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1C2541] text-[#00A896] border border-[#00A896]/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-[#1C2541]/50'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E63946] text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User / Session Footer */}
      <div className="p-3 border-t border-gray-800 bg-[#1C2541]/40">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Active Session</div>
        <div className="text-xs text-gray-300 font-medium truncate mt-0.5">{user?.full_name || 'Officer'}</div>
        <div className="text-[10px] text-[#00A896] truncate">{user?.role}</div>
      </div>
    </aside>
  );
};
