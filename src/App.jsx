import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

// Initial Fallback Data
import INITIAL_STAGES from './data/stages';
import INITIAL_SERVICES from './data/services';
import INITIAL_OFFERS from './data/offers';
import INITIAL_CUSTOMERS from './data/customers';
import INITIAL_ORDERS from './data/orders';
import INITIAL_STAFF from './data/staff';

// Utilities & Helpers
import {
  calculateOrderTotals,
  calculateFinancials,
  normalizeOrder,
  normalizeService,
  normalizeCoupon,
  normalizeStaff,
} from './utils/helpers';
import useToast from './hooks/useToast';

// API Services
import {
  authApi,
  dashboardApi,
  ordersApi,
  customersApi,
  servicesApi,
  couponsApi,
  payrollApi,
  leavesApi,
  IS_DEMO_MODE,
} from './api';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import DemoFloatingBar from './components/DemoFloatingBar';

// Dedicated Auth Modals
import AdminLoginModal from './components/modals/AdminLoginModal';
import StaffAuthModal from './components/modals/StaffAuthModal';
import CustomerAuthModal from './customer/modals/CustomerAuthModal';

// Modals for Orders & Config
import NewOrderModal from './components/modals/NewOrderModal';
import NewCustomerModal from './components/modals/NewCustomerModal';
import ServiceModal from './components/modals/ServiceModal';
import OfferModal from './components/modals/OfferModal';
import StaffModal from './components/modals/StaffModal';
import CustomerDetailModal from './components/modals/CustomerDetailModal';

// Pages
import Homepage from './pages/Homepage';
import CustomerPortal from './customer/CustomerPortal';
import Dashboard from './pages/Dashboard';
import OrderPipeline from './pages/OrderPipeline';
import AllOrders from './pages/AllOrders';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Offers from './pages/Offers';
import Staff from './pages/Staff';
import StaffDetailPage from './pages/StaffDetailPage';
import Payroll from './pages/Payroll';
import AdminLeaves from './pages/AdminLeaves';
import StaffLeaves from './pages/StaffLeaves';
import StaffPayouts from './pages/StaffPayouts';
import StaffProfile from './pages/StaffProfile';
import StoreSettings from './pages/StoreSettings';

