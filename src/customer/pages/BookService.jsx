import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Trash2,
  Info,
  Check,
  Layers,
  Banknote,
  QrCode,
} from 'lucide-react';
import { servicesApi, couponsApi, customerApi } from '../../api';
import INITIAL_SERVICES from '../../data/services';

export default function BookService({
  customerProfile,
  onOrderSuccess,
  prefilledCoupon = '',
  prefilledService = null,
  onOpenAuth,
}) {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [loadingServices, setLoadingServices] = useState(false);
  // Initialize cart strictly from localStorage or empty array (never hardcoded 3kg/2kg)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('washflow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pickup details
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [pickupSlot, setPickupSlot] = useState('Morning (9:00 AM - 12:00 PM)');

  // Address logic: Crucial question asked by system
  const [sameAddress, setSameAddress] = useState(
    customerProfile?.same_delivery_address ?? true
  );
  const [pickupAddress, setPickupAddress] = useState(
    customerProfile?.pickup_address || customerProfile?.address || ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    customerProfile?.delivery_address || customerProfile?.address || ''
  );
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Coupon state
  const [couponCode, setCouponCode] = useState(prefilledCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  // Time slot options
  const timeSlots = [
    'Morning (9:00 AM - 12:00 PM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (5:00 PM - 8:00 PM)',
    'Express Priority (Within 2 Hours)',
  ];

  // Fetch available services
  useEffect(() => {
    loadServices();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cart && cart.length > 0) {
        localStorage.setItem('washflow_cart', JSON.stringify(cart));
      } else {
        localStorage.removeItem('washflow_cart');
      }
    } catch (e) {
      console.warn('LocalStorage cart sync error:', e);
    }
  }, [cart]);

  // Handle prefilled service passed from homepage or dashboard
  useEffect(() => {
    if (prefilledService) {
      setCart((prev) => {
        const exists = prev.find((item) => item.service_id === prefilledService.id);
        if (exists) return prev;
        const newItem = {
          service_id: prefilledService.id,
          name: prefilledService.name,
          pricing_type: prefilledService.pricing_type || (prefilledService.unit?.includes('Piece') ? 'pc' : 'kg'),
          price: parseFloat(prefilledService.price || prefilledService.pricePerKg || prefilledService.pricePerPiece || 80),
          qty_or_kg: (prefilledService.pricing_type === 'kg' || prefilledService.unit?.includes('Kg')) ? 2 : 1,
        };
        const updated = [...prev, newItem];
        try {
          localStorage.setItem('washflow_cart', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  }, [prefilledService]);

  // Update address defaults if customerProfile changes
  useEffect(() => {
    if (customerProfile) {
      if (!pickupAddress) {
        setPickupAddress(customerProfile.pickup_address || customerProfile.address || '');
      }
      if (!deliveryAddress) {
        setDeliveryAddress(
          customerProfile.delivery_address ||
            customerProfile.pickup_address ||
            customerProfile.address ||
            ''
        );
      }
      if (customerProfile.same_delivery_address !== undefined) {
        setSameAddress(customerProfile.same_delivery_address);
      }
    }
  }, [customerProfile]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const res = await servicesApi.getServices();
      const rawList = res?.services || res?.data || (Array.isArray(res) ? res : []);
      const sourceList = rawList && rawList.length > 0 ? rawList : INITIAL_SERVICES;

      const normalized = sourceList
        .filter((s) => s.is_active !== false && s.is_active !== 0 && s.active !== false)
        .map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category || 'Daily Laundry',
          pricing_type:
            s.pricing_type?.toLowerCase().includes('kg') || s.unit?.toLowerCase().includes('kg')
              ? 'kg'
              : 'pc',
          price: parseFloat(s.price || s.pricePerKg || s.pricePerPiece || 80),
          turnaround: s.turnaround || '48 Hours',
        }));

      setServices(normalized.length > 0 ? normalized : INITIAL_SERVICES);
    } catch (err) {
      console.warn('Fallback to initial services:', err);
      setServices(INITIAL_SERVICES);
    } finally {
      setLoadingServices(false);
    }
  };

  // Add / remove items in cart
  const handleAddService = (service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service_id === service.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.service_id === service.id
            ? { ...item, qty_or_kg: item.qty_or_kg + 1 }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            service_id: service.id,
            name: service.name,
            pricing_type: service.pricing_type,
            price: parseFloat(service.price),
            qty_or_kg: service.pricing_type === 'kg' ? 2 : 1,
          },
        ];
      }
      try {
        localStorage.setItem('washflow_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateQty = (serviceId, delta) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.service_id === serviceId) {
            const step = item.pricing_type === 'kg' ? 0.5 : 1;
            const newQty = Math.max(0.5, item.qty_or_kg + delta * step);
            return { ...item, qty_or_kg: parseFloat(newQty.toFixed(1)) };
          }
          return item;
        })
        .filter((item) => item.qty_or_kg > 0);
      try {
        if (updated.length > 0) {
          localStorage.setItem('washflow_cart', JSON.stringify(updated));
        } else {
          localStorage.removeItem('washflow_cart');
        }
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveItem = (serviceId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.service_id !== serviceId);
      try {
        if (updated.length > 0) {
          localStorage.setItem('washflow_cart', JSON.stringify(updated));
        } else {
          localStorage.removeItem('washflow_cart');
        }
      } catch (e) {}
      return updated;
    });
  };

  // Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty_or_kg, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discount_amount
      ? appliedCoupon.type === 'percentage'
        ? (subtotal * parseFloat(appliedCoupon.discount_amount)) / 100
        : Math.min(subtotal, parseFloat(appliedCoupon.discount_amount))
      : 0
    : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await couponsApi.validateCoupon(couponCode.trim().toUpperCase(), subtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        setCouponError('');
      } else {
        setCouponError(res.message || 'Coupon could not be applied');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid or expired promo code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Book order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Please select at least one laundry service.');
      return;
    }

    // Check if user is logged in. If not, save cart to localStorage and trigger registration modal
    const token = localStorage.getItem('washflow_token');
    if (!token) {
      try {
        localStorage.setItem('washflow_cart', JSON.stringify(cart));
      } catch (e) {}
      if (onOpenAuth) {
        onOpenAuth();
      }
      setErrorMsg('Please sign in or register to schedule your pickup. Your selected items are saved in your cart!');
      return;
    }

    if (!pickupAddress.trim()) {
      setErrorMsg('Please provide a valid pickup address.');
      return;
    }

    if (!sameAddress && !deliveryAddress.trim()) {
      setErrorMsg('Please provide a delivery address since it is different from pickup.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((i) => ({
          service_id: i.service_id,
          qty_or_kg: i.qty_or_kg,
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        pickup_address: pickupAddress.trim(),
        delivery_address: sameAddress ? pickupAddress.trim() : deliveryAddress.trim(),
        same_delivery_address: Boolean(sameAddress),
        pickup_time: `${pickupDate} | ${pickupSlot}`,
        payment_status: paymentMethod,
        notes: notes.trim(),
      };

      const res = await customerApi.bookOrder(payload);
      if (res.success && res.order) {
        setSuccessOrder(res.order);
        // Reset cart to 0 and clear from localStorage after every order
        setCart([]);
        try {
          localStorage.removeItem('washflow_cart');
        } catch (e) {}
        setAppliedCoupon(null);
        setCouponCode('');
      } else {
        setErrorMsg(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Something went wrong while booking your laundry service.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If order is successfully placed, show full receipt card
  if (successOrder) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Pickup Scheduled Successfully
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Order #{successOrder.order_id_string} Placed!
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
            Our rider has been alerted and will arrive during your chosen pickup slot:{' '}
            <strong className="text-slate-800">{successOrder.pickup_time}</strong>.
          </p>

          {/* Details breakdown */}
          <div className="bg-slate-50 rounded-2xl p-6 mt-8 text-left border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-sm">
              <span className="text-slate-500 font-medium">Pickup Address:</span>
              <span className="text-slate-900 font-semibold text-right max-w-[260px] truncate">
                {successOrder.pickup_address}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-sm">
              <span className="text-slate-500 font-medium">Delivery Address:</span>
              <span className="text-slate-900 font-semibold text-right max-w-[260px] truncate">
                {successOrder.delivery_address}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-sm">
              <span className="text-slate-500 font-medium">Total Bill:</span>
              <span className="text-xl font-black text-slate-900">
                ₹{parseFloat(successOrder.final_amount).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Status & Updates:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> WhatsApp Notification Sent
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button
              onClick={() => {
                setCart([]);
                try {
                  localStorage.removeItem('washflow_cart');
                } catch (e) {}
                onOrderSuccess && onOrderSuccess('orders');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:from-sky-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Track Live Order Status</span>
            </button>
            <button
              onClick={() => {
                setSuccessOrder(null);
                setCart([]);
                try {
                  localStorage.removeItem('washflow_cart');
                } catch (e) {}
                setAppliedCoupon(null);
                setCouponCode('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
          <Sparkles className="w-4 h-4" />
          <span>Quick & Easy Booking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Book Laundry & Dry Cleaning
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Select services, customize quantity, set your pickup time, and specify pickup & delivery addresses.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 7 COLS: Service Picker & Address Config */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Services Picker */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 font-extrabold flex items-center justify-center text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Select Services</h3>
                    <p className="text-xs text-slate-400">Choose all services you need cleaned</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {cart.length} in cart
                </span>
              </div>

              {loadingServices ? (
                <div className="py-8 text-center text-slate-400 text-sm">Loading available services...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((srv) => {
                    const cartItem = cart.find((i) => i.service_id === srv.id);
                    const isSelected = Boolean(cartItem);

                    return (
                      <div
                        key={srv.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-extrabold text-sky-700">
                                ₹{parseFloat(srv.price).toFixed(0)}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400 uppercase">
                                /{srv.pricing_type}
                              </span>
                            </div>
                          </div>

                          {!isSelected ? (
                            <button
                              type="button"
                              onClick={() => handleAddService(srv)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:text-sky-600 font-bold text-xs text-slate-700 transition flex items-center gap-1 shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-sky-200 shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(srv.id, -1)}
                                className="w-6 h-6 rounded-lg text-slate-500 hover:bg-slate-100 flex items-center justify-center"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-black text-xs text-sky-700 min-w-[28px] text-center">
                                {cartItem.qty_or_kg}
                                <span className="text-[10px] ml-0.5 font-normal text-slate-400">
                                  {srv.pricing_type}
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(srv.id, 1)}
                                className="w-6 h-6 rounded-lg text-slate-500 hover:bg-slate-100 flex items-center justify-center"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Pickup Scheduling */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 font-extrabold flex items-center justify-center text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Pickup Schedule</h3>
                  <p className="text-xs text-slate-400">When should our rider collect your clothes?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Pickup Date</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>Preferred Time Slot</span>
                  </label>
                  <select
                    value={pickupSlot}
                    onChange={(e) => setPickupSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Crucial Address Question (Prompted explicitly by system) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 font-extrabold flex items-center justify-center text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Pickup & Delivery Addresses
                  </h3>
                  <p className="text-xs text-slate-400">
                    Verify location details for our rider and delivery van
                  </p>
                </div>
              </div>

              {/* CRITICAL PROMPT: Ask user if pickup and delivery addresses are the same or different */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/80 to-indigo-50/80 border border-sky-100 mb-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Are pickup and delivery addresses the same, or should they be kept different?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You can have clean laundry delivered back to your home, office, or another address.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <label
                    onClick={() => setSameAddress(true)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition ${
                      sameAddress
                        ? 'border-sky-600 bg-white shadow-sm ring-2 ring-sky-500/20'
                        : 'border-slate-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="same_address_choice"
                      checked={sameAddress}
                      onChange={() => setSameAddress(true)}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Same Address (Recommended)</p>
                      <p className="text-[11px] text-slate-500">Pickup & drop at the exact same location</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setSameAddress(false)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition ${
                      !sameAddress
                        ? 'border-indigo-600 bg-white shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="same_address_choice"
                      checked={!sameAddress}
                      onChange={() => setSameAddress(false)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Different Delivery Address</p>
                      <p className="text-[11px] text-slate-500">e.g., Deliver to Office, Hotel, or Friend</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Pickup Address (Where we collect clothes)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter full pickup address with flat/door number, building, landmark..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>

                {!sameAddress && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>Delivery Address (Where clean clothes are delivered)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter full delivery address with office/flat, street, city..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      required={!sameAddress}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Special Washing Instructions / Rider Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Do not iron silk shirts, call before arriving..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Order Summary, Coupon & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm sticky top-24">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                  {cart.length} items
                </span>
              </h3>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">Your basket is empty</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Add services from the list on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.service_id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.qty_or_kg} {item.pricing_type} × ₹{item.price.toFixed(0)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{(item.price * item.qty_or_kg).toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.service_id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Box */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-600" />
                  <span>Promo / Festive Coupon</span>
                </label>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE25, DIWALI100"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-extrabold text-emerald-900">
                          {appliedCoupon.code} Applied!
                        </p>
                        <p className="text-[10px] text-emerald-700">
                          You save ₹{discountAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1.5">{couponError}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Payment Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-sky-600 bg-sky-50 text-sky-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Pay on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI / QR Code')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 justify-center transition ${
                      paymentMethod === 'UPI / QR Code'
                        ? 'border-sky-600 bg-sky-50 text-sky-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Doorstep Pickup & Delivery</span>
                  <span className="font-bold text-emerald-600 uppercase text-[11px]">Free</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="w-full mt-6 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-sky-500/25 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Scheduling Your Pickup...</span>
                ) : (
                  <>
                    <span>Confirm & Schedule Pickup</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Hygienic Wash Guarantee & Free Insurance</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

