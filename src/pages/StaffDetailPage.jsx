import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';

export default function StaffDetailPage({
  staff,
  onBack,
  onPaySalary,
}) {
  if (!staff) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No staff member selected.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
        >
          Back to Staff Directory
        </button>
      </div>
    );
  }

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const baseSalary = Number(staff.baseSalary || 0);
  const leaveDeductions = Number(staff.leaveDeductions || 0);
  const netPay = Number(staff.netPay !== undefined ? staff.netPay : Math.max(0, baseSalary - leaveDeductions));

  return (
    <motion.div
      key="staff-detail-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Staff Directory</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Staff ID: #{staff.id} • Joined: {staff.joiningDate || 'Active'}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shrink-0">
            {staff.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{staff.name}</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {staff.role}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  staff.status === 'Paid'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {staff.status === 'Paid' ? 'Paid This Month' : 'Salary Pending'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                {staff.phone || '-'}
              </span>
              {staff.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  {staff.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Joined {staff.joiningDate || 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Base Monthly Salary Badge */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0 text-right">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
            Base Monthly Salary
          </span>
          <span className="text-2xl font-extrabold text-white block mt-0.5">
            ₹{baseSalary.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">Assigned in Contract</span>
        </div>
      </div>

      {/* Grid: Personal Info, Bank Credentials, Salary Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Contact & Address Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" /> Personal & Residential Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <span className="text-[10px] font-semibold text-slate-400 block">Full Name</span>
              <span className="font-bold text-slate-900 text-sm">{staff.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] font-semibold text-slate-400 block">Mobile Phone</span>
                <span className="font-bold text-slate-900">{staff.phone || '-'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] font-semibold text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-900 truncate block">{staff.email || 'None'}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Residential Address
              </span>
              <p className="font-medium text-slate-800 leading-relaxed text-xs">
                {staff.address || 'Flat 42, 3rd Cross, Indiranagar, Bengaluru, Karnataka'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Banking & Payout Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-sky-950 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" /> Banking & Payout Credentials
            </h3>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
              For Salary Transfer
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100">
                <span className="text-[10px] font-semibold text-slate-400 block">Bank Name</span>
                <span className="font-bold text-slate-900">{staff.bankName || 'HDFC Bank'}</span>
              </div>
              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100">
                <span className="text-[10px] font-semibold text-slate-400 block">Account Holder</span>
                <span className="font-bold text-slate-900 truncate block">{staff.accountHolderName || staff.name}</span>
              </div>
            </div>

            <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block">Bank Account Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {staff.accountNumber || '50100492817281'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(staff.accountNumber || '50100492817281', 'Account Number')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[11px] text-slate-700 flex items-center gap-1 transition"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 block">IFSC Code</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {staff.ifscCode || 'HDFC0001245'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(staff.ifscCode || 'HDFC0001245', 'IFSC Code')}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-bold text-[11px] text-slate-700 flex items-center gap-1 transition"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">UPI ID / VPA</span>
                  <span className="font-mono font-bold text-emerald-800 text-xs">
                    {staff.upiId || 'staff@upi'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(staff.upiId || 'staff@upi', 'UPI ID')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center gap-1 transition"
              >
                <Copy className="w-3.5 h-3.5" /> Copy UPI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Salary & Attendance Breakdown Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-600" /> Current Month Salary & Leave Calculation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-semibold block">Base Salary</span>
            <span className="text-lg font-bold text-slate-900 block mt-1">₹{baseSalary.toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <span className="text-[11px] text-emerald-700 font-semibold block">Paid Leaves</span>
            <span className="text-lg font-bold text-emerald-800 block mt-1">
              {staff.paidLeavesCount || 0} Day(s) (₹0 Deduction)
            </span>
          </div>

          <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200">
            <span className="text-[11px] text-rose-700 font-semibold block">Unpaid Leaves</span>
            <span className="text-lg font-bold text-rose-800 block mt-1">
              {staff.unpaidLeavesCount || 0} Day(s)
            </span>
          </div>

          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200">
            <span className="text-[11px] text-rose-700 font-semibold block">Leave Deduction</span>
            <span className="text-lg font-extrabold text-rose-600 block mt-1">
              -₹{leaveDeductions.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Calculation Banner */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Net Payable (Base Salary - Leave Deductions)
            </span>
            <span className="text-2xl font-extrabold text-emerald-400 block mt-0.5">
              ₹{netPay.toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              Status: <strong className="text-white">{staff.status}</strong> {staff.paidDate !== '-' && `(Paid on ${staff.paidDate})`}
            </p>
          </div>

          {staff.status === 'Pending' && onPaySalary && (
            <button
              onClick={() => onPaySalary(staff)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Proceed to Pay ₹{netPay.toLocaleString('en-IN')}</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

