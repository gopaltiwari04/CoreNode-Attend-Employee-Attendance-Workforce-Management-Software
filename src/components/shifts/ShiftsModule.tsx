import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Clock,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Check,
  Moon,
  Sun,
  Coffee,
  X,
  Users,
  Calendar,
} from 'lucide-react';
import { Shift, Employee } from '../../types';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
  { id: 0, label: 'Sun' },
];

export const ShiftsModule: React.FC = () => {
  const {
    shifts,
    employees,
    branches,
    departments,
    selectedBranchId,
    createShift,
    updateShift,
    deleteShift,
    assignShiftToEmployee,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'roster' | 'shifts'>('roster');

  // Modal state
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMinutes, setBreakMinutes] = useState('60');
  const [graceMinutes, setGraceMinutes] = useState('15');
  const [weeklyOffs, setWeeklyOffs] = useState<number[]>([0]);
  const [isOvernight, setIsOvernight] = useState(false);
  const [color, setColor] = useState('#0284c7');

  // Filter employees by branch
  const activeEmployees = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  const handleOpenCreate = () => {
    setEditingShift(null);
    setName('');
    setStartTime('09:00');
    setEndTime('17:00');
    setBreakMinutes('60');
    setGraceMinutes('15');
    setWeeklyOffs([0]);
    setIsOvernight(false);
    setColor('#0f766e');
    setIsShiftModalOpen(true);
  };

  const handleOpenEdit = (shift: Shift) => {
    setEditingShift(shift);
    setName(shift.name);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setBreakMinutes(String(shift.breakMinutes));
    setGraceMinutes(String(shift.graceMinutes));
    setWeeklyOffs(shift.weeklyOffDays);
    setIsOvernight(!!shift.isOvernight);
    setColor(shift.color);
    setIsShiftModalOpen(true);
  };

  const handleSubmitShift = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      startTime,
      endTime,
      breakMinutes: parseInt(breakMinutes, 10) || 60,
      graceMinutes: parseInt(graceMinutes, 10) || 15,
      weeklyOffDays: weeklyOffs,
      isOvernight,
      color,
    };

    if (editingShift) {
      updateShift({ ...editingShift, ...payload });
    } else {
      createShift(payload);
    }

    setIsShiftModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const res = deleteShift(id);
    if (!res.success && res.message) {
      showToast(res.message, 'error');
    }
  };

  const toggleOffDay = (dayId: number) => {
    setWeeklyOffs(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Shifts & Weekly Rosters</h1>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              Grace & Punctuality Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure working shifts, grace periods, overnight hours, and weekly employee schedules
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'roster' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Weekly Roster
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'shifts' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Shift Settings ({shifts.length})
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Shift</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'roster' ? (
        /* Weekly Roster Grid */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-900">Current Week Roster (Indiranagar & Koramangala)</span>
            </div>
            <span className="text-slate-500 text-[11px]">Click any shift badge to reassign employee shift</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 min-w-[220px]">Employee / Department</th>
                  {DAYS_OF_WEEK.map(day => (
                    <th key={day.id} className="py-3 px-3 text-center min-w-[110px]">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeEmployees.map(emp => {
                  const currentShift = shifts.find(s => s.id === emp.shiftId);
                  const dept = departments.find(d => d.id === emp.departmentId);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70">
                      {/* Employee Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {dept?.name} • <span className="font-mono">{emp.id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Day Columns */}
                      {DAYS_OF_WEEK.map(day => {
                        const isOff = currentShift?.weeklyOffDays.includes(day.id);

                        return (
                          <td key={day.id} className="py-2.5 px-2 text-center">
                            {isOff ? (
                              <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200">
                                Weekly Off
                              </span>
                            ) : currentShift ? (
                              <div
                                onClick={() => {
                                  // Quick cycler to next shift
                                  const currentIdx = shifts.findIndex(s => s.id === currentShift.id);
                                  const nextShift = shifts[(currentIdx + 1) % shifts.length];
                                  assignShiftToEmployee(emp.id, nextShift.id);
                                }}
                                className="group cursor-pointer inline-flex flex-col items-center p-1 rounded-md hover:ring-2 hover:ring-indigo-400 transition-all"
                              >
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded text-white flex items-center gap-1 shadow-2xs"
                                  style={{ backgroundColor: currentShift.color }}
                                >
                                  {currentShift.isOvernight && <Moon className="w-2.5 h-2.5" />}
                                  {currentShift.name.replace(' Shift', '')}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                                  {currentShift.startTime}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-semibold flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Unassigned
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Shifts Config Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shifts.map(shift => {
            const assignedCount = employees.filter(e => e.shiftId === shift.id).length;

            return (
              <div
                key={shift.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: shift.color }}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(shift)}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                        title="Edit Shift"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(shift.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                        title="Delete Shift"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mt-2 flex items-center gap-1.5">
                    {shift.name}
                    {shift.isOvernight && (
                      <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                        Overnight
                      </span>
                    )}
                  </h3>

                  <div className="mt-3 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Scheduled Hours:</span>
                      <span className="font-semibold text-slate-800">
                        {shift.startTime} to {shift.endTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Grace Period:</span>
                      <span className="font-semibold text-amber-700">{shift.graceMinutes} mins</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Break Duration:</span>
                      <span className="font-semibold text-slate-800">{shift.breakMinutes} mins</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Weekly Offs:</span>
                      <span className="font-semibold text-slate-800">
                        {shift.weeklyOffDays
                          .map(d => DAYS_OF_WEEK.find(day => day.id === d)?.label)
                          .join(', ') || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{assignedCount} Assigned Staff</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{shift.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Shift Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingShift ? 'Edit Shift Configuration' : 'Create New Working Shift'}
              </h3>
              <button
                onClick={() => setIsShiftModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitShift} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Rush Shift"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time (24h) *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time (24h) *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grace Period (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={graceMinutes}
                    onChange={e => setGraceMinutes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Break Duration (Mins)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={breakMinutes}
                    onChange={e => setBreakMinutes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="overnight"
                  checked={isOvernight}
                  onChange={e => setIsOvernight(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="overnight" className="font-semibold text-slate-700 cursor-pointer">
                  Overnight Shift (Crosses midnight into next day)
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Off Days</label>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = weeklyOffs.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleOffDay(day.id)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShiftModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  {editingShift ? 'Save Changes' : 'Create Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
