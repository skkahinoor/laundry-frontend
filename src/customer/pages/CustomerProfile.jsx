import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Save,
  Home,
  Building,
  LogOut,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { customerApi } from '../../api';

export default function CustomerProfile({
  customerUser,
  customerProfile,
  onProfileUpdated,
  onLogout,
}) {
  const [name, setName] = useState(customerUser?.name || customerProfile?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || customerProfile?.phone || '');
  const [email, setEmail] = useState(customerUser?.email || '');

  // Address logic: Crucial question asked by the system
  const [sameAddress, setSameAddress] = useState(
    customerProfile?.same_delivery_address ?? true
  );
  const [pickupAddress, setPickupAddress] = useState(
    customerProfile?.pickup_address || customerProfile?.address || ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    customerProfile?.delivery_address || customerProfile?.address || ''
  );
  const [notes, setNotes] = useState(customerProfile?.notes || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync when props change
  useEffect(() => {
    if (customerUser) {
      setName(customerUser.name || '');
      setEmail(customerUser.email || '');
      if (customerUser.phone) setPhone(customerUser.phone);
    }
    if (customerProfile) {
      if (customerProfile.name) setName(customerProfile.name);
      if (customerProfile.phone) setPhone(customerProfile.phone);
      setPickupAddress(customerProfile.pickup_address || customerProfile.address || '');
      setDeliveryAddress(
        customerProfile.delivery_address ||
          customerProfile.pickup_address ||
          customerProfile.address ||
          ''
      );
      if (customerProfile.same_delivery_address !== undefined) {
        setSameAddress(customerProfile.same_delivery_address);
      }
      if (customerProfile.notes) setNotes(customerProfile.notes);
    }
  }, [customerUser, customerProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Name is required.');
      setSaving(false);
      return;
    }

    if (!pickupAddress.trim()) {
      setErrorMsg('Pickup address is required.');
      setSaving(false);
      return;
    }

    if (!sameAddress && !deliveryAddress.trim()) {
      setErrorMsg('Please specify a delivery address since it is different from pickup.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        pickup_address: pickupAddress.trim(),
        delivery_address: sameAddress ? pickupAddress.trim() : deliveryAddress.trim(),
        same_delivery_address: Boolean(sameAddress),
        notes: notes.trim(),
      };

      const res = await customerApi.updateProfile(payload);
      if (res.success) {
        setSuccessMsg('Your profile and address preferences have been saved successfully!');
        if (onProfileUpdated) {
          onProfileUpdated(res.customer);
        }
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Something went wrong while saving your details.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            <User className="w-4 h-4" />
            <span>Account Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Addresses & Customer Profile
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your personal info and configure separate addresses for laundry pickup and delivery.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-2 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* SECTION 1: Personal Contact Info */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Contact Information</h2>
              <p className="text-xs text-slate-400">Used for pickup coordination & order tracking updates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone (WhatsApp updates)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 bg-slate-50 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Email is tied to your account login</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SYSTEM PROMPT & ADDRESS CONFIGURATION */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Address Preferences</h2>
              <p className="text-xs text-slate-400">Configure where we pick up and deliver your laundry</p>
            </div>
          </div>

          {/* CRITICAL QUESTION PROMPT: Explicit system requirement */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/70 mb-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Are pickup and delivery addresses the same, or should they be kept different?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Many customers like having their clothes picked up from home and delivered to their office, or vice-versa. Choose what fits your schedule best:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Option 1: Same address */}
              <div
                onClick={() => setSameAddress(true)}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  sameAddress
                    ? 'border-sky-600 bg-white shadow-md'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Same Address (Default)</p>
                      <p className="text-[11px] text-slate-500">Pickup & Delivery at identical address</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="profile_same_address"
                    checked={sameAddress}
                    onChange={() => setSameAddress(true)}
                    className="text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                </div>
              </div>

              {/* Option 2: Different addresses */}
              <div
                onClick={() => setSameAddress(false)}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  !sameAddress
                    ? 'border-indigo-600 bg-white shadow-md'
                    : 'border-slate-200 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Different Delivery Address</p>
                      <p className="text-[11px] text-slate-500">Deliver to Office, Hotel, or Branch</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="profile_same_address"
                    checked={!sameAddress}
                    onChange={() => setSameAddress(false)}
                    className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Input Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Primary Pickup Address</span>
              </label>
              <textarea
                rows={3}
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Flat / Villa No., Apartment Name, Street, Landmark, City, Pincode"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            {!sameAddress && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Separate Delivery Address</span>
                </label>
                <textarea
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Office / Secondary Address, Floor, Company Name, Landmark, City, Pincode"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required={!sameAddress}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Delivery Instructions & Gate Passes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Leave with security guard, call before ringing bell, ring flat 402"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Changes are securely synced with the WashFlow Rider dispatch system.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Profile & Addresses'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

