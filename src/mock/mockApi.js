/**
 * ==========================================
 * WashFlow Laundry CRM - Demo Mock API Layer
 * ==========================================
 * Provides a 100% realistic, persistent, interactive local state
 * backed by localStorage without requiring MySQL or PHP Laravel.
 */

import {
  DEMO_ADMIN_USER,
  DEMO_STAFF_USERS,
  DEMO_CUSTOMER_USER,
  DEMO_SERVICES,
  DEMO_OFFERS,
  DEMO_CUSTOMERS,
  DEMO_ORDERS,
  DEMO_STAFF,
  DEMO_LEAVES,
  DEMO_STORE_SETTINGS,
  DEMO_METRICS,
} from './demoData';

// Simulated latency helper (default 250ms for realistic snappy feel)
const mockDelay = (data, ms = 250) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
};

// Storage Key Helpers
const STORAGE_KEYS = {
  ORDERS: 'washflow_demo_orders',
  SERVICES: 'washflow_demo_services',
  COUPONS: 'washflow_demo_coupons',
  CUSTOMERS: 'washflow_demo_customers',
  STAFF: 'washflow_demo_staff',
  LEAVES: 'washflow_demo_leaves',
  SETTINGS: 'washflow_demo_store_settings',
};

// Helper: Get or initialize collection from localStorage
const getCollection = (key, defaultData) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return JSON.parse(JSON.stringify(defaultData));
    }
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(defaultData));
  }
};

const saveCollection = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

// Initialize all demo tables on first load if missing
export const initializeDemoStorage = () => {
  getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
  getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
  getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
  getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
  getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
  getCollection(STORAGE_KEYS.LEAVES, DEMO_LEAVES);
  getCollection(STORAGE_KEYS.SETTINGS, DEMO_STORE_SETTINGS);
};

// Call initialization
initializeDemoStorage();

// ==========================================
// 1. AUTHENTICATION MOCK API
// ==========================================
export const mockAuthApi = {
  login: async ({ email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check Admin
    if (cleanEmail.includes('owner') || cleanEmail.includes('admin')) {
      const user = DEMO_ADMIN_USER;
      const token = 'demo-admin-token-' + Date.now();
      localStorage.setItem('washflow_token', token);
      localStorage.setItem('washflow_user', JSON.stringify(user));
      return mockDelay({ success: true, user, token, message: 'Welcome Store Owner!' });
    }

    // Check Staff
    const matchedStaff = DEMO_STAFF_USERS.find(
      (s) => s.email.toLowerCase() === cleanEmail || cleanEmail.includes(s.name.split(' ')[0].toLowerCase())
    );
    if (matchedStaff || cleanEmail.includes('staff')) {
      const user = matchedStaff || DEMO_STAFF_USERS[0];
      const token = 'demo-staff-token-' + Date.now();
      localStorage.setItem('washflow_token', token);
      localStorage.setItem('washflow_user', JSON.stringify(user));
      return mockDelay({ success: true, user, token, message: 'Welcome ' + user.name });
    }

    // Default Customer Login (e.g. rahul@washflow.in or any customer)
    const user = {
      ...DEMO_CUSTOMER_USER,
      email: cleanEmail || DEMO_CUSTOMER_USER.email,
    };
    const token = 'demo-customer-token-' + Date.now();
    localStorage.setItem('washflow_token', token);
    localStorage.setItem('washflow_user', JSON.stringify(user));
    localStorage.setItem('washflow_customer', JSON.stringify(user));
    return mockDelay({ success: true, user, token, customer: user, message: 'Welcome Customer!' });
  },

  register: async (userData) => {
    const user = {
      id: Date.now(),
      name: userData.name || 'New Customer',
      email: userData.email,
      phone: userData.phone || '9876543210',
      role: 'customer',
      pickup_address: userData.pickup_address || 'Registered Address, Bengaluru',
      delivery_address: userData.delivery_address || userData.pickup_address,
    };
    const token = 'demo-customer-token-' + Date.now();
    localStorage.setItem('washflow_token', token);
    localStorage.setItem('washflow_user', JSON.stringify(user));
    localStorage.setItem('washflow_customer', JSON.stringify(user));

    // Also add to customers list
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    customers.unshift({
      id: user.id,
      name: user.name,
      phone: user.phone,
      address: user.pickup_address,
      joinedDate: 'Today',
      tier: 'New Member',
      total_orders: 0,
      total_spent: 0,
    });
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);

    return mockDelay({ success: true, user, customer: user, token });
  },

  logout: async () => {
    localStorage.removeItem('washflow_token');
    localStorage.removeItem('washflow_user');
    localStorage.removeItem('washflow_customer');
    return mockDelay({ success: true });
  },

  getUser: async () => {
    try {
      const raw = localStorage.getItem('washflow_user');
      const user = raw ? JSON.parse(raw) : DEMO_ADMIN_USER;
      return mockDelay({ success: true, user });
    } catch (e) {
      return mockDelay({ success: true, user: DEMO_ADMIN_USER });
    }
  },
};

