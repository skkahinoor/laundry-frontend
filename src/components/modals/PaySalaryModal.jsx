import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export default function PaySalaryModal({ staff, isOpen, onClose, onConfirmPay }) {
  if (!isOpen || !staff) return null;

  const [paymentMode, setPaymentMode] = useState(staff.paymentMode || 'UPI Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseSalary = Number(staff.baseSalary || 0);
  const leaveDeductions = Number(staff.leaveDeductions || 0);
  const netPay = Number(
    staff.netPay !== undefined
      ? staff.netPay
      : Math.max(0, baseSalary - leaveDeductions)
  );

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmPay({
        staff_id: staff.id,
        amount: baseSalary,
        bonus: 0,
        deduction: leaveDeductions,
        month: staff.month || 'Nov-2026',
        payment_mode: paymentMode,
        transaction_ref: transactionRef,
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
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pay Staff Salary</h3>
              <p className="text-xs text-slate-500">
                Transfer salary to <strong className="text-slate-800">{staff.name}</strong> ({staff.role})
              </p>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            {/* 1. BANK & UPI CREDENTIALS BOX */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-600" /> Staff Payout Bank Details
                </span>
                <span className="text-[10px] font-bold bg-white text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Bank Name</span>
                  <span className="font-bold text-slate-800 truncate block">{staff.bankName || 'HDFC Bank'}</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Account Holder</span>
                  <span className="font-bold text-slate-800 truncate block">{staff.accountHolderName || staff.name}</span>
                </div>

                <div className="bg-white p-2 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">Account Number</span>
                    <span className="font-mono font-bold text-slate-900 truncate block">
                      {staff.accountNumber || '50100492817281'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(staff.accountNumber || '50100492817281', 'Account Number')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="Copy Account Number"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white p-2 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-semibold">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 truncate block">
                      {staff.ifscCode || 'HDFC0001245'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(staff.ifscCode || 'HDFC0001245', 'IFSC Code')}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    title="Copy IFSC"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white p-2 rounded-xl border border-sky-100 col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">UPI ID / VPA</span>
                      <span className="font-mono font-bold text-emerald-800 text-xs truncate block">
                        {staff.upiId || 'staff@upi'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(staff.upiId || 'staff@upi', 'UPI ID')}
                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 shrink-0"
                  >
                    <Copy className="w-3 h-3" /> Copy UPI
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SALARY BREAKDOWN CALCULATION */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs space-y-1.5">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Monthly Salary Breakdown
              </span>
              <div className="flex items-center justify-between text-slate-600">
                <span>Base Salary (Assigned):</span>
                <span className="font-bold text-slate-800">₹{baseSalary.toLocaleString('en-IN')}</span>
              </div>
              {leaveDeductions > 0 && (
                <div className="flex items-center justify-between text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Leave Deduction ({staff.unpaidLeavesCount || 1} day unpaid leave):
                  </span>
                  <span className="font-bold">-₹{leaveDeductions.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-900 font-extrabold text-sm">
                <span>Net Payable Payout:</span>
                <span className="text-emerald-700 text-base">₹{netPay.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 3. PAYMENT MODE SELECTION */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI Transfer', 'Bank Transfer', 'Cash'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                      paymentMode === mode
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TRANSACTION REFERENCE / NOTE */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Transaction Ref / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. UTR 429104829102 or Paid via PhonePe"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isSubmitting ? 'Logging Payment...' : `Confirm & Mark ₹${netPay.toLocaleString('en-IN')} Paid`}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

