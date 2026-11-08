import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';

export default function NewOrderModal({
  show,
  onClose,
  customers,
  services,
  offers,
  newOrderForm,
  setNewOrderForm,
  onSubmit,
}) {
  if (!show) return null;

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

          <h3 className="font-bold text-lg text-slate-900">Create New Laundry Order</h3>
          <p className="text-xs text-slate-500 mt-0.5">Enters pipeline stage & sends WhatsApp receipt</p>

          <form onSubmit={onSubmit} className="space-y-4 mt-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Customer</label>
              <select
                value={newOrderForm.customerId}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, customerId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Laundry Items</label>
                <button
                  type="button"
                  onClick={() =>
                    setNewOrderForm({
                      ...newOrderForm,
                      items: [...newOrderForm.items, { serviceId: services[0]?.id || '', qty: 2 }],
                    })
                  }
                  className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {newOrderForm.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.serviceId}
                      onChange={(e) => {
                        const updated = [...newOrderForm.items];
                        updated[idx].serviceId = e.target.value;
                        setNewOrderForm({ ...newOrderForm, items: updated });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-sky-500"
                    >
                      {services
                        .filter((s) => s.active)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — ₹{s.price} ({s.unit})
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => {
                        const updated = [...newOrderForm.items];
                        updated[idx].qty = Number(e.target.value);
                        setNewOrderForm({ ...newOrderForm, items: updated });
                      }}
                      className="w-20 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center focus:outline-none focus:border-sky-500"
                    />
                    {newOrderForm.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNewOrderForm({
                            ...newOrderForm,
                            items: newOrderForm.items.filter((_, i) => i !== idx),
                          })
                        }
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Apply Offer / Coupon</label>
                <select
                  value={newOrderForm.couponCode}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, couponCode: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option value="">No Offer</option>
                  {offers
                    .filter((o) => o.active)
                    .map((o) => (
                      <option key={o.id} value={o.code}>
                        {o.code} ({o.title})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Mode</label>
                <select
                  value={newOrderForm.paymentStatus}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option>Paid (UPI)</option>
                  <option>Paid (Cash)</option>
                  <option>Pending COD</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition"
            >
              Create Order & Send WhatsApp Alert
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

