import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Users,
  ShoppingBag,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import {
  DEMO_ADMIN_USER,
  DEMO_STAFF_USERS,
  DEMO_CUSTOMER_USER,
} from '../mock/demoData';
import { initializeDemoStorage } from '../mock/mockApi';

export default function DemoFloatingBar({
  onSwitchToAdmin,
  onSwitchToStaff,
  onSwitchToCustomer,
  onGoHome,
  onDataReset,
}) {
  const [minimized, setMinimized] = useState(false);

  const handleResetData = () => {
    localStorage.removeItem('washflow_demo_orders');
    localStorage.removeItem('washflow_demo_services');
    localStorage.removeItem('washflow_demo_coupons');
    localStorage.removeItem('washflow_demo_customers');
    localStorage.removeItem('washflow_demo_staff');
    localStorage.removeItem('washflow_demo_leaves');
    localStorage.removeItem('washflow_demo_store_settings');
    localStorage.removeItem('washflow_cart');
    initializeDemoStorage();
    if (onDataReset) {
      onDataReset();
    }
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-2xl backdrop-blur-md border border-slate-700/80 transition-all active:scale-95 cursor-pointer"
          title="Open Live Demo Switcher"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Demo Switcher</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 max-w-[95vw]">
      <div className="bg-slate-900/95 text-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-lg border border-slate-700/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Badge & Title */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Live Preview</span>
        </div>

        {/* 1-Click Role Switchers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onSwitchToAdmin(DEMO_ADMIN_USER, 'demo-admin-token')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600/80 text-white text-[11px] font-bold border border-white/10 hover:border-indigo-400/50 transition active:scale-95 cursor-pointer"
            title="Log in as Store Owner / Superadmin"
          >
            <ShieldCheck className="w-3 h-3 text-indigo-300" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => onSwitchToStaff(DEMO_STAFF_USERS[0], 'demo-staff-token')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-blue-600/80 text-white text-[11px] font-bold border border-white/10 hover:border-blue-400/50 transition active:scale-95 cursor-pointer"
            title="Log in as Laundry Staff (Washer / Pipeline)"
          >
            <Users className="w-3 h-3 text-blue-300" />
            <span>Staff</span>
          </button>

          <button
            onClick={() => onSwitchToCustomer(DEMO_CUSTOMER_USER, DEMO_CUSTOMER_USER)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-600/80 text-white text-[11px] font-bold border border-white/10 hover:border-emerald-400/50 transition active:scale-95 cursor-pointer"
            title="Log in as Customer (Rahul Verma)"
          >
            <ShoppingBag className="w-3 h-3 text-emerald-300" />
            <span>Customer</span>
          </button>

          <button
            onClick={onGoHome}
            className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] font-bold border border-white/5 transition active:scale-95 cursor-pointer"
            title="Go to Public Homepage"
          >
            Home
          </button>
        </div>

        {/* Reset State Button */}
        <button
          onClick={handleResetData}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Reset Demo Data to Initial State"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Minimize Button */}
        <button
          onClick={() => setMinimized(true)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Minimize Demo Pill"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
