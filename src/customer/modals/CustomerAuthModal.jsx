import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { customerApi } from '../../api';

export default function CustomerAuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('rahul.verma@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regPickupAddress, setRegPickupAddress] = useState('');
  const [regSameAddress, setRegSameAddress] = useState(true);
  const [regDeliveryAddress, setRegDeliveryAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await customerApi.login({
        email: loginIdentifier.trim(),
        email_or_phone: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (res.token && res.user) {
        onAuthSuccess(res.user, res.customer);
        onClose();
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (!err.response) {
        setErrorMsg('Cannot reach Laravel API at http://127.0.0.1:8000. Please ensure "php artisan serve" is running.');
      } else {
        setErrorMsg(
          err.response?.data?.message || 'Invalid email/phone or password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!regPickupAddress.trim()) {
      setErrorMsg('Please provide your pickup address.');
      setLoading(false);
      return;
    }

    if (!regSameAddress && !regDeliveryAddress.trim()) {
      setErrorMsg('Please provide your delivery address since it is different from pickup.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        password_confirmation: regPasswordConfirm,
        pickup_address: regPickupAddress.trim(),
        delivery_address: regSameAddress
          ? regPickupAddress.trim()
          : regDeliveryAddress.trim(),
        same_delivery_address: Boolean(regSameAddress),
      };

      const res = await customerApi.register(payload);
      if (res.token && res.user) {
        onAuthSuccess(res.user, res.customer);
        onClose();
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      const firstErr =
        err.response?.data?.errors &&
        Object.values(err.response.data.errors)[0]?.[0];
      setErrorMsg(
        firstErr ||
          err.response?.data?.message ||
          'Failed to create account. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setLoginIdentifier('rahul.verma@example.com');
    setLoginPassword('password123');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-4 sm:my-6"
        >
          {/* Top Header */}
          <div className="p-5 sm:p-7 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-100">
                Customer Hub
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {mode === 'login' ? 'Customer Sign In' : 'Create Laundry Account'}
            </h2>
            <p className="text-xs text-sky-100/90 mt-1 max-w-sm">
              {mode === 'login'
                ? 'Check live laundry stage, past invoices, and schedule free doorstep pickups.'
                : 'Sign up in 30 seconds for door-to-door laundry & dry clean pickups.'}
            </p>

            {/* Tab Selector */}
            <div className="mt-4 flex bg-black/20 p-1 rounded-2xl backdrop-blur-md text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition ${
                  mode === 'login'
                    ? 'bg-white text-sky-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-xl transition ${
                  mode === 'register'
                    ? 'bg-white text-sky-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                New Customer
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="rahul.verma@example.com or 9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      required
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
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                {/* Demo Fill */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Fill Demo Customer: Rahul Verma (password123)</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Signing in...' : 'Sign In to Customer Hub'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Anjali Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9812345678"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. anjali@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                {/* Primary Pickup Address */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Primary Pickup Address</span>
                  </label>
                  <textarea
                    rows={2}
                    value={regPickupAddress}
                    onChange={(e) => setRegPickupAddress(e.target.value)}
                    placeholder="House/Flat No., Street, Landmark, City..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                {/* Address Prompt Question */}
                <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-100 text-xs">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Are pickup & delivery addresses the same?</span>
                  </p>

                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="cust_reg_same_address"
                        checked={regSameAddress}
                        onChange={() => setRegSameAddress(true)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span className="font-semibold text-slate-700 text-[11px]">Yes, same</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="cust_reg_same_address"
                        checked={!regSameAddress}
                        onChange={() => setRegSameAddress(false)}
                        className="text-sky-600 focus:ring-sky-500"
                      />
                      <span className="font-semibold text-slate-700 text-[11px]">
                        No, keep different
                      </span>
                    </label>
                  </div>
                </div>

                {!regSameAddress && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Delivery Address</span>
                    </label>
                    <textarea
                      rows={2}
                      value={regDeliveryAddress}
                      onChange={(e) => setRegDeliveryAddress(e.target.value)}
                      placeholder="Secondary or office delivery address..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                      required={!regSameAddress}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-3"
                >
                  {loading ? 'Creating Account...' : 'Complete Customer Registration'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
