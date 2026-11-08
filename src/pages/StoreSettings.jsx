import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react';
import { storeSettingsApi } from '../api';

const DEFAULT_SETTINGS = {
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

export default function StoreSettings({ showToast }) {
  const [formData, setFormData] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await storeSettingsApi.getSettings();
      const data = res?.store || res?.data || res;
      if (data && data.store_name) {
        setFormData({
          store_name: data.store_name || DEFAULT_SETTINGS.store_name,
          tagline: data.tagline || DEFAULT_SETTINGS.tagline,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          whatsapp_number: data.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
          email: data.email || DEFAULT_SETTINGS.email,
          address: data.address || DEFAULT_SETTINGS.address,
          city: data.city || DEFAULT_SETTINGS.city,
          state: data.state || DEFAULT_SETTINGS.state,
          pincode: data.pincode || DEFAULT_SETTINGS.pincode,
          opening_hours: data.opening_hours || DEFAULT_SETTINGS.opening_hours,
          map_link: data.map_link || DEFAULT_SETTINGS.map_link,
          support_notes: data.support_notes || DEFAULT_SETTINGS.support_notes,
        });
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await storeSettingsApi.updateSettings(formData);
      if (res?.success || res?.store) {
        setSaveSuccess(true);
        if (showToast) {
          showToast('Store Settings Updated', 'Changes are now live in Customer Portal & Support!');
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save store settings:', err);
      if (showToast) {
        showToast('Update Failed', 'Please check server connection and try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Page Header */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Store Settings & Brand Information
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure store details displayed in the Customer Portal Support page and mobile bottom navigation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Reload settings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 active:scale-95 disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Store Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Store Brand Info */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Brand & Name</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store / Hub Name *</label>
              <input
                type="text"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                placeholder="e.g. WashFlow Laundry & Dry Cleaning Hub"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Sub-heading</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                placeholder="e.g. Smart On-Demand Doorstep Laundry & Express Steam Press"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours *</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  placeholder="e.g. 08:00 AM - 09:00 PM (Monday - Sunday)"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Contact Helplines */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Direct Contact & Helplines</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Calling Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Support Number *</label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Customers can 1-tap open direct WhatsApp chat from their dashboard.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Support Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  placeholder="e.g. support@washflow.in"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Physical Address & Location */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-rose-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Physical Store Address & Location</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Store Address *</label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
              placeholder="e.g. 12/4 Laundry Hub, 100ft Road, Indiranagar, Bengaluru, KA 560038"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 transition"
                placeholder="Bengaluru"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 transition"
                placeholder="Karnataka"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 transition"
                placeholder="560038"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Link (Optional)</label>
            <div className="relative">
              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="url"
                name="map_link"
                value={formData.map_link}
                onChange={handleChange}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 transition"
                placeholder="https://maps.google.com/?q=..."
              />
            </div>
          </div>
        </div>

        {/* Card 4: Support Notes */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Info className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Support Notes & Customer Instructions</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Assistance Message</label>
            <textarea
              name="support_notes"
              rows={3}
              value={formData.support_notes}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500 transition"
              placeholder="e.g. Complimentary doorstep pickup and drop within 48 hours for all orders."
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-sky-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Store Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

