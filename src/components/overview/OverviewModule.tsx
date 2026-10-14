import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarOff,
  Percent,
  AlertCircle,
  FileText,
  UserPlus,
  CalendarDays,
  Download,
  ArrowRight,
  Cake,
  Award,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  AttendanceBreakdownDonut,
  WeeklyAttendanceChart,
  DepartmentAttendanceBars,
} from '../charts/InteractiveCharts';
import {
  getTodayDateString,
  formatDateIndian,
  formatTime12h,
} from '../../utils/formatters';
import { MarkAttendanceModal } from '../attendance/AttendanceModals';
import { AddEmployeeModal } from '../employees/AddEmployeeModal';

export const OverviewModule: React.FC = () => {
  const {
    employees,
    attendanceRecords,
    leaveRequests,
    regularizationRequests,
    departments,
    branches,
    shifts,
    selectedBranchId,
    setActiveTab,
    currentRole,
    approveLeaveRequest,
    rejectLeaveRequest,
    approveRegularizationRequest,
    rejectRegularizationRequest,
    checkOutEmployee,
  } = useApp();

  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [isMarkAttModalOpen, setIsMarkAttModalOpen] = useState(false);

  const todayStr = getTodayDateString();

  // Filter employees and records by selected branch
  const filteredEmployees = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  const todayRecords = attendanceRecords.filter(
    r => r.date === todayStr && (selectedBranchId === 'all' || r.branchId === selectedBranchId)
  );

  // Compute live KPI metrics
  const totalEmployeesCount = filteredEmployees.length;
  const presentRecords = todayRecords.filter(r => r.status === 'Present');
  const lateRecords = todayRecords.filter(r => r.status === 'Late');
  const checkedOutRecords = todayRecords.filter(r => r.status === 'Checked Out');
  const halfDayRecords = todayRecords.filter(r => r.status === 'Half Day');
  const absentRecords = todayRecords.filter(r => r.status === 'Absent');
  const leaveRecords = todayRecords.filter(r => r.status === 'On Leave');

  // Currently checked-in = Present or Late and has checkIn without checkOut
  const currentlyCheckedInRecords = todayRecords.filter(
    r => (r.status === 'Present' || r.status === 'Late') && r.checkIn && !r.checkOut
  );

  const totalAttended = presentRecords.length + lateRecords.length + checkedOutRecords.length + halfDayRecords.length;
  const attendanceRate = totalEmployeesCount > 0 ? Math.round((totalAttended / totalEmployeesCount) * 100) : 0;

  const pendingLeaves = leaveRequests.filter(
    r => r.status === 'Pending' && (selectedBranchId === 'all' || employees.find(e => e.id === r.employeeId)?.branchId === selectedBranchId)
  );

  const pendingRegularizations = regularizationRequests.filter(
    r => r.status === 'Pending' && (selectedBranchId === 'all' || employees.find(e => e.id === r.employeeId)?.branchId === selectedBranchId)
  );

  // Weekly attendance data (last 7 days)
  const weeklyDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });

    const recs = attendanceRecords.filter(
      r => r.date === dStr && (selectedBranchId === 'all' || r.branchId === selectedBranchId)
    );

    return {
      dayLabel,
      date: formatDateIndian(dStr),
      present: recs.filter(r => r.status === 'Present' || r.status === 'Checked Out').length,
      late: recs.filter(r => r.status === 'Late').length,
      absent: recs.filter(r => r.status === 'Absent').length,
      leave: recs.filter(r => r.status === 'On Leave').length,
    };
  });

  // Department attendance rate
  const deptPerformance = departments.map(dept => {
    const deptEmps = filteredEmployees.filter(e => e.departmentId === dept.id);
    if (deptEmps.length === 0) return { name: dept.name, rate: 100, count: 0 };

    const deptRecs = todayRecords.filter(r => {
      const emp = employees.find(e => e.id === r.employeeId);
      return emp?.departmentId === dept.id;
    });

    const attended = deptRecs.filter(r => r.status === 'Present' || r.status === 'Late' || r.status === 'Checked Out').length;
    const rate = Math.round((attended / deptEmps.length) * 100);
    return { name: dept.name, rate, count: deptEmps.length };
  });

  const getGreeting = () => {
    if (currentRole === 'employee') return 'Good day, Aarav!';
    if (currentRole === 'hr') return 'Welcome, HR Operations!';
    if (currentRole === 'branch_manager') return 'Welcome, Branch Manager!';
    return 'Good morning, Admin!';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Greeting & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                {selectedBranchId === 'all'
                  ? 'All Branches'
                  : branches.find(b => b.id === selectedBranchId)?.name}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                • {formatDateIndian(todayStr)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">{getGreeting()}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Here is your workforce attendance overview for today. Real-time punches, late arrivals, and pending leave requests are ready for review.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddEmpModalOpen(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>

            <button
              onClick={() => setIsMarkAttModalOpen(true)}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('shifts')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Assign Shift</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div
          onClick={() => setActiveTab('employees')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-mono text-slate-400">Total</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{totalEmployeesCount}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Total Staff</div>
        </div>

        <div
          onClick={() => setActiveTab('live-attendance')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-600">Live</span>
          </div>
          <div className="text-xl font-bold text-emerald-700">{presentRecords.length + checkedOutRecords.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Present Today</div>
        </div>

        <div
          onClick={() => setActiveTab('live-attendance')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-rose-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <UserX className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-mono text-slate-400">Absent</span>
          </div>
          <div className="text-xl font-bold text-rose-700">{absentRecords.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Absent Today</div>
        </div>

        <div
          onClick={() => setActiveTab('live-attendance')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-600">Late</span>
          </div>
          <div className="text-xl font-bold text-amber-700">{lateRecords.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Late Arrivals</div>
        </div>

        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <CalendarOff className="w-4 h-4 text-purple-600" />
            <span className="text-[10px] font-mono text-slate-400">Leave</span>
          </div>
          <div className="text-xl font-bold text-purple-700">{leaveRecords.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">On Leave</div>
        </div>

        <div
          onClick={() => setActiveTab('live-attendance')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
            <span className="text-[10px] font-bold text-teal-600">Active</span>
          </div>
          <div className="text-xl font-bold text-teal-700">{currentlyCheckedInRecords.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Checked In Now</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <Percent className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-bold text-indigo-600">Rate</span>
          </div>
          <div className="text-xl font-bold text-slate-900">{attendanceRate}%</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Attendance Rate</div>
        </div>

        <div
          onClick={() => setActiveTab('leaves')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            {pendingLeaves.length > 0 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                Review
              </span>
            )}
          </div>
          <div className="text-xl font-bold text-amber-700">{pendingLeaves.length}</div>
          <div className="text-[11px] font-medium text-slate-500 truncate">Pending Leaves</div>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Donut Breakdown & Weekly Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Today's Attendance Composition</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proportion of staff present, late, on leave, and absent
                </p>
              </div>
              <button
                onClick={() => setActiveTab('live-attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View Live Roster <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <AttendanceBreakdownDonut
              present={presentRecords.length + checkedOutRecords.length}
              late={lateRecords.length}
              absent={absentRecords.length}
              halfDay={halfDayRecords.length}
              onLeave={leaveRecords.length}
              notCheckedIn={Math.max(0, totalEmployeesCount - todayRecords.length)}
            />
          </div>

          {/* Weekly Attendance Trend */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">7-Day Attendance Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily comparison of staff attendance and punctuality
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Past Week
              </span>
            </div>

            <WeeklyAttendanceChart days={weeklyDays} />
          </div>

          {/* Currently Checked In Staff Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Currently Checked-In Staff ({currentlyCheckedInRecords.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500">Live Work Floor</span>
            </div>

            {currentlyCheckedInRecords.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No employees currently clocked in on floor.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {currentlyCheckedInRecords.slice(0, 6).map(rec => {
                  const emp = employees.find(e => e.id === rec.employeeId);
                  const shift = shifts.find(s => s.id === rec.shiftId);
                  if (!emp) return null;

                  return (
                    <div key={rec.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{emp.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({emp.id})</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {emp.designation} • Shift: {shift?.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-emerald-700 flex items-center gap-1 justify-end">
                            <Clock className="w-3.5 h-3.5" /> {formatTime12h(rec.checkIn)}
                          </div>
                          <div className="text-[10px] text-slate-400">Clocked In</div>
                        </div>

                        <button
                          onClick={() => checkOutEmployee(emp.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded text-[11px] font-semibold border border-slate-200 transition-colors"
                        >
                          Check Out
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Department Comparison & Pending Approvals */}
        <div className="space-y-6">
          {/* Department-wise attendance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Department Attendance</h3>
            <p className="text-xs text-slate-500 mb-4">Today's presence percentage by team</p>
            <DepartmentAttendanceBars departments={deptPerformance} />
          </div>

          {/* Pending Approvals Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Action Items</h3>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {pendingLeaves.length + pendingRegularizations.length} Awaiting
              </span>
            </div>

            {/* Pending Leave Requests */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Leave Approvals ({pendingLeaves.length})
              </span>
              {pendingLeaves.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-400 text-xs text-center">
                  No pending leave requests
                </div>
              ) : (
                pendingLeaves.slice(0, 2).map(req => {
                  const emp = employees.find(e => e.id === req.employeeId);
                  return (
                    <div key={req.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{emp?.name}</span>
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                          {req.leaveType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {formatDateIndian(req.startDate)} to {formatDateIndian(req.endDate)} ({req.daysCount} d)
                      </div>
                      <div className="text-[11px] text-slate-500 italic truncate">"{req.reason}"</div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => rejectLeaveRequest(req.id)}
                          className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveLeaveRequest(req.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors shadow-2xs"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pending Regularization Requests */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Punch Corrections ({pendingRegularizations.length})
              </span>
              {pendingRegularizations.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-400 text-xs text-center">
                  No pending punch corrections
                </div>
              ) : (
                pendingRegularizations.slice(0, 2).map(reg => {
                  const emp = employees.find(e => e.id === reg.employeeId);
                  return (
                    <div key={reg.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{emp?.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{reg.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Requested: {formatTime12h(reg.requestedCheckIn)} - {formatTime12h(reg.requestedCheckOut)}
                      </div>
                      <div className="text-[11px] text-slate-500 italic truncate">"{reg.reason}"</div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => rejectRegularizationRequest(reg.id)}
                          className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => approveRegularizationRequest(reg.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors shadow-2xs"
                        >
                          Approve Fix
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Celebrations Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Workplace Milestones
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-lg flex items-center gap-3">
                <Cake className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Chef Rohan Gupta</div>
                  <div className="text-[11px] text-slate-500">Birthday coming up on 18 Oct</div>
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/60 border border-teal-200/60 rounded-lg flex items-center gap-3">
                <Award className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Aarav Sharma</div>
                  <div className="text-[11px] text-slate-500">3-Year Work Anniversary this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal isOpen={isAddEmpModalOpen} onClose={() => setIsAddEmpModalOpen(false)} />
      <MarkAttendanceModal isOpen={isMarkAttModalOpen} onClose={() => setIsMarkAttModalOpen(false)} />
    </div>
  );
};
