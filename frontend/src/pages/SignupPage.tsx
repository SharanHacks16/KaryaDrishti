import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Mail, Lock, Building2, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Portfolio/Ministry Officer');
  const [department, setDepartment] = useState('Ministry of Infrastructure');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signup({
      full_name: fullName,
      username,
      email,
      password,
      role,
      department
    });

    if (result.success) {
      navigate('/app', { replace: true });
    } else {
      setError(result.error || 'Registration failed. Please check form fields.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col justify-center items-center p-4 selection:bg-[#00A896] selection:text-white relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A896]/10 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6 my-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00A896] to-[#1C2541] mx-auto flex items-center justify-center border border-[#00A896]/40 shadow-xl shadow-[#00A896]/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">KARYADRISHTI</h1>
          <p className="text-xs text-[#00A896] font-semibold uppercase tracking-widest">
            Institutional Account Registration
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#1C2541] border border-gray-700/80 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="border-b border-gray-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Create Official Account</h2>
              <p className="text-xs text-gray-400">Register as an authorized monitoring officer.</p>
            </div>
            <Link to="/login" className="text-xs text-[#00A896] hover:underline font-semibold">
              Sign In →
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 flex items-center space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="e.g. Vikram Singh"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="e.g. vikram_singh"
                />
                <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Departmental Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="officer@morth.gov.in"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                User Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#00A896]"
              >
                <option value="Portfolio/Ministry Officer">Portfolio/Ministry Officer</option>
                <option value="Project/Program Officer">Project/Program Officer</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer/Read-only User">Viewer/Read-only User</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Department / Ministry
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#00A896] transition-colors"
                  placeholder="e.g. Ministry of Road Transport & Highways"
                />
                <Building2 className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#00A896]/20 mt-2"
            >
              {isSubmitting ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-800 text-xs text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="text-[#00A896] font-semibold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-500">
          SIH 2026 • SIH26103 Protected Government System
        </div>
      </div>
    </div>
  );
};
