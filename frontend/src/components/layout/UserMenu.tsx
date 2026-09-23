import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, ChevronDown, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-1.5 rounded-lg bg-[#1C2541] border border-gray-700 hover:border-[#00A896] transition-all"
      >
        <div className="w-8 h-8 rounded-md bg-[#00A896]/20 border border-[#00A896]/40 flex items-center justify-center text-[#00A896] font-bold text-sm">
          {user.full_name.charAt(0)}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold text-white leading-none">{user.full_name}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{user.role}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[#1C2541] border border-gray-700 shadow-2xl z-50 py-2 text-sm text-gray-200">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
            <p className="font-semibold text-white truncate">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30">
              <Shield className="w-3 h-3 mr-1" />
              {user.role}
            </div>
          </div>

          <button
            onClick={() => { setIsOpen(false); navigate('/profile'); }}
            className="w-full text-left px-4 py-2 hover:bg-[#0B132B] flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <UserCheck className="w-4 h-4 text-[#00A896]" />
            <span>Profile & Security</span>
          </button>

          <div className="border-t border-gray-800 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 flex items-center space-x-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
