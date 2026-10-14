import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  FileEdit,
  Info,
  MoreVertical,
  Activity,
  PlusCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AttendanceStatus, Employee, AttendanceRecord } from '../../types';
import {
  getTodayDateString,
  getCurrentTimeString,
  formatDateIndian,
  formatTime12h,
} from '../../utils/formatters';
import { MarkAttendanceModal } from './AttendanceModals';
import { EmployeeDetailDrawer } from '../employees/EmployeeDetailDrawer';

export const LiveAttendanceModule: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    branches,
    departments,
    shifts,
    selectedBranchId,
    checkInEmployee,
    checkOutEmployee,
    markEmployeeAttendance,
    activityLogs,
    submitRegularizationRequest,
    openHardwareModal,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedEmpForDrawer, setSelectedEmpForDrawer] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Correction inline modal
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [correctingEmp, setCorrectingEmp] = useState<Employee | null>(null);
  const [correctCheckIn, setCorrectCheckIn] = useState('09:00');
  const [correctCheckOut, setCorrectCheckOut] = useState('17:00');
  const [correctReason, setCorrectReason] = useState('');

  // Date navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const isToday = selectedDate === getTodayDateString();

  // Active employees matching branch
  const activeEmployees = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  // Assemble attendance row for each active employee on selectedDate
  const rows = activeEmployees.map(emp => {
    const record = attendanceRecords.find(
      r => r.employeeId === emp.id && r.date === selectedDate
    );
    const shift = shifts.find(s => s.id === emp.shiftId) || shifts[0];
    const dept = departments.find(d => d.id === emp.departmentId);
    const branch = branches.find(b => b.id === emp.branchId);

    // If no record exists for this date, default to 'Not Checked In' if today, else 'Absent'
    const status: AttendanceStatus = record
      ? record.status
      : isToday
      ? 'Not Checked In'
      : 'Absent';

    return {
      employee: emp,
      record,
      shift,
      department: dept,
      branch,
      status,
    };
  });

  // Apply filters
  const filteredRows = rows.filter(item => {
    const matchesSearch =
      item.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'all' || item.employee.departmentId === deptFilter;
    const matchesShift = shiftFilter === 'all' || item.shift.id === shiftFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesDept && matchesShift && matchesStatus;
  });

  // Status metrics for selected date
  const statusCounts = {
    present: rows.filter(r => r.status === 'Present' || r.status === 'Checked Out').length,
    late: rows.filter(r => r.status === 'Late').length,
    absent: rows.filter(r => r.status === 'Absent').length,
    onLeave: rows.filter(r => r.status === 'On Leave').length,
    notCheckedIn: rows.filter(r => r.status === 'Not Checked In').length,
  };

  const handleOpenCorrection = (emp: Employee, rec?: AttendanceRecord) => {
    setCorrectingEmp(emp);
    setCorrectCheckIn(rec?.checkIn || '09:00');
    setCorrectCheckOut(rec?.checkOut || '17:00');
    setCorrectReason('');
    setIsCorrectModalOpen(true);
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingEmp) return;

    submitRegularizationRequest({
      employeeId: correctingEmp.id,
      date: selectedDate,
      currentCheckIn: rows.find(r => r.employee.id === correctingEmp.id)?.record?.checkIn,
      currentCheckOut: rows.find(r => r.employee.id === correctingEmp.id)?.record?.checkOut,
      requestedCheckIn: correctCheckIn,
      requestedCheckOut: correctCheckOut,
      reason: correctReason.trim() || 'Manual supervisor regularization requested',
    });

    setIsCorrectModalOpen(false);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Present</span>;
      case 'Late':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Late Arrival</span>;
      case 'Checked Out':
        return <span className="bg-teal-100 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Checked Out</span>;
      case 'Half Day':
        return <span className="bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Half Day</span>;
      case 'On Leave':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">On Leave</span>;
      case 'Absent':
        return <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">Absent</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">Not Checked In</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation Bar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">Live Attendance Roster</h1>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              Real-Time Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time punch tracking, working duration calculations, and shift grace compliance
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs">
            <button
              onClick={handlePrevDay}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{formatDateIndian(selectedDate)}</span>
            </div>
            <button
              onClick={handleNextDay}
              className="p-1 hover:bg-white text-slate-600 rounded transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={handleToday}
              className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              Today
            </button>
          )}

          <button
            onClick={() => setIsMarkModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Mark Punch</span>
          </button>
        </div>
      </div>

      {/* Date-specific Quick Stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-800">Present Staff</div>
            <div className="text-lg font-bold text-emerald-900 mt-0.5">{statusCounts.present}</div>
          </div>
          <UserCheck className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-800">Late Arrivals</div>
            <div className="text-lg font-bold text-amber-900 mt-0.5">{statusCounts.late}</div>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div className="bg-rose-50 border border-rose-200/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-800">Absent</div>
            <div className="text-lg font-bold text-rose-900 mt-0.5">{statusCounts.absent}</div>
          </div>
          <UserX className="w-5 h-5 text-rose-600" />
        </div>

        <div className="bg-purple-50 border border-purple-200/80 p-3 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-purple-800">On Leave</div>
            <div className="text-lg font-bold text-purple-900 mt-0.5">{statusCounts.onLeave}</div>
          </div>
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <div className="text-xs font-semibold text-slate-700">Not Checked In</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{statusCounts.notCheckedIn}</div>
          </div>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee name or EMP ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Shift */}
          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Shifts</option>
            {shifts.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Half Day">Half Day</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
            <option value="Not Checked In">Not Checked In</option>
          </select>

          {(searchQuery || deptFilter !== 'all' || shiftFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDeptFilter('all');
                setShiftFilter('all');
                setStatusFilter('all');
              }}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 py-1 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Dept & Role</th>
                <th className="py-3 px-3">Assigned Shift</th>
                <th className="py-3 px-3">Check-In</th>
                <th className="py-3 px-3">Check-Out</th>
                <th className="py-3 px-3">Working Hours</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No staff records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRows.map(({ employee, record, shift, department, status }) => {
                  const isCheckedIn = (status === 'Present' || status === 'Late') && record?.checkIn && !record?.checkOut;

                  return (
                    <tr key={employee.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee Info */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => {
                            setSelectedEmpForDrawer(employee);
                            setIsDrawerOpen(true);
                          }}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {employee.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{employee.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Role */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{department?.name}</div>
                        <div className="text-[11px] text-slate-500">{employee.designation}</div>
                      </td>

                      {/* Assigned Shift */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: shift.color }} />
                          <span className="font-semibold text-slate-800">{shift.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {shift.startTime} - {shift.endTime} (Grace: {shift.graceMinutes}m)
                        </div>
                      </td>

                      {/* Check-In */}
                      <td className="py-3 px-3">
                        {record?.checkIn ? (
                          <div className="font-semibold font-mono text-slate-800 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatTime12h(record.checkIn)}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Check-Out */}
                      <td className="py-3 px-3">
                        {record?.checkOut ? (
                          <div className="font-semibold font-mono text-slate-800 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatTime12h(record.checkOut)}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Working Hours */}
                      <td className="py-3 px-3">
                        {record?.workingHours ? (
                          <span className="font-mono font-bold text-slate-900">
                            {record.workingHours.toFixed(1)} hrs
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">0.0 hrs</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">{getStatusBadge(status)}</td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Check-In / Check-Out shortcut */}
                          {isCheckedIn ? (
                            <button
                              onClick={() => checkOutEmployee(employee.id)}
                              className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded font-semibold text-[11px] transition-colors"
                            >
                              Check Out
                            </button>
                          ) : (
                            <button
                              onClick={() => checkInEmployee(employee.id)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold text-[11px] transition-colors"
                            >
                              Check In
                            </button>
                          )}

                          {/* Regularize button */}
                          <button
                            onClick={() => handleOpenCorrection(employee, record)}
                            title="Attendance Regularization"
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <FileEdit className="w-4 h-4" />
                          </button>

                          {/* View details drawer */}
                          <button
                            onClick={() => {
                              setSelectedEmpForDrawer(employee);
                              setIsDrawerOpen(true);
                            }}
                            title="Staff Attendance History"
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Activity Feed & Biometric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              Live Activity Stream
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Real-time event logging</span>
          </div>

          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {activityLogs.slice(0, 6).map(log => (
              <div key={log.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">{log.action}: </span>
                    <span className="text-slate-600">{log.details}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Biometrics Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl text-white shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
              Hardware Compatibility
            </span>
            <h4 className="text-sm font-bold text-white mt-2">Biometric Punch & Face Recognition</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Connect biometric fingerprint terminals (eSSL, ZKTeco) or an iPad kiosk for automated contact-free punches.
            </p>
          </div>

          <button
            onClick={() => openHardwareModal('Biometric Device Integration')}
            className="mt-4 w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors text-center"
          >
            Learn How Hardware Connects
          </button>
        </div>
      </div>

      {/* Modals & Drawers */}
      <MarkAttendanceModal isOpen={isMarkModalOpen} onClose={() => setIsMarkModalOpen(false)} />
      <EmployeeDetailDrawer
        employee={selectedEmpForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEmpForDrawer(null);
        }}
      />

      {/* Inline Regularization Modal */}
      {isCorrectModalOpen && correctingEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">
              Request Attendance Regularization
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              For {correctingEmp.name} on {formatDateIndian(selectedDate)}
            </p>

            <form onSubmit={handleSubmitCorrection} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Check-In</label>
                  <input
                    type="time"
                    value={correctCheckIn}
                    onChange={e => setCorrectCheckIn(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Check-Out</label>
                  <input
                    type="time"
                    value={correctCheckOut}
                    onChange={e => setCorrectCheckOut(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Punch Adjustment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Device reader failure / off-site delivery run"
                  value={correctReason}
                  onChange={e => setCorrectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCorrectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Submit Regularization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
