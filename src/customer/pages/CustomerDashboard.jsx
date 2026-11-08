import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  ShoppingBag,
  Sparkles,
  Tag,
  ArrowRight,
  Ticket,
  Copy,
  Check,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Shirt,
  Plus,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import OrderProgressStepper from '../components/OrderProgressStepper';
import INITIAL_SERVICES from '../../data/services';
import { servicesApi } from '../../api';

export default function CustomerDashboard({
  customer,
  metrics,
  activeOrders = [],
  ongoingOffers = [],
  setActiveTab,
  showToast,
  customerUser,
  customerProfile,
  dashboardData,
  onBookClick,
  onOrdersClick,
  onApplyCoupon,
  onOpenAuth,
  onSelectServiceToBook,
}) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [dashboardServices, setDashboardServices] = useState(INITIAL_SERVICES);
  const [visibleServicesCount, setVisibleServicesCount] = useState(6);
  const [isLoadingMoreServices, setIsLoadingMoreServices] = useState(false);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isOfferHovered, setIsOfferHovered] = useState(false);

  const cust = customer || customerProfile || customerUser;
  const met = metrics || dashboardData?.metrics || {};
  const orders =
    activeOrders && activeOrders.length > 0
      ? activeOrders
      : dashboardData?.active_orders || [];
  const offers =
    ongoingOffers && ongoingOffers.length > 0
      ? ongoingOffers
      : dashboardData?.ongoing_offers || [];

  const goToBook = onBookClick || (() => setActiveTab && setActiveTab('book'));
  const goToOrders = onOrdersClick || (() => setActiveTab && setActiveTab('orders'));

  useEffect(() => {
    servicesApi.getServices().then((res) => {
      const list = res?.services || res?.data || (Array.isArray(res) ? res : []);
      if (list && list.length > 0) {
        setDashboardServices(list);
      }
    }).catch(() => {});
  }, []);

  // 1.5s Auto Slider for Deals & Coupons on Mobile
  useEffect(() => {
    if (!offers || offers.length <= 1 || isOfferHovered) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [offers, isOfferHovered]);

  const handlePrevOffer = () => {
    if (!offers || offers.length === 0) return;
    setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNextOffer = () => {
    if (!offers || offers.length === 0) return;
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
  };

  const handleLoadMoreServices = async () => {
    setIsLoadingMoreServices(true);
    try {
      const res = await servicesApi.getServices();
      const list = res?.services || res?.data || (Array.isArray(res) ? res : []);
      if (list && list.length > 0) {
        setDashboardServices(list);
      }
    } catch (e) {
      // fallback
    } finally {
      setTimeout(() => {
        setVisibleServicesCount((prev) => prev + 6);
        setIsLoadingMoreServices(false);
      }, 350);
    }
  };

  const handleCopy = (code, id) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    if (showToast) {
      showToast(`Copied Coupon: ${code}`, 'Applied automatically on booking!');
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6 sm:space-y-8"
    >
      {/* 1. Welcome Banner & Action CTA */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-sky-600/15 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
            Welcome to WashFlow
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">
            Hi, {cust?.name || 'Valued Customer'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-xl leading-relaxed">
            Track your live laundry in washing & steam ironing, discover festive discounts, and book hassle-free home pickup.
          </p>
        </div>

        <button
          onClick={goToBook}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 shrink-0 transition active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Book Laundry Pickup</span>
        </button>
      </div>

      {/* 2. Overview Metric Cards (2 Columns on Mobile, 4 on Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Spends */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-slate-400 block truncate">
              Total Spends
            </span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">
              ₹{(met?.total_spends || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-emerald-600 mt-0.5 truncate">
              {met?.delivered_orders_count || 0} completed
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ml-2">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-sky-600 block truncate">
              In Processing
            </span>
            <p className="text-lg sm:text-2xl font-black text-sky-700 mt-1 truncate">
              {met?.active_orders_count || orders.length}
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 truncate">
              Live in laundry
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 ml-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Orders History */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-amber-500 block truncate">
              Total Orders
            </span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">
              {(met?.total_orders_count || (met?.delivered_orders_count || 0) + (met?.active_orders_count || orders.length)) || 1}
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5 truncate">
              Lifetime requests
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 ml-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Ongoing Offers */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-indigo-500 block truncate">
              Active Deals
            </span>
            <p className="text-lg sm:text-2xl font-black text-indigo-900 mt-1 truncate">
              {offers.length} Deals
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-indigo-600 mt-0.5 truncate">
              Festive discounts
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ml-2">
            <Tag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* 3. ACTIVE ORDERS SPOTLIGHT (WITH PIPELINE STEPPER) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Active Laundry Orders (Live Status)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates directly synced with our washing and steam iron hub
            </p>
          </div>
          <button
            onClick={goToOrders}
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => {
              const items = ord.items || [];
              const totalItems = items.reduce(
                (sum, i) => sum + (Number(i.qty || i.qty_or_kg) || 0),
                0
              );

              return (
                <div
                  key={ord.id}
                  className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-3.5 sm:space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-lg">
                        #{ord.id || ord.order_id_string}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {totalItems} Items / Pcs
                      </span>
                      <span className="text-xs text-slate-400">
                        • {ord.order_date || ord.orderDate || ord.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {ord.payment_status || ord.paymentStatus || 'Pending COD'}
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ₹{(ord.final_amount || ord.netRevenue || ord.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  {items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                      {items.map((it, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]"
                        >
                          {it.qty || it.qty_or_kg}x {it.name || it.service_name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pipeline Stepper */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/70 overflow-x-auto">
                    <OrderProgressStepper stage={ord.stage} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1 gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>
                        Expected Delivery:{' '}
                        <strong className="text-slate-800">
                          {ord.expected_delivery || ord.expectedDelivery || 'In 48 Hours'}
                        </strong>
                      </span>
                    </div>

                    <span className="text-emerald-700 font-bold text-[11px]">
                      {ord.last_notified || ord.lastNotified || 'Auto updates enabled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">No Active Orders Right Now</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Schedule a pickup anytime and we'll take care of your laundry fresh & clean!
              </p>
            </div>
            <button
              onClick={goToBook}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition"
            >
              + Book Laundry Pickup
            </button>
          </div>
        )}
      </div>

      {/* 4. CURRENT ONGOING OFFERS & PROMOS (AUTO-SLIDER ON MOBILE WITH 1.5S DELAY) */}
      <div className="space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Current Ongoing Deals & Coupons
            </h3>
            <p className="text-xs text-slate-500">Copy code to apply during your booking checkout</p>
          </div>

          {/* Mobile Manual Next & Prev Controls */}
          {offers.length > 1 && (
            <div className="flex sm:hidden items-center gap-1 shrink-0">
              <button
                onClick={handlePrevOffer}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-90 transition shadow-2xs cursor-pointer"
                aria-label="Previous Offer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextOffer}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-90 transition shadow-2xs cursor-pointer"
                aria-label="Next Offer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* --- MOBILE VIEW: 1.5s Auto-Slider Card (< sm) --- */}
        {offers.length > 0 && (
          <div
            className="block sm:hidden relative"
            onMouseEnter={() => setIsOfferHovered(true)}
            onMouseLeave={() => setIsOfferHovered(false)}
            onTouchStart={() => setIsOfferHovered(true)}
            onTouchEnd={() => setIsOfferHovered(false)}
          >
            {(() => {
              const off = offers[currentOfferIndex] || offers[0];
              const discountLabel =
                off.discountType === 'percentage' || off.type === 'percentage'
                  ? `${off.discountValue || off.discount_amount}% OFF`
                  : `₹${off.discountValue || off.discount_amount} OFF`;

              return (
                <div
                  key={off.id || currentOfferIndex}
                  className="bg-white p-4 rounded-2xl border-2 border-sky-100 shadow-md shadow-sky-600/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {off.category || 'Special Deal'}
                      </span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {discountLabel}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 mt-2">
                      {off.title || off.name || 'Special Discount'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {off.description || 'Apply this promo code during booking.'}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="px-2.5 py-1 rounded-xl bg-slate-100 font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{off.code}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onApplyCoupon && (
                        <button
                          onClick={() => onApplyCoupon(off.code)}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition active:scale-95 cursor-pointer"
                        >
                          Use
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(off.code, off.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition active:scale-95 cursor-pointer"
                      >
                        {copiedCode === off.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Pagination Dots for Slider */}
            {offers.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2.5">
                {offers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentOfferIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentOfferIndex ? 'w-5 bg-sky-600' : 'w-1.5 bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- DESKTOP VIEW: Grid Layout (hidden on mobile) --- */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {offers.map((off) => {
            const discountLabel =
              off.discountType === 'percentage' || off.type === 'percentage'
                ? `${off.discountValue || off.discount_amount}% OFF`
                : `₹${off.discountValue || off.discount_amount} OFF`;

            return (
              <div
                key={off.id}
                className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {off.category || 'Special Deal'}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {discountLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2.5">
                    {off.title || off.name || 'Special Discount'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {off.description || 'Apply this promo code during booking.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-100 font-mono font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{off.code}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onApplyCoupon && (
                      <button
                        onClick={() => onApplyCoupon(off.code)}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold hover:bg-sky-100 transition active:scale-95"
                      >
                        Use
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(off.code, off.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition active:scale-95"
                    >
                      {copiedCode === off.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ALL SERVICES & PRICING RATE CARD */}
      <div className="space-y-3.5 sm:space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Laundry Services & Pricing Rate Card
            </h3>
            <p className="text-xs text-slate-500">Professional wash, steam press, and dry clean rates</p>
          </div>
          <button
            onClick={goToBook}
            className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Book Custom Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1 Row me 2 Services on Mobile, by default 6 displayed */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {dashboardServices.slice(0, visibleServicesCount).map((srv) => {
            const price = srv.price || srv.pricePerKg || srv.pricePerPiece || 0;
            const unit = srv.pricing_type || (srv.unit?.includes('Piece') ? 'Piece' : 'Kg');

            return (
              <div
                key={srv.id}
                className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Shirt className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {srv.turnaround || '48h'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">{srv.name}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {srv.category || 'Professional Laundry Care'}
                  </p>

                  <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1">
                    <span className="text-lg sm:text-2xl font-black text-slate-900">
                      ₹{parseFloat(price).toFixed(0)}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">
                      /{unit}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSelectServiceToBook) {
                      onSelectServiceToBook(srv);
                    } else {
                      goToBook();
                    }
                  }}
                  className="mt-3 sm:mt-4 w-full py-2 sm:py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white font-bold text-[11px] sm:text-xs transition flex items-center justify-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Service</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* AJAX Load More Button */}
        {visibleServicesCount < dashboardServices.length ? (
          <div className="pt-3 sm:pt-4 flex flex-col items-center justify-center gap-2">
            <button
              onClick={handleLoadMoreServices}
              disabled={isLoadingMoreServices}
              className="px-6 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-700 hover:text-sky-600 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition flex items-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              {isLoadingMoreServices ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  <span>Loading services...</span>
                </>
              ) : (
                <>
                  <span>Load More Services ({dashboardServices.length - visibleServicesCount} remaining)</span>
                  <ChevronDown className="w-4 h-4 text-sky-600" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400">
              Showing {Math.min(visibleServicesCount, dashboardServices.length)} of {dashboardServices.length} available services
            </p>
          </div>
        ) : (
          dashboardServices.length > 6 && (
            <div className="pt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span>All {dashboardServices.length} services loaded</span>
              <span>•</span>
              <button
                onClick={() => setVisibleServicesCount(6)}
                className="text-sky-600 font-semibold hover:underline cursor-pointer"
              >
                Show Less
              </button>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
