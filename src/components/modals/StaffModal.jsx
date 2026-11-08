import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building, Lock } from 'lucide-react';

export default function StaffModal({ show, onClose, onAddStaff }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    address: '',
    role: 'Washer & Stain Specialist',
    baseSalary: 5500,
    // Banking Details
    bankName: 'HDFC Bank',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onAddStaff({
      ...formData,
      staff_role: formData.role,
      base_salary: Number(formData.baseSalary),
      account_holder_name: formData.accountHolderName || formData.name,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      upi_id: formData.upiId || (formData.phone ? `${formData.phone}@upi` : ''),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="font-bold text-lg text-slate-900">Add New Staff Member</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Register staff profile, role, base salary, and bank details for salary payout.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* 1. Basic Information */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Personal & Login Info
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manoj Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email (For Login) *</label>
                  <input
                    type="email"
                    required
                    placeholder="manoj@washflow.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98000 11223"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Temporary Password</label>
                  <input
                    type="password"
                    placeholder="Default: password123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 12, Gali 3, Indiranagar, Bengaluru"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Employment & Salary */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Job Role & Salary
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Staff Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-sky-500"
                  >
                    <option>Washer & Stain Specialist</option>
                    <option>Steam Iron & Packaging Master</option>
                    <option>Dry Cleaning Operator</option>
                    <option>Pickup & Delivery Rider</option>
                    <option>Store Quality Assistant</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Base Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="6500"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payout & Banking Details */}
            <div className="space-y-3 pt-2 border-t border-slate-100 bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-600" /> Payout / Banking Credentials
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. State Bank of India / HDFC"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="As per bank passbook"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 501004928172"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SBIN0004521"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white uppercase font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 9800011223@upi or staff@okhdfcbank"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                Enroll Staff & Save Payout Info
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
