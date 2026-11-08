import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function OfferModal({ show, onClose, onAddOffer }) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: 'Festive Offer',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 500,
    validTill: '31 Dec 2026',
    description: '',
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.code.trim()) return;
    onAddOffer({
      id: `off-${Date.now()}`,
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrder: Number(formData.minOrder),
      active: true,
    });
    onClose();
  };

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
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-lg text-slate-900">Create Offer or Coupon</h3>
          <p className="text-xs text-slate-500 mt-0.5">Discounts will be available across orders</p>

          <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Offer Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Diwali Super Discount"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm uppercase font-bold focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option>Festive Offer</option>
                  <option>Holiday Offer</option>
                  <option>Coupon Code</option>
                  <option>Special Discount</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Value</label>
                <input
                  type="number"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Valid Till</label>
                <input
                  type="text"
                  placeholder="e.g. 31 Dec 2026"
                  value={formData.validTill}
                  onChange={(e) => setFormData({ ...formData, validTill: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Details of the offer..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition"
            >
              Publish Offer
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