// ==========================================
// 2. CUSTOMER PORTAL MOCK API
// ==========================================
export const mockCustomerApi = {
  login: async ({ email, email_or_phone, password }) => {
    return mockAuthApi.login({ email: email || email_or_phone, password });
  },

  register: async (data) => {
    return mockAuthApi.register(data);
  },

  getDashboard: async () => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    // Find customer orders or use all active
    const active = orders.filter((o) => o.stage !== 'delivered');
    const delivered = orders.filter((o) => o.stage === 'delivered');
    const totalSpends = orders.reduce((sum, o) => sum + (Number(o.final_amount) || 0), 0);

    return mockDelay({
      success: true,
      customer: DEMO_CUSTOMER_USER,
      metrics: {
        total_spends: totalSpends,
        active_orders_count: active.length,
        delivered_orders_count: delivered.length,
        total_orders: orders.length,
      },
      active_orders: active,
      recent_orders: orders.slice(0, 5),
      ongoing_offers: getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS),
    });
  },

  getOrders: async () => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    return mockDelay({
      success: true,
      active: orders.filter((o) => o.stage !== 'delivered'),
      delivered: orders.filter((o) => o.stage === 'delivered'),
      all: orders,
    });
  },

  bookOrder: async (orderData) => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);

    const newId = Date.now().toString().slice(-4);
    const nextCode = 'WF-' + (1040 + orders.length + 1);

    const items = (orderData.items || []).map((it) => {
      const matchedSrv = services.find((s) => s.id === it.service_id);
      return {
        service_id: it.service_id,
        service_name: matchedSrv?.name || it.name || 'Laundry Service',
        name: matchedSrv?.name || it.name || 'Laundry Service',
        qty_or_kg: it.qty_or_kg || it.qty || 2,
        qty: it.qty_or_kg || it.qty || 2,
        price: matchedSrv?.price || it.price || 89,
        unit: matchedSrv?.pricing_type || it.unit || 'kg',
      };
    });

    const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty_or_kg), 0);
    const discount = orderData.coupon_code ? Math.round(subtotal * 0.25) : 0;
    const finalAmount = Math.max(0, subtotal - discount);

    const newOrder = {
      id: parseInt(newId, 10),
      order_id_string: nextCode,
      customerId: 10,
      customer_id: 10,
      customerName: DEMO_CUSTOMER_USER.name,
      customerPhone: DEMO_CUSTOMER_USER.phone,
      stage: 'placed',
      dayCategory: 'Today',
      orderDate: new Date().toISOString().split('T')[0],
      order_date: new Date().toISOString().split('T')[0],
      createdAt: 'Just Now',
      pickup_time_slot: orderData.pickup_time_slot || 'Morning (08:00 AM - 11:00 AM)',
      turnaround: '48 Hours Guaranteed',
      expectedDelivery: 'In 48 Hours',
      assignedStaff: 'Deepak Paswan',
      items,
      totalAmount: subtotal,
      subtotal,
      couponCode: orderData.coupon_code || null,
      coupon_code: orderData.coupon_code || null,
      discountAmount: discount,
      discount_amount: discount,
      final_amount: finalAmount,
      netRevenue: finalAmount,
      total_cost: Math.round(subtotal * 0.3),
      profit: Math.round(finalAmount - subtotal * 0.3),
      paymentStatus: orderData.payment_preference === 'upi' ? 'Paid (UPI Online)' : 'Pay on Delivery',
      payment_status: orderData.payment_preference === 'upi' ? 'Paid' : 'Pay on Delivery',
      pickup_address: orderData.pickup_address || DEMO_CUSTOMER_USER.pickup_address,
      delivery_address: orderData.same_delivery_address ? (orderData.pickup_address || DEMO_CUSTOMER_USER.pickup_address) : (orderData.delivery_address || DEMO_CUSTOMER_USER.pickup_address),
      lastNotified: 'Just now via WhatsApp',
      notifyCount: 1,
    };

    orders.unshift(newOrder);
    saveCollection(STORAGE_KEYS.ORDERS, orders);

    return mockDelay({
      success: true,
      message: `Order #${nextCode} booked successfully! Rider assigned.`,
      order: newOrder,
    });
  },

  getProfile: async () => {
    return mockDelay({ success: true, customer: DEMO_CUSTOMER_USER });
  },

  updateProfile: async (data) => {
    Object.assign(DEMO_CUSTOMER_USER, data);
    localStorage.setItem('washflow_customer', JSON.stringify(DEMO_CUSTOMER_USER));
    return mockDelay({ success: true, customer: DEMO_CUSTOMER_USER });
  },
};

