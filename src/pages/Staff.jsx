import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Eye,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Staff({
  staffList,
  onViewStaff,
  setShowStaffModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const roles = ['All', 'Washer', 'Iron', 'Rider', 'Operator'];

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' ||
      s.role.toLowerCase().includes(roleFilter.toLowerCase());

    return matchesSearch && matchesRole;
  });

  const totalMonthlyPayroll = staffList.reduce((acc, s) => acc + (Number(s.baseSalary) || 0), 0);

  return (
    <motion.div
      key="staff-directory"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Team Management
          </span>
          <h2 className="text-xl font-bold mt-0.5">Staff Members & Operations Team</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage your store washers, ironing specialists, and delivery riders. View detailed staff profiles, banking credentials, and attendance records.
          </p>
        </div>

        <button
          onClick={() => setShowStaffModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Staff</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{staffList.length}</p>
          <span className="text-[11px] text-slate-500">Active roster members</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Active On Duty</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{staffList.length}</p>
          <span className="text-[11px] text-slate-500">Available for operations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-sky-600 block">Total Base Payroll</span>
          <p className="text-xl font-bold text-sky-700 mt-1">₹{totalMonthlyPayroll.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500">Monthly salary budget</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-indigo-600 block">Payout Mode</span>
          <p className="text-xl font-bold text-indigo-700 mt-1">Bank / UPI</p>
          <span className="text-[11px] text-slate-500">Direct salary transfer</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Role Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'All' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-4 px-5">Staff Member</th>
                <th className="py-4 px-4">Contact Info</th>
                <th className="py-4 px-4">Residential Address</th>
                <th className="py-4 px-4">Base Salary</th>
                <th className="py-4 px-4">Bank Payout Info</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStaff.map((stf) => (
                <tr key={stf.id} className="hover:bg-slate-50/80 transition">
                  {/* Avatar & Name & Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {stf.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{stf.name}</p>
                        <span className="text-xs font-semibold text-sky-700 block mt-0.5">{stf.role}</span>
                        <span className="text-[10px] text-slate-400">Joined: {stf.joiningDate || 'Recently'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-slate-800 font-semibold flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{stf.phone || '-'}</span>
                      </p>
                      {stf.email && (
                        <p className="text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[160px]">{stf.email}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 max-w-xs text-xs text-slate-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">{stf.address || 'Address on file'}</span>
                    </div>
                  </td>

                  {/* Base Salary */}
                  <td className="py-4 px-4">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{Number(stf.baseSalary || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold">per month</span>
                  </td>

                  {/* Bank & UPI */}
                  <td className="py-4 px-4 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block truncate max-w-[180px]">
                        {stf.bankName || 'HDFC Bank'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 block truncate max-w-[180px]">
                        A/C: {stf.accountNumber || '••••••••'}
                      </span>
                      {stf.upiId && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5 inline-block truncate max-w-[180px]">
                          UPI: {stf.upiId}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions: View Profile */}
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => onViewStaff(stf)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition"
                      title="View Staff Profile & Full Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No staff members match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

