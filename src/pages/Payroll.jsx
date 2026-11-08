import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  Eye,
  CreditCard,
  Building,
  AlertTriangle,
  QrCode,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import PaySalaryModal from '../components/modals/PaySalaryModal';
import { payrollApi } from '../api';
import { normalizeStaff } from '../utils/helpers';

const AVAILABLE_MONTHS = [
  { id: 'Nov-2026', label: 'November 2026', short: 'Nov 2026', isCurrent: true },
  { id: 'Oct-2026', label: 'October 2026', short: 'Oct 2026' },
  { id: 'Sep-2026', label: 'September 2026', short: 'Sep 2026' },
  { id: 'Aug-2026', label: 'August 2026', short: 'Aug 2026' },
];

export default function Payroll({
  staffList = [],
  setStaffList,
  financials,
  setShowStaffModal,
  payAllPendingSalaries,
  toggleSalaryStatus,
  onPaySalaryConfirmed,
  onViewStaff,
}) {
  const [selectedMonth, setSelectedMonth] = useState('Nov-2026');
  const [monthStaffList, setMonthStaffList] = useState(staffList);
  const [isMonthLoading, setIsMonthLoading] = useState(false);
  const [selectedStaffForPay, setSelectedStaffForPay] = useState(null);

  // Sync monthStaffList whenever parent staffList updates (if on current month)
  useEffect(() => {
    if (selectedMonth === 'Nov-2026') {
      setMonthStaffList(staffList);
    }
  }, [staffList, selectedMonth]);

  // Fetch month-specific payroll data when selectedMonth changes
  const handleSelectMonth = async (monthId) => {
    setSelectedMonth(monthId);
    setIsMonthLoading(true);
    try {
      const res = await payrollApi.getStaff(monthId);
      const raw = res?.staff || res?.data || [];
      if (Array.isArray(raw)) {
        setMonthStaffList(raw.map(normalizeStaff));
      }
    } catch (err) {
      console.warn('Could not load staff for month', monthId, err);
      // Fallback: If not Nov-2026, simulate past months as already paid
      if (monthId !== 'Nov-2026') {
        setMonthStaffList((prev) =>
          prev.map((s) => ({
            ...s,
            status: 'Paid',
            paidDate: `02 ${monthId.split('-')[0]} ${monthId.split('-')[1]}`,
          }))
        );
      }
    } finally {
      setIsMonthLoading(false);
    }
  };

  const activeRoster = monthStaffList.length > 0 ? monthStaffList : staffList;

  // Month-specific calculations
  const totalPaid = activeRoster
    .filter((s) => s.status === 'Paid')
    .reduce((sum, s) => sum + Number(s.netPay !== undefined ? s.netPay : s.baseSalary), 0);

  const totalPending = activeRoster
    .filter((s) => s.status === 'Pending')
    .reduce((sum, s) => sum + Number(s.netPay !== undefined ? s.netPay : s.baseSalary), 0);

  const paidCount = activeRoster.filter((s) => s.status === 'Paid').length;

  const totalRevenue = financials?.totalRevenue || 0;
  const actualNetProfit = totalRevenue - totalPaid;

  const handleConfirmPay = async (payload) => {
    // Optimistic update for 0ms latency
    setMonthStaffList((prev) =>
      prev.map((s) =>
        s.id === payload.staff_id
          ? {
              ...s,
              status: 'Paid',
              paidDate: 'Just now',
            }
          : s
      )
    );

    if (onPaySalaryConfirmed) {
      await onPaySalaryConfirmed({
        ...payload,
        month: selectedMonth,
      });
    } else {
      toggleSalaryStatus(payload.staff_id);
    }
  };

  return (
    <motion.div
      key="payroll"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Salary Payroll Center
            </span>
            <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full">
              Month-Wise System
            </span>
          </div>
          <h2 className="text-xl font-bold">Month-Wise Staff Payroll & Banking Disbursements</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Formula: <span className="font-semibold text-emerald-300">Net Payable = Base Salary - Leave Deductions</span>. Inspect staff bank accounts and log salary transfers instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowStaffModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" /> Add Staff Member
          </button>
          <button
            onClick={() => {
              setMonthStaffList((prev) =>
                prev.map((s) => ({
                  ...s,
                  status: 'Paid',
                  paidDate: 'Just now',
                }))
              );
              payAllPendingSalaries(selectedMonth);
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
          >
            <CheckCircle2 className="w-4 h-4" /> Pay All Pending ({selectedMonth})
          </button>
        </div>
      </div>

      {/* MONTH SELECTOR TABS */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Select Payroll Month:</span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto gap-1">
          {AVAILABLE_MONTHS.map((m) => {
            const isSelected = selectedMonth === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMonth(m.id)}
                className={`px-3.5 py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{m.short}</span>
                {m.isCurrent && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-sky-400' : 'bg-indigo-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">Total Revenue (Orders)</span>
          <p className="text-2xl font-bold text-indigo-900 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-500 mt-1">Total billing from laundry orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold uppercase text-amber-600">
            Salaries Paid ({selectedMonth})
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            ₹{totalPaid.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-semibold text-slate-400">
              (Pending: ₹{totalPending.toLocaleString('en-IN')})
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {paidCount} of {activeRoster.length} staff paid for {selectedMonth}
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm ${
          actualNetProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <span className={`text-xs font-bold uppercase ${
            actualNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            Actual Net Profit ({selectedMonth})
          </span>
          <p className={`text-2xl font-bold mt-1 ${
            actualNetProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'
          }`}>
            ₹{actualNetProfit.toLocaleString('en-IN')}
          </p>
          <p className={`text-xs font-semibold mt-1 ${
            actualNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            Total Revenue minus paid staff payouts
          </p>
        </div>
      </div>

      {/* Staff Payroll & Banking Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <span>Staff Roster ({activeRoster.length} members)</span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              {selectedMonth}
            </span>
          </div>
          <div className="text-slate-500 text-[11px] font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Click Eye icon to view full dedicated profile & banking details</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-4 px-5">Staff Member & Role</th>
                <th className="py-4 px-4">Base Salary</th>
                <th className="py-4 px-4">Leaves & Deductions</th>
                <th className="py-4 px-4">Net Payable</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeRoster.map((stf) => {
                const baseSalary = Number(stf.baseSalary || 0);
                const leaveDeduction = Number(stf.leaveDeductions || 0);
                const netPay = Number(
                  stf.netPay !== undefined
                    ? stf.netPay
                    : Math.max(0, baseSalary - leaveDeduction)
                );

                return (
                  <tr key={stf.id} className="hover:bg-slate-50/80 transition">
                    {/* Staff Name & Role */}
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {stf.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm leading-tight">{stf.name}</p>
                          <p className="text-xs text-sky-700 font-semibold truncate">{stf.role}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{stf.phone || stf.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Base Salary */}
                    <td className="py-4 px-4 font-bold text-slate-800">
                      ₹{baseSalary.toLocaleString('en-IN')}
                    </td>

                    {/* Leaves & Deductions */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs">
                          {stf.paidLeavesCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {stf.paidLeavesCount}d Paid
                            </span>
                          )}
                          {stf.unpaidLeavesCount > 0 ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              {stf.unpaidLeavesCount}d Unpaid
                            </span>
                          ) : (
                            stf.paidLeavesCount === 0 && (
                              <span className="text-[11px] text-slate-400">0 leaves</span>
                            )
                          )}
                        </div>
                        {leaveDeduction > 0 && (
                          <span className="text-xs font-bold text-rose-600 block mt-1">
                            -₹{leaveDeduction.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Net Payable: Formula is strictly Base Salary - Leave Deduction */}
                    <td className="py-4 px-4">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{netPay.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          stf.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {stf.status === 'Paid' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {stf.status}
                      </span>
                      {stf.paidDate !== '-' && stf.status === 'Paid' && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">Paid {stf.paidDate}</span>
                      )}
                    </td>

                    {/* Actions: Eye Button (Opens Full Page) + Pay Button */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Eye Button: Opens dedicated full page view */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewStaff) {
                              onViewStaff(stf);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 transition"
                          title="View Full Staff Profile Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Pay Salary button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (stf.status === 'Pending') {
                              setSelectedStaffForPay({ ...stf, month: selectedMonth });
                            } else {
                              setMonthStaffList((prev) =>
                                prev.map((s) => (s.id === stf.id ? { ...s, status: 'Pending', paidDate: '-' } : s))
                              );
                              toggleSalaryStatus(stf.id, selectedMonth);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs transition shadow-sm ${
                            stf.status === 'Pending'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {stf.status === 'Pending'
                            ? `Pay ₹${netPay.toLocaleString('en-IN')}`
                            : 'Mark Unpaid'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Salary Modal with Bank Details */}
      <PaySalaryModal
        staff={selectedStaffForPay}
        isOpen={Boolean(selectedStaffForPay)}
        onClose={() => setSelectedStaffForPay(null)}
        onConfirmPay={handleConfirmPay}
      />
    </motion.div>
  );
}