// ==========================================
// 3. DASHBOARD & METRICS MOCK API
// ==========================================
export const mockDashboardApi = {
  getMetrics: async () => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const delivered = orders.filter((o) => o.stage === 'delivered');
    const active = orders.filter((o) => o.stage !== 'delivered');
    const totalRev = orders.reduce((sum, o) => sum + (Number(o.final_amount) || 0), 0);

    const metrics = {
      ...DEMO_METRICS,
      total_revenue: totalRev + 80000,
      net_revenue: totalRev + 80000,
      active_orders: active.length,
      delivered_orders: delivered.length + 130,
      total_orders: orders.length + 130,
      pipeline_breakdown: {
        placed: orders.filter((o) => o.stage === 'placed').length,
        picked_up: orders.filter((o) => o.stage === 'picked_up').length,
        washing: orders.filter((o) => o.stage === 'washing').length,
        ironing: orders.filter((o) => o.stage === 'ironing').length,
        ready: orders.filter((o) => o.stage === 'ready').length,
        delivered: delivered.length + 130,
      },
    };

    return mockDelay({ success: true, metrics });
  },
};

// ==========================================
// 4. ORDERS & PIPELINE MOCK API
// ==========================================
export const mockOrdersApi = {
  getOrders: async () => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    return mockDelay({ success: true, data: orders, orders: { data: orders } });
  },

  getPipeline: async () => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    return mockDelay({ success: true, data: orders });
  },

  updateStage: async (orderId, stage) => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const found = orders.find(
      (o) => o.id === orderId || o.id === parseInt(orderId, 10) || o.order_id_string === orderId
    );

    if (found) {
      found.stage = stage;
      if (stage === 'delivered') {
        found.payment_status = 'Paid';
        found.paymentStatus = 'Paid';
        found.deliveredAt = 'Just now';
      }
      saveCollection(STORAGE_KEYS.ORDERS, orders);
    }

    return mockDelay({ success: true, order: found, message: `Moved order to ${stage}` });
  },

  createOrder: async (orderData) => {
    return mockCustomerApi.bookOrder(orderData);
  },

  getOrder: async (id) => {
    const orders = getCollection(STORAGE_KEYS.ORDERS, DEMO_ORDERS);
    const found = orders.find((o) => o.id == id || o.order_id_string === id);
    return mockDelay({ success: true, data: found || orders[0] });
  },
};

