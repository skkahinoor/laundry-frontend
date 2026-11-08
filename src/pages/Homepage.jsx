import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Shirt,
  Tag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  Phone,
  Star,
  ShoppingBag,
  Users,
  Lock,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  MapPin,
  Calendar,
  HelpCircle,
  ChevronDown,
  Droplets,
  Flame,
  PackageCheck,
  Award,
  MessageCircle,
  Menu,
  X,
  ExternalLink,
  LayoutDashboard,
  ClipboardList,
} from 'lucide-react';
import { servicesApi, couponsApi, customerApi } from '../api';
import OrderProgressStepper from '../customer/components/OrderProgressStepper';
import INITIAL_SERVICES from '../data/services';
import INITIAL_OFFERS from '../data/offers';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    city: 'Indiranagar, Bengaluru',
    rating: 5,
    role: 'Working Professional',
    comment:
      'WashFlow is an absolute lifesaver! The clothes come back smelling fresh, folded crisply in eco bags, and the live WhatsApp updates keep me informed at every stage.',
    service: 'Wash & Steam Iron',
  },
  {
    id: 2,
    name: 'Arjun Nambiar',
    city: 'Koramangala, Bengaluru',
    rating: 5,
    role: 'Tech Consultant',
    comment:
      'Best dry cleaning experience in town. They handled my designer suit and heavy quilts with extraordinary care. Fast 48-hr turnaround and free doorstep pickup!',
    service: 'Suit Dry Clean & Steam Press',
  },
  {
    id: 3,
    name: 'Ananya Deshmukh',
    city: 'HSR Layout, Bengaluru',
    rating: 5,
    role: 'Entrepreneur',
    comment:
      'Transparent per-kg pricing with zero hidden charges. The rider arrived right on time during my selected morning slot. Highly recommended for busy families!',
    service: 'Daily Wash & Fold',
  },
  {
    id: 4,
    name: 'Vikramaditya Roy',
    city: 'Whitefield, Bengaluru',
    rating: 5,
    role: 'Senior Architect',
    comment:
      'The steam ironing quality is top-notch. Shirts are crisp without any shine marks or collar crushing. The customer dashboard makes reordering effortless.',
    service: 'Express Steam Press',
  },
];

const FAQS = [
  {
    q: 'How does free doorstep pickup & delivery work?',
    a: 'Simply choose your preferred laundry services, pick a date and convenient time slot (Morning, Afternoon, Evening, or 2-Hr Express), and enter your pickup address. Our uniformed rider arrives with secure bags, weighs or counts items in front of you, and brings them back fresh within 48 hours.',
  },
  {
    q: 'Are all customer clothes washed separately for hygiene?',
    a: 'Yes, 100%! We strictly follow a Zero-Mix Hygiene Policy. Your garments are never combined with another customer’s load. Each batch is treated with softened water, antibacterial rinse, and dermatologically tested eco-friendly detergents.',
  },
  {
    q: 'Can my pickup and delivery addresses be different?',
    a: 'Absolutely! Many of our customers schedule a morning pickup from home and evening delivery at their office (or vice-versa). You can configure separate pickup and delivery addresses with custom gate/security instructions directly on your dashboard.',
  },
  {
    q: 'What is the standard turnaround time?',
    a: 'Our standard turnaround is 48 hours for daily wash & iron. We also offer 24-hour express turnaround and 72-hour delicate dry cleaning for designer wear and heavy quilts.',
  },
  {
    q: 'What payment modes are accepted?',
    a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and direct card/net banking. You can pay securely upon delivery or during online order booking.',
  },
  {
    q: 'How do live order status updates work?',
    a: 'From the moment your rider picks up the bag, you can track every stage live on your Customer Dashboard: Placed → Picked Up → Washing & Spotting → Steam Iron & QC → Out for Delivery. Instant WhatsApp alerts keep you informed automatically.',
  },
];

