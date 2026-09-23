import React from 'react';
import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';
import { Search, Bell, ShieldCheck } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen bg-[#0B132B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-[#0B132B] border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>

          <div className="flex items-center space-x-4">
            {/* Last Data Refresh Banner */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded bg-[#1C2541] border border-gray-800 text-[11px] text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A896]" />
              <span>PAIMANA Observations: <b>Aug 2026</b></span>
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-lg bg-[#1C2541] border border-gray-800 hover:border-[#00A896] text-gray-300 relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E63946]"></span>
            </button>

            {/* User Profile Menu */}
            <UserMenu />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
