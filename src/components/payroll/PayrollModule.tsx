import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianRupee,
  Download,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Filter,
  Search,
  Calculator,
  Info,
} from 'lucide-react';
import { formatCurrencyINR, downloadCSV } from '../../utils/formatters';

export const PayrollModule: React.FC = () => {
  const {
    employees,
    branches,
    departments,
    attendanceRecords,
    selectedBranchId,
    showToast,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [deptFilter, setDeptFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Scheduled working days in a typical Indian SMB month (excluding 4 Sundays)
  const SCHEDULED_WORKING_DAYS = 26;

  // Active employees
  const activeEmployees = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  const filteredEmployees = activeEmployees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.departmentId === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Calculate payroll summary rows
  const payrollRows = filteredEmployees.map(emp => {
    const empRecords = attendanceRecords.filter(r => r.employeeId === emp.id);

    // Count attendance metrics over past 30 days
    const daysPresent = empRecords.filter(r => r.status === 'Present' || r.status === 'Checked Out').length;
    const lateDays = empRecords.filter(r => r.status === 'Late').length;
    const halfDays = empRecords.filter(r => r.status === 'Half Day').length;
    const approvedLeaveDays = empRecords.filter(r => r.status === 'On Leave').length;
    const absences = empRecords.filter(r => r.status === 'Absent').length;
    const totalRecordedHours = empRecords.reduce((acc, curr) => acc + (curr.workingHours || 0), 0);

    // Eligible payable days = Present + Late + Approved Paid Leave + (Half Days * 0.5)
    // Scale to the 26-day standard month
    const totalLogs = empRecords.length || 1;
    const presentRatio = (daysPresent + lateDays + approvedLeaveDays + halfDays * 0.5) / totalLogs;
    const eligiblePayableDays = Number((presentRatio * SCHEDULED_WORKING_DAYS).toFixed(1));

    // Estimated Attendance Pay formula
    const dailyRate = emp.salary / SCHEDULED_WORKING_DAYS;
    const estimatedPay = Math.round(dailyRate * eligiblePayableDays);

    let reviewStatus: 'Ready' | 'Under Review' = 'Ready';
    if (absences > 3) reviewStatus = 'Under Review';

    return {
      employee: emp,
      monthlySalary: emp.salary,
      scheduledDays: SCHEDULED_WORKING_DAYS,
      daysPresent: daysPresent + lateDays,
      approvedLeaveDays,
      unpaidLeaveDays: 0,
      absences,
      recordedHours: totalRecordedHours.toFixed(1),
      eligiblePayableDays,
      estimatedPay,
      reviewStatus,
    };
  });

  const totalMonthlyPayroll = payrollRows.reduce((acc, curr) => acc + curr.estimatedPay, 0);
  const totalBaseSalary = payrollRows.reduce((acc, curr) => acc + curr.monthlySalary, 0);

  const handleExportPayrollCSV = () => {
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Branch',
      'Base Monthly Salary (₹)',
      'Scheduled Working Days',
      'Days Present & Late',
      'Approved Paid Leave',
      'Absences',
      'Recorded Hours',
      'Eligible Payable Days',
      'Estimated Pay (₹)',
      'Payroll Review Status',
    ];

    const rows = payrollRows.map(row => {
      const dept = departments.find(d => d.id === row.employee.departmentId)?.name || '';
      const branch = branches.find(b => b.id === row.employee.branchId)?.name || '';
      return [
        row.employee.id,
        row.employee.name,
        dept,
        branch,
        row.monthlySalary,
        row.scheduledDays,
        row.daysPresent,
        row.approvedLeaveDays,
        row.absences,
        row.recordedHours,
        row.eligiblePayableDays,
        row.estimatedPay,
        row.reviewStatus,
      ];
    });

    downloadCSV(`CoreNode_Attend_Payroll_${selectedMonth.replace(' ', '_')}.csv`, headers, rows);
    showToast(`Exported ${payrollRows.length} payroll summary records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Attendance-Linked Payroll Summary</h1>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              Salary Pre-Processing
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculate eligible payable days from punch logs and approved leaves prior to disbursal
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-hidden"
          >
            <option value="October 2026">October 2026 (Active)</option>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
          </select>

          <button
            onClick={handleExportPayrollCSV}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Payroll CSV</span>
          </button>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer & Formula Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 p-4.5 rounded-xl text-white shadow-2xs flex items-start gap-3">
          <Calculator className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-white text-sm">Attendance Pay Formula</h3>
            <p className="text-slate-300 mt-1 font-mono text-[11px]">
              Estimated Pay = (Base Salary ÷ 26 Scheduled Days) × Eligible Payable Days
            </p>
            <p className="text-[11px] text-teal-300 mt-1.5">
              * Approved Casual & Earned leaves are treated as fully payable. Unexcused absences do not accumulate payable credit.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Demo Estimation Notice:</strong>
            <p className="text-amber-800 mt-0.5 leading-relaxed text-[11px]">
              Demo estimate only. Actual payroll depends on company policy, applicable employment laws, and verified payroll records.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs">Total Base Compensation (Gross)</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrencyINR(totalBaseSalary)}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{payrollRows.length} Active Staff</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs">Estimated Attendance-Linked Payout</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {formatCurrencyINR(totalMonthlyPayroll)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
            Net variance: -{formatCurrencyINR(totalBaseSalary - totalMonthlyPayroll)} (absence deductions)
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs">Scheduled Working Days / Month</span>
          <div className="text-2xl font-bold font-mono text-indigo-700 mt-1">
            {SCHEDULED_WORKING_DAYS} Days
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Excluding weekly offs (4 Sundays)</span>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Base Salary</th>
                <th className="py-3 px-3 text-center">Scheduled</th>
                <th className="py-3 px-3 text-center">Present</th>
                <th className="py-3 px-3 text-center">Paid Leave</th>
                <th className="py-3 px-3 text-center">Absences</th>
                <th className="py-3 px-3 text-center">Recorded Hours</th>
                <th className="py-3 px-3 text-center">Payable Days</th>
                <th className="py-3 px-3 text-right">Estimated Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payrollRows.map(row => {
                const isUnderReview = row.reviewStatus === 'Under Review';

                return (
                  <tr key={row.employee.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{row.employee.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {row.employee.id} • {row.employee.designation}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                      {formatCurrencyINR(row.monthlySalary)}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-slate-600">{row.scheduledDays}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{row.daysPresent}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-purple-700">{row.approvedLeaveDays}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-rose-700">{row.absences}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-600">{row.recordedHours}h</td>

                    <td className="py-3 px-3 text-center font-mono font-extrabold text-indigo-700 bg-indigo-50/40">
                      {row.eligiblePayableDays} d
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-900 text-sm">
                      {formatCurrencyINR(row.estimatedPay)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isUnderReview
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {row.reviewStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
