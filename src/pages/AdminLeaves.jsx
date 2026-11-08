import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  FileText,
  DollarSign,
} from 'lucide-react';
import ReviewLeaveModal from '../components/modals/ReviewLeaveModal';

export default function AdminLeaves({
  leaves = [],
  onReviewLeave,
  isLoading,
}) {
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaveForReview, setSelectedLeaveForReview] = useState(null);

  const filteredLeaves = leaves.filter((l) => {
    const matchesTab = activeTab === 'all' || l.status === activeTab;
    const matchesSearch =
      !searchQuery ||
      (l.staff_name && l.staff_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.reason && l.reason.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'rejected').length;
  const totalDeductions = leaves
    .filter((l) => l.status === 'approved' && !l.is_paid)
    .reduce((sum, l) => sum + (Number(l.deduction_amount) || 0), 0);

  return (
    <motion.div
      key="admin-leaves"
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
            Staff Leave Management
          </span>
          <h2 className="text-xl font-bold mt-0.5">Staff Leave Requests & Payroll Deductions</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Review staff leave applications. Approve as paid leave or assign salary deductions that automatically reflect on monthly payroll.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-300 font-bold uppercase block">Pending Review</span>
            <span className="text-lg font-extrabold text-amber-300">{pendingCount} Request(s)</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Requests</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{leaves.length}</p>
          <span className="text-[11px] text-slate-500">All applications</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Pending Action</span>
          <p className="text-xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-500">Awaiting your approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Approved Leaves</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{approvedCount}</p>
          <span className="text-[11px] text-slate-500">Active approvals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Payroll Deductions</span>
          <p className="text-xl font-bold text-rose-600 mt-1">₹{totalDeductions.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-500">From unpaid leaves</span>
        </div>
      </div>

      {/* Controls Bar & Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
          {[
            { id: 'all', label: 'All Leaves', count: leaves.length },
            { id: 'pending', label: 'Pending', count: pendingCount, highlight: true },
            { id: 'approved', label: 'Approved', count: approvedCount },
            { id: 'rejected', label: 'Rejected', count: rejectedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  tab.highlight && tab.count > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Leaves Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
                <th className="py-4 px-5">Staff Member</th>
                <th className="py-4 px-4">Dates & Duration</th>
                <th className="py-4 px-4">Reason</th>
                <th className="py-4 px-4">Type & Deduction</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeaves.map((leave) => {
                const isApproved = leave.status === 'approved';
                const isPending = leave.status === 'pending';
                const isRejected = leave.status === 'rejected';

                return (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition">
                    {/* Staff */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                          {leave.staff_name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{leave.staff_name}</p>
                          <p className="text-[11px] text-slate-500">{leave.staff_role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 text-xs">
                        <span>{leave.start_date}</span>
                        {leave.start_date !== leave.end_date && <span> → {leave.end_date}</span>}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded inline-block mt-0.5">
                        {leave.days} Day(s)
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {leave.reason}
                      </p>
                      {leave.admin_notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Note: {leave.admin_notes}
                        </p>
                      )}
                    </td>

                    {/* Type & Deduction */}
                    <td className="py-4 px-4">
                      {isApproved ? (
                        leave.is_paid ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Paid Leave (₹0 Deduction)
                          </span>
                        ) : (
                          <div>
                            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 inline-block">
                              Unpaid Leave
                            </span>
                            <span className="block text-xs font-extrabold text-rose-600 mt-1">
                              -₹{Number(leave.deduction_amount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">Decided on approval</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isRejected && <XCircle className="w-3.5 h-3.5" />}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedLeaveForReview(leave)}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-sm ${
                          isPending
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isPending ? 'Review Leave' : 'Update Decision'}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No leave requests match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Leave Modal */}
      <ReviewLeaveModal
        leave={selectedLeaveForReview}
        isOpen={Boolean(selectedLeaveForReview)}
        onClose={() => setSelectedLeaveForReview(null)}
        onReviewSubmitted={onReviewLeave}
      />
    </motion.div>
  );
}

