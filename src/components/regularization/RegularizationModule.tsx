import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileEdit,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Plus,
  Search,
  Filter,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import { AttendanceCorrectionRequest } from '../../types';
import { formatDateIndian, formatTime12h, getTodayDateString } from '../../utils/formatters';

export const RegularizationModule: React.FC = () => {
  const {
    regularizationRequests,
    employees,
    attendanceRecords,
    selectedBranchId,
    submitRegularizationRequest,
    approveRegularizationRequest,
    rejectRegularizationRequest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // New Request Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || 'EMP001');
  const [date, setDate] = useState(getTodayDateString());
  const [reqCheckIn, setReqCheckIn] = useState('09:00');
  const [reqCheckOut, setReqCheckOut] = useState('17:00');
  const [reason, setReason] = useState('');

  // Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<AttendanceCorrectionRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');

  const filteredRequests = regularizationRequests.filter(req => {
    const emp = employees.find(e => e.id === req.employeeId);
    if (!emp) return false;

    const matchesBranch = selectedBranchId === 'all' || emp.branchId === selectedBranchId;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'pending') {
      return matchesBranch && matchesSearch && req.status === 'Pending';
    }
    return matchesBranch && matchesSearch;
  });

  const pendingCount = regularizationRequests.filter(
    r => r.status === 'Pending' && (selectedBranchId === 'all' || employees.find(e => e.id === r.employeeId)?.branchId === selectedBranchId)
  ).length;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    submitRegularizationRequest({
      employeeId,
      date,
      currentCheckIn: attendanceRecords.find(r => r.employeeId === employeeId && r.date === date)?.checkIn,
      currentCheckOut: attendanceRecords.find(r => r.employeeId === employeeId && r.date === date)?.checkOut,
      requestedCheckIn: reqCheckIn,
      requestedCheckOut: reqCheckOut,
      reason: reason.trim(),
    });
    setIsSubmitModalOpen(false);
    setReason('');
  };

  const handleOpenReview = (req: AttendanceCorrectionRequest, action: 'approve' | 'reject') => {
    setSelectedReq(req);
    setReviewAction(action);
    setReviewComment(action === 'approve' ? 'Approved based on supervisor physical roster verification.' : 'Discrepancy in requested timings.');
    setIsReviewModalOpen(true);
  };

  const handleConfirmReview = () => {
    if (!selectedReq) return;
    if (reviewAction === 'approve') {
      approveRegularizationRequest(selectedReq.id, reviewComment);
    } else {
      rejectRegularizationRequest(selectedReq.id, reviewComment);
    }
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Attendance Regularization</h1>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Audit Trail & Corrections
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve missed punches, device offline periods, and adjust verified working hours with immutable logs
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
              <span>Pending Review</span>
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
              All Audit Records ({regularizationRequests.length})
            </button>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Correction</span>
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <History className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-800">Biometric & Punch Discrepancy Handling:</strong>
          <span className="ml-1 text-slate-600">
            When a punch correction is approved, CoreNode Attend automatically recalculates the employee's net working hours, applies late thresholds based on the shift policy, and marks the record with an audit tag.
          </span>
        </div>
      </div>

      {/* Regularization Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Recorded Time</th>
                <th className="py-3 px-3">Requested Correction</th>
                <th className="py-3 px-3">Reason & Submitter</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Review Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    {activeTab === 'pending'
                      ? 'No attendance corrections pending review.'
                      : 'No regularization records found.'}
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  const emp = employees.find(e => e.id === req.employeeId);
                  if (!emp) return null;

                  const isPending = req.status === 'Pending';
                  const isApproved = req.status === 'Approved';

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{emp.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {formatDateIndian(req.date)}
                      </td>

                      {/* Recorded Time */}
                      <td className="py-3 px-3 font-mono text-slate-500">
                        <div>In: {formatTime12h(req.currentCheckIn)}</div>
                        <div>Out: {formatTime12h(req.currentCheckOut)}</div>
                      </td>

                      {/* Requested Correction */}
                      <td className="py-3 px-3 font-mono">
                        <div className="text-emerald-700 font-bold">In: {formatTime12h(req.requestedCheckIn)}</div>
                        <div className="text-emerald-700 font-bold">Out: {formatTime12h(req.requestedCheckOut)}</div>
                      </td>

                      <td className="py-3 px-3 max-w-[200px]">
                        <p className="truncate text-slate-700 italic" title={req.reason}>
                          "{req.reason}"
                        </p>
                        <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
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
                          <span className="text-slate-400 text-[11px]">Pending verification</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenReview(req, 'reject')}
                              className="px-2.5 py-1 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded font-semibold text-[11px]"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleOpenReview(req, 'approve')}
                              className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded font-semibold text-[11px] shadow-2xs"
                            >
                              Approve Fix
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Closed</span>
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

      {/* Submit New Request Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Submit Punch Correction</h3>
            <p className="text-slate-500 mb-4">Request punch time updates for supervisor review</p>

            <form onSubmit={handleSubmitNew} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee *</label>
                <select
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Punch Discrepancy *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Check-In (24h) *</label>
                  <input
                    type="time"
                    required
                    value={reqCheckIn}
                    onChange={e => setReqCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Check-Out (24h) *</label>
                  <input
                    type="time"
                    required
                    value={reqCheckOut}
                    onChange={e => setReqCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Punch Discrepancy *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Card scanner network error during peak customer lunch rush..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-2xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {isReviewModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 text-xs">
            <h3 className="text-base font-bold text-slate-900">
              {reviewAction === 'approve' ? 'Approve Punch Correction' : 'Reject Regularization'}
            </h3>
            <p className="text-slate-500 mt-1">
              {reviewAction === 'approve'
                ? 'Approving will recalculate working hours and update the official attendance timeline.'
                : 'Rejecting leaves the original recorded punch times unmodified.'}
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reviewer Decision Note</label>
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
                    reviewAction === 'approve' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {reviewAction === 'approve' ? 'Correction' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
