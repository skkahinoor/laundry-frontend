import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  PackageCheck,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import OrderProgressStepper from '../components/OrderProgressStepper';

export default function CustomerOrders({
  orders = [],
  activeOrders: propActiveOrders,
  deliveredOrders: propDeliveredOrders,
  setActiveTab,
  onBookClick,
  onRefresh,
}) {
  const [tab, setTab] = useState('active'); // 'active' or 'delivered'
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const goToBook = onBookClick || (() => setActiveTab && setActiveTab('book'));

  // Determine active and delivered orders from props
  const activeOrders =
    propActiveOrders !== undefined
      ? propActiveOrders
      : orders.filter((o) => o.stage !== 'delivered');

  const deliveredOrders =
    propDeliveredOrders !== undefined
      ? propDeliveredOrders
      : orders.filter((o) => o.stage === 'delivered');

  const currentList = tab === 'active' ? activeOrders : deliveredOrders;

  const displayedList = currentList.filter((o) => {
    const id = String(o.id || o.order_id_string || '').toLowerCase();
    const q = search.toLowerCase();
    return (
      id.includes(q) ||
      (o.items || []).some((it) =>
        (it.name || it.service_name || '').toLowerCase().includes(q)
      )
    );
  });

  const handleManualRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6"
    >
      {/* Top Header & Search */}
      <div className="bg-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Laundry Orders & History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline tracking, invoices, and delivery addresses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, item..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {onRefresh && (
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition shrink-0"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          )}

          <button
            onClick={goToBook}
            className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 whitespace-nowrap transition flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book Laundry</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setTab('active')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'active'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active In-Progress</span>
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] ${
              tab === 'active' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {activeOrders.length}
          </span>
        </button>

        <button
          onClick={() => setTab('delivered')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
            tab === 'delivered'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>Delivered / History</span>
          <span
            className={`px-2 py-0.2 rounded-full text-[10px] ${
              tab === 'delivered' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {deliveredOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {displayedList.length > 0 ? (
          displayedList.map((ord) => {
            const items = ord.items || [];
            const isDelivered = ord.stage === 'delivered';
            const totalBill =
              ord.final_amount || ord.netRevenue || ord.totalAmount || 0;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs space-y-3.5 sm:space-y-4 hover:shadow-md transition"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-xs sm:text-base text-sky-700 bg-sky-50 px-2.5 sm:px-3 py-1 rounded-xl border border-sky-200/60">
                      #{ord.id || ord.order_id_string}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Ordered: {ord.order_date || ord.orderDate || ord.createdAt || 'Recently'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full border ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-sky-50 text-sky-700 border-sky-300'
                      }`}
                    >
                      {isDelivered ? '✓ Delivered' : `In Processing (${ord.stage})`}
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ₹{Number(totalBill).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper for Active Orders */}
                {!isDelivered ? (
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 overflow-x-auto">
                    <OrderProgressStepper stage={ord.stage} />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-emerald-600" />
                      Order successfully washed, steam pressed & delivered!
                    </span>
                    <span className="font-bold text-emerald-700">
                      Payment: {ord.payment_status || 'Paid'}
                    </span>
                  </div>
                )}

                {/* Items & Services Breakdown */}
                {items.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Clothes & Services in this Order:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {items.map((it, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-800 truncate mr-2">
                            {it.name || it.service_name}
                          </span>
                          <span className="font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px] shrink-0">
                            {it.qty || it.qty_or_kg} {it.unit?.replace('per ', '') || 'pc'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Addresses & Location info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">
                        Pickup Location:
                      </span>
                      <span className="text-slate-500">
                        {ord.pickup_address || 'Address on profile'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-700 block text-[11px]">
                        Delivery Location:
                      </span>
                      <span className="text-slate-500">
                        {ord.delivery_address || ord.pickup_address || 'Same as pickup'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                No {tab === 'active' ? 'Active' : 'Delivered'} Orders Found
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {tab === 'active'
                  ? 'All your current orders have been completed or you have not scheduled one yet.'
                  : 'Delivered orders will appear here once marked completed.'}
              </p>
            </div>
            <button
              onClick={goToBook}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition"
            >
              + Schedule Pickup Now
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
