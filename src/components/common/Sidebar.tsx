import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Clock,
  Users,
  CalendarDays,
  CalendarOff,
  FileCheck2,
  BarChart3,
  IndianRupee,
  Building2,
  Settings,
  UserCircle,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setCurrentRole,
    leaveRequests,
    regularizationRequests,
    openHardwareModal,
  } = useApp();

  const pendingLeavesCount = leaveRequests.filter(r => r.status === 'Pending').length;
  const pendingRegCount = regularizationRequests.filter(r => r.status === 'Pending').length;

  const adminNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live-attendance', label: 'Live Attendance', icon: Clock },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'shifts', label: 'Shifts & Rosters', icon: CalendarDays },
    { id: 'leaves', label: 'Leave Management', icon: CalendarOff, badge: pendingLeavesCount },
    { id: 'regularization', label: 'Attendance Regularization', icon: FileCheck2, badge: pendingRegCount },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'payroll', label: 'Payroll Summary', icon: IndianRupee },
    { id: 'organization', label: 'Locations & Depts', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const employeeNavItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'self-service', label: 'My Self-Service Hub', icon: UserCheck },
    { id: 'live-attendance', label: 'Punch Log', icon: Clock },
    { id: 'leaves', label: 'My Leave Requests', icon: CalendarOff },
    { id: 'regularization', label: 'Request Correction', icon: FileCheck2 },
    { id: 'shifts', label: 'My Shift Schedule', icon: CalendarDays },
  ];

  const navItems = currentRole === 'employee' ? employeeNavItems : adminNavItems;

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 text-white flex items-center justify-center font-extrabold shadow-md shadow-indigo-900/40">
              CN
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">CoreNode</span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800/80 uppercase">
                  Attend
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium">Smart Attendance Suite</p>
            </div>
          </div>

          <button
            onClick={onMobileClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Mode Banner in Sidebar */}
        <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                currentRole === 'employee' ? 'bg-amber-400' : 'bg-teal-400'
              }`}
            />
            <span className="text-[11px] font-semibold text-slate-200">
              {currentRole === 'employee' ? 'Staff Portal' : 'Admin & Manager Suite'}
            </span>
          </div>

          {currentRole === 'employee' ? (
            <button
              onClick={() => setCurrentRole('admin')}
              className="text-[10px] text-teal-400 hover:text-teal-300 underline font-medium"
            >
              Switch to Admin
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentRole('employee');
                setActiveTab('self-service');
              }}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-medium"
            >
              Try Self-Service
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs font-medium">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-500 text-slate-950 font-extrabold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Biometrics & Hardware Notice Pill */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Biometric Hardware
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                Bridge
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              ZKTeco, eSSL & Face kiosk integration details.
            </p>
            <button
              onClick={() => openHardwareModal('Biometric Device & Kiosk Integration')}
              className="mt-2.5 w-full py-1 text-center text-[11px] font-semibold text-teal-400 hover:text-teal-300 hover:bg-slate-800/80 rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Device Bridge</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
          <span>CoreNode Attend v1.2</span>
          <span>Asia/Kolkata</span>
        </div>
      </aside>
    </>
  );
};
