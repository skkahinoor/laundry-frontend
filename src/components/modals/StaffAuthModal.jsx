import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Lock,
  Mail,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { authApi } from '../../api';

export default function StaffAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [loginEmail, setLoginEmail] = useState('ramesh@washflow.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (res.success && res.user) {
        if (res.user.role !== 'staff' && res.user.role !== 'admin') {
          setErrorMsg('This portal is for Staff and Laundry Operations team only.');
          setLoading(false);
          return;
        }
        onAuthSuccess(res.user, res.token);
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid staff credentials.');
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Cannot reach Laravel API at http://127.0.0.1:8000.');
      } else {
        setErrorMsg(
          err.response?.data?.message || 'Login failed. Please check your staff email and password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fillStaff = (email) => {
    setLoginEmail(email);
    setLoginPassword('password123');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                Operations Team
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">Staff & Rider Login</h2>
            <p className="text-xs text-sky-100/90 mt-1">
              Sign in with your staff account created by Admin to access the operational pipeline and your payout settings.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7">
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ramesh@washflow.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter staff password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Demo Accounts Quick Fill */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-600" /> Quick Demo Staff Login:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => fillStaff('ramesh@washflow.in')}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 font-semibold text-slate-700"
                  >
                    Ramesh (Washer)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillStaff('deepak@washflow.in')}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 font-semibold text-slate-700"
                  >
                    Deepak (Rider)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillStaff('suresh@washflow.in')}
                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 font-semibold text-slate-700"
                  >
                    Suresh (Iron)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Staff Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Staff accounts are provisioned exclusively by the Store Owner.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
