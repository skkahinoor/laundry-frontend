import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, Calendar, Clock, CheckCircle2, PackageCheck } from 'lucide-react';
import { calculateOrderTotals } from '../../utils/helpers';

export default function CustomerDetailModal({
  customer,
  orders,
  stages,
  onClose,
  onNewOrder,
}) {
  if (!customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const totalSpent = customerOrders.reduce((sum, o) => sum + calculateOrderTotals(o).netRevenue, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {customer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{customer.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Customer #{customer.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-sky-600" /> {customer.phone}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-5">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{customer.address}</span>
            </p>
            {customer.notes && (
              <p className="text-slate-500 italic pt-1 border-t border-slate-200/60">
                "{customer.notes}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-900">
              <span className="text-[10px] uppercase font-bold text-sky-600 block">Total Orders</span>
              <span className="text-lg font-bold">{customerOrders.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Total Lifetime Spend</span>
              <span className="text-lg font-bold">₹{totalSpent.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Order Timeline</h4>
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {customerOrders.map((ord) => {
                const { netRevenue } = calculateOrderTotals(ord);
                const stg = stages.find((s) => s.id === ord.stage);
                return (
                  <div
                    key={ord.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sky-700">#{ord.id}</span>
                        <span className="text-slate-400">{ord.createdAt}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-slate-900 block">₹{netRevenue}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stg?.color}`}>
                        {stg?.label}
                      </span>
                    </div>
                  </div>
                );
              })}
              {customerOrders.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No past orders found for this customer.</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNewOrder(customer.id);
              }}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm"
            >
              + Place New Order
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

