import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function NewCustomerModal({
  show,
  onClose,
  newCustomerForm,
  setNewCustomerForm,
  onSubmit,
}) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-lg text-slate-900">Add New Customer</h3>
          <form onSubmit={onSubmit} className="space-y-3.5 mt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Siddharth Roy"
                value={newCustomerForm.name}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 98765 43210"
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Address</label>
              <input
                type="text"
                required
                placeholder="Flat / House No, Society, Area"
                value={newCustomerForm.address}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Notes / Preferences</label>
              <textarea
                rows={2}
                placeholder="e.g. Prefers gentle wash, starch in shirts"
                value={newCustomerForm.notes}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition"
            >
              Save Customer
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

