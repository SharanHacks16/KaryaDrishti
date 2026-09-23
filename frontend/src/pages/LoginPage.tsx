import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('officer');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid departmental credentials. Please verify your username and key.');
      }
    } catch (err) {
      setError('Connection failure to authentication server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPresetUser = (u: string) => {
    setUsername(u);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col justify-center items-center p-4 selection:bg-[#00A896] selection:text-white relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A896]/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#1C2541] mx-auto flex items-center justify-center border border-[#00A896]/40 shadow-xl shadow-[#00A896]/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">KARYADRISHTI</h1>
          <p className="text-xs text-[#00A896] font-semibold uppercase tracking-widest">
            Institutional Project-Monitoring Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1C2541] border border-gray-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <h2 className="text-base font-semibold text-white">Official Sign In</h2>
            <p className="text-xs text-gray-400">Authenticate with approved government credentials.</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 flex items-center space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Username / Government Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="e.g. officer@morth.gov.in"
                />
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Password / Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00A896]/20"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Signup Navigation Link */}
          <div className="pt-3 text-center border-t border-gray-800">
            <span className="text-xs text-gray-400">Don't have an institutional account? </span>
            <Link to="/signup" className="text-xs font-bold text-[#00A896] hover:underline inline-flex items-center space-x-1 ml-1">
              <span>Create Account</span>
              <UserPlus className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Demo Role Presets */}
          <div className="pt-3 border-t border-gray-800">
            <p className="text-[11px] font-semibold text-gray-400 mb-2">Quick Sign-In Presets (Development):</p>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setPresetUser('officer')}
                className={`py-1.5 px-2 rounded border text-center font-medium transition-all ${
                  username === 'officer' ? 'bg-[#00A896]/20 border-[#00A896] text-[#00A896]' : 'bg-[#0B132B] border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                Ministry Officer
              </button>
              <button
                type="button"
                onClick={() => setPresetUser('analyst')}
                className={`py-1.5 px-2 rounded border text-center font-medium transition-all ${
                  username === 'analyst' ? 'bg-[#00A896]/20 border-[#00A896] text-[#00A896]' : 'bg-[#0B132B] border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                Analyst
              </button>
              <button
                type="button"
                onClick={() => setPresetUser('admin')}
                className={`py-1.5 px-2 rounded border text-center font-medium transition-all ${
                  username === 'admin' ? 'bg-[#00A896]/20 border-[#00A896] text-[#00A896]' : 'bg-[#0B132B] border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-500">
          SIH 2026 • SIH26103 Protected Government System
        </div>
      </div>
    </div>
  );
};
