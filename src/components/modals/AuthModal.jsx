import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function AuthModal({
  show,
  onClose,
  authTab,
  setAuthTab,
  authForm,
  setAuthForm,
  onSubmit,
  onSwitchToCustomer,
}) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">WashFlow Auth Portal</h3>
              <p className="text-xs text-slate-500">Owner Admin Login & Staff Onboarding</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold mb-6">
            <button
              type="button"
              onClick={() => setAuthTab('admin_login')}
              className={`py-2 rounded-xl transition ${
                authTab === 'admin_login' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('staff_login')}
              className={`py-2 rounded-xl transition ${
                authTab === 'staff_login' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Login
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('staff_register')}
              className={`py-2 rounded-xl transition ${
                authTab === 'staff_register' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Staff Register
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {authTab === 'staff_register' ? (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raju Verma"
                    value={authForm.staffName}
                    onChange={(e) => setAuthForm({ ...authForm, staffName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98765 00000"
                      value={authForm.staffPhone}
                      onChange={(e) => setAuthForm({ ...authForm, staffPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Salary (₹)</label>
                    <input
                      type="number"
                      required
                      value={authForm.expectedSalary}
                      onChange={(e) => setAuthForm({ ...authForm, expectedSalary: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={authForm.staffRole}
                    onChange={(e) => setAuthForm({ ...authForm, staffRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-sky-500"
                  >
                    <option>Washer & Stain Specialist</option>
                    <option>Steam Iron & Packaging Master</option>
                    <option>Dry Cleaning Operator</option>
                    <option>Pickup & Delivery Rider</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={authForm.emailOrPhone}
                    onChange={(e) => setAuthForm({ ...authForm, emailOrPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition"
            >
              {authTab === 'admin_login' && 'Sign In as Laundry Owner'}
              {authTab === 'staff_login' && 'Sign In as Staff'}
              {authTab === 'staff_register' && 'Register Staff & Add to Payroll'}
            </button>

            {onSwitchToCustomer && (
              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500">
                  Are you a Customer looking to book laundry?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToCustomer();
                    }}
                    className="font-bold text-sky-600 hover:underline"
                  >
                    Go to Customer Portal
                  </button>
                </p>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

