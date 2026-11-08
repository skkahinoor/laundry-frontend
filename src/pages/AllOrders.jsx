import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Search,
  Plus,
  RefreshCw,
  Send,
  X,
} from 'lucide-react';
import { calculateOrderTotals } from '../utils/helpers';

export default function AllOrders({
  orders,
  stages,
  ordersStageTab,
  setOrdersStageTab,
  ordersDayFilter,
  setOrdersDayFilter,
  ordersDateFilter,
  setOrdersDateFilter,
  ordersSearch,
  setOrdersSearch,
  setShowNewOrderModal,
  updateOrderStageDirect,
  moveOrderStage,
  sendWhatsAppNotification,
  onRefresh,
  isLoading,
}) {
  const filteredOrders = orders.filter((ord) => {
    const matchesTab = ordersStageTab === 'all' || ord.stage === ordersStageTab;
    const matchesDay = ordersDayFilter === 'All' || ord.dayCategory === ordersDayFilter;
    const matchesDate = !ordersDateFilter || ord.orderDate === ordersDateFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      ord.customerPhone.includes(ordersSearch);
    return matchesTab && matchesDay && matchesDate && matchesSearch;
  });

  const filteredRevenue = filteredOrders.reduce(
    (acc, o) => acc + calculateOrderTotals(o).netRevenue,
    0
  );

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Progress Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setOrdersStageTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              ordersStageTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Orders</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                ordersStageTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {orders.length}
            </span>
          </button>

          {stages.map((stg) => {
            const StgIcon = stg.icon;
            const count = orders.filter((o) => o.stage === stg.id).length;
            const active = ordersStageTab === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setOrdersStageTab(stg.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition border ${
                  active
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <StgIcon className="w-3.5 h-3.5" />
                <span>{stg.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    active ? 'bg-white text-sky-700' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day-Wise Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-1">
            <CalendarDays className="w-4 h-4 text-sky-600" />
            <span>Day Filter:</span>
          </div>

          {['All', 'Today', 'Yesterday', '2 Days Ago'].map((day) => (
            <button
              key={day}
              onClick={() => {
                setOrdersDayFilter(day);
                setOrdersDateFilter('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ordersDayFilter === day && !ordersDateFilter
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day === 'All' ? 'All Days' : day}
            </button>
          ))}

          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500">Date:</span>
            <input
              type="date"
              value={ordersDateFilter}
              onChange={(e) => {
                setOrdersDateFilter(e.target.value);
                if (e.target.value) setOrdersDayFilter('All');
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
            />
            {ordersDateFilter && (
              <button
                onClick={() => setOrdersDateFilter('')}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ordersSearch}
              onChange={(e) => setOrdersSearch(e.target.value)}
              placeholder="Search order #, name, phone..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {/* Orders Container: Mobile Cards (< md) & Desktop Table (>= md) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="font-bold text-slate-700 flex items-center gap-2">
            <span>Showing {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-sky-700 font-extrabold">Filtered: ₹{filteredRevenue.toLocaleString('en-IN')}</span>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-[11px] font-semibold text-slate-600 hover:text-sky-700 flex items-center gap-1.5 transition disabled:opacity-50"
            title="Click to refresh live order data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>100% Synced</span>
          </button>
        </div>

        {/* 1. MOBILE CARD VIEW (< md) */}
        <div className="md:hidden divide-y divide-slate-100 p-2 sm:p-3 space-y-3">
          {filteredOrders.map((ord) => {
            const { netRevenue, discount } = calculateOrderTotals(ord);
            const stgIdx = stages.findIndex((s) => s.id === ord.stage);
            const stg = stages[stgIdx];

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs space-y-3"
              >
                {/* Header: ID, Day, Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sky-700 text-sm">#{ord.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.dayCategory === 'Today'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.dayCategory === 'Yesterday'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ord.dayCategory}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{ord.createdAt}</span>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{ord.customerName}</p>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-xs text-sky-600 font-semibold hover:underline"
                    >
                      {ord.customerPhone}
                    </a>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-slate-900">
                      ₹{netRevenue.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-slate-50/80 rounded-xl p-2.5 text-xs space-y-1">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="truncate">• {it.name}</span>
                      <span className="font-bold text-slate-900 shrink-0">{it.qty}x</span>
                    </div>
                  ))}
                  {ord.couponCode && (
                    <div className="text-[10px] font-bold text-amber-700 pt-1 border-t border-slate-200/60">
                      Coupon: {ord.couponCode} (-₹{discount})
                    </div>
                  )}
                </div>

                {/* Stage Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block">Current Stage</label>
                  <select
                    value={ord.stage}
                    onChange={(e) => updateOrderStageDirect(ord.id, e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${stg?.color}`}
                  >
                    {stages.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white text-slate-800 font-semibold">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions: WhatsApp & Next Stage */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => sendWhatsAppNotification(ord, ord.stage)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" /> WhatsApp Alert
                  </button>
                  <button
                    disabled={stgIdx === stages.length - 1}
                    onClick={() => moveOrderStage(ord.id, 1)}
                    className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 shadow-2xs"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              No laundry orders match the filter.
            </div>
          )}
        </div>

        {/* 2. DESKTOP TABLE VIEW (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-[11px] uppercase">
                <th className="py-3.5 px-4">Order ID & Day</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Laundry Items</th>
                <th className="py-3.5 px-4">Total Bill & Payment</th>
                <th className="py-3.5 px-4">Live Progress Stage (Sync)</th>
                <th className="py-3.5 px-4">WhatsApp Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map((ord) => {
                const { netRevenue, discount } = calculateOrderTotals(ord);
                const stgIdx = stages.findIndex((s) => s.id === ord.stage);
                const stg = stages[stgIdx];

                return (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sky-700">#{ord.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.dayCategory === 'Today'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.dayCategory === 'Yesterday'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ord.dayCategory}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ord.createdAt} • Due: {ord.expectedDelivery}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{ord.customerName}</p>
                      <p className="text-xs text-slate-500">{ord.customerPhone}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {ord.items.map((it, idx) => (
                          <p key={idx} className="text-xs text-slate-700 font-semibold truncate">
                            {it.qty}x {it.name}
                          </p>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">₹{netRevenue.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                          {ord.paymentStatus}
                        </span>
                        {ord.couponCode && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            {ord.couponCode} (-₹{discount})
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.stage}
                        onChange={(e) => updateOrderStageDirect(ord.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${stg?.color}`}
                      >
                        {stages.map((s) => (
                          <option key={s.id} value={s.id} className="bg-white text-slate-800 font-semibold">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-600 block">{ord.lastNotified}</span>
                      <span className="text-[10px] font-bold text-emerald-600">{ord.notifyCount} updates sent</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => sendWhatsAppNotification(ord, ord.stage)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1 transition"
                        >
                          <Send className="w-3.5 h-3.5" /> WhatsApp
                        </button>
                        <button
                          disabled={stgIdx === stages.length - 1}
                          onClick={() => moveOrderStage(ord.id, 1)}
                          className="px-2.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white font-bold text-xs transition"
                        >
                          Next →
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No laundry orders match the selected Day / Stage filter.
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

