import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Clock, User, AlertCircle, FileText } from 'lucide-react';
import { AttendanceStatus } from '../../types';
import { getTodayDateString, getCurrentTimeString } from '../../utils/formatters';

export const MarkAttendanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  preselectedEmployeeId?: string;
}> = ({ isOpen, onClose, preselectedEmployeeId }) => {
  const { employees, markEmployeeAttendance, shifts, selectedBranchId } = useApp();

  const activeEmployees = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  const [employeeId, setEmployeeId] = useState(preselectedEmployeeId || activeEmployees[0]?.id || '');
  const [status, setStatus] = useState<AttendanceStatus>('Present');
  const [date, setDate] = useState(getTodayDateString());
  const [checkIn, setCheckIn] = useState('09:00');
  const [checkOut, setCheckOut] = useState('17:00');
  const [note, setNote] = useState('');
  const [includeTimes, setIncludeTimes] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    markEmployeeAttendance(
      employeeId,
      status,
      date,
      includeTimes && (status === 'Present' || status === 'Late' || status === 'Half Day') ? checkIn : undefined,
      includeTimes && (status === 'Present' || status === 'Late' || status === 'Half Day') ? checkOut : undefined,
      note.trim() ? note : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Record Attendance Entry</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Employee *</label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-hidden"
            >
              {activeEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id}) — {emp.designation}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attendance Status *</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-hidden"
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="Absent">Absent</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-hidden"
              />
            </div>
          </div>

          {(status === 'Present' || status === 'Late' || status === 'Half Day') && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Include Punch Timestamps</span>
                <input
                  type="checkbox"
                  checked={includeTimes}
                  onChange={e => setIncludeTimes(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {includeTimes && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Check-In Time</label>
                    <input
                      type="time"
                      value={checkIn}
                      onChange={e => setCheckIn(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-800 font-mono text-xs focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Check-Out Time</label>
                    <input
                      type="time"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-slate-800 font-mono text-xs focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remarks / Note (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Approved by store manager for morning setup"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-xs transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