export default function App() {
  // 1. Current Authenticated User (Strict: null if not logged in!)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('washflow_user');
      const token = localStorage.getItem('washflow_token');
      if (savedUser && token) {
        const parsed = JSON.parse(savedUser);
        return { ...parsed, token };
      }
    } catch (e) {
      // Fallback
    }
    return null; // Not logged in by default
  });

  // 2. View Mode: 'home' | 'admin' | 'staff' | 'customer'
  const [viewMode, setViewMode] = useState(() => {
    try {
      const savedUser = localStorage.getItem('washflow_user');
      const token = localStorage.getItem('washflow_token');
      if (savedUser && token) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') return 'admin';
        if (parsed.role === 'staff') return 'staff';
        if (parsed.role === 'customer') return 'customer';
      }
    } catch (e) {}
    return 'home'; // Show Homepage to visitors!
  });

  // Auth Modals state
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [showStaffAuthModal, setShowStaffAuthModal] = useState(false);
  const [showCustomerAuthModal, setShowCustomerAuthModal] = useState(false);

  // Connection & Loading States
  const [apiConnected, setApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation & Layout (Staff defaults to 'pipeline', Admin defaults to 'dashboard')
  const [activePage, setActivePage] = useState(() => {
    return currentUser?.role === 'staff' ? 'pipeline' : 'dashboard';
  });
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [pipelineFullScreen, setPipelineFullScreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer Portal Navigation state
  const [customerInitialTab, setCustomerInitialTab] = useState('dashboard');
  const [customerInitialService, setCustomerInitialService] = useState(null);

  const handleGoToCustomerPortal = (tab = 'dashboard', service = null) => {
    setCustomerInitialTab(tab);
    setCustomerInitialService(service);
    setViewMode('customer');
  };

  // Core Data States
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [leavesList, setLeavesList] = useState([]);
  const [backendMetrics, setBackendMetrics] = useState(null);

  // Pipeline Specific States
  const [autoWhatsappOnMove, setAutoWhatsappOnMove] = useState(true);
  const [pipelineLayoutJugaad, setPipelineLayoutJugaad] = useState('auto_grid');
  const [pipelineDayFilter, setPipelineDayFilter] = useState('All');
  const [pipelineSearch, setPipelineSearch] = useState('');
  const [stagePageMap, setStagePageMap] = useState({});
  const [expandedOrderItems, setExpandedOrderItems] = useState({});

  // All Orders Page States
  const [ordersStageTab, setOrdersStageTab] = useState('all');
  const [ordersDayFilter, setOrdersDayFilter] = useState('All');
  const [ordersDateFilter, setOrdersDateFilter] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');

  // Customer Page States
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);

  // Service Page States
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Daily Laundry',
    price: '',
    unit: 'per Kg',
    turnaround: '48 Hours',
  });

  // Offers Page States
  const [offerFilter, setOfferFilter] = useState('All');

  // Modal Visibility States
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Forms
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [newOrderForm, setNewOrderForm] = useState({
    customerId: INITIAL_CUSTOMERS[0]?.id || 1,
    items: [{ serviceId: INITIAL_SERVICES[1]?.id || 1, qty: 5 }],
    couponCode: 'FESTIVE25',
    paymentStatus: 'Paid (UPI)',
  });

  // Toasts Hook
  const { toasts, showToast } = useToast();

  // Load all data from Laravel API
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        ordersRes,
        servicesRes,
        couponsRes,
        customersRes,
        staffRes,
        metricsRes,
      ] = await Promise.allSettled([
        ordersApi.getOrders(),
        servicesApi.getServices(),
        couponsApi.getCoupons(),
        customersApi.getCustomers(),
        payrollApi.getStaff(),
        dashboardApi.getMetrics('all'),
      ]);

      if (ordersRes.status === 'fulfilled') {
        const val = ordersRes.value;
        const raw = val?.data || val?.orders?.data || (Array.isArray(val) ? val : []);
        if (Array.isArray(raw) && raw.length > 0) {
          setOrders(raw.map(normalizeOrder));
        }
      }

      if (servicesRes.status === 'fulfilled') {
        const val = servicesRes.value;
        const rawS = val?.services || val?.data || (Array.isArray(val) ? val : []);
        if (Array.isArray(rawS) && rawS.length > 0) {
          setServices(rawS.map(normalizeService));
        }
      }

      if (couponsRes.status === 'fulfilled') {
        const val = couponsRes.value;
        const rawC = val?.coupons || val?.data || (Array.isArray(val) ? val : []);
        if (Array.isArray(rawC) && rawC.length > 0) {
          setOffers(rawC.map(normalizeCoupon));
        }
      }

      if (customersRes.status === 'fulfilled') {
        const val = customersRes.value;
        const rawCust = val?.customers || val?.data || (Array.isArray(val) ? val : []);
        if (Array.isArray(rawCust) && rawCust.length > 0) {
          setCustomers(rawCust);
        }
      }

      if (staffRes.status === 'fulfilled') {
        const val = staffRes.value;
        const rawStaff = val?.staff || val?.data || (Array.isArray(val) ? val : []);
        if (Array.isArray(rawStaff) && rawStaff.length > 0) {
          setStaffList(rawStaff.map(normalizeStaff));
        }
      }

      if (metricsRes.status === 'fulfilled' && metricsRes.value?.metrics) {
        setBackendMetrics(metricsRes.value.metrics);
      }

      // Fetch Staff Leaves for Admin
      try {
        const leavesRes = await leavesApi.getLeaves();
        const rawLeaves = leavesRes?.leaves || leavesRes?.data || [];
        if (Array.isArray(rawLeaves)) {
          setLeavesList(rawLeaves);
        }
      } catch (e) {
        // Ignored for non-admin
      }

      setApiConnected(true);
    } catch (err) {
      console.warn('Backend API Sync Notice:', err.message);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Staff Detail Navigation State
  const [selectedStaffForView, setSelectedStaffForView] = useState(null);

  const handleViewStaff = (stf) => {
    setSelectedStaffForView(stf);
    setActivePage('staff-detail');
  };

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Load data once when entering admin or staff mode (no aggressive 10s heavy polling)
  useEffect(() => {
    if (viewMode === 'admin' || viewMode === 'staff') {
      loadAllData();
    }
  }, [viewMode, loadAllData]);

  // Ensure Staff is never on an Admin-only page
  useEffect(() => {
    if (currentUser?.role === 'staff') {
      if (activePage === 'dashboard' || activePage === 'offers' || activePage === 'payroll') {
        setActivePage('pipeline');
      }
    }
  }, [currentUser, activePage]);

  // Financial Calculations: Net Profit = Total Revenue (Orders) - Staff Salaries Paid
  const financials = useMemo(() => {
    if (backendMetrics) {
      const rev = Number(backendMetrics.total_revenue || 0);
      const paidSalaries = Number(backendMetrics.total_payroll_paid || 0);
      return {
        totalRevenue: rev,
        staffSalariesTotal: paidSalaries,
        totalPayrollPaid: paidSalaries,
        totalPayrollPending: Number(backendMetrics.total_payroll_pending || 0),
        actualProfitAfterPaidSalary: backendMetrics.actual_net_profit !== undefined
          ? Number(backendMetrics.actual_net_profit)
          : (rev - paidSalaries),
        netMarginPercent: Number(backendMetrics.net_margin_percent || 0),
        totalKgWashed: backendMetrics.total_kg_washed || 120,
        activeOrdersCount: backendMetrics.active_orders_count || orders.filter((o) => o.stage !== 'delivered').length,
        deliveredOrdersCount: backendMetrics.delivered_orders_count || orders.filter((o) => o.stage === 'delivered').length,
      };
    }
    return calculateFinancials(orders, staffList);
  }, [orders, staffList, backendMetrics]);

  // ==========================================
  // AUTH SUCCESS HANDLERS
  // ==========================================

  const handleAdminLoginSuccess = (user, token) => {
    const authUser = { ...user, token };
    setCurrentUser(authUser);
    localStorage.setItem('washflow_token', token);
    localStorage.setItem('washflow_user', JSON.stringify(authUser));
    setViewMode('admin');
    setActivePage('dashboard');
    showToast(`Welcome Owner ${user.name}!`, 'Admin Dashboard unlocked with financial control.');
    loadAllData();
  };

  const handleStaffAuthSuccess = (user, token) => {
    const authUser = { ...user, token };
    setCurrentUser(authUser);
    localStorage.setItem('washflow_token', token);
    localStorage.setItem('washflow_user', JSON.stringify(authUser));
    setViewMode('staff');
    setActivePage('pipeline');
    showToast(`Welcome Staff ${user.name}!`, 'Operations Workspace unlocked.');
    loadAllData();
  };

  const handleCustomerAuthSuccess = (user, customer) => {
    setCurrentUser(user);
    // If cart in localStorage has items, redirect directly to Book Laundry page!
    try {
      const savedCart = localStorage.getItem('washflow_cart');
      if (savedCart && JSON.parse(savedCart).length > 0) {
        setCustomerInitialTab('book');
      }
    } catch (e) {}
    setViewMode('customer');
    showToast(`Welcome ${user.name}!`, 'Customer Laundry Hub opened.');
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    localStorage.removeItem('washflow_token');
    localStorage.removeItem('washflow_user');
    localStorage.removeItem('washflow_customer');
    setCurrentUser(null);
    setViewMode('home');
    showToast('Signed Out', 'You have been logged out securely.');
  };

  // ==========================================
  // CRM OPERATIONAL ACTIONS
  // ==========================================

  const moveOrderStage = (orderId, targetStageOrDirection) => {
    // Find the target order
    const order = orders.find(
      (o) => o.id === orderId || o.numericId === orderId || o.order_id_string === orderId
    );
    if (!order) return;

    let targetStage = targetStageOrDirection;

    // If a number (direction) is passed like 1 (Next) or -1 (Back):
    if (typeof targetStageOrDirection === 'number') {
      const currentIdx = INITIAL_STAGES.findIndex((s) => s.id === order.stage);
      const newIdx = currentIdx + targetStageOrDirection;
      if (newIdx < 0 || newIdx >= INITIAL_STAGES.length) return;
      targetStage = INITIAL_STAGES[newIdx].id;
    }

    // Ensure targetStage is a valid stage
    const stageObj = INITIAL_STAGES.find((s) => s.id === targetStage);
    const stageLabel = stageObj?.label || targetStage;

    // Use order's id (or numericId)
    const apiId = order.id || order.numericId || orderId;

    // 1. INSTANT OPTIMISTIC STATE UPDATE (0ms delay!)
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === order.id) {
          return {
            ...ord,
            stage: targetStage,
            lastNotified: `Moved to ${stageLabel}`,
            notifyCount: (ord.notifyCount || 0) + 1,
          };
        }
        return ord;
      })
    );
    showToast('Order Stage Updated', `Order #${order.id} moved to ${stageLabel}.`);

    // 2. Background API update (non-blocking)
    ordersApi.updateStage(apiId, targetStage).catch((err) => {
      console.warn('API update failed in background:', err.message);
    });
  };

  const sendWhatsAppNotification = async (order) => {
    const timeStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              lastNotified: `Sent at ${timeStr} via WhatsApp`,
              notifyCount: (o.notifyCount || 0) + 1,
            }
          : o
      )
    );
    showToast(
      'WhatsApp Notification Dispatched',
      `Live status sent to ${order.customerName} (${order.customerPhone})`
    );
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === Number(newOrderForm.customerId)) || customers[0];

    try {
      const payload = {
        customer_id: cust.id,
        items: newOrderForm.items.map((i) => ({
          service_id: i.serviceId,
          qty_or_kg: parseFloat(i.qty),
        })),
        coupon_code: newOrderForm.couponCode || null,
        payment_status: newOrderForm.paymentStatus,
        pickup_address: cust.address,
      };

      const res = await ordersApi.createOrder(payload);
      if (res.success && res.order) {
        setOrders((prev) => [normalizeOrder(res.order), ...prev]);
        setShowNewOrderModal(false);
        showToast('Order Created!', `Order #${res.order.order_id_string} placed successfully.`);
        loadAllData();
      }
    } catch (err) {
      console.warn('API create order failed, using local fallback:', err.message);
      const { subtotal, discount, totalCost, finalAmount } = calculateOrderTotals(
        newOrderForm.items,
        newOrderForm.couponCode,
        services,
        offers
      );

      const newOrder = {
        id: `WF-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerAddress: cust.address,
        tier: cust.tier || 'Regular',
        items: newOrderForm.items.map((item) => {
          const s = services.find((srv) => srv.id === item.serviceId);
          return {
            name: s ? s.name : 'Wash Service',
            qty: item.qty,
            unit: s ? s.unit : 'Kg',
            price: s ? s.pricePerKg || s.pricePerPiece || s.price : 60,
          };
        }),
        stage: 'placed',
        paymentStatus: newOrderForm.paymentStatus,
        expectedDelivery: 'In 48 Hours',
        assignedStaff: 'Ramesh Kumar',
        grossAmount: subtotal,
        discountApplied: discount,
        couponCode: newOrderForm.couponCode,
        netRevenue: finalAmount,
        directCost: totalCost,
        lastNotified: 'Ready to notify',
        notifyCount: 0,
        createdAt: 'Just now',
        orderDate: new Date().toISOString().split('T')[0],
      };

      setOrders((prev) => [newOrder, ...prev]);
      setShowNewOrderModal(false);
      showToast('Order Created', `Order #${newOrder.id} placed.`);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const res = await customersApi.createCustomer(newCustomerForm);
      if (res.success && res.data) {
        setCustomers((prev) => [res.data, ...prev]);
        setShowNewCustomerModal(false);
        showToast('Customer Added', `${newCustomerForm.name} saved to directory.`);
      }
    } catch (err) {
      const newCust = {
        id: Date.now(),
        ...newCustomerForm,
        totalOrders: 0,
        lifetimeSpend: 0,
      };
      setCustomers((prev) => [newCust, ...prev]);
      setShowNewCustomerModal(false);
      showToast('Customer Added', `${newCust.name} saved.`);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const payload = {
      name: serviceForm.name,
      pricing_type: serviceForm.unit?.includes('Piece') ? 'piece' : 'kg',
      price: parseFloat(serviceForm.price),
      turnaround: serviceForm.turnaround,
      category: serviceForm.category,
    };

    try {
      if (editingService) {
        const res = await servicesApi.updateService(editingService.id, payload);
        if (res.success) {
          loadAllData();
          setShowServiceModal(false);
          showToast('Service Updated', `${payload.name} rate updated.`);
        }
      } else {
        const res = await servicesApi.createService(payload);
        if (res.success) {
          loadAllData();
          setShowServiceModal(false);
          showToast('Service Added', `${payload.name} created.`);
        }
      }
    } catch (err) {
      console.warn('API error saving service:', err.message);
      setShowServiceModal(false);
    }
  };

  const handleToggleService = async (serviceId) => {
    try {
      await servicesApi.toggleActive(serviceId);
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s))
      );
      showToast('Service Status', 'Service active state updated.');
    } catch (err) {
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s))
      );
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Delete this laundry service?')) return;
    try {
      await servicesApi.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      showToast('Service Deleted', 'Service removed.');
    } catch (err) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    }
  };

  const handleSaveOffer = async (newOffer) => {
    try {
      const res = await couponsApi.createCoupon({
        code: newOffer.code,
        discount_amount: parseFloat(newOffer.discount),
        type: newOffer.discountType === 'percentage' ? 'percentage' : 'fixed',
        is_active: true,
      });
      if (res.success) {
        loadAllData();
        showToast('Coupon Created', `${newOffer.code} is now live.`);
      }
    } catch (err) {
      setOffers((prev) => [newOffer, ...prev]);
      showToast('Coupon Created', `${newOffer.code} is now live.`);
    }
  };

  const toggleSalaryStatus = async (staffId, targetMonth = 'Nov-2026') => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;

    const newStatus = staff.status === 'Paid' ? 'Pending' : 'Paid';
    const paidDate =
      newStatus === 'Paid'
        ? new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : '-';

    // 1. Instant optimistic state update (0ms)
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status: newStatus, paidDate } : s))
    );

    // 2. Persist to API
    try {
      await payrollApi.paySalary({
        staff_id: staff.id,
        amount: Number(staff.baseSalary),
        month: targetMonth,
        status: newStatus,
        payment_mode: staff.paymentMode || 'UPI Transfer',
      });
      // Refresh metrics to keep net profit in sync with database
      dashboardApi
        .getMetrics('all')
        .then((res) => {
          if (res?.metrics) setBackendMetrics(res.metrics);
        })
        .catch(() => {});
    } catch (err) {
      console.warn('API pay salary error:', err);
    }
  };

  const payAllPendingSalaries = async (month = 'Nov-2026') => {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    // 1. Instant optimistic state update (0ms)
    setStaffList((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'Paid',
        paidDate: today,
      }))
    );

    // 2. Persist to API
    try {
      await payrollApi.payAll(month);
      dashboardApi
        .getMetrics('all')
        .then((res) => {
          if (res?.metrics) setBackendMetrics(res.metrics);
        })
        .catch(() => {});
    } catch (err) {
      console.warn('Background pay all error:', err);
    }
  };

  const handleAddStaff = async (newStaff) => {
    const tempId = Date.now();
    const optimisticStaff = normalizeStaff({
      id: tempId,
      ...newStaff,
      baseSalary: newStaff.base_salary || newStaff.baseSalary,
      bankName: newStaff.bank_name || newStaff.bankName,
      accountNumber: newStaff.account_number || newStaff.accountNumber,
      ifscCode: newStaff.ifsc_code || newStaff.ifscCode,
      upiId: newStaff.upi_id || newStaff.upiId,
      status: 'Pending',
    });

    // 1. Instant optimistic update (0ms)
    setStaffList((prev) => [...prev, optimisticStaff]);
    setShowStaffModal(false);

    // 2. Background API call
    try {
      const res = await payrollApi.createStaff({
        name: newStaff.name,
        email: newStaff.email || `staff_${Date.now()}@washflow.in`,
        password: newStaff.password || 'password123',
        phone: newStaff.phone,
        address: newStaff.address,
        staff_role: newStaff.staff_role || newStaff.role,
        base_salary: Number(newStaff.base_salary || newStaff.baseSalary),
        bank_name: newStaff.bank_name || newStaff.bankName,
        account_holder_name: newStaff.account_holder_name || newStaff.accountHolderName,
        account_number: newStaff.account_number || newStaff.accountNumber,
        ifsc_code: newStaff.ifsc_code || newStaff.ifscCode,
        upi_id: newStaff.upi_id || newStaff.upiId,
      });
      if (res?.staff?.id) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === tempId ? normalizeStaff(res.staff) : s))
        );
      }
    } catch (err) {
      console.warn('Background add staff warning:', err.message);
    }
  };

  const handleReviewLeave = async (id, data) => {
    // 1. Instant optimistic update in leavesList (0ms)
    setLeavesList((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: data.status,
              is_paid: data.is_paid,
              deduction_amount: data.deduction_amount,
            }
          : l
      )
    );

    // 2. Background API call
    try {
      await leavesApi.reviewLeave(id, data);
    } catch (err) {
      console.warn('Background leave review warning:', err.message);
    }
  };

  const handlePaySalaryConfirmed = async (payload) => {
    // 1. Instant optimistic update (0ms)
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === payload.staff_id
          ? {
              ...s,
              status: 'Paid',
              paidDate: 'Just now',
            }
          : s
      )
    );

    // 2. Persist to API
    try {
      await payrollApi.paySalary({
        ...payload,
        status: 'Paid',
      });
      // Refresh metrics to keep net profit in sync with database
      dashboardApi
        .getMetrics('all')
        .then((res) => {
          if (res?.metrics) setBackendMetrics(res.metrics);
        })
        .catch(() => {});
    } catch (err) {
      console.warn('Background pay salary warning:', err.message);
    }
  };

  // Badges helper for sidebar
  const getBadge = (itemId) => {
    if (itemId === 'pipeline') return orders.filter((o) => o.stage !== 'delivered').length;
    if (itemId === 'orders') return orders.length;
    if (itemId === 'customers') return customers.length;
    if (itemId === 'services') return services.length;
    if (itemId === 'offers') return offers.filter((o) => o.active).length;
    if (itemId === 'staff') return staffList.length;
    if (itemId === 'payroll') return staffList.filter((s) => s.status === 'Pending').length || null;
    if (itemId === 'leaves') return leavesList.filter((l) => l.status === 'pending').length || null;
    return null;
  };

  // ==========================================
  // VIEW MODE 1: CUSTOMER PORTAL
  // ==========================================
  if (viewMode === 'customer') {
    return (
      <>
        <CustomerPortal
          onGoHome={() => setViewMode('home')}
          onLogoutSuccess={handleLogout}
          initialTab={customerInitialTab}
          initialService={customerInitialService}
        />

        {IS_DEMO_MODE && (
          <DemoFloatingBar
            onSwitchToAdmin={handleAdminLoginSuccess}
            onSwitchToStaff={handleStaffAuthSuccess}
            onSwitchToCustomer={handleCustomerAuthSuccess}
            onGoHome={() => setViewMode('home')}
            onDataReset={() => {
              loadAllData();
              showToast('Demo Reset', 'Mock data restored to default.');
            }}
          />
        )}
      </>
    );
  }

  // ==========================================
  // VIEW MODE 2: PUBLIC HOMEPAGE (UNAUTHENTICATED OR VISITORS)
  // ==========================================
  if (viewMode === 'home' || !currentUser) {
    return (
      <>
        <Homepage
          currentUser={currentUser}
          onOpenCustomerAuth={() => setShowCustomerAuthModal(true)}
          onOpenStaffAuth={() => setShowStaffAuthModal(true)}
          onOpenAdminAuth={() => setShowAdminAuthModal(true)}
          onGoToCustomerPortal={handleGoToCustomerPortal}
          onDirectBook={(srv) => {
            if (currentUser?.role === 'customer') {
              handleGoToCustomerPortal('book', srv);
            } else {
              setShowCustomerAuthModal(true);
            }
          }}
        />

        {/* Dedicated Auth Modals */}
        <CustomerAuthModal
          isOpen={showCustomerAuthModal}
          onClose={() => setShowCustomerAuthModal(false)}
          onAuthSuccess={handleCustomerAuthSuccess}
        />

        <StaffAuthModal
          isOpen={showStaffAuthModal}
          onClose={() => setShowStaffAuthModal(false)}
          onAuthSuccess={handleStaffAuthSuccess}
        />

        <AdminLoginModal
          isOpen={showAdminAuthModal}
          onClose={() => setShowAdminAuthModal(false)}
          onLoginSuccess={handleAdminLoginSuccess}
        />

        {IS_DEMO_MODE && (
          <DemoFloatingBar
            onSwitchToAdmin={handleAdminLoginSuccess}
            onSwitchToStaff={handleStaffAuthSuccess}
            onSwitchToCustomer={handleCustomerAuthSuccess}
            onGoHome={() => setViewMode('home')}
            onDataReset={() => {
              loadAllData();
              showToast('Demo Reset', 'Mock data restored to default.');
            }}
          />
        )}
      </>
    );
  }

  // ==========================================
  // VIEW MODE 3: ADMIN & STAFF CRM WORKSPACE (RBAC PROTECTED)
  // ==========================================
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 flex selection:bg-sky-500 selection:text-white">
      {/* Fixed Desktop Sidebar & Mobile Off-Canvas Drawer */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
        pipelineFullScreen={pipelineFullScreen}
        currentUser={currentUser}
        setShowNewOrderModal={setShowNewOrderModal}
        getBadge={getBadge}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header
          activePage={activePage}
          financials={financials}
          apiConnected={apiConnected}
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoHome={() => setViewMode('home')}
          onRefresh={loadAllData}
          isLoading={isLoading}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main
          className={`flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 ${
            pipelineFullScreen ? 'fixed inset-0 z-50 bg-slate-50 p-4 sm:p-6' : ''
          }`}
        >
          <AnimatePresence mode="wait">
            {/* Dashboard: ADMIN ONLY */}
            {activePage === 'dashboard' && currentUser?.role === 'admin' && (
              <Dashboard
                orders={orders}
                financials={financials}
                stages={INITIAL_STAGES}
                setActivePage={setActivePage}
                setShowNewOrderModal={setShowNewOrderModal}
              />
            )}

            {/* Pipeline: Both Admin and Staff can use */}
            {activePage === 'pipeline' && (
              <OrderPipeline
                orders={orders}
                stages={INITIAL_STAGES}
                pipelineSearch={pipelineSearch}
                setPipelineSearch={setPipelineSearch}
                pipelineDayFilter={pipelineDayFilter}
                setPipelineDayFilter={setPipelineDayFilter}
                autoWhatsappOnMove={autoWhatsappOnMove}
                setAutoWhatsappOnMove={setAutoWhatsappOnMove}
                pipelineLayoutJugaad={pipelineLayoutJugaad}
                setPipelineLayoutJugaad={setPipelineLayoutJugaad}
                pipelineFullScreen={pipelineFullScreen}
                setPipelineFullScreen={setPipelineFullScreen}
                stagePageMap={stagePageMap}
                setStagePageMap={setStagePageMap}
                expandedOrderItems={expandedOrderItems}
                setExpandedOrderItems={setExpandedOrderItems}
                moveOrderStage={moveOrderStage}
                updateOrderStageDirect={moveOrderStage}
                setShowNewOrderModal={setShowNewOrderModal}
                sendWhatsAppNotification={sendWhatsAppNotification}
                onRefresh={loadAllData}
                isLoading={isLoading}
              />
            )}

            {/* All Orders: Both Admin and Staff can use */}
            {activePage === 'orders' && (
              <AllOrders
                orders={orders}
                stages={INITIAL_STAGES}
                ordersStageTab={ordersStageTab}
                setOrdersStageTab={setOrdersStageTab}
                ordersDayFilter={ordersDayFilter}
                setOrdersDayFilter={setOrdersDayFilter}
                ordersDateFilter={ordersDateFilter}
                setOrdersDateFilter={setOrdersDateFilter}
                ordersSearch={ordersSearch}
                setOrdersSearch={setOrdersSearch}
                moveOrderStage={moveOrderStage}
                updateOrderStageDirect={moveOrderStage}
                setShowNewOrderModal={setShowNewOrderModal}
                sendWhatsAppNotification={sendWhatsAppNotification}
                onRefresh={loadAllData}
                isLoading={isLoading}
              />
            )}

            {/* Customers Directory */}
            {activePage === 'customers' && (
              <Customers
                customers={customers}
                orders={orders}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                selectedCustomerDetail={selectedCustomerDetail}
                setSelectedCustomerDetail={setSelectedCustomerDetail}
                setShowNewCustomerModal={setShowNewCustomerModal}
                setShowNewOrderModal={setShowNewOrderModal}
              />
            )}

            {/* Services: View and Edit */}
            {activePage === 'services' && (
              <Services
                services={services}
                orders={orders}
                handleToggleService={handleToggleService}
                handleDeleteService={handleDeleteService}
                setEditingService={setEditingService}
                setServiceForm={setServiceForm}
                setShowServiceModal={setShowServiceModal}
                showToast={showToast}
              />
            )}

            {/* Offers & Coupons: ADMIN ONLY */}
            {activePage === 'offers' && currentUser?.role === 'admin' && (
              <Offers
                offers={offers}
                setOffers={setOffers}
                offerFilter={offerFilter}
                setOfferFilter={setOfferFilter}
                setShowOfferModal={setShowOfferModal}
                showToast={showToast}
              />
            )}

            {/* Staff Management Directory: ADMIN ONLY */}
            {activePage === 'staff' && currentUser?.role === 'admin' && (
              <Staff
                staffList={staffList}
                onViewStaff={handleViewStaff}
                setShowStaffModal={setShowStaffModal}
              />
            )}

            {/* Staff Full Profile Detail Page: ADMIN ONLY */}
            {activePage === 'staff-detail' && currentUser?.role === 'admin' && (
              <StaffDetailPage
                staff={selectedStaffForView}
                onBack={() => setActivePage('staff')}
                onPaySalary={(stf) => {
                  setActivePage('payroll');
                }}
              />
            )}

            {/* Month-Wise Payroll: ADMIN ONLY */}
            {activePage === 'payroll' && currentUser?.role === 'admin' && (
              <Payroll
                staffList={staffList}
                setStaffList={setStaffList}
                financials={financials}
                setShowStaffModal={setShowStaffModal}
                payAllPendingSalaries={payAllPendingSalaries}
                toggleSalaryStatus={toggleSalaryStatus}
                onPaySalaryConfirmed={handlePaySalaryConfirmed}
                onViewStaff={handleViewStaff}
              />
            )}

            {/* Staff Leaves: ADMIN VIEW */}
            {activePage === 'leaves' && currentUser?.role === 'admin' && (
              <AdminLeaves
                leaves={leavesList}
                onReviewLeave={handleReviewLeave}
                isLoading={isLoading}
              />
            )}

            {/* Staff Leaves: STAFF SELF-SERVICE */}
            {activePage === 'leaves' && currentUser?.role === 'staff' && (
              <StaffLeaves />
            )}

            {/* Staff Salary Payouts: STAFF SELF-SERVICE */}
            {activePage === 'payouts' && currentUser?.role === 'staff' && (
              <StaffPayouts />
            )}

            {/* Staff Profile & Bank Settings: STAFF SELF-SERVICE */}
            {activePage === 'profile' && currentUser?.role === 'staff' && (
              <StaffProfile currentUser={currentUser} />
            )}

            {/* Store Settings: ADMIN ONLY */}
            {activePage === 'store-settings' && currentUser?.role === 'admin' && (
              <StoreSettings showToast={showToast} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals for CRM Workspace */}
      <NewOrderModal
        show={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        customers={customers}
        services={services}
        offers={offers}
        newOrderForm={newOrderForm}
        setNewOrderForm={setNewOrderForm}
        onSubmit={handleCreateOrder}
      />

      <NewCustomerModal
        show={showNewCustomerModal}
        onClose={() => setShowNewCustomerModal(false)}
        newCustomerForm={newCustomerForm}
        setNewCustomerForm={setNewCustomerForm}
        onSubmit={handleAddCustomer}
      />

      <ServiceModal
        show={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        editingService={editingService}
        serviceForm={serviceForm}
        setServiceForm={setServiceForm}
        onSubmit={handleSaveService}
      />

      <OfferModal
        show={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        onSubmit={handleSaveOffer}
      />

      <StaffModal
        show={showStaffModal}
        onClose={() => setShowStaffModal(false)}
        onAddStaff={handleAddStaff}
        onSubmit={handleAddStaff}
      />

      <CustomerDetailModal
        customer={selectedCustomerDetail}
        orders={orders}
        onClose={() => setSelectedCustomerDetail(null)}
      />

      {IS_DEMO_MODE && (
        <DemoFloatingBar
          onSwitchToAdmin={handleAdminLoginSuccess}
          onSwitchToStaff={handleStaffAuthSuccess}
          onSwitchToCustomer={handleCustomerAuthSuccess}
          onGoHome={() => setViewMode('home')}
          onDataReset={() => {
            loadAllData();
            showToast('Demo Reset', 'Mock data restored to default.');
          }}
        />
      )}
    </div>
  );
}
