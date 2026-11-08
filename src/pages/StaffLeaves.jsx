import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { leavesApi } from '../api';

export default function StaffLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStaffLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await leavesApi.getStaffLeaves();
      if (res.leaves) {
        setLeaves(res.leaves);
        setSummary(res.summary);
      }
    } catch (e) {
      console.warn('Failed to load leaves:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await leavesApi.applyLeave({
        start_date: startDate,
        end_date: endDate,
        reason: reason,
      });
      setShowApplyModal(false);
      setReason('');
      setSuccessMsg(res.message || 'Leave request submitted!');
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchStaffLeaves();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      key="staff-leaves"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Attendance & Time Off
          </span>
          <h2 className="text-xl font-bold mt-0.5">My Leave Applications</h2>
          <p className="text-xs text-slate-300 mt-1">
            Apply for leave in advance. Track approval status and check whether leave is marked paid or unpaid.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Requests</span>
          <span className="text-xl font-bold text-slate-900">{leaves.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Pending</span>
          <span className="text-xl font-bold text-amber-600">
            {leaves.filter((l) => l.status === 'pending').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Paid Leaves</span>
          <span className="text-xl font-bold text-emerald-700">
            {leaves.filter((l) => l.status === 'approved' && l.is_paid).length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Unpaid Leaves</span>
          <span className="text-xl font-bold text-rose-600">
            {leaves.filter((l) => l.status === 'approved' && !l.is_paid).length}
          </span>
        </div>
      </div>

      {/* Leaves History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Leave History</span>
          <button
            onClick={fetchStaffLeaves}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 1. MOBILE CARD VIEW (< md) */}
        <div className="md:hidden divide-y divide-slate-100 p-2 sm:p-3 space-y-3">
          {leaves.map((leave) => {
            const isApproved = leave.status === 'approved';
            const isPending = leave.status === 'pending';
            const isRejected = leave.status === 'rejected';

            return (
              <div
                key={leave.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{leave.start_date}</span>
                    {leave.start_date !== leave.end_date && <span> → {leave.end_date}</span>}
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {leave.days} Day(s)
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-2.5 text-xs">
                  <p className="text-slate-700 font-medium leading-relaxed">{leave.reason}</p>
                  {leave.admin_notes && (
                    <p className="text-[11px] text-slate-500 mt-1 italic border-t border-slate-200/50 pt-1">
                      Manager Note: {leave.admin_notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Pay Status</span>
                    {isApproved ? (
                      leave.is_paid ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Paid (₹0 cut)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Unpaid (-₹{leave.deduction_amount})
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">Pending review</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Status</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isPending && <Clock className="w-3.5 h-3.5" />}
                      {isRejected && <XCircle className="w-3.5 h-3.5" />}
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {leaves.length === 0 && (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              No leave applications yet. Click "Apply for Leave" above.
            </div>
          )}
        </div>

        {/* 2. DESKTOP TABLE VIEW (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-4 px-5">Dates</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Reason</th>
                <th className="py-4 px-4">Pay Status</th>
                <th className="py-4 px-5 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leaves.map((leave) => {
                const isApproved = leave.status === 'approved';
                const isPending = leave.status === 'pending';
                const isRejected = leave.status === 'rejected';

                return (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5 font-semibold text-slate-900">
                      <span>{leave.start_date}</span>
                      {leave.start_date !== leave.end_date && <span> → {leave.end_date}</span>}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {leave.days} Day(s)
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-xs text-slate-700 leading-relaxed">{leave.reason}</p>
                      {leave.admin_notes && (
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                          Admin: {leave.admin_notes}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {isApproved ? (
                        leave.is_paid ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Paid (₹0 cut)
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Unpaid (-₹{leave.deduction_amount})
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5" />}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {leaves.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No leave applications yet. Click "Apply for Leave" above to request time off.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setShowApplyModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-bold text-lg text-slate-900">Apply for Leave</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit time-off dates for store manager review.
              </p>

              <form onSubmit={handleApply} className="space-y-3.5 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reason for Leave</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Urgent family function / doctor visit / sick leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold shadow-md transition"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

