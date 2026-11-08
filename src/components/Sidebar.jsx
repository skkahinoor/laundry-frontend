import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  LayoutDashboard,
  Kanban,
  ClipboardList,
  Users,
  Shirt,
  Tag,
  Wallet,
  Plus,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
  CreditCard,
  UserCheck,
  UserCog,
  Building2,
  X,
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Profit & Dashboard', icon: LayoutDashboard },
  { id: 'pipeline', label: 'Order Pipeline', icon: Kanban, badgeColor: 'bg-sky-600 text-white' },
  { id: 'orders', label: 'All Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'services', label: 'Services & Pricing', icon: Shirt },
  { id: 'offers', label: 'Offers & Coupons', icon: Tag },
  { id: 'staff', label: 'Staff Management', icon: UserCog, badgeColor: 'bg-blue-600 text-white' },
  { id: 'payroll', label: 'Payroll & Salaries', icon: Wallet, badgeColor: 'bg-amber-500 text-white' },
  { id: 'leaves', label: 'Staff Leaves', icon: Calendar, badgeColor: 'bg-rose-500 text-white' },
  { id: 'store-settings', label: 'Store Settings', icon: Building2 },
];

const STAFF_NAV_ITEMS = [
  { id: 'pipeline', label: 'Order Pipeline', icon: Kanban, badgeColor: 'bg-sky-600 text-white' },
  { id: 'orders', label: 'All Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'services', label: 'Services & Rates', icon: Shirt },
  { id: 'leaves', label: 'My Leaves', icon: Calendar },
  { id: 'payouts', label: 'My Salary Payouts', icon: CreditCard },
  { id: 'profile', label: 'Payout Settings', icon: UserCheck },
];

export default function Sidebar({
  activePage,
  setActivePage,
  sidebarMinimized,
  setSidebarMinimized,
  pipelineFullScreen,
  currentUser,
  setShowNewOrderModal,
  getBadge,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const isAdmin = currentUser?.role === 'admin';
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : STAFF_NAV_ITEMS;

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE SLIDE-IN OFF-CANVAS DRAWER (< md) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative w-72 max-w-[85vw] bg-white h-full flex flex-col justify-between shadow-2xl z-10"
            >
              {/* Drawer Brand Header with Close (X) */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base text-slate-900">WashFlow</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {isAdmin ? 'Admin' : 'Staff'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">Laundry Suite</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile CTA */}
              <div className="p-3 border-b border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewOrderModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Laundry Order</span>
                </button>
              </div>

              {/* Scrollable Nav Items */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  const badge = getBadge(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActivePage(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                        isActive
                          ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200/60 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600 stroke-[2.5]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {badge !== null && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                            item.badgeColor
                              ? item.badgeColor
                              : isActive
                              ? 'bg-sky-600 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Pinned Bottom User Card in Mobile Drawer */}
              <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.2 rounded-full ${
                      isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isAdmin ? 'Store Owner' : 'Operations Staff'}
                  </span>
                  <p className="font-bold text-xs text-slate-900 truncate mt-1">
                    {currentUser?.name || 'Authorized User'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {isAdmin ? 'Super Admin & Owner' : currentUser?.staffRole || 'Washing Specialist'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. DESKTOP / TABLET FIXED DOCKED SIDEBAR (>= md) */}
      {/* ========================================================= */}
      <aside
        className={`bg-white border-r border-slate-200/80 shrink-0 h-screen sticky top-0 hidden md:flex flex-col justify-between z-30 transition-all duration-300 ${
          sidebarMinimized && !pipelineFullScreen
            ? 'w-20'
            : pipelineFullScreen
            ? 'hidden'
            : 'w-64 lg:w-72'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Logo & Minimize Toggle */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className={`flex items-center gap-3 ${sidebarMinimized ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              {!sidebarMinimized && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base tracking-tight text-slate-900">WashFlow</span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isAdmin ? 'Admin OS' : 'Staff Ops'}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {isAdmin ? 'Store Owner Suite' : 'Laundry Operations'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
              title={sidebarMinimized ? 'Expand Sidebar' : 'Minimize Sidebar'}
            >
              {sidebarMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary CTA: New Laundry Order */}
          <div className="p-3.5 shrink-0">
            {sidebarMinimized ? (
              <button
                type="button"
                onClick={() => setShowNewOrderModal(true)}
                className="w-12 h-12 mx-auto rounded-2xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-md transition"
                title="New Laundry Order"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewOrderModal(true)}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Laundry Order</span>
              </motion.button>
            )}
          </div>

          {/* Scrollable Navigation Menu (Internal Scroll Only) */}
          <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const badge = getBadge(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePage(item.id)}
                  title={item.label}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200/60 font-bold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  } ${sidebarMinimized ? 'justify-center px-2' : ''}`}
                >
                  <div className={`flex items-center gap-3 ${sidebarMinimized ? 'gap-0' : ''}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600 stroke-[2.5]' : 'text-slate-400'}`} />
                    {!sidebarMinimized && <span>{item.label}</span>}
                  </div>
                  {badge !== null && !sidebarMinimized && (
                    <span
                      className={`ml-2 text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pinned Bottom User Card: ALWAYS FIXED AT THE BOTTOM */}
        <div className="shrink-0 p-3 border-t border-slate-100 bg-white">
          <div className={`p-3 rounded-2xl bg-slate-50 border border-slate-200/80 ${sidebarMinimized ? 'text-center' : ''}`}>
            {!sidebarMinimized && (
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.2 rounded-full ${
                    isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isAdmin ? 'Store Owner' : 'Operations Staff'}
                </span>
              </div>
            )}
            <p className="font-bold text-xs text-slate-900 truncate">
              {currentUser?.name || 'Authorized User'}
            </p>
            {!sidebarMinimized && (
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {isAdmin ? 'Super Admin & Owner' : currentUser?.staffRole || 'Washing Specialist'}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
