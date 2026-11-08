import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Kanban, Wallet, Calendar, RefreshCw } from 'lucide-react';
import { calculateOrderTotals } from '../utils/helpers';
import { dashboardApi } from '../api';

export default function Dashboard({
  orders,
  financials: initialFinancials,
  stages,
  setActivePage,
  setShowNewOrderModal,
}) {
  const [period, setPeriod] = useState('all');
  const [periodMetrics, setPeriodMetrics] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePeriodChange = async (newPeriod) => {
    setPeriod(newPeriod);
    setIsRefreshing(true);
    try {
      const res = await dashboardApi.getMetrics(newPeriod);
      if (res.success) {
        setPeriodMetrics(res.metrics);
      }
    } catch (e) {
      console.warn('Metrics period change error:', e.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const metrics = periodMetrics || {
    total_revenue: initialFinancials.totalRevenue,
    total_payroll_paid: initialFinancials.totalPayrollPaid,
    total_payroll_pending: initialFinancials.totalPayrollPending,
    actual_net_profit: initialFinancials.actualProfitAfterPaidSalary,
    net_margin_percent: initialFinancials.netMarginPercent,
    total_orders_count: orders.length,
  };

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Top Filter Bar for Dashboard Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Financial Period Filter:</span>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          {[
            { label: 'All Time', value: 'all' },
            { label: 'Today', value: 'today' },
            { label: 'Yesterday', value: 'yesterday' },
            { label: 'This Month', value: 'month' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handlePeriodChange(item.value)}
              disabled={isRefreshing}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                period === item.value
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Core Financial Metric Cards: Total Revenue - Staff Salaries = Net Profit */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {/* 1. Total Revenue (From Orders) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-slate-400 block">
              Total Revenue (Orders)
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 truncate">
              ₹{(metrics.total_revenue || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] sm:text-[11px] font-semibold text-sky-600 flex items-center gap-1 truncate">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" /> From {metrics.total_orders_count || orders.length} orders
          </div>
        </div>

        {/* 2. Staff Salaries Paid */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-amber-600 block">
              Staff Salaries Paid
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 truncate">
              ₹{(metrics.total_payroll_paid || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] sm:text-[11px] font-semibold text-amber-700 truncate">
            Pending: ₹{(metrics.total_payroll_pending || 0).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 3. Actual Net Profit = Revenue - Staff Salaries */}
        <div className={`col-span-2 md:col-span-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-white shadow-lg flex flex-col justify-between ${
          (metrics.actual_net_profit || 0) >= 0
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
            : 'bg-gradient-to-br from-rose-600 to-pink-700'
        }`}>
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-white/80 block">
              Actual Net Profit
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-white mt-1 truncate">
              ₹{(metrics.actual_net_profit || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/20 text-[10px] sm:text-[11px] font-bold text-white/90">
            ✓ Total Revenue minus Staff Salaries ({metrics.net_margin_percent}% Net Margin)
          </div>
        </div>
      </div>

      {/* Dashboard Quick Actions & Recent Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Laundry Orders</h3>
            <button
              onClick={() => setActivePage('orders')}
              className="text-xs font-bold text-sky-600 hover:underline"
            >
              View All ({orders.length}) →
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {orders.slice(0, 5).map((ord) => {
              const { netRevenue } = calculateOrderTotals(ord);
              const stg = stages.find((s) => s.id === ord.stage);
              return (
                <div
                  key={ord.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-sky-700">#{ord.id}</span>
                      <span className="font-bold text-xs text-slate-900 truncate">{ord.customerName}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {(ord.items || []).map((i) => `${i.qty}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 block">₹{netRevenue}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stg?.color}`}>
                      {stg?.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-1.5">CRM Quick Operations</h3>
            <p className="text-xs text-slate-500 mb-4">
              Manage your laundry business instantly with 1-click shortcuts.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create New Order
                </span>
                <span>→</span>
              </button>
              <button
                onClick={() => setActivePage('pipeline')}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Kanban className="w-4 h-4" /> Open Order Pipeline
                </span>
                <span>→</span>
              </button>
              <button
                onClick={() => setActivePage('payroll')}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> Pay Staff Salaries
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] font-semibold text-slate-400">WashFlow Live Synced with API</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
