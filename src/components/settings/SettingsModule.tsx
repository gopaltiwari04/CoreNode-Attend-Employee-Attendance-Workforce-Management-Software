import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Clock,
  CalendarOff,
  Bell,
  Shield,
  RotateCcw,
  Check,
  Save,
  AlertTriangle,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { settings, updateSettings, resetDemoData, currentRole } = useApp();

  const [activeSection, setActiveSection] = useState<'org' | 'attendance' | 'leaves' | 'notifications' | 'account'>('attendance');

  // Form states initialized from settings
  const [orgName, setOrgName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [industry, setIndustry] = useState(settings.industry);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);

  const [gracePeriod, setGracePeriod] = useState(String(settings.policy.defaultGraceMinutes));
  const [halfDayHours, setHalfDayHours] = useState(String(settings.policy.halfDayThresholdHours));
  const [fullDayHours, setFullDayHours] = useState(String(settings.policy.fullDayThresholdHours));
  const [unpaidBreak, setUnpaidBreak] = useState(String(settings.policy.unpaidBreakMinutes));

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      name: orgName,
      tagline,
      industry,
      phone,
      email,
      policy: {
        ...settings.policy,
        defaultGraceMinutes: parseInt(gracePeriod, 10) || 15,
        halfDayThresholdHours: parseFloat(halfDayHours) || 4.0,
        fullDayThresholdHours: parseFloat(fullDayHours) || 7.5,
        unpaidBreakMinutes: parseInt(unpaidBreak, 10) || 60,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">System & Policy Settings</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Configurable Rules
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize working hour rules, shift grace allowances, leave entitlements, and company details
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Settings Grid with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sub-nav */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3 space-y-1 h-fit text-xs font-medium">
          {[
            { id: 'attendance', label: 'Attendance & Grace Rules', icon: Clock },
            { id: 'org', label: 'Organization Profile', icon: Building },
            { id: 'leaves', label: 'Leave Allowances', icon: CalendarOff },
            { id: 'notifications', label: 'Alert Preferences', icon: Bell },
            { id: 'account', label: 'Account & Demo State', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Body */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
          {activeSection === 'attendance' && (
            <form onSubmit={handleSavePolicy} className="space-y-6 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Workforce Attendance Policy</h3>
                <p className="text-slate-500 mt-0.5">
                  These thresholds drive live check-in late warnings and payroll calculations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Shift Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={gracePeriod}
                    onChange={e => setGracePeriod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Check-ins after (Shift Start + Grace) are tagged as "Late".
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Unpaid Meal/Tea Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={unpaidBreak}
                    onChange={e => setUnpaidBreak(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Subtracted from gross working duration for payroll.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Half-Day Working Threshold (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="12"
                    value={halfDayHours}
                    onChange={e => setHalfDayHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Duration under which half-day deduction applies.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full-Day Minimum Required (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="16"
                    value={fullDayHours}
                    onChange={e => setFullDayHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Standard full shift duration for normal working day credit.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Policy Rules</span>
                </button>
              </div>
            </form>
          )}

          {activeSection === 'org' && (
            <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Organization Information</h3>
              <p className="text-slate-500">Business registration and client communications data</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Head Office Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Administrative Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Timezone & Currency</label>
                  <input
                    type="text"
                    disabled
                    value="Asia/Kolkata (IST) • INR (₹)"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </form>
          )}

          {activeSection === 'leaves' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Configured Annual Leave Types</h3>
              <p className="text-slate-500">Standard illustrative allotments per fiscal year</p>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Casual Leave (CL)</div>
                    <div className="text-[11px] text-slate-500">Short personal errands and family emergencies</div>
                  </div>
                  <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded">
                    12 Days / Year
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Sick Leave (SL)</div>
                    <div className="text-[11px] text-slate-500">Medical recovery with doctor certificate verification</div>
                  </div>
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                    8 Days / Year
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Earned / Privilege Leave (EL)</div>
                    <div className="text-[11px] text-slate-500">Annual vacation leave accrued based on service tenure</div>
                  </div>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                    15 Days / Year
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Notification & Alert Channels</h3>
              <p className="text-slate-500">In-app notifications and trigger rules</p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Late Arrival In-App Alerts</div>
                    <div className="text-[11px] text-slate-500">Notify supervisor when a staff member checks in after grace window</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">New Leave Requests</div>
                    <div className="text-[11px] text-slate-500">Alert managers whenever an employee submits leave</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Punch Regularization Audits</div>
                    <div className="text-[11px] text-slate-500">Notification upon attendance time revision requests</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Demonstration Session Controls</h3>
              <p className="text-slate-500">Simulated role privileges and database refresh</p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800">Currently Active Role:</div>
                <span className="inline-block px-3 py-1 rounded-full font-bold text-indigo-700 bg-indigo-100 uppercase tracking-wider text-[11px]">
                  {currentRole}
                </span>
                <p className="text-[11px] text-slate-500">
                  Switch roles anytime using the top-right profile avatar to see how managers and staff experience CoreNode Attend differently.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900">Restore Factory Demo Data</div>
                  <div className="text-[11px] text-amber-800">
                    Restores all 22 employees, 30 days of punch logs, and sample requests.
                  </div>
                </div>
                <button
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This will restore all default seed data (22 employees, 30 days of attendance, shifts, and leaves).
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg shadow-2xs"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
