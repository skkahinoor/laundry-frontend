import React from 'react';
import {
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Home,
  Shield,
  Users,
  RefreshCw,
  Menu,
} from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Business Revenue & Net Profit Dashboard',
  pipeline: 'Live Laundry Order Progress Pipeline',
  orders: 'All Orders Directory (Day-Wise & Progress Synced)',
  customers: 'Customer Directory & Order History',
  services: 'Laundry Services & Pricing Rates',
  offers: 'Festive Offers, Holiday Deals & Coupons',
  staff: 'Staff Management & Operations Team',
  'staff-detail': 'Staff Profile & Banking Credentials',
  payroll: 'Month-Wise Staff Payroll & Salaries',
  leaves: 'Staff Leave Management & Deductions',
  payouts: 'My Salary Payouts & Receipts',
  profile: 'Staff Profile & Payout Bank Settings',
};

const PAGE_SUBTITLES = {
  dashboard: 'Real-time Total Revenue, Staff Salaries & Actual Net Profit',
  pipeline: 'Clean operational board with Full-Screen toggle & 3 Smart Laptop Views',
  orders: 'Filter orders by Day (Today, Yesterday, Date) & Pipeline Stage Tabs',
  customers: 'Manage customer accounts, addresses, and order history',
  services: 'Configure per-kg and per-piece laundry rates and turnaround time',
  offers: 'Create Festive, Holiday, and Coupon discounts',
  staff: 'Store roster, member contact info, roles, and attendance records',
  'staff-detail': 'Dedicated profile page with verified banking credentials & leave records',
  payroll: 'Month-wise staff salaries, leave deductions & salary payment transfer',
  leaves: 'Review staff time-off applications and specify salary deductions',
  payouts: 'Check monthly salary credits and payment methods',
  profile: 'Keep your personal contact and bank account details up to date for salary',
};

export default function Header({
  activePage,
  financials,
  apiConnected,
  currentUser,
  onLogout,
  onGoHome,
  onRefresh,
  isLoading,
  onOpenMobileMenu,
}) {
  const isStaff = currentUser?.role === 'staff';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-3 sticky top-0 z-20 shrink-0 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Hamburger (Mobile) + Title + Subtitle */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile 3-line hamburger menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 active:scale-95 transition shrink-0"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate tracking-tight">
              {PAGE_TITLES[activePage] || 'Operational Workspace'}
            </h1>
            <span
              className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full items-center gap-1 shrink-0 ${
                apiConnected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
              title={apiConnected ? 'Connected to Laravel 12 API' : 'Checking connection...'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              {apiConnected ? 'API Live' : 'Offline'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate hidden md:block">
            {PAGE_SUBTITLES[activePage] || 'Manage store laundry workflow'}
          </p>
        </div>
      </div>

      {/* Right: Actions, Badges & Logout */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Role Badge on Tablet & Desktop */}
        {isStaff && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Staff: {currentUser.staffRole || 'Operations'}</span>
          </div>
        )}

        {/* FINANCIAL PROFIT PILL: ONLY VISIBLE TO STORE OWNER / ADMIN ON LARGE SCREENS */}
        {isAdmin && (
          <div className="hidden xl:flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="text-emerald-700 font-semibold">Actual Net Profit: </span>
              <span className="font-bold text-emerald-900 text-xs">
                ₹{(financials?.actualProfitAfterPaidSalary || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Live Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            title="Refresh Live Data from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Live Sync</span>
          </button>
        )}

        {/* Go to Website Button */}
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1.5 transition"
            title="Go to WashFlow Public Website"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Website</span>
          </button>
        )}

        {/* Logged in User & Logout button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name || 'Authorized User'}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {currentUser?.role === 'admin' ? 'Store Owner' : 'Operations Staff'}
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition"
            title="Log Out of System"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
