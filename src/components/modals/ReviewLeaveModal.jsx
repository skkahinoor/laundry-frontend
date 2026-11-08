import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, AlertTriangle, Calendar, User, DollarSign } from 'lucide-react';

export default function ReviewLeaveModal({ leave, isOpen, onClose, onReviewSubmitted }) {
  if (!isOpen || !leave) return null;

  const [status, setStatus] = useState('approved');
  const [isPaid, setIsPaid] = useState(true);
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (leave) {
      setIsPaid(leave.is_paid !== undefined ? Boolean(leave.is_paid) : true);
      // Auto suggest daily deduction if unpaid: default ~ ₹180-200 per day or existing deduction
      setDeductionAmount(leave.deduction_amount || Math.round(Number(leave.days || 1) * 200));
      setAdminNotes(leave.admin_notes || '');
      setStatus(leave.status === 'pending' ? 'approved' : leave.status);
    }
  }, [leave]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onReviewSubmitted(leave.id, {
        status: status,
        is_paid: status === 'approved' ? isPaid : false,
        deduction_amount: status === 'approved' && !isPaid ? Number(deductionAmount) : 0,
        admin_notes: adminNotes,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8 relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Review Leave Application</h3>
              <p className="text-xs text-slate-500">
                Staff: <strong className="text-slate-800">{leave.staff_name}</strong> ({leave.staff_role})
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Leave Details Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Leave Duration</span>
                  <span className="font-bold text-slate-800">
                    {leave.start_date} to {leave.end_date}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Total Days</span>
                  <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                    {leave.days} Day(s)
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Reason for Leave</span>
                <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200 mt-1 leading-relaxed">
                  "{leave.reason}"
                </p>
              </div>
            </div>

            {/* Approval Decision */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Decision</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('approved')}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                    status === 'approved'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Leave
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('rejected')}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition ${
                    status === 'rejected'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> Reject Leave
                </button>
              </div>
            </div>

            {/* If Approved: Paid vs Unpaid Toggle */}
            {status === 'approved' && (
              <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPaid}
                    onChange={(e) => setIsPaid(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-sky-950 block text-xs">Is this a Paid Leave?</span>
                    <span className="text-[11px] text-sky-800 block">
                      {isPaid
                        ? 'Staff salary will NOT be deducted for this leave (0 deduction).'
                        : 'Unpaid Leave: Enter salary deduction amount below to be deducted from monthly payroll.'}
                    </span>
                  </div>
                </label>

                {/* If Unpaid: Show Deduction Amount Input */}
                {!isPaid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 border-t border-sky-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-rose-800 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Salary Deduction Amount (₹) *
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Suggested for {leave.days} day(s)
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={deductionAmount}
                        onChange={(e) => setDeductionAmount(e.target.value)}
                        placeholder="e.g. 333.33"
                        className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-rose-300 bg-white font-bold text-rose-700 text-sm focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <p className="text-[10px] text-rose-600">
                      This amount will be automatically deducted from staff's salary in Payroll.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Admin Remark / Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Approved. Cover shift arranged with Suresh."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Updating Leave...' : 'Save Leave Decision'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