// ==========================================
// 5. CUSTOMERS MOCK API
// ==========================================
export const mockCustomersApi = {
  getCustomers: async () => {
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    return mockDelay({ success: true, data: customers, customers });
  },

  getCustomer: async (id) => {
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    const found = customers.find((c) => c.id == id) || customers[0];
    return mockDelay({ success: true, data: found });
  },

  createCustomer: async (customerData) => {
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    const newCust = {
      id: Date.now(),
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      joinedDate: 'Today',
      tier: 'Regular',
      notes: customerData.notes || '',
      total_orders: 0,
      total_spent: 0,
    };
    customers.unshift(newCust);
    saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
    return mockDelay({ success: true, data: newCust, customer: newCust });
  },

  updateCustomer: async (id, customerData) => {
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    const idx = customers.findIndex((c) => c.id == id);
    if (idx >= 0) {
      customers[idx] = { ...customers[idx], ...customerData };
      saveCollection(STORAGE_KEYS.CUSTOMERS, customers);
      return mockDelay({ success: true, data: customers[idx] });
    }
    return mockDelay({ success: true, data: customerData });
  },

  deleteCustomer: async (id) => {
    const customers = getCollection(STORAGE_KEYS.CUSTOMERS, DEMO_CUSTOMERS);
    const updated = customers.filter((c) => c.id != id);
    saveCollection(STORAGE_KEYS.CUSTOMERS, updated);
    return mockDelay({ success: true, message: 'Customer deleted' });
  },
};

// ==========================================
// 6. SERVICES & PRICING MOCK API
// ==========================================
export const mockServicesApi = {
  getServices: async () => {
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
    return mockDelay({ success: true, data: services, services });
  },

  createService: async (serviceData) => {
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
    const newSrv = {
      id: 'srv-' + (services.length + 1),
      name: serviceData.name,
      category: serviceData.category || 'Daily Laundry',
      price: parseFloat(serviceData.price) || 99,
      unit: serviceData.unit || (serviceData.pricing_type === 'pc' ? 'per Pc' : 'per Kg'),
      pricing_type: serviceData.pricing_type || (serviceData.unit?.includes('Pc') ? 'pc' : 'kg'),
      turnaround: serviceData.turnaround || '48 Hours',
      active: true,
      popular: false,
    };
    services.push(newSrv);
    saveCollection(STORAGE_KEYS.SERVICES, services);
    return mockDelay({ success: true, data: newSrv, service: newSrv });
  },

  updateService: async (id, serviceData) => {
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
    const idx = services.findIndex((s) => s.id == id);
    if (idx >= 0) {
      services[idx] = { ...services[idx], ...serviceData };
      saveCollection(STORAGE_KEYS.SERVICES, services);
      return mockDelay({ success: true, data: services[idx], service: services[idx] });
    }
    return mockDelay({ success: true, data: serviceData });
  },

  deleteService: async (id) => {
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
    const updated = services.filter((s) => s.id != id);
    saveCollection(STORAGE_KEYS.SERVICES, updated);
    return mockDelay({ success: true, message: 'Service deleted' });
  },

  toggleActive: async (id) => {
    const services = getCollection(STORAGE_KEYS.SERVICES, DEMO_SERVICES);
    const found = services.find((s) => s.id == id);
    if (found) {
      found.active = !found.active;
      saveCollection(STORAGE_KEYS.SERVICES, services);
    }
    return mockDelay({ success: true, service: found });
  },
};

