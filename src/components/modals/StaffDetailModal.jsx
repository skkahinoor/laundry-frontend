import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Copy,
} from 'lucide-react';

export default function StaffDetailModal({ staff, isOpen, onClose, onPaySalary }) {
  if (!isOpen || !staff) return null;

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8 relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
              {staff.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{staff.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    staff.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {staff.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-sky-700">{staff.role}</p>
            </div>
          </div>

          <div className="space-y-5 text-xs">
            {/* 1. Contact & Personal Info */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200/70">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" /> Personal & Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{staff.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{staff.phone || 'No phone'}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 col-span-full">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{staff.address || 'Address on file'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined: {staff.joiningDate || 'Recently'}</span>
                </div>
              </div>
            </div>

            {/* 2. Bank & Payout Setting Info */}
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sky-950 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-sky-600" /> Banking & Payout Credentials
                </h4>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                  For Salary Transfer
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Bank Name</span>
                  <span className="font-bold text-slate-800 text-xs">{staff.bankName || 'HDFC Bank'}</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Account Holder</span>
                  <span className="font-bold text-slate-800 text-xs">{staff.accountHolderName || staff.name}</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Account Number</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
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

                <div className="bg-white p-2.5 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">IFSC Code</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">
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

                <div className="bg-white p-2.5 rounded-xl border border-sky-100 sm:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">UPI ID / VPA</span>
                      <span className="font-mono font-bold text-emerald-800 text-xs">
                        {staff.upiId || 'staff@upi'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(staff.upiId || 'staff@upi', 'UPI ID')}
                    className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy UPI
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Salary & Leaves Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Current Month Salary & Leaves Breakdown
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 block font-semibold">Base Salary</span>
                  <span className="font-bold text-slate-800 text-sm">₹{Number(staff.baseSalary).toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-emerald-600 block font-semibold">Paid Leaves</span>
                  <span className="font-bold text-emerald-700 text-sm">{staff.paidLeavesCount || 0} Day(s)</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-amber-600 block font-semibold">Unpaid Leaves</span>
                  <span className="font-bold text-amber-700 text-sm">{staff.unpaidLeavesCount || 0} Day(s)</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] text-rose-600 block font-semibold">Leave Deduction</span>
                  <span className="font-bold text-rose-600 text-sm">-₹{Number(staff.leaveDeductions || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Net Salary Payable</span>
                  <span className="text-base font-extrabold text-emerald-950">
                    ₹{Number(staff.netPay || staff.baseSalary).toLocaleString('en-IN')}
                  </span>
                </div>
                {staff.status === 'Pending' && onPaySalary && (
                  <button
                    onClick={() => {
                      onClose();
                      onPaySalary(staff);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                  >
                    Proceed to Pay ₹{Number(staff.netPay || staff.baseSalary).toLocaleString('en-IN')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

