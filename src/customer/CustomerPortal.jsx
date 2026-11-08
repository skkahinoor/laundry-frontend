import React, { useState, useEffect } from 'react';
import CustomerNavbar from './CustomerNavbar';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/CustomerOrders';
import BookService from './pages/BookService';
import CustomerProfile from './pages/CustomerProfile';
import CustomerSupport from './pages/CustomerSupport';
import CustomerAuthModal from './modals/CustomerAuthModal';
import { customerApi } from '../api';
import { Sparkles, Loader2, LogIn, ArrowRight } from 'lucide-react';

export default function CustomerPortal({
  onGoHome,
  onLogoutSuccess,
  initialTab = 'dashboard',
  initialService = null,
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'dashboard' | 'orders' | 'book' | 'profile'
  const [selectedService, setSelectedService] = useState(initialService);

  // User & Profile State
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const stored = localStorage.getItem('washflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('washflow_customer');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [ordersData, setOrdersData] = useState({ active: [], delivered: [] });
  const [loading, setLoading] = useState(true);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Coupon selected from dashboard to pre-fill in booking page
  const [selectedCoupon, setSelectedCoupon] = useState('');

  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('washflow_token');
    if (token) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes, profileRes] = await Promise.allSettled([
        customerApi.getDashboard(),
        customerApi.getOrders(),
        customerApi.getProfile(),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
        setDashboardData(dashRes.value);
        if (dashRes.value.customer) {
          setCustomerProfile(dashRes.value.customer);
          localStorage.setItem('washflow_customer', JSON.stringify(dashRes.value.customer));
        }
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) {
        setOrdersData({
          active: ordersRes.value.active || [],
          delivered: ordersRes.value.delivered || [],
        });
      }

      if (profileRes.status === 'fulfilled' && profileRes.value?.success) {
        if (profileRes.value.user) {
          setCustomerUser(profileRes.value.user);
        }
        if (profileRes.value.customer) {
          setCustomerProfile(profileRes.value.customer);
        }
      }
    } catch (err) {
      console.error('Error fetching customer portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (user, customer) => {
    setCustomerUser(user);
    if (customer) {
      setCustomerProfile(customer);
    }
    setIsAuthModalOpen(false);
    fetchCustomerData();

    // If guest had added items to cart before registering, redirect straight to Book Laundry page!
    try {
      const savedCart = localStorage.getItem('washflow_cart');
      if (savedCart && JSON.parse(savedCart).length > 0) {
        setActiveTab('book');
      }
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('washflow_token');
    localStorage.removeItem('washflow_user');
    localStorage.removeItem('washflow_customer');
    setCustomerUser(null);
    setCustomerProfile(null);
    setDashboardData(null);
    setOrdersData({ active: [], delivered: [] });
    setActiveTab('dashboard');
    if (onLogoutSuccess) {
      onLogoutSuccess();
    } else if (onGoHome) {
      onGoHome();
    }
  };

  const handleApplyCouponFromDashboard = (code) => {
    setSelectedCoupon(code);
    setActiveTab('book');
  };

  const handleOrderSuccess = () => {
    setActiveTab('orders');
    fetchCustomerData();
  };

  // If user is not logged in, show enticing guest view or banner with Auth modal button
  const isGuest = !customerUser || customerUser.role !== 'customer';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Customer Navigation Bar */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customerUser={customerUser}
        onLogout={handleLogout}
        onGoHome={onGoHome}
        activeOrdersCount={ordersData.active.length}
      />

      {/* Guest Notice Banner if not logged in */}
      {isGuest && (
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white px-4 py-3 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>Welcome to WashFlow Laundry!</strong> Sign in to view live wash stage tracking, your past invoices, and book doorstep pickups.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-sky-800 font-bold text-xs hover:bg-sky-50 transition shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Customer Sign In</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-24 sm:pb-16">
        {loading && !dashboardData ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            <p className="text-sm font-medium">Loading your laundry profile...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <CustomerDashboard
                customerUser={customerUser}
                customerProfile={customerProfile}
                dashboardData={dashboardData}
                onBookClick={() => setActiveTab('book')}
                onOrdersClick={() => setActiveTab('orders')}
                onApplyCoupon={handleApplyCouponFromDashboard}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSelectServiceToBook={(srv) => {
                  setSelectedService(srv);
                  setActiveTab('book');
                }}
              />
            )}

            {activeTab === 'orders' && (
              <CustomerOrders
                activeOrders={ordersData.active}
                deliveredOrders={ordersData.delivered}
                onBookClick={() => setActiveTab('book')}
                onRefresh={fetchCustomerData}
              />
            )}

            {activeTab === 'book' && (
              <BookService
                customerProfile={customerProfile}
                onOrderSuccess={handleOrderSuccess}
                prefilledCoupon={selectedCoupon}
                prefilledService={selectedService}
                onOpenAuth={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {activeTab === 'profile' && (
              <CustomerProfile
                customerUser={customerUser}
                customerProfile={customerProfile}
                onProfileUpdated={(updatedCustomer) => {
                  setCustomerProfile(updatedCustomer);
                }}
                onLogout={handleLogout}
              />
            )}

            {activeTab === 'support' && (
              <CustomerSupport
                onBookClick={() => setActiveTab('book')}
              />
            )}
          </>
        )}
      </main>

      {/* Customer Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">WashFlow</span>
            <span>• Premium Doorstep Laundry & Dry Clean Network</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-sky-600 transition"
            >
              Address Preferences
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className="hover:text-sky-600 transition"
            >
              Order Tracking
            </button>
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="hover:text-sky-600 font-semibold transition"
              >
                WashFlow Home
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Customer Auth Modal (Login / Register) */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

