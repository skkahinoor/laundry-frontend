import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Headphones,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { storeSettingsApi } from '../../api';

const DEFAULT_STORE = {
  store_name: 'WashFlow Laundry & Dry Cleaning Hub',
  tagline: 'Smart On-Demand Doorstep Laundry & Express Steam Press',
  phone: '+91 98765 43210',
  whatsapp_number: '+91 98765 43210',
  email: 'support@washflow.in',
  address: '12/4 Laundry Hub, 100ft Road, Indiranagar, Bengaluru, KA 560038',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  opening_hours: '08:00 AM - 09:00 PM (Monday - Sunday)',
  map_link: 'https://maps.google.com/?q=Indiranagar+Bengaluru',
  support_notes: 'Complimentary doorstep pickup and drop within 48 hours for all orders. For urgent wash queries, ping our direct WhatsApp helpline.',
};

export default function CustomerSupport({ onBookClick }) {
  const [store, setStore] = useState(DEFAULT_STORE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storeSettingsApi
      .getSettings()
      .then((res) => {
        const data = res?.store || res?.data || res;
        if (data && data.store_name) {
          setStore((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.error('Error fetching store settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format phone for WhatsApp link (remove spaces, symbols)
  const cleanPhone = (store.whatsapp_number || store.phone || '')
    .replace(/[^0-9]/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-6"
    >
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-9 text-white shadow-xl shadow-sky-600/20 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-sky-100">
            <Headphones className="w-3.5 h-3.5" />
            <span>Store Help & Support Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            {store.store_name}
          </h1>

          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            {store.tagline || 'We are here to help you with pickup schedules, garment care queries, and order updates.'}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Store Timing: {store.opening_hours}</span>
          </div>
        </div>
      </div>

      {/* 2. Direct One-Tap Contact Actions (Grid 3 on desktop, 1 on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Direct Call */}
        <a
          href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Phone className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Call Hotline
            </span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate group-hover:text-sky-600 transition">
              {store.phone}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">Tap to call store</span>
          </div>
        </a>

        {/* WhatsApp Chat */}
        <a
          href={`https://wa.me/${cleanPhone}?text=Hi%20WashFlow,%20I%20need%20help%20with%20my%20laundry%20order`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              WhatsApp Support
            </span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate group-hover:text-emerald-600 transition">
              {store.whatsapp_number || store.phone}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600">Live chat on WhatsApp</span>
          </div>
        </a>

        {/* Email Support */}
        <a
          href={`mailto:${store.email}?subject=Laundry%20Order%20Assistance`}
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition flex items-center gap-3.5 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Mail className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Official Email
            </span>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate group-hover:text-indigo-600 transition">
              {store.email}
            </p>
            <span className="text-[11px] font-semibold text-indigo-600">Send an email</span>
          </div>
        </a>
      </div>

      {/* 3. Physical Store Location & Timing Details */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                Physical Store & Washing Facility
              </h2>
              <p className="text-xs text-slate-400">Visit our hub or send clothes via doorstep pickup</p>
            </div>
          </div>

          {store.map_link && (
            <a
              href={store.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
              <span>Google Maps Directions</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Address Details */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Address & Postal Code
            </span>
            <p className="text-sm font-bold text-slate-800 leading-relaxed">
              {store.address}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {store.city && `${store.city}, `}
              {store.state && `${store.state} `}
              {store.pincode && `- ${store.pincode}`}
            </p>
          </div>

          {/* Operating Schedule */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Working Hours & Slots
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{store.opening_hours}</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Doorstep Pickup & Delivery Runs All 7 Days</span>
            </p>
          </div>
        </div>

        {/* Customer Assistance Notes */}
        {store.support_notes && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-0.5">📌 Store Policy & Assistance Note:</strong>
            {store.support_notes}
          </div>
        )}
      </div>

      {/* 4. Quality Guarantees Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Zero-Mix Separate Wash Guarantee</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            Need urgent laundry cleaned or special stain treatment?
          </h3>
          <p className="text-xs text-slate-400">
            Our master washers and steam pressing experts are ready to assist you.
          </p>
        </div>

        {onBookClick && (
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          >
            <span>Book Laundry Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

