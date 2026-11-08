import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  User,
  LogOut,
  Home,
  ShoppingBag,
  Headphones,
} from 'lucide-react';

export default function CustomerNavbar({
  activeTab,
  setActiveTab,
  customerUser,
  onLogout,
  onGoHome,
  activeOrdersCount = 0,
}) {
  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand Tag */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  WashFlow
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Customer
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Doorstep Laundry Hub</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on mobile - moved to native app bottom bar) */}
          <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-2xl text-xs font-bold gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>My Orders</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'book'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Book Laundry</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile & Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap ${
                activeTab === 'support'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Support & Store</span>
            </button>
          </div>

          {/* Quick Actions (Home & Logout on Mobile and Desktop) */}
          <div className="flex items-center gap-2">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                title="Return to Main Homepage"
              >
                <Home className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">WashFlow Home</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                {customerUser?.name ? customerUser.name[0] : 'U'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {customerUser?.name?.split(' ')[0] || 'Customer'}
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  {customerUser?.phone || customerUser?.email || ''}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition active:scale-95"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile App-Style Fixed Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-2 flex items-center justify-around safe-area-pb">
        {/* 1. Home / Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'dashboard'
              ? 'text-sky-600 font-extrabold'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
          {activeTab === 'dashboard' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5"></span>
          )}
        </button>

        {/* 2. My Orders with Active Badge */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'orders'
              ? 'text-sky-600 font-extrabold'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ClipboardList className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 rounded-full bg-sky-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">My Orders</span>
          {activeTab === 'orders' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5"></span>
          )}
        </button>

        {/* 3. Center Elevated Action Button (Book Laundry) */}
        <button
          onClick={() => setActiveTab('book')}
          className="flex flex-col items-center justify-center -mt-6 group transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-600/35 flex items-center justify-center border-2 border-white">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className={`text-[10px] mt-1 font-extrabold ${activeTab === 'book' ? 'text-sky-600' : 'text-slate-700'}`}>
            Book Pickup
          </span>
        </button>

        {/* 4. Profile & Addresses */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
            activeTab === 'profile'
              ? 'text-sky-600 font-extrabold'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5"></span>
          )}
        </button>

        {/* 5. Support & Store Info */}
        <button
          onClick={() => setActiveTab('support')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all relative ${
            activeTab === 'support'
              ? 'text-sky-600 font-extrabold'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Headphones className={`w-5 h-5 ${activeTab === 'support' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">Support</span>
          {activeTab === 'support' && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-0.5"></span>
          )}
        </button>
      </div>
    </>
  );
}
