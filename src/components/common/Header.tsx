import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Search,
  MapPin,
  Shield,
  UserCheck,
  RotateCcw,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  Check,
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  User,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const {
    currentRole,
    setCurrentRole,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    employees,
    notifications,
    markNotificationsAsRead,
    setActiveTab,
    setSelectedEmployeeId,
    startTour,
    resetDemoData,
    setIsLoggedIn,
    showToast,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredEmployees = searchQuery.trim()
    ? employees.filter(
        e =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.designation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'employee') {
      setActiveTab('self-service');
      showToast('Switched to Employee Self-Service mode (Aarav Sharma)', 'info');
    } else {
      if (role === 'branch_manager' && selectedBranchId === 'all') {
        setSelectedBranchId('BR-MAIN');
      }
      showToast(`Switched view to ${role === 'admin' ? 'Business Owner / Admin' : role === 'hr' ? 'HR Manager' : 'Branch Manager'}`);
    }
    setIsProfileOpen(false);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Business Owner';
      case 'hr':
        return 'HR Manager';
      case 'branch_manager':
        return 'Branch Manager';
      case 'employee':
        return 'Staff / Employee';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        {/* Left: Mobile hamburger & Branch Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Branch Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                value={selectedBranchId}
                onChange={e => {
                  setSelectedBranchId(e.target.value);
                  showToast(
                    e.target.value === 'all'
                      ? 'Displaying all branches combined'
                      : `Filtered to ${branches.find(b => b.id === e.target.value)?.name}`
                  );
                }}
                className="bg-transparent border-none text-slate-800 text-xs font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Locations (2 Branches)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Persistent Demo Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Demo Mode Active
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name, EMP ID, or role..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-11 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Staff ({filteredEmployees.length})
              </div>
              {filteredEmployees.length === 0 ? (
                <div className="px-4 py-3 text-xs text-slate-500 text-center">No employee found</div>
              ) : (
                filteredEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployeeId(emp.id);
                      setActiveTab('employees');
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-800">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">{emp.designation} • {emp.id}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {branches.find(b => b.id === emp.branchId)?.code}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right side: Tour, Notifications, Role Switcher & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Guided Tour Trigger Button */}
          <button
            onClick={startTour}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Tour Demo</span>
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (unreadCount > 0) markNotificationsAsRead();
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Activity & Alerts</span>
                  </div>
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-[11px] text-teal-300 hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.targetTab) setActiveTab(n.targetTab as any);
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                          !n.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {n.type === 'success' && <Check className="w-4 h-4 text-emerald-500" />}
                          {n.type === 'info' && <Info className="w-4 h-4 text-teal-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{n.title}</div>
                          <div className="text-slate-600 text-[11px] mt-0.5">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200/80 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs ring-1 ring-slate-300">
                {currentRole === 'employee' ? 'AS' : 'UB'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentRole === 'employee' ? 'Aarav Sharma' : 'Urban Brew Admin'}
                </div>
                <div className="text-[10px] text-indigo-700 font-semibold leading-tight">
                  {getRoleLabel(currentRole)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">CoreNode Attend Demo</div>
                  <div className="text-[11px] text-slate-500">Urban Brew Software Account</div>
                </div>

                {/* Role Switcher Section */}
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Switch Active Role
                  </div>
                  <div className="space-y-1">
                    {[
                      { role: 'admin' as UserRole, label: 'Business Owner / Admin' },
                      { role: 'hr' as UserRole, label: 'HR Manager' },
                      { role: 'branch_manager' as UserRole, label: 'Branch Manager' },
                      { role: 'employee' as UserRole, label: 'Employee (Self-Service)' },
                    ].map(r => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleChange(r.role)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          currentRole === r.role
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r.label}</span>
                        {currentRole === r.role && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" /> Account Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsResetConfirmOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Reset Demo Data
                  </button>

                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" /> Exit to Demo Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Dialog for Reset Demo Data */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data to Factory Default?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              This will restore all 22 Indian employee profiles, seed shifts, 30-day historical logs, leaves, and attendance punches back to their pristine demo state. Any custom check-ins or records created during this session will be refreshed.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
              >
                Yes, Restore Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
