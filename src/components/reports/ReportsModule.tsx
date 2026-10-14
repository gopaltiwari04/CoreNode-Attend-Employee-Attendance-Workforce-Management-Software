import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Building,
  TrendingDown,
  FileSpreadsheet,
} from 'lucide-react';
import {
  formatDateIndian,
  formatTime12h,
  getTodayDateString,
  downloadCSV,
  printCurrentView,
} from '../../utils/formatters';

type ReportType =
  | 'daily'
  | 'monthly'
  | 'employee_history'
  | 'late'
  | 'absenteeism'
  | 'hours'
  | 'leaves'
  | 'branch_compare';

export const ReportsModule: React.FC = () => {
  const {
    attendanceRecords,
    employees,
    branches,
    departments,
    shifts,
    leaveRequests,
    selectedBranchId,
    showToast,
  } = useApp();

  const [activeReport, setActiveReport] = useState<ReportType>('daily');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('30days');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP001');
  const [deptFilter, setDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getTodayDateString();

  // Determine date bounds
  const getFilteredRecords = () => {
    let daysToLook = 30;
    if (dateRange === 'today') daysToLook = 1;
    if (dateRange === '7days') daysToLook = 7;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToLook);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    return attendanceRecords.filter(r => {
      const isDateInRange = dateRange === 'today' ? r.date === todayStr : r.date >= cutoffStr;
      const isBranch = selectedBranchId === 'all' || r.branchId === selectedBranchId;
      const emp = employees.find(e => e.id === r.employeeId);
      const isDept = deptFilter === 'all' || emp?.departmentId === deptFilter;
      const isSearch =
        !searchQuery ||
        emp?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp?.id.toLowerCase().includes(searchQuery.toLowerCase());

      return isDateInRange && isBranch && isDept && isSearch;
    });
  };

  const records = getFilteredRecords();

  // Export handler
  const handleExportCSV = () => {
    let filename = `CoreNode_${activeReport}_Report_${todayStr}.csv`;
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeReport === 'daily') {
      headers = ['Date', 'EMP ID', 'Employee Name', 'Department', 'Branch', 'Shift', 'Check-In', 'Check-Out', 'Hours', 'Status'];
      rows = records.map(r => {
        const emp = employees.find(e => e.id === r.employeeId);
        const dept = departments.find(d => d.id === emp?.departmentId)?.name || '';
        const branch = branches.find(b => b.id === r.branchId)?.name || '';
        const shift = shifts.find(s => s.id === r.shiftId)?.name || '';
        return [
          r.date,
          r.employeeId,
          emp?.name || '',
          dept,
          branch,
          shift,
          formatTime12h(r.checkIn),
          formatTime12h(r.checkOut),
          r.workingHours,
          r.status,
        ];
      });
    } else if (activeReport === 'monthly') {
      headers = ['EMP ID', 'Employee Name', 'Department', 'Branch', 'Days Present', 'Late Arrivals', 'Absences', 'Leave Days', 'Attendance %'];
      rows = employees.map(emp => {
        const empRecs = records.filter(r => r.employeeId === emp.id);
        const present = empRecs.filter(r => r.status === 'Present' || r.status === 'Checked Out').length;
        const late = empRecs.filter(r => r.status === 'Late').length;
        const absent = empRecs.filter(r => r.status === 'Absent').length;
        const leave = empRecs.filter(r => r.status === 'On Leave').length;
        const total = empRecs.length || 1;
        const pct = Math.round(((present + late) / total) * 100);
        const dept = departments.find(d => d.id === emp.departmentId)?.name || '';
        const branch = branches.find(b => b.id === emp.branchId)?.name || '';
        return [emp.id, emp.name, dept, branch, present, late, absent, leave, `${pct}%`];
      });
    } else if (activeReport === 'late') {
      headers = ['Date', 'EMP ID', 'Employee Name', 'Shift Start', 'Check-In Time', 'Late Duration'];
      const lateRecs = records.filter(r => r.status === 'Late');
      rows = lateRecs.map(r => {
        const emp = employees.find(e => e.id === r.employeeId);
        const shift = shifts.find(s => s.id === r.shiftId);
        return [
          r.date,
          r.employeeId,
          emp?.name || '',
          shift?.startTime || '',
          formatTime12h(r.checkIn),
          'Arrived after grace period',
        ];
      });
    } else {
      // General rows
      headers = ['Date', 'EMP ID', 'Employee', 'Status', 'Recorded Hours', 'Branch'];
      rows = records.map(r => {
        const emp = employees.find(e => e.id === r.employeeId);
        const branch = branches.find(b => b.id === r.branchId)?.name || '';
        return [r.date, r.employeeId, emp?.name || '', r.status, r.workingHours, branch];
      });
    }

    downloadCSV(filename, headers, rows);
    showToast(`Generated and exported ${rows.length} rows to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Workforce Reports & Analytics</h1>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              Audit-Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and export consolidated attendance summaries, absenteeism reports, and staff punctuality records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printCurrentView}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Categories Navigation */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'daily' as ReportType, label: 'Daily Attendance' },
          { id: 'monthly' as ReportType, label: 'Monthly Summary' },
          { id: 'employee_history' as ReportType, label: 'Staff Timeline' },
          { id: 'late' as ReportType, label: 'Late Arrival Audit' },
          { id: 'absenteeism' as ReportType, label: 'Absenteeism Trends' },
          { id: 'hours' as ReportType, label: 'Working Hours' },
          { id: 'branch_compare' as ReportType, label: 'Branch Comparison' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeReport === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Time Window:</span>
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded ${dateRange === 'today' ? 'bg-white font-bold text-indigo-700 shadow-2xs' : 'text-slate-600'}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('7days')}
              className={`px-2.5 py-1 rounded ${dateRange === '7days' ? 'bg-white font-bold text-indigo-700 shadow-2xs' : 'text-slate-600'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('30days')}
              className={`px-2.5 py-1 rounded ${dateRange === '30days' ? 'bg-white font-bold text-indigo-700 shadow-2xs' : 'text-slate-600'}`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeReport === 'employee_history' && (
            <select
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </option>
              ))}
            </select>
          )}

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
        </div>
      </div>

      {/* Report Render Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {activeReport === 'daily' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Shift</th>
                  <th className="py-3 px-3">Punches</th>
                  <th className="py-3 px-3">Working Hours</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {records.slice(0, 50).map(rec => {
                  const emp = employees.find(e => e.id === rec.employeeId);
                  const dept = departments.find(d => d.id === emp?.departmentId);
                  const shift = shifts.find(s => s.id === rec.shiftId);

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-medium">{formatDateIndian(rec.date)}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{emp?.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{rec.employeeId}</div>
                      </td>
                      <td className="py-3 px-3">{dept?.name}</td>
                      <td className="py-3 px-3">{shift?.name}</td>
                      <td className="py-3 px-3 font-mono">
                        {rec.checkIn ? `${formatTime12h(rec.checkIn)} - ${formatTime12h(rec.checkOut)}` : '—'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {rec.workingHours ? `${rec.workingHours}h` : '0h'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.status === 'Present' || rec.status === 'Checked Out'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'Late'
                              ? 'bg-amber-100 text-amber-800'
                              : rec.status === 'On Leave'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'monthly' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Days Present</th>
                  <th className="py-3 px-3 text-center">Late Arrivals</th>
                  <th className="py-3 px-3 text-center">Leaves</th>
                  <th className="py-3 px-3 text-center">Absences</th>
                  <th className="py-3 px-3 text-center">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {employees.map(emp => {
                  const empRecs = records.filter(r => r.employeeId === emp.id);
                  const present = empRecs.filter(r => r.status === 'Present' || r.status === 'Checked Out').length;
                  const late = empRecs.filter(r => r.status === 'Late').length;
                  const leave = empRecs.filter(r => r.status === 'On Leave').length;
                  const absent = empRecs.filter(r => r.status === 'Absent').length;
                  const total = empRecs.length || 1;
                  const pct = Math.round(((present + late) / total) * 100);
                  const dept = departments.find(d => d.id === emp.departmentId);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{emp.id}</div>
                      </td>
                      <td className="py-3 px-3">{dept?.name}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{present}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-700">{late}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-purple-700">{leave}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-rose-700">{absent}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                            pct >= 90 ? 'bg-emerald-100 text-emerald-800' : pct >= 80 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'employee_history' && (
          <div className="p-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Timeline for {employees.find(e => e.id === selectedEmpId)?.name} ({selectedEmpId})
                </h3>
                <p className="text-slate-500 text-xs">Past 30 Days punch logs and overtime verification</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                {records.filter(r => r.employeeId === selectedEmpId).length} Records Found
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {records
                .filter(r => r.employeeId === selectedEmpId)
                .map(r => (
                  <div key={r.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <div className="font-semibold text-slate-800">{formatDateIndian(r.date)}</div>
                      <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                        In: {formatTime12h(r.checkIn)} • Out: {formatTime12h(r.checkOut)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-700">{r.workingHours} hrs</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Present' || r.status === 'Checked Out'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeReport === 'late' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3">Staff Member</th>
                  <th className="py-3 px-3">Shift Assigned</th>
                  <th className="py-3 px-3">Scheduled Start</th>
                  <th className="py-3 px-3">Actual Check-In</th>
                  <th className="py-3 px-3">Grace Permitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {records
                  .filter(r => r.status === 'Late')
                  .map(r => {
                    const emp = employees.find(e => e.id === r.employeeId);
                    const shift = shifts.find(s => s.id === r.shiftId);

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-mono">{formatDateIndian(r.date)}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{emp?.name}</td>
                        <td className="py-3 px-3">{shift?.name}</td>
                        <td className="py-3 px-3 font-mono">{shift?.startTime}</td>
                        <td className="py-3 px-3 font-mono font-bold text-amber-700">
                          {formatTime12h(r.checkIn)}
                        </td>
                        <td className="py-3 px-3 font-mono">{shift?.graceMinutes} mins</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'branch_compare' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map(branch => {
                const branchEmps = employees.filter(e => e.branchId === branch.id);
                const branchRecs = attendanceRecords.filter(r => r.branchId === branch.id);
                const attended = branchRecs.filter(r => r.status === 'Present' || r.status === 'Late' || r.status === 'Checked Out').length;
                const total = branchRecs.length || 1;
                const rate = Math.round((attended / total) * 100);

                return (
                  <div key={branch.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-base">{branch.name}</h3>
                      <span className="font-mono text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {branch.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">Total Headcount</span>
                        <span className="text-xl font-bold text-slate-900">{branchEmps.length} Staff</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-slate-500 block text-[11px]">30-Day Attendance Rate</span>
                        <span className="text-xl font-bold text-emerald-700">{rate}%</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Branch Manager: <strong className="text-slate-700">{branch.managerName}</strong> • {branch.phone}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
