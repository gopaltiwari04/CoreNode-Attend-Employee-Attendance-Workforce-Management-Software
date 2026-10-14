import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  CalendarOff,
  FileEdit,
  Shield,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Coffee,
  Sparkles,
  MapPin,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  formatDateIndian,
  formatTime12h,
  getTodayDateString,
  getCurrentTimeString,
} from '../../utils/formatters';

export const EmployeeSelfService: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    shifts,
    branches,
    leaveRequests,
    regularizationRequests,
    checkInEmployee,
    checkOutEmployee,
    submitLeaveRequest,
    submitRegularizationRequest,
    setCurrentRole,
    showToast,
  } = useApp();

  // Active employee for self service (Aarav Sharma EMP001 by default)
  const currentEmp = employees.find(e => e.id === 'EMP001') || employees[0];
  const todayStr = getTodayDateString();

  // Live clock simulation
  const [liveTime, setLiveTime] = useState(getCurrentTimeString());
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const empShift = shifts.find(s => s.id === currentEmp?.shiftId) || shifts[0];
  const empBranch = branches.find(b => b.id === currentEmp?.branchId);

  // Today's attendance record
  const todayRecord = attendanceRecords.find(
    r => r.employeeId === currentEmp?.id && r.date === todayStr
  );

  const isCheckedIn = !!(todayRecord?.checkIn && !todayRecord?.checkOut && todayRecord?.status !== 'Absent' && todayRecord?.status !== 'On Leave');
  const isCheckedOut = !!todayRecord?.checkOut;

  // Monthly stats
  const pastRecords = attendanceRecords.filter(r => r.employeeId === currentEmp?.id);
  const daysPresent = pastRecords.filter(r => r.status === 'Present' || r.status === 'Checked Out').length;
  const lateDays = pastRecords.filter(r => r.status === 'Late').length;
  const totalHours = pastRecords.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

  // Modals for leave & regularization
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'Casual Leave' | 'Sick Leave' | 'Earned Leave'>('Casual Leave');
  const [leaveStart, setLeaveStart] = useState(todayStr);
  const [leaveEnd, setLeaveEnd] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState('');

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regDate, setRegDate] = useState(todayStr);
  const [regIn, setRegIn] = useState('09:00');
  const [regOut, setRegOut] = useState('17:00');
  const [regReason, setRegReason] = useState('');

  const handleSelfCheckIn = () => {
    const res = checkInEmployee(currentEmp.id);
    if (!res.success && res.error) {
      showToast(res.error, 'error');
    }
  };

  const handleSelfCheckOut = () => {
    const res = checkOutEmployee(currentEmp.id);
    if (!res.success && res.error) {
      showToast(res.error, 'error');
    }
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      employeeId: currentEmp.id,
      leaveType,
      startDate: leaveStart,
      endDate: leaveEnd,
      daysCount: 1,
      reason: leaveReason.trim() || 'Personal leave request',
    });
    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  const handleApplyReg = (e: React.FormEvent) => {
    e.preventDefault();
    submitRegularizationRequest({
      employeeId: currentEmp.id,
      date: regDate,
      requestedCheckIn: regIn,
      requestedCheckOut: regOut,
      reason: regReason.trim() || 'Self-service punch correction',
    });
    setIsRegModalOpen(false);
    setRegReason('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner with Switch Mode */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentEmp.avatar}
            alt={currentEmp.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Staff Self-Service Portal
              </span>
              <span className="text-xs text-slate-400 font-mono">({currentEmp.id})</span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Namaste, {currentEmp.name}</h1>
            <p className="text-xs text-slate-300">
              {currentEmp.designation} • {empBranch?.name}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentRole('admin')}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <span>Return to Manager View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Punch Clock Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Simulated Device Time (Asia/Kolkata)</span>
          </div>

          <div className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 tracking-tight">
            {formatTime12h(liveTime)}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Today: <strong className="text-slate-800">{formatDateIndian(todayStr)}</strong>
          </div>

          <div className="pt-1 flex items-center justify-center md:justify-start gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: empShift.color }}
            />
            <span className="text-xs font-semibold text-slate-700">
              Assigned Shift: {empShift.name} ({empShift.startTime} - {empShift.endTime})
            </span>
          </div>
        </div>

        {/* Action Punch Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {!isCheckedIn && !isCheckedOut ? (
            <button
              onClick={handleSelfCheckIn}
              className="w-full sm:w-44 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex flex-col items-center justify-center shadow-lg shadow-emerald-600/20 transition-all hover:scale-102"
            >
              <CheckCircle2 className="w-6 h-6 mb-1" />
              <span>Punch In Now</span>
              <span className="text-[10px] font-normal opacity-90 mt-0.5 font-mono">
                Grace: {empShift.graceMinutes}m
              </span>
            </button>
          ) : isCheckedIn ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Clocked In Today At
                </span>
                <span className="text-lg font-bold font-mono text-emerald-900">
                  {formatTime12h(todayRecord?.checkIn)}
                </span>
              </div>

              <button
                onClick={handleSelfCheckOut}
                className="w-full sm:w-44 py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex flex-col items-center justify-center shadow-lg shadow-amber-600/20 transition-all hover:scale-102"
              >
                <Clock className="w-6 h-6 mb-1" />
                <span>Punch Out</span>
                <span className="text-[10px] font-normal opacity-90 mt-0.5">End Work Shift</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-center w-full sm:w-64">
              <span className="text-xs font-bold text-teal-900 block">Shift Completed Today!</span>
              <span className="text-xs text-teal-700 mt-1 block">
                Punched In: {formatTime12h(todayRecord?.checkIn)} • Punched Out: {formatTime12h(todayRecord?.checkOut)}
              </span>
              <span className="text-sm font-mono font-bold text-teal-950 mt-1 block">
                Total: {todayRecord?.workingHours} hrs logged
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 text-xs block">Days Present</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
            {daysPresent}
          </span>
          <span className="text-[11px] text-slate-500">Last 30 Days</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 text-xs block">Hours Logged</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
            {totalHours.toFixed(1)} h
          </span>
          <span className="text-[11px] text-slate-500">Working duration</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 text-xs block">Casual Leave Quota</span>
          <span className="text-2xl font-bold font-mono text-purple-700 mt-1 block">
            {currentEmp.leaveBalance.casual} d
          </span>
          <span className="text-[11px] text-slate-500">Available</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 text-xs block">Earned Leave Quota</span>
          <span className="text-2xl font-bold font-mono text-indigo-700 mt-1 block">
            {currentEmp.leaveBalance.earned} d
          </span>
          <span className="text-[11px] text-slate-500">Available</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Need Time Off?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit a Casual, Sick, or Earned leave request to your store manager.
            </p>
          </div>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs shrink-0 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Missed a Punch?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit an attendance regularization request with supervisor notes.
            </p>
          </div>
          <button
            onClick={() => setIsRegModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs shrink-0 transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Request Fix</span>
          </button>
        </div>
      </div>

      {/* Recent Personal Punch Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">Your Recent Attendance History</span>
          <span className="text-slate-500 text-[11px]">Past 7 Logged Days</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {pastRecords.slice(0, 7).map(rec => (
            <div key={rec.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
              <div>
                <div className="font-semibold text-slate-800">{formatDateIndian(rec.date)}</div>
                <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                  Check-In: {formatTime12h(rec.checkIn)} • Check-Out: {formatTime12h(rec.checkOut)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-700 font-semibold">{rec.workingHours} hrs</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rec.status === 'Present' || rec.status === 'Checked Out'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rec.status === 'Late'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {rec.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Apply for Leave</h3>
            <form onSubmit={handleApplyLeave} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                >
                  <option value="Casual Leave">Casual Leave ({currentEmp.leaveBalance.casual} left)</option>
                  <option value="Sick Leave">Sick Leave ({currentEmp.leaveBalance.sick} left)</option>
                  <option value="Earned Leave">Earned Leave ({currentEmp.leaveBalance.earned} left)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStart}
                    onChange={e => setLeaveStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEnd}
                    onChange={e => setLeaveEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Reason for taking time off..."
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Regularization Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Request Punch Correction</h3>
            <form onSubmit={handleApplyReg} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Missed Punch</label>
                <input
                  type="date"
                  required
                  value={regDate}
                  onChange={e => setRegDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Check-In</label>
                  <input
                    type="time"
                    required
                    value={regIn}
                    onChange={e => setRegIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Actual Check-Out</label>
                  <input
                    type="time"
                    required
                    value={regOut}
                    onChange={e => setRegOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Missing Punch</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Card scanner was offline at the café entrance..."
                  value={regReason}
                  onChange={e => setRegReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Submit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
