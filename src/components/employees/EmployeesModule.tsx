import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  UserPlus,
  Download,
  Filter,
  MapPin,
  Building,
  Calendar,
  Clock,
  Phone,
  Mail,
  Shield,
  LayoutGrid,
  List,
  MoreVertical,
  ExternalLink,
  IndianRupee,
} from 'lucide-react';
import { Employee, EmploymentType, EmploymentStatus } from '../../types';
import {
  formatDateIndian,
  formatCurrencyINR,
  downloadCSV,
} from '../../utils/formatters';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EmployeeDetailDrawer } from './EmployeeDetailDrawer';

export const EmployeesModule: React.FC = () => {
  const {
    employees,
    branches,
    departments,
    shifts,
    selectedBranchId,
    toggleEmployeeStatus,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState(selectedBranchId);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const activeBranch = branchFilter !== 'all' ? branchFilter : selectedBranchId !== 'all' ? selectedBranchId : 'all';
    const matchesBranch = activeBranch === 'all' || emp.branchId === activeBranch;
    const matchesDept = deptFilter === 'all' || emp.departmentId === deptFilter;
    const matchesType = typeFilter === 'all' || emp.employmentType === typeFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesBranch && matchesDept && matchesType && matchesStatus;
  });

  // Export directory to CSV
  const handleExportCSV = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Designation',
      'Department',
      'Branch',
      'Employment Type',
      'Status',
      'Date of Joining',
      'Assigned Shift',
      'Monthly Salary (INR)',
      'Email',
      'Phone Number',
      'Reporting Manager',
    ];

    const rows = filteredEmployees.map(emp => {
      const dept = departments.find(d => d.id === emp.departmentId)?.name || emp.departmentId;
      const branch = branches.find(b => b.id === emp.branchId)?.name || emp.branchId;
      const shift = shifts.find(s => s.id === emp.shiftId)?.name || emp.shiftId;

      return [
        emp.id,
        emp.name,
        emp.designation,
        dept,
        branch,
        emp.employmentType,
        emp.status,
        emp.joiningDate,
        shift,
        emp.salary,
        emp.email,
        emp.phone,
        emp.reportingManager,
      ];
    });

    downloadCSV(`CoreNode_Attend_Employees_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
    showToast(`Exported ${filteredEmployees.length} employee records to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Employee Directory</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200">
              {filteredEmployees.length} of {employees.length} Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organizational staff profiles, departmental assignments, and shift rosters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, EMP ID, designation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch */}
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Locations</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Staff</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'}`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Employees Table or Grid View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Role & Dept</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Assigned Shift</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
                      No employees match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => {
                    const dept = departments.find(d => d.id === emp.departmentId);
                    const branch = branches.find(b => b.id === emp.branchId);
                    const shift = shifts.find(s => s.id === emp.shiftId);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Employee Name */}
                        <td className="py-3 px-4">
                          <div
                            onClick={() => {
                              setSelectedEmp(emp);
                              setIsDrawerOpen(true);
                            }}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <img
                              src={emp.avatar}
                              alt={emp.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{emp.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Dept & Designation */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800">{emp.designation}</div>
                          <div className="text-[11px] text-slate-500">{dept?.name}</div>
                        </td>

                        {/* Branch */}
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-700 truncate block max-w-[150px]">
                            {branch?.name}
                          </span>
                        </td>

                        {/* Shift */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: shift?.color }} />
                            <span className="font-semibold text-slate-800">{shift?.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {shift?.startTime} - {shift?.endTime}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-3">
                          <div className="text-slate-800">{emp.phone}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{emp.email}</div>
                        </td>

                        {/* Employment Type */}
                        <td className="py-3 px-3">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                            {emp.employmentType}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              emp.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedEmp(emp);
                              setIsDrawerOpen(true);
                            }}
                            className="px-3 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded font-semibold text-[11px] transition-colors"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid cards view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => {
            const dept = departments.find(d => d.id === emp.departmentId);
            const branch = branches.find(b => b.id === emp.branchId);
            const shift = shifts.find(s => s.id === emp.shiftId);

            return (
              <div
                key={emp.id}
                onClick={() => {
                  setSelectedEmp(emp);
                  setIsDrawerOpen(true);
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                        <p className="text-xs text-slate-500">{emp.designation}</p>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {emp.id}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-teal-600" />
                      <span>{dept?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="truncate">{branch?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{shift?.name} ({shift?.startTime} - {shift?.endTime})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">
                    {formatCurrencyINR(emp.salary)} / mo
                  </span>
                  <span className="text-indigo-600 font-semibold hover:underline">
                    View 5-Tab Profile →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Employee Modal & Employee Details Drawer */}
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EmployeeDetailDrawer
        employee={selectedEmp}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEmp(null);
        }}
      />
    </div>
  );
};
