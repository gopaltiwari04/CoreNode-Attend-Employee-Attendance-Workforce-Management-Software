import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: '1. Executive Dashboard Overview',
    desc: 'Real-time workforce KPIs, attendance rate, department breakdowns, and live checked-in staff.',
    tab: 'overview',
  },
  {
    title: '2. Live Attendance Monitoring',
    desc: 'Perform live check-in and check-out, record punch corrections, and observe shift grace period rules.',
    tab: 'live-attendance',
  },
  {
    title: '3. Employee Management & Profiles',
    desc: 'Manage staff across branches, inspect 30-day individual attendance histories, and assign rosters.',
    tab: 'employees',
  },
  {
    title: '4. Leave Approval Workflow',
    desc: 'Review pending leave requests, check leave balances, and approve or reject with manager comments.',
    tab: 'leaves',
  },
  {
    title: '5. Reports & CSV Export',
    desc: 'Explore daily and monthly attendance audits, absenteeism, and download real CSV files.',
    tab: 'reports',
  },
  {
    title: '6. Attendance-Linked Payroll Summary',
    desc: 'Review monthly attendance-based salary calculations and payable days formula before dispatching pay.',
    tab: 'payroll',
  },
];

export const GuidedDemoBanner: React.FC = () => {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, endTour } = useApp();

  if (!isTourActive) return null;

  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isLast = tourStep === TOUR_STEPS.length - 1;

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-teal-950 text-white px-4 py-3 border-b border-indigo-700/50 shadow-md animate-in slide-in-from-top">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                Guided Demo • Step {tourStep + 1} of {TOUR_STEPS.length}
              </span>
              <h4 className="text-sm font-bold text-white">{current.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{current.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {tourStep > 0 && (
            <button
              onClick={prevTourStep}
              className="px-2.5 py-1.5 rounded text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}

          <button
            onClick={nextTourStep}
            className="px-3.5 py-1.5 rounded text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 flex items-center gap-1 shadow-sm transition-colors"
          >
            {isLast ? 'Complete Tour' : 'Next Module'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={endTour}
            title="Exit Tour"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
