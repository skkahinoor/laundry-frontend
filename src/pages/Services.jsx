import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Edit3, Shirt } from 'lucide-react';

export default function Services({
  services,
  setServices,
  setEditingService,
  setServiceForm,
  setShowServiceModal,
  showToast,
}) {
  return (
    <motion.div
      key="services"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-base text-slate-900">
            Laundry Services & Rate Card
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer laundry rates, categories, turnaround times, and service availability.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setServiceForm({
              name: '',
              category: 'Daily Laundry',
              price: '',
              unit: 'per Kg',
              turnaround: '48 Hours',
            });
            setShowServiceModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`bg-white rounded-3xl p-5 border transition flex flex-col justify-between ${
              srv.active
                ? 'border-slate-200/90 shadow-sm hover:shadow-md'
                : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60">
                  {srv.category}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {srv.turnaround}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 mt-3">{srv.name}</h3>

              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Service Rate</span>
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">₹{srv.price}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    {' '}/{srv.unit ? srv.unit.replace('per ', '') : 'unit'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setEditingService(srv);
                  setServiceForm({
                    name: srv.name,
                    category: srv.category,
                    price: srv.price,
                    unit: srv.unit,
                    turnaround: srv.turnaround,
                  });
                  setShowServiceModal(true);
                }}
                className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Price
              </button>
              <button
                onClick={() => {
                  setServices((prev) =>
                    prev.map((s) => (s.id === srv.id ? { ...s, active: !s.active } : s))
                  );
                  if (showToast) {
                    showToast(`${srv.name} status updated`, 'Service availability toggled.');
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  srv.active
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {srv.active ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
