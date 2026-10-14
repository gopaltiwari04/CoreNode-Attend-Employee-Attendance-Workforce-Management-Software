import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Shield,
  FileCheck2,
  CalendarOff,
  UserCheck,
  AlertTriangle,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../../types';
import {
  formatDateIndian,
  formatTime12h,
  formatCurrencyINR,
} from '../../utils/formatters';

interface DrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeDetailDrawer: React.FC<DrawerProps> = ({ employee, isOpen, onClose }) => {
  const {
    branches,
    departments,
    shifts,
    attendanceRecords,
    leaveRequests,
    assignShiftToEmployee,
    toggleEmployeeStatus,
    updateEmployee,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'shift' | 'leaves' | 'edit'>('overview');
  const [selectedShiftId, setSelectedShiftId] = useState(employee?.shiftId || '');
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(employee?.name || '');
  const [editPhone, setEditPhone] = useState(employee?.phone || '');
  const [editDesignation, setEditDesignation] = useState(employee?.designation || '');
  const [editSalary, setEditSalary] = useState(String(employee?.salary || 0));

  if (!isOpen || !employee) return null;

  const branch = branches.find(b => b.id === employee.branchId);
  const department = departments.find(d => d.id === employee.departmentId);
  const shift = shifts.find(s => s.id === employee.shiftId);

  // Attendance stats for this employee
  const empRecords = attendanceRecords
    .filter(r => r.employeeId === employee.id)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  const totalLogs = empRecords.length;
  const presentCount = empRecords.filter(r => r.status === 'Present' || r.status === 'Checked Out').length;
  const lateCount = empRecords.filter(r => r.status === 'Late').length;
  const absentCount = empRecords.filter(r => r.status === 'Absent').length;
  const leaveCount = empRecords.filter(r => r.status === 'On Leave').length;
  const totalWorkingHours = empRecords.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

  const attendanceRate = totalLogs > 0 ? Math.round(((presentCount + lateCount) / totalLogs) * 100) : 100;

  // Leave history
  const empLeaves = leaveRequests.filter(l => l.employeeId === employee.id);

  const handleSaveShift = () => {
    if (selectedShiftId && selectedShiftId !== employee.shiftId) {
      assignShiftToEmployee(employee.id, selectedShiftId);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployee({
      ...employee,
      name: editName,
      phone: editPhone,
      designation: editDesignation,
      salary: parseInt(editSalary, 10) || employee.salary,
    });
    setActiveTab('overview');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right">
        {/* Header Profile Summary */}
        <div className="p-6 bg-slate-950 text-white shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-teal-400 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white truncate">{employee.name}</h2>
                <span className="text-[10px] font-mono bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
                  {employee.id}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    employee.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 mt-0.5">{employee.designation}</div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2.5">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-400" />
                  {department?.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {branch?.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Joined {formatDateIndian(employee.joiningDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-slate-800 text-xs font-semibold overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendance', label: `Attendance Log (${totalLogs})` },
              { id: 'shift', label: 'Shift Roster' },
              { id: 'leaves', label: `Leave Balances (${empLeaves.length})` },
              { id: 'edit', label: 'Edit Profile' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-slate-800">{attendanceRate}%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Attendance Rate</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-emerald-800">{presentCount}</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Days Present</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-amber-800">{lateCount}</div>
                  <div className="text-[11px] text-amber-700 font-medium">Late Arrivals</div>
                </div>
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-rose-800">{absentCount}</div>
                  <div className="text-[11px] text-rose-700 font-medium">Absences</div>
                </div>
              </div>

              {/* Personal Information Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Contact & Employment Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Email</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Mobile Phone</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Employment Classification</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{employee.employmentType}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Reporting Line Manager</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{employee.reportingManager}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Base Monthly Compensation</span>
                    <span className="font-semibold text-indigo-700 font-mono mt-0.5 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" /> {formatCurrencyINR(employee.salary)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] block">Emergency Contact</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {employee.emergencyContact || 'Not recorded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Employment Status Controls</div>
                  <div className="text-[11px] text-slate-500">
                    Active employees can check in and be scheduled on rosters.
                  </div>
                </div>
                <button
                  onClick={() => setIsDeactivateConfirmOpen(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    employee.status === 'Active'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {employee.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">Past 30 Days Attendance Timeline</span>
                <span className="text-slate-500 text-[11px]">Total Logged: {totalWorkingHours.toFixed(1)} hrs</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {empRecords.map(rec => {
                  const isPresent = rec.status === 'Present' || rec.status === 'Checked Out';
                  const isLate = rec.status === 'Late';
                  const isLeave = rec.status === 'On Leave';

                  return (
                    <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-800">{formatDateIndian(rec.date)}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          In: {formatTime12h(rec.checkIn)} • Out: {formatTime12h(rec.checkOut)}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPresent
                              ? 'bg-emerald-100 text-emerald-800'
                              : isLate
                              ? 'bg-amber-100 text-amber-800'
                              : isLeave
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {rec.workingHours ? `${rec.workingHours} hrs` : '-'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'shift' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h3 className="font-bold text-slate-800 text-xs mb-2">Current Active Shift</h3>
                {shift ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{shift.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Timings: {shift.startTime} to {shift.endTime} (Grace Period: {shift.graceMinutes}m)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Break: {shift.breakMinutes} mins • Overnight: {shift.isOvernight ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: shift.color }}
                    />
                  </div>
                ) : (
                  <div className="text-slate-400">No shift currently assigned.</div>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">Assign or Switch Shift</h4>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedShiftId}
                    onChange={e => setSelectedShiftId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-hidden"
                  >
                    {shifts.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveShift}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Update Shift
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-900">{employee.leaveBalance.casual}</div>
                  <div className="text-[11px] text-purple-700 font-medium">Casual Leave</div>
                </div>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-center">
                  <div className="text-xl font-bold text-teal-900">{employee.leaveBalance.sick}</div>
                  <div className="text-[11px] text-teal-700 font-medium">Sick Leave</div>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                  <div className="text-xl font-bold text-indigo-900">{employee.leaveBalance.earned}</div>
                  <div className="text-[11px] text-indigo-700 font-medium">Earned Leave</div>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 text-xs mt-2">Submitted Leave Requests</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {empLeaves.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">No leave requests recorded.</div>
                ) : (
                  empLeaves.map(lr => (
                    <div key={lr.id} className="p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{lr.leaveType}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lr.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : lr.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {lr.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formatDateIndian(lr.startDate)} to {formatDateIndian(lr.endDate)} ({lr.daysCount} days)
                      </div>
                      <div className="text-slate-600 text-[11px] italic">"{lr.reason}"</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={e => setEditDesignation(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={editSalary}
                  onChange={e => setEditSalary(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Deactivation */}
      {isDeactivateConfirmOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {employee.status === 'Active' ? 'Deactivate Employee?' : 'Reactivate Employee?'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {employee.status === 'Active'
                ? `Deactivating ${employee.name} will suspend punch recording and remove them from active weekly rosters.`
                : `Reactivating ${employee.name} will enable them to record punches and be scheduled on shifts.`}
            </p>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setIsDeactivateConfirmOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleEmployeeStatus(employee.id);
                  setIsDeactivateConfirmOpen(false);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs ${
                  employee.status === 'Active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {employee.status === 'Active' ? 'Deactivation' : 'Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
