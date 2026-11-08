import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  Building,
  RefreshCw,
} from 'lucide-react';
import { payrollApi } from '../api';

export default function StaffPayouts() {
  const [payouts, setPayouts] = useState([]);
  const [totalReceived, setTotalReceived] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const res = await payrollApi.getStaffPayouts();
      if (res.payouts) {
        setPayouts(res.payouts);
        setTotalReceived(res.total_received || 0);
      }
    } catch (e) {
      console.warn('Failed to load payouts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  return (
    <motion.div
      key="staff-payouts"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            My Salary & Earnings
          </span>
          <h2 className="text-xl font-bold mt-0.5">Salary Payout History</h2>
          <p className="text-xs text-slate-300 mt-1">
            Track your month-wise disbursed salaries, bonuses, and payment receipts.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-3">
          <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-[10px] text-slate-300 font-bold uppercase block">Total Disbursed</span>
            <span className="text-lg font-extrabold text-emerald-300">
              ₹{totalReceived.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
          <span>Salary Records</span>
          <button
            onClick={fetchPayouts}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 1. MOBILE CARDS VIEW (< md) */}
        <div className="md:hidden divide-y divide-slate-100 p-2 sm:p-3 space-y-3">
          {payouts.map((p) => {
            const isPaid = p.status === 'Paid';
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{p.month}</p>
                      {p.paid_at && p.paid_at !== '-' && (
                        <p className="text-[10px] text-slate-400">Paid: {p.paid_at}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {p.status}
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-3 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Net Disbursed</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    ₹{p.net_pay.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Base</span>
                    <span className="font-bold text-slate-700">₹{p.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 block font-semibold">Bonus</span>
                    <span className="font-bold text-emerald-700">
                      {p.bonus > 0 ? `+₹${p.bonus.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                    <span className="text-[10px] text-rose-600 block font-semibold">Deduction</span>
                    <span className="font-bold text-rose-600">
                      {p.deduction > 0 ? `-₹${p.deduction.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Transfer Method:</span>
                  <span className="font-semibold text-slate-700">{p.payment_mode || 'UPI Transfer'}</span>
                </div>
              </div>
            );
          })}

          {payouts.length === 0 && (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              No payout records generated yet.
            </div>
          )}
        </div>

        {/* 2. DESKTOP TABLE VIEW (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-4 px-5">Salary Month</th>
                <th className="py-4 px-4">Base Salary</th>
                <th className="py-4 px-4">Bonus / Incentive</th>
                <th className="py-4 px-4">Deductions</th>
                <th className="py-4 px-4">Net Amount</th>
                <th className="py-4 px-4">Payment Mode</th>
                <th className="py-4 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.map((p) => {
                const isPaid = p.status === 'Paid';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-600" />
                        <div>
                          <p className="font-bold text-slate-900">{p.month}</p>
                          {p.paid_at && p.paid_at !== '-' && (
                            <p className="text-[10px] text-slate-400">Paid: {p.paid_at}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-700">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4 text-emerald-700 font-bold">
                      {p.bonus > 0 ? `+₹${p.bonus.toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    <td className="py-4 px-4 text-rose-600 font-bold">
                      {p.deduction > 0 ? `-₹${p.deduction.toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{p.net_pay.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600">
                      <span>{p.payment_mode || 'UPI Transfer'}</span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {payouts.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No payout records generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

