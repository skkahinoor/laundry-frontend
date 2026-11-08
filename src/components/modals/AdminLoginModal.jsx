import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, AlertCircle, X, ArrowRight, Sparkles } from 'lucide-react';
import { authApi } from '../../api';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('owner@washflow.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authApi.login({ email: email.trim(), password });
      if (res.success && res.user) {
        if (res.user.role !== 'admin') {
          setErrorMsg('Access Denied: This portal is restricted to Store Owners / Super Admins only.');
          setLoading(false);
          return;
        }
        onLoginSuccess(res.user, res.token);
        onClose();
      } else {
        setErrorMsg(res.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Cannot reach Laravel API at http://127.0.0.1:8000. Please ensure "php artisan serve" is running.');
      } else {
        setErrorMsg(
          err.response?.data?.message || 'Invalid admin email or password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('owner@washflow.in');
    setPassword('password123');
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
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Security Gateway
              </span>
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">Admin & Store Owner Login</h2>
            <p className="text-xs text-slate-300 mt-1">
              Protected access to financial reports, gross margin calculations, staff payroll & store control.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-7">
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@washflow.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Fill Demo Admin: owner@washflow.in (password123)</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-slate-800 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-900/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating Owner...' : 'Access Admin Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[11px] text-slate-400">
                Are you a staff member or delivery rider?{' '}
                <span className="font-semibold text-slate-600">Please use the Staff Portal.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