export default function Homepage({
  onOpenCustomerAuth,
  onOpenStaffAuth,
  onOpenAdminAuth,
  onDirectBook,
  currentUser,
  onGoToCustomerPortal,
}) {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Testimonial Slider State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const isCustomerLoggedIn = currentUser?.role === 'customer';
  const [activeCustomerOrders, setActiveCustomerOrders] = useState([]);

  // Fetch live active orders on homepage if logged in as customer
  useEffect(() => {
    if (currentUser?.role === 'customer') {
      customerApi
        .getOrders()
        .then((res) => {
          const active = res?.active || [];
          setActiveCustomerOrders(active);
        })
        .catch((err) => {
          console.warn('Could not fetch active customer orders on homepage:', err);
        });
    } else {
      setActiveCustomerOrders([]);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-advance testimonial slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [sRes, oRes] = await Promise.allSettled([
        servicesApi.getServices(),
        couponsApi.getCoupons(),
      ]);

      if (sRes.status === 'fulfilled' && (sRes.value?.data || sRes.value?.services || sRes.value)) {
        const raw = sRes.value?.services || sRes.value?.data || sRes.value;
        if (Array.isArray(raw) && raw.length > 0) {
          setServices(raw);
        }
      }

      if (oRes.status === 'fulfilled' && (oRes.value?.data || oRes.value?.coupons || oRes.value)) {
        const rawO = oRes.value?.coupons || oRes.value?.data || oRes.value;
        if (Array.isArray(rawO) && rawO.length > 0) {
          setOffers(rawO);
        }
      }
    } catch (err) {
      console.warn('Using initial fallback on homepage:', err);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleBookService = (srv = null) => {
    if (srv) {
      try {
        const item = {
          service_id: srv.id,
          name: srv.name,
          pricing_type: srv.pricing_type || (srv.unit?.includes('Piece') ? 'pc' : 'kg'),
          price: parseFloat(srv.price || srv.pricePerKg || srv.pricePerPiece || 80),
          qty_or_kg: (srv.pricing_type === 'kg' || srv.unit?.includes('Kg')) ? 2 : 1,
        };
        const existing = localStorage.getItem('washflow_cart');
        const cartArr = existing ? JSON.parse(existing) : [];
        if (!cartArr.some((c) => c.service_id === srv.id)) {
          cartArr.push(item);
          localStorage.setItem('washflow_cart', JSON.stringify(cartArr));
        }
      } catch (e) {}
    }
    if (isCustomerLoggedIn && onGoToCustomerPortal) {
      onGoToCustomerPortal('book', srv);
    } else if (onDirectBook) {
      onDirectBook(srv);
    } else {
      onOpenCustomerAuth();
    }
  };

  const serviceCategories = ['All', ...new Set(services.map((s) => s.category || 'Daily Laundry'))];

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => (s.category || 'Daily Laundry') === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* ========================================================= */}
      {/* 1. TOP NOTIFICATION / ANNOUNCEMENT STRIP */}
      {/* ========================================================= */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="bg-sky-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
              Special
            </span>
            <span className="font-medium text-slate-200 truncate">
              Flat 25% OFF on your first doorstep pickup with code{' '}
              <strong className="text-sky-400 font-bold underline">FESTIVE25</strong>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-slate-400 shrink-0">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> +91 98765 43210
            </a>
            <span>• 8:00 AM - 9:00 PM Everyday</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MINIMAL & ADVANCED NAVBAR */}
      {/* ========================================================= */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">WashFlow</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                  Laundry Hub
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Doorstep Laundry & Dry Cleaning
              </p>
            </div>
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-sky-600 transition">
              Services & Rates
            </a>
            <a href="#how-it-works" className="hover:text-sky-600 transition">
              How It Works
            </a>
            <a href="#offers" className="hover:text-sky-600 transition">
              Offers
            </a>
            <a href="#testimonials" className="hover:text-sky-600 transition">
              Reviews
            </a>
            <a href="#faq" className="hover:text-sky-600 transition">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Staff Portal Link (Desktop only) */}
            <button
              onClick={onOpenStaffAuth}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition active:scale-95"
              title="Staff Operations Portal"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Staff Portal</span>
            </button>

            {/* Admin Login Link (Desktop only) */}
            <button
              onClick={onOpenAdminAuth}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-900 text-xs font-bold transition active:scale-95"
              title="Admin & Store Owner Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-700" />
              <span>Admin</span>
            </button>

            {/* Customer CTA Button (Desktop only - on mobile screens it is cleanly placed inside the hamburger drawer) */}
            {isCustomerLoggedIn ? (
              <button
                onClick={() => onGoToCustomerPortal && onGoToCustomerPortal('dashboard')}
                className="hidden lg:flex px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Portal ({currentUser?.name?.split(' ')[0]})</span>
              </button>
            ) : (
              <button
                onClick={onOpenCustomerAuth}
                className="hidden lg:flex px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition items-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Login / Book</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu (Houses all logins & navigation on mobile) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 mt-3 pt-3 space-y-3 overflow-hidden"
            >
              {/* Primary Mobile Customer Action Button */}
              <div>
                {isCustomerLoggedIn ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToCustomerPortal && onGoToCustomerPortal('dashboard');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Customer Portal ({currentUser?.name?.split(' ')[0]})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCustomerAuth();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Customer Login / Book Pickup</span>
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-700 border-t border-slate-100 pt-2 pb-1">
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Services & Rates
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  How It Works
                </a>
                <a
                  href="#offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Festive Offers
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Customer Reviews
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  Frequently Asked Questions
                </a>
              </div>

              {/* Staff Portal & Admin Login inside Mobile Menu */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStaffAuth();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Staff Portal</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminAuth();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-100 active:scale-95 transition"
                >
                  <Lock className="w-4 h-4 text-indigo-700" />
                  <span>Admin Login</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================= */}
      {/* 2.5 LIVE ACTIVE ORDER TRACKING (FOR LOGGED-IN CUSTOMERS WITH ACTIVE ORDERS) */}
      {/* ========================================================= */}
      {isCustomerLoggedIn && activeCustomerOrders.length > 0 && (
        <section className="bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900 text-white py-6 sm:py-8 px-4 sm:px-8 border-b border-sky-500/30 shadow-xl relative overflow-hidden">
          {/* Subtle glowing ambient lights */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6">
            {/* Section Header with live pulsating status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold">
                  <Truck className="w-3.5 h-3.5 text-sky-300" />
                  <span>Live Laundry Status</span>
                </div>
                <span className="text-xs text-sky-200/50 hidden sm:inline">•</span>
                <span className="text-xs text-sky-200/90 font-medium hidden sm:inline">
                  Real-time pipeline tracking synced directly with our washing hub
                </span>
              </div>

              <div className="text-xs text-sky-300 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Orders: <strong className="text-white font-extrabold">{activeCustomerOrders.length}</strong></span>
              </div>
            </div>

            {/* Orders Cards List */}
            <div className="space-y-4">
              {activeCustomerOrders.map((ord) => {
                const items = ord.items || [];
                const totalBill = ord.final_amount || ord.netRevenue || ord.totalAmount || 0;
                const orderCode = ord.order_id_string || (ord.id ? `#WF-${ord.id}` : 'Order');

                return (
                  <div
                    key={ord.id}
                    className="bg-white text-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 space-y-4"
                  >
                    {/* Order Top Bar: Order ID, Date & Amount */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-sky-700 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
                          {orderCode}
                        </span>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ord.order_date || ord.orderDate || ord.createdAt || 'Today'}
                        </span>
                        {ord.pickup_time_slot && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg font-medium">
                            Slot: {ord.pickup_time_slot}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          In Processing ({ord.stage ? ord.stage.replace('_', ' ').toUpperCase() : 'PLACED'})
                        </span>
                        <span className="text-lg sm:text-xl font-black text-slate-900">
                          ₹{Number(totalBill).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Live Progress Stepper */}
                    <div className="bg-slate-50/80 p-3.5 sm:p-5 rounded-2xl border border-slate-100 overflow-x-auto">
                      <OrderProgressStepper stage={ord.stage || 'placed'} />
                    </div>

                    {/* Summary Info: Items and Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-slate-600">
                      {/* Clothes/Services in Order */}
                      <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100/80">
                        <span className="font-bold text-sky-900 block mb-1">
                          📦 Clothes / Services in this Order:
                        </span>
                        {items.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {items.map((it, idx) => (
                              <span
                                key={idx}
                                className="bg-white px-2.5 py-1 rounded-lg border border-sky-200 text-slate-700 font-semibold text-[11px]"
                              >
                                {it.service_name || it.name || 'Laundry Item'} ({it.qty_or_kg || 1} {it.unit || 'kg'})
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Scheduled for hub pickup</span>
                        )}
                      </div>

                      {/* Pickup/Delivery and Payment Details */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-1.5">
                        <div>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mb-0.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-600" />
                            Doorstep Pickup & Delivery:
                          </span>
                          <p className="text-slate-600 line-clamp-1">
                            {ord.pickup_address || ord.delivery_address || 'Customer Registered Address'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-semibold text-slate-500">
                          <span>Turnaround: <strong className="text-sky-700">{ord.turnaround || '48-Hour Fresh Delivery'}</strong></span>
                          <span>Payment: <strong className={ord.payment_status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{ord.payment_status || 'Pay on Delivery'}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons: Open Dashboard & Open Orders */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onGoToCustomerPortal && onGoToCustomerPortal('dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-sky-900 hover:bg-sky-50 font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-sky-600" />
                <span>Open Dashboard</span>
              </button>
              <button
                onClick={() => onGoToCustomerPortal && onGoToCustomerPortal('orders')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-800/80 hover:bg-sky-800 text-white border border-sky-400/30 font-black text-xs sm:text-sm backdrop-blur-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md"
              >
                <ClipboardList className="w-4 h-4 text-sky-300" />
                <span>Open Orders</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 3. HERO SECTION (MINIMAL, ADVANCED, MODERN) */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-28 bg-gradient-to-b from-sky-50/70 via-slate-50/40 to-white">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-sky-400/15 via-blue-400/10 to-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Smart On-Demand Laundry & Dry Cleaning</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Professional Laundry Cleaned, Pressed & Delivered in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">
                48 Hours
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-sm sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Never worry about washing, drying, or ironing again. Schedule a free doorstep pickup, track washing & steam pressing live on WhatsApp, and enjoy fresh, crisp clothes delivered to your doorstep.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => handleBookService()}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-sky-600/25 transition flex items-center justify-center gap-2.5 group active:scale-95"
              >
                <span>Schedule Free Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:bg-slate-50 transition text-center"
              >
                Explore Services & Rates
              </a>
            </div>

            {/* Quick 4-Grid Trust Highlights */}
            <div className="pt-8 sm:pt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 text-left">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900">Free Pickup</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">At your preferred slot</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900">48-Hr Delivery</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Guaranteed turnaround</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900">Zero-Mix Hygiene</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">100% separate wash</p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900">4.9★ Rated</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">50,000+ clothes cleaned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. THE WASHFLOW ADVANTAGE (WHY CHOOSE US) */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              The WashFlow Quality Standard
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Why 10,000+ Households Choose WashFlow
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Engineered with world-class laundry equipment, softened water, and strict hygiene protocols.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-lg line-clamp-2">
                Softened Water & Gentle Eco-Detergents
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Hard water damages fabrics and causes fading. We use multi-stage softened water with pH-neutral eco detergents that protect fabric fibers.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-lg line-clamp-2">
                Vacuum Steam Pressing & QC
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed line-clamp-3 sm:line-clamp-none">
                No burning irons. Italian vacuum steam tables remove wrinkles, eliminate bacteria, and give sharp, crisp collar and sleeve creases without fabric sheen.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-lg line-clamp-2">
                Live WhatsApp & Pipeline Tracking
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Never wonder where clothes are. Receive automated WhatsApp updates when your clothes are picked up, washed, inspected, and dispatched.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-lg line-clamp-2">
                Free Doorstep Pickup & 48-Hr Return
              </h3>
              <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed line-clamp-3 sm:line-clamp-none">
                Complimentary doorstep pickup and drop at your selected time slot. Fresh, hygienically packed clothes delivered right back to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SERVICES & TRANSPARENT PRICING RATE CARD */}
      {/* ========================================================= */}
      <section id="services" className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Clear & Transparent Rates
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Laundry & Dry Clean Services
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              No hidden fees. Select daily per-kg laundry or specialized per-piece garment dry cleaning.
            </p>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-1.5 mt-5 sm:mt-6 overflow-x-auto pb-1 scrollbar-none">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredServices.map((srv) => {
              const price = srv.price || srv.pricePerKg || srv.pricePerPiece || 0;
              const unit = srv.pricing_type || (srv.unit?.includes('Piece') ? 'Piece' : 'Kg');

              return (
                <div
                  key={srv.id}
                  className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/70 border border-slate-200/90 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sky-600 shadow-2xs">
                        <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-sky-100 text-sky-800">
                        {srv.turnaround || '48h'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xs sm:text-lg text-slate-900 line-clamp-1">{srv.name}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-2">
                      {srv.category || 'Professional wash with eco detergents & steam iron'}
                    </p>

                    <div className="mt-2.5 sm:mt-4 pb-2.5 sm:pb-4 border-b border-slate-200/80 flex items-baseline gap-1 sm:gap-1.5">
                      <span className="text-base sm:text-3xl font-black text-slate-900">
                        ₹{parseFloat(price).toFixed(0)}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                        / {unit}
                      </span>
                    </div>

                    <ul className="mt-2.5 sm:mt-3.5 space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-slate-600 font-medium">
                      <li className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">Gentle eco detergents</span>
                      </li>
                      <li className="flex items-center gap-1.5 sm:gap-2">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">WhatsApp tracking</span>
                      </li>
                      <li className="hidden sm:flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Neatly folded in dust-proof packaging</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBookService(srv)}
                    className="mt-3.5 sm:mt-6 w-full py-2 sm:py-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 font-bold text-[11px] sm:text-xs text-slate-700 shadow-2xs transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Book Service</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. HOW IT WORKS (4 CLEAN STEPS) */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-12 sm:py-22 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Simple 4-Step Flow
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              How WashFlow Works
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
              From dirty hampers to fresh, wrinkle-free clothes in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h3 className="font-extrabold text-white text-xs sm:text-base">Schedule Online</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Choose services, date, and time slot in 30 seconds from your phone.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                2
              </div>
              <h3 className="font-extrabold text-white text-xs sm:text-base">Doorstep Pickup</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Rider arrives with tagged laundry bags at your home or office.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                3
              </div>
              <h3 className="font-extrabold text-white text-xs sm:text-base">Wash & Steam Press</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Washed in softened water and vacuum steam pressed with zero shine.
              </p>
            </div>

            <div className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-2 sm:space-y-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-sky-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center shadow-md">
                4
              </div>
              <h3 className="font-extrabold text-white text-xs sm:text-base">Doorstep Delivery</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Delivered fresh, clean, and ready-to-wear within 48-hour window.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FESTIVE OFFERS & PROMO COUPONS */}
      {/* ========================================================= */}
      <section id="offers" className="py-12 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Savings & Promotions
            </span>
            <h2 className="text-xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Ongoing Festive Offers & Promo Deals
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Copy coupon code and apply during order checkout for instant discounts.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {offers.slice(0, 4).map((off) => {
              const code = off.code;
              const isCopied = copiedCode === code;
              const discountText =
                off.type === 'percentage'
                  ? `${off.discount_amount || off.discount || 25}% OFF`
                  : `₹${off.discount_amount || off.discount || 100} FLAT`;

              return (
                <div
                  key={off.id}
                  className="p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {off.category || 'Special'}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                        Min. ₹{off.minCart || off.min_cart || 499}
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-2xl text-slate-900">{discountText}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {off.name || 'Valid on all doorstep laundry pickups.'}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-3">
                    <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-[10px] sm:text-xs text-slate-800 tracking-wider">
                      {code}
                    </div>

                    <button
                      onClick={() => handleCopyCode(code)}
                      className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. TESTIMONIAL SLIDER / CAROUSEL (RESPONSIVE) */}
      {/* ========================================================= */}
      <section id="testimonials" className="py-14 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Verified Customer Reviews
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Loved by Busy Families & Professionals
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Over 50,000+ clothes cleaned with an average customer rating of 4.9 out of 5 stars.
            </p>
          </div>

          {/* Testimonial Card Display */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Service Tag */}
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {TESTIMONIALS[testimonialIndex].service}
                </span>
              </div>

              {/* Quote Text */}
              <p className="text-slate-800 text-sm sm:text-lg font-medium leading-relaxed italic min-h-[72px]">
                "{TESTIMONIALS[testimonialIndex].comment}"
              </p>

              {/* Author & Slider Controls */}
              <div className="mt-8 pt-5 border-t border-slate-200/70 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                    {TESTIMONIALS[testimonialIndex].name[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {TESTIMONIALS[testimonialIndex].name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {TESTIMONIALS[testimonialIndex].city} • {TESTIMONIALS[testimonialIndex].role}
                    </p>
                  </div>
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setTestimonialIndex(
                        (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                      )
                    }
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Previous Review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
                    }
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    title="Next Review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-6">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === testimonialIndex ? 'w-6 bg-sky-600' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      {/* ========================================================= */}
      <section id="faq" className="py-14 sm:py-24 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              Everything you need to know about our doorstep laundry service, hygiene protocols, and delivery.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 focus:outline-none"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100"
                      >
                        <p className="pt-3">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. HIGH-CONVERTING FINAL CTA BANNER */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Ready to Experience Stress-Free Laundry?
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Schedule Your Doorstep Pickup in 30 Seconds
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join thousands of happy customers who trust WashFlow for their daily clothes and premium dry cleaning. Free pickup, eco-wash, and 48-hour return.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => handleBookService()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Book Pickup Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. RESPONSIVE FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-slate-950 text-white pt-10 sm:pt-14 pb-8 px-4 sm:px-8 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Grid: 2 columns on mobile, 4 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-10 border-b border-slate-800/80">
            {/* Brand Details - Spans 2 cols on mobile */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">WashFlow</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Smart on-demand laundry, dry clean, and steam pressing operations with automated live WhatsApp tracking and guaranteed 48-hour doorstep return.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span>Open Today: 8:00 AM - 9:00 PM</span>
              </div>
            </div>

            {/* Quick Navigation - Column 1 on mobile */}
            <div className="col-span-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-3 sm:mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a href="#services" className="hover:text-white transition block">
                    Services & Rates
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition block">
                    4-Step Process
                  </a>
                </li>
                <li>
                  <a href="#offers" className="hover:text-white transition block">
                    Promo Offers
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition block">
                    Customer Reviews
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition block">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Portals & Access - Column 2 on mobile */}
            <div className="col-span-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-3 sm:mb-4">
                Portals
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={onOpenCustomerAuth}
                    className="hover:text-white transition text-left block"
                  >
                    Customer Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenStaffAuth}
                    className="hover:text-white transition text-left block"
                  >
                    Staff Operations
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAdminAuth}
                    className="hover:text-white transition text-left block"
                  >
                    Store Admin
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleBookService()}
                    className="text-sky-400 hover:text-sky-300 font-bold transition text-left block"
                  >
                    + Book Pickup
                  </button>
                </li>
              </ul>
            </div>

            {/* Customer Support & Contact */}
            <div className="col-span-2 md:col-span-1 space-y-2.5 pt-4 sm:pt-0 border-t border-slate-900 md:border-none">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-200 mb-3 sm:mb-4">
                Customer Support
              </h4>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>12/4 Laundry Hub, Indiranagar, Bengaluru, KA 560038</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white font-semibold">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Open 8:00 AM - 9:00 PM (All 7 Days)</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright and Legal Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3 text-center sm:text-left">
            <p>© 2026 WashFlow Laundry Systems. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-400">
              <span className="hover:text-slate-300 transition cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-300 transition cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-300 transition cursor-pointer">Hygienic Guarantee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
