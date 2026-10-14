import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  Lock,
  Building,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setIsLoggedIn, setCurrentRole, setActiveTab, setSelectedBranchId, showToast } = useApp();

  const [email, setEmail] = useState('owner@urbanbrew.in');
  const [password, setPassword] = useState('demo1234');
  const [chosenRole, setChosenRole] = useState<UserRole>('admin');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentRole(chosenRole);
    if (chosenRole === 'employee') {
      setActiveTab('self-service');
    } else {
      setActiveTab('overview');
    }
    setIsLoggedIn(true);
    showToast(`Signed into CoreNode Attend as ${chosenRole === 'admin' ? 'Business Owner' : chosenRole === 'hr' ? 'HR Manager' : chosenRole === 'branch_manager' ? 'Branch Manager' : 'Employee'}.`);
  };

  const handleQuickRole = (role: UserRole) => {
    setChosenRole(role);
    if (role === 'admin') setEmail('owner@urbanbrew.in');
    else if (role === 'hr') setEmail('hr@urbanbrew.in');
    else if (role === 'branch_manager') setEmail('manager@urbanbrew.in');
    else setEmail('aarav.sharma@urbanbrew.in');

    setCurrentRole(role);
    if (role === 'employee') setActiveTab('self-service');
    else setActiveTab('overview');
    setIsLoggedIn(true);
    showToast(`Quick launched as ${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 p-4 sm:p-8">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center font-extrabold shadow-lg shadow-indigo-900/50">
            CN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">CoreNode</span>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800 uppercase">
                Attend
              </span>
            </div>
            <p className="text-[11px] text-slate-400">CoreNode Software Solutions • India</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Bengaluru, India</span>
        </div>
      </div>

      {/* Main Login / Quick Launch Box */}
      <div className="max-w-4xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
        {/* Left Column: Product Value Proposition */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 text-xs font-semibold border border-indigo-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive SMB Attendance Demo</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Smart Attendance. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">
                Simplified Workforce.
              </span>
            </h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Designed specifically for Indian SMBs—cafés, restaurants, retail stores, gyms, and offices. Manage live punches, grace periods, shift rosters, leave balances, and attendance-linked payroll summaries in one unified dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" /> Live Shifts & Grace
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Dynamic late detection & break calculations
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" /> 22 Fictional Staff
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Indiranagar & Koramangala branches
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Welcome to CoreNode Attend</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a simulated role or click Explore Demo below
            </p>
          </div>

          {/* Quick Role Selection Buttons */}
          <div className="space-y-2 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-left">
              Quick Launch by Role:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole('admin')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Business Owner</div>
                <div className="text-[10px] text-slate-500">Full management suite</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('hr')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">HR Manager</div>
                <div className="text-[10px] text-slate-500">Approvals & records</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('branch_manager')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">Branch Manager</div>
                <div className="text-[10px] text-slate-500">Store-level punches</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('employee')}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-100/50 text-left transition-all group"
              >
                <div className="font-bold text-xs text-amber-900 group-hover:text-amber-700">Staff Member</div>
                <div className="text-[10px] text-amber-700">Self-service punch portal</div>
              </button>
            </div>
          </div>

          <div className="relative my-4 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-slate-200" />
            <span className="relative bg-white px-3 text-[11px] text-slate-400 font-medium uppercase">
              Or sign in with demo credentials
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Explore Demo Environment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              No registration or cloud keys needed • 100% Client-Side Interactive
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center py-4 text-xs text-slate-500 border-t border-slate-800/80">
        © 2026 CoreNode Software Solutions. All rights reserved. • Currency: INR (₹) • Timezone: Asia/Kolkata
      </div>
    </div>
  );
};