// ==========================================
// 7. COUPONS & OFFERS MOCK API
// ==========================================
export const mockCouponsApi = {
  getCoupons: async () => {
    const coupons = getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
    return mockDelay({ success: true, data: coupons, coupons });
  },

  createCoupon: async (couponData) => {
    const coupons = getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
    const newCoupon = {
      id: 'off-' + (coupons.length + 1),
      title: couponData.title,
      code: (couponData.code || '').toUpperCase(),
      category: couponData.category || 'Special Offer',
      discountType: couponData.discountType || 'percentage',
      discountValue: parseFloat(couponData.discountValue) || 20,
      minOrder: parseFloat(couponData.minOrder) || 400,
      validTill: couponData.validTill || '31 Dec 2026',
      description: couponData.description || 'Limited time promotional voucher.',
      active: true,
      is_active: true,
    };
    coupons.push(newCoupon);
    saveCollection(STORAGE_KEYS.COUPONS, coupons);
    return mockDelay({ success: true, data: newCoupon, coupon: newCoupon });
  },

  updateCoupon: async (id, couponData) => {
    const coupons = getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
    const idx = coupons.findIndex((c) => c.id == id);
    if (idx >= 0) {
      coupons[idx] = { ...coupons[idx], ...couponData };
      saveCollection(STORAGE_KEYS.COUPONS, coupons);
      return mockDelay({ success: true, data: coupons[idx] });
    }
    return mockDelay({ success: true, data: couponData });
  },

  deleteCoupon: async (id) => {
    const coupons = getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
    const updated = coupons.filter((c) => c.id != id);
    saveCollection(STORAGE_KEYS.COUPONS, updated);
    return mockDelay({ success: true, message: 'Coupon deleted' });
  },

  validateCoupon: async (code, cartValue = 500) => {
    const coupons = getCollection(STORAGE_KEYS.COUPONS, DEMO_OFFERS);
    const found = coupons.find((c) => c.code.toUpperCase() === (code || '').toUpperCase());

    if (!found) {
      return mockDelay({ success: false, message: 'Invalid promo code.' });
    }
    const discount =
      found.discountType === 'percentage'
        ? Math.round((cartValue * (found.discountValue || 20)) / 100)
        : found.discountValue || 100;

    return mockDelay({
      success: true,
      valid: true,
      coupon: found,
      discount_amount: discount,
      message: `Coupon ${found.code} applied! Saved ₹${discount}`,
    });
  },
};

// ==========================================
// 8. STAFF & PAYROLL MOCK API
// ==========================================
export const mockPayrollApi = {
  getStaff: async () => {
    const staff = getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
    return mockDelay({ success: true, data: staff, staff });
  },

  createStaff: async (staffData) => {
    const staff = getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
    const newStaff = {
      id: Date.now(),
      name: staffData.name,
      role: staffData.role || 'Laundry Specialist',
      phone: staffData.phone,
      email: staffData.email,
      baseSalary: parseFloat(staffData.baseSalary || staffData.base_salary) || 12000,
      bonus: 0,
      deduction: 0,
      status: 'Pending',
      paidDate: null,
      paymentMode: 'Pending',
      joiningDate: 'Today',
    };
    staff.push(newStaff);
    saveCollection(STORAGE_KEYS.STAFF, staff);
    return mockDelay({ success: true, data: newStaff, staff: newStaff });
  },

  updateStaff: async (id, staffData) => {
    const staff = getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
    const idx = staff.findIndex((s) => s.id == id);
    if (idx >= 0) {
      staff[idx] = { ...staff[idx], ...staffData };
      saveCollection(STORAGE_KEYS.STAFF, staff);
      return mockDelay({ success: true, data: staff[idx] });
    }
    return mockDelay({ success: true, data: staffData });
  },

  paySalary: async (payload) => {
    const staff = getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
    const found = staff.find((s) => s.id == payload.staff_id || s.id == payload.id);
    if (found) {
      found.status = 'Paid';
      found.paidDate = 'Today';
      found.paymentMode = payload.payment_mode || 'UPI Transfer';
      saveCollection(STORAGE_KEYS.STAFF, staff);
    }
    return mockDelay({ success: true, message: 'Salary disbursed successfully!' });
  },

  payAll: async () => {
    const staff = getCollection(STORAGE_KEYS.STAFF, DEMO_STAFF);
    staff.forEach((s) => {
      s.status = 'Paid';
      s.paidDate = 'Today';
      s.paymentMode = 'Bulk UPI';
    });
    saveCollection(STORAGE_KEYS.STAFF, staff);
    return mockDelay({ success: true, message: 'All pending staff salaries paid!' });
  },

  getStaffProfile: async () => {
    return mockDelay({ success: true, staff: DEMO_STAFF[0] });
  },

  updateStaffProfile: async (data) => {
    return mockDelay({ success: true, staff: { ...DEMO_STAFF[0], ...data } });
  },

  getStaffPayouts: async () => {
    return mockDelay({
      success: true,
      payouts: [
        { id: 1, month: 'October 2026', amount: 16500, status: 'Paid', date: '02 Nov 2026', mode: 'UPI' },
        { id: 2, month: 'September 2026', amount: 16500, status: 'Paid', date: '02 Oct 2026', mode: 'Bank Transfer' },
      ],
    });
  },
};

