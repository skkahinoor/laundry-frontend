import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, PartyPopper, Ticket, Check, Copy } from 'lucide-react';

export default function Offers({
  offers,
  setOffers,
  offerFilter,
  setOfferFilter,
  setShowOfferModal,
  showToast,
}) {
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredOffers = offers.filter(
    (o) => offerFilter === 'All' || o.category === offerFilter
  );

  return (
    <motion.div
      key="offers"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Festive Offer', 'Holiday Offer', 'Coupon Code', 'Special Discount'].map((cat) => (
            <button
              key={cat}
              onClick={() => setOfferFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                offerFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowOfferModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create Offer / Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOffers.map((off) => {
          const badgeStyle =
            off.category === 'Festive Offer'
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : off.category === 'Holiday Offer'
              ? 'bg-sky-100 text-sky-800 border-sky-300'
              : off.category === 'Coupon Code'
              ? 'bg-purple-100 text-purple-800 border-purple-300'
              : 'bg-emerald-100 text-emerald-800 border-emerald-300';

          return (
            <div
              key={off.id}
              className={`bg-white rounded-3xl p-6 border relative overflow-hidden transition ${
                off.active
                  ? 'border-slate-200/90 shadow-sm hover:shadow-md'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badgeStyle}`}
                  >
                    <PartyPopper className="w-3.5 h-3.5" /> {off.category}
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 mt-3">{off.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{off.description}</p>
                </div>

                <div className="text-right shrink-0 bg-indigo-50 border border-indigo-100 px-3.5 py-2.5 rounded-2xl">
                  <span className="text-xl font-bold text-indigo-700 block">
                    {off.discountType === 'percentage'
                      ? `${off.discountValue}% OFF`
                      : `₹${off.discountValue} OFF`}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">
                    Min Order ₹{off.minOrder}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-300 font-bold text-sm tracking-wider text-slate-900 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-indigo-600" />
                    {off.code}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(off.code);
                      setCopiedCode(off.id);
                      showToast(`Copied Code ${off.code}`, 'Ready to apply in checkout.');
                      setTimeout(() => setCopiedCode(null), 2000);
                    }}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                    title="Copy Promo Code"
                  >
                    {copiedCode === off.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Valid till {off.validTill}
                  </span>
                  <button
                    onClick={() => {
                      setOffers((prev) =>
                        prev.map((o) => (o.id === off.id ? { ...o, active: !o.active } : o))
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      off.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {off.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

