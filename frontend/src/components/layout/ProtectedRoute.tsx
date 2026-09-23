import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#00A896] border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-gray-400">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== "Administrator") {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1C2541] border border-red-500/30 rounded-xl p-6 text-center shadow-2xl">
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-300 mb-6">
            Your role (<b className="text-white">{user.role}</b>) does not have authorization to view this module.
          </p>
          <a href="/app" className="px-4 py-2 bg-[#00A896] text-white font-semibold rounded-lg text-sm inline-block">
            Return to Command Center
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
