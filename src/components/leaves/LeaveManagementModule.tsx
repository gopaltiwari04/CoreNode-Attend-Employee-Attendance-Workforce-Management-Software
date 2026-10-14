import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarOff,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  FileText,
  User,
  Calendar,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { LeaveRequest, LeaveType, RequestStatus } from '../../types';
import { formatDateIndian, getTodayDateString } from '../../utils/formatters';

export const LeaveManagementModule: React.FC = () => {
  const {
    leaveRequests,
    employees,
    branches,
    selectedBranchId,
    currentRole,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    cancelLeaveRequest,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'balances'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Submit Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantId, setApplicantId] = useState(employees[0]?.id || 'EMP001');
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [reason, setReason] = useState('');

  // Review comment modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingReq, setReviewingReq] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');

  // Filter employees & requests by branch
  const branchEmps = employees.filter(
    e => e.status === 'Active' && (selectedBranchId === 'all' || e.branchId === selectedBranchId)
  );

  const filteredRequests = leaveRequests.filter(req => {
    const emp = employees.find(e => e.id === req.employeeId);
    if (!emp) return false;

    const matchesBranch = selectedBranchId === 'all' || emp.branchId === selectedBranchId;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.leaveType === typeFilter;

    if (activeTab === 'pending') {
      return matchesBranch && matchesSearch && req.status === 'Pending';
    }

    return matchesBranch && matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = leaveRequests.filter(
    r => r.status === 'Pending' && (selectedBranchId === 'all' || employees.find(e => e.id === r.employeeId)?.branchId === selectedBranchId)
  ).length;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      showToast('End date cannot precede start date.', 'error');
      return;
    }

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    submitLeaveRequest({
      employeeId: applicantId,
      leaveType,
      startDate,
      endDate,
      daysCount: diffDays,
      reason: reason.trim(),
    });

    setIsApplyModalOpen(false);
    setReason('');
  };

  const handleOpenReview = (req: LeaveRequest, action: 'approve' | 'reject') => {
    setReviewingReq(req);
    setReviewAction(action);
    setReviewComment(action === 'approve' ? 'Approved as per business requirements.' : 'Unable to approve due to peak operational shift coverage.');
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = () => {
    if (!reviewingReq) return;

    if (reviewAction === 'approve') {
      approveLeaveRequest(reviewingReq.id, reviewComment);
    } else {
      rejectLeaveRequest(reviewingReq.id, reviewComment);
    }
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Leave Management & Approvals</h1>
            {pendingCount > 0 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Process Casual, Sick, and Earned leaves with live balance tracking and roster synchronisation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <span>Pending Requests</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              All Requests ({leaveRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'balances' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Employee Balances
            </button>
          </div>

          <button
            onClick={() => setIsApplyModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {activeTab !== 'balances' ? (
        <>
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by staff name, reason, or EMP ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTab === 'all' && (
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">All Leave Types</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-3">Leave Type</th>
                    <th className="py-3 px-3">Date Duration</th>
                    <th className="py-3 px-3">Days</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Reviewer / Notes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        {activeTab === 'pending'
                          ? 'Zero pending leave requests awaiting approval.'
                          : 'No leave requests match your criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map(req => {
                      const emp = employees.find(e => e.id === req.employeeId);
                      if (!emp) return null;

                      const isPending = req.status === 'Pending';
                      const isApproved = req.status === 'Approved';
                      const isRejected = req.status === 'Rejected';

                      return (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{emp.name}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{emp.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-800">{req.leaveType}</span>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">
                              {formatDateIndian(req.startDate)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              to {formatDateIndian(req.endDate)}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {req.daysCount} d
                            </span>
                          </td>

                          <td className="py-3 px-3 max-w-[200px]">
                            <p className="truncate text-slate-700 italic" title={req.reason}>
                              "{req.reason}"
                            </p>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : isPending
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>

                          <td className="py-3 px-3 max-w-[180px]">
                            {req.reviewer ? (
                              <div>
                                <div className="font-semibold text-slate-800 text-[11px]">{req.reviewer}</div>
                                <div className="text-[10px] text-slate-400 truncate">{req.reviewerComment}</div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Awaiting supervisor</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenReview(req, 'reject')}
                                  className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded font-semibold text-[11px] transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleOpenReview(req, 'approve')}
                                  className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded font-semibold text-[11px] shadow-2xs transition-colors"
                                >
                                  Approve
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Resolved</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Leave Balances Matrix */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Annual Entitlements & Remaining Leave Quota per Employee
            </span>
            <span className="text-[11px] text-slate-400">Policy year 2026-27</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3 text-center">Casual Leave (CL)</th>
                  <th className="py-3 px-3 text-center">Sick Leave (SL)</th>
                  <th className="py-3 px-3 text-center">Earned Leave (EL)</th>
                  <th className="py-3 px-3 text-center">Total Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {branchEmps.map(emp => {
                  const branch = branches.find(b => b.id === emp.branchId);
                  const totalRem = emp.leaveBalance.casual + emp.leaveBalance.sick + emp.leaveBalance.earned;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{emp.id}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{branch?.name}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-purple-700">
                        {emp.leaveBalance.casual}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-teal-700">
                        {emp.leaveBalance.sick}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-700">
                        {emp.leaveBalance.earned}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-extrabold text-slate-900 bg-slate-50">
                        {totalRem} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Submit Leave Application</h3>
            <p className="text-slate-500 mb-4">
              Deducts quota from selected employee balance once approved
            </p>

            <form onSubmit={handleApplySubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicant *</label>
                <select
                  value={applicantId}
                  onChange={e => setApplicantId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                >
                  {branchEmps.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) — CL: {emp.leaveBalance.casual}, SL: {emp.leaveBalance.sick}, EL: {emp.leaveBalance.earned}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Classification *</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as LeaveType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                  <option value="Other">Other Personal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Handover Plan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason and who will cover your shift..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {isReviewModalOpen && reviewingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              {reviewAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <p className="text-slate-500 mt-1">
              {reviewAction === 'approve'
                ? `Approving will deduct ${reviewingReq.daysCount} day(s) from the staff member's balance and mark attendance records.`
                : 'Rejecting leaves the balance intact and informs the employee.'}
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewer Decision Comments</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReview}
                  className={`px-4 py-1.5 rounded-lg font-semibold text-white shadow-2xs ${
                    reviewAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