// ==========================================
// 9. LEAVES MOCK API
// ==========================================
export const mockLeavesApi = {
  getLeaves: async () => {
    const leaves = getCollection(STORAGE_KEYS.LEAVES, DEMO_LEAVES);
    return mockDelay({ success: true, data: leaves, leaves });
  },

  reviewLeave: async (id, data) => {
    const leaves = getCollection(STORAGE_KEYS.LEAVES, DEMO_LEAVES);
    const found = leaves.find((l) => l.id == id);
    if (found) {
      found.status = data.status || 'approved';
      found.deduction_type = data.deduction_type || 'paid';
      found.reviewed_by = 'Store Admin';
      saveCollection(STORAGE_KEYS.LEAVES, leaves);
    }
    return mockDelay({ success: true, leave: found });
  },

  getStaffLeaves: async () => {
    const leaves = getCollection(STORAGE_KEYS.LEAVES, DEMO_LEAVES);
    return mockDelay({ success: true, leaves });
  },

  applyLeave: async (data) => {
    const leaves = getCollection(STORAGE_KEYS.LEAVES, DEMO_LEAVES);
    const newLeave = {
      id: Date.now(),
      staff_id: 2,
      staff_name: 'Ramesh Kumar',
      role: 'Master Washer & Stain Expert',
      leave_type: data.leave_type || 'Casual',
      start_date: data.start_date || '2026-11-20',
      end_date: data.end_date || '2026-11-21',
      days_count: 2,
      reason: data.reason || 'Personal family work',
      status: 'pending',
      applied_on: 'Today',
    };
    leaves.unshift(newLeave);
    saveCollection(STORAGE_KEYS.LEAVES, leaves);
    return mockDelay({ success: true, leave: newLeave, message: 'Leave application submitted!' });
  },
};

// ==========================================
// 10. STORE SETTINGS MOCK API
// ==========================================
export const mockStoreSettingsApi = {
  getSettings: async () => {
    const settings = getCollection(STORAGE_KEYS.SETTINGS, DEMO_STORE_SETTINGS);
    return mockDelay({ success: true, settings });
  },

  updateSettings: async (settingsData) => {
    const settings = getCollection(STORAGE_KEYS.SETTINGS, DEMO_STORE_SETTINGS);
    const updated = { ...settings, ...settingsData };
    saveCollection(STORAGE_KEYS.SETTINGS, updated);
    return mockDelay({ success: true, settings: updated, message: 'Store details updated!' });
  },
};
