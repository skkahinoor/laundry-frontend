import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  QrCode,
  CheckCircle2,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { payrollApi } from '../api';

export default function StaffProfile({ currentUser }) {
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    role: currentUser?.staffRole || 'Operations Staff',
    // Payout Bank Settings
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await payrollApi.getStaffProfile();
        if (res.user) {
          setProfile({
            name: res.user.name || '',
            email: res.user.email || '',
            phone: res.user.phone || '',
            address: res.user.address || '',
            role: res.user.staff_role || 'Operations Staff',
            bankName: res.user.bank_name || '',
            accountHolderName: res.user.account_holder_name || res.user.name || '',
            accountNumber: res.user.account_number || '',
            ifscCode: res.user.ifsc_code || '',
            upiId: res.user.upi_id || '',
          });
        }
      } catch (e) {
        console.warn('Failed to load staff profile:', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const res = await payrollApi.updateStaffProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        bank_name: profile.bankName,
        account_holder_name: profile.accountHolderName,
        account_number: profile.accountNumber,
        ifsc_code: profile.ifscCode,
        upi_id: profile.upiId,
      });
      setSuccessMsg('Profile and Payout Settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      alert('Failed to update profile: ' + (e.response?.data?.message || e.message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      key="staff-profile"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Staff Workspace
          </span>
          <h2 className="text-lg sm:text-xl font-bold mt-0.5">My Profile & Payout Settings</h2>
          <p className="text-xs text-slate-300 mt-1">
            Update your personal address and bank account details so admin can process your monthly salary.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl sm:rounded-2xl border border-white/15 flex items-center gap-2 text-xs font-bold shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role: {profile.role}</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        {/* SECTION 1: Personal Details */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile / Phone Number</label>
              <input
                type="text"
                required
                placeholder="+91 98111 22334"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Designated Store Role</label>
              <input
                type="text"
                disabled
                value={profile.role}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Home / Residential Address</label>
              <textarea
                rows={2}
                placeholder="Enter your complete home address..."
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PAYOUT SETTINGS (Bank Account & UPI) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-sky-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" /> Payout Settings (Bank Details For Salary)
            </h3>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              Direct Bank / UPI Transfer
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Ensure your account details are accurate so store management can transfer your monthly salary on time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. State Bank of India, HDFC Bank, ICICI"
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Holder Name</label>
              <input
                type="text"
                placeholder="Name as printed in passbook"
                value={profile.accountHolderName}
                onChange={(e) => setProfile({ ...profile, accountHolderName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Account Number</label>
              <input
                type="text"
                placeholder="e.g. 50100492817281"
                value={profile.accountNumber}
                onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. SBIN0004521"
                value={profile.ifscCode}
                onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 uppercase font-mono font-bold text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" /> UPI ID / VPA (Optional for Instant UPI Pay)
              </label>
              <input
                type="text"
                placeholder="e.g. 9811122334@upi or ramesh@okaxis"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-medium text-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Profile & Payout Settings'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

