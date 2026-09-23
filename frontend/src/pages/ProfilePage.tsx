import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Key, LogOut, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppShell title="User Profile & Security" subtitle="Active Session Information">
      <div className="max-w-2xl space-y-6">

        <div className="p-6 rounded-2xl bg-[#1C2541] border border-gray-800 space-y-6 shadow-xl">
          <div className="flex items-center space-x-4 border-b border-gray-800 pb-4">
            <div className="w-14 h-14 rounded-xl bg-[#00A896]/20 border border-[#00A896]/40 flex items-center justify-center text-[#00A896] text-2xl font-bold">
              {user.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
              <p className="text-xs text-[#00A896] font-semibold">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800">
              <span className="text-gray-400 block text-[10px]">Username</span>
              <span className="font-bold text-white">{user.username}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800">
              <span className="text-gray-400 block text-[10px]">Email Address</span>
              <span className="font-bold text-white">{user.email}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800">
              <span className="text-gray-400 block text-[10px]">Department / Ministry</span>
              <span className="font-bold text-white">{user.department || 'Ministry Office'}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0B132B] border border-gray-800">
              <span className="text-gray-400 block text-[10px]">Session Status</span>
              <span className="font-bold text-[#00A896] flex items-center space-x-1 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Active & Authenticated</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
            <button
              onClick={handleSignOut}
              className="px-5 py-2.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Session</span>
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
};
