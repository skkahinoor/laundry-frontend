import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ServiceModal({
  show,
  onClose,
  editingService,
  serviceForm,
  setServiceForm,
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
          <h3 className="font-bold text-lg text-slate-900">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h3>
          <form onSubmit={onSubmit} className="space-y-3.5 mt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Service Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Curtain Steam Wash"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option>Daily Laundry</option>
                  <option>Dry Clean</option>
                  <option>Household</option>
                  <option>Ironing</option>
                  <option>Express</option>
                  <option>Shoe Spa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
                <select
                  value={serviceForm.unit}
                  onChange={(e) => setServiceForm({ ...serviceForm, unit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option>per Kg</option>
                  <option>per Pc</option>
                  <option>per Set</option>
                  <option>per Pair</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 99"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={serviceForm.turnaround}
                  onChange={(e) => setServiceForm({ ...serviceForm, turnaround: e.target.value })}
                  placeholder="e.g. 24 Hours, 48 Hours"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition"
            >
              Save Service
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

