import apiClient from './client';
import {
  mockAuthApi,
  mockCustomerApi,
  mockDashboardApi,
  mockOrdersApi,
  mockCustomersApi,
  mockServicesApi,
  mockCouponsApi,
  mockPayrollApi,
  mockLeavesApi,
  mockStoreSettingsApi,
} from '../mock/mockApi';

// Determine if Demo Mode is active:
// 1. Explicit env flag VITE_DEMO_MODE=true
// 2. Production build (for static preview hosting on cPanel / laundrycrm / Netlify / Vercel)
// 3. Or when hosted on any non-localhost domain without backend
export const IS_DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === 'true' ||
  import.meta.env.VITE_DEMO_MODE === true ||
  import.meta.env.MODE === 'production' ||
  (typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1');

// Helper to execute with automatic mock fallback on network failure
async function withFallback(realFn, mockFn) {
  if (IS_DEMO_MODE) {
    return await mockFn();
  }
  try {
    return await realFn();
  } catch (err) {
    if (!err.response) {
      console.warn('[WashFlow Demo Mode] Backend unreachable, serving live mock state:', err.message);
      return await mockFn();
    }
    throw err;
  }
}

// ==========================================
// 1. ADMIN & STAFF AUTHENTICATION API
// ==========================================
export const authApi = {
  login: async (credentials) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/auth/login', credentials);
        if (res.data?.token) {
          localStorage.setItem('washflow_token', res.data.token);
          localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
        }
        return res.data;
      },
      () => mockAuthApi.login(credentials)
    );
  },

  register: async (userData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/auth/register', userData);
        if (res.data?.token) {
          localStorage.setItem('washflow_token', res.data.token);
          localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
        }
        return res.data;
      },
      () => mockAuthApi.register(userData)
    );
  },

  logout: async () => {
    try {
      if (!IS_DEMO_MODE) {
        await apiClient.post('/auth/logout').catch(() => {});
      }
    } finally {
      localStorage.removeItem('washflow_token');
      localStorage.removeItem('washflow_user');
      localStorage.removeItem('washflow_customer');
    }
    return { success: true };
  },

  getUser: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/user');
        return res.data;
      },
      () => mockAuthApi.getUser()
    );
  },
};

// ==========================================
// 2. CUSTOMER PORTAL DEDICATED API
// ==========================================
export const customerApi = {
  register: async (data) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/customer/register', data);
        if (res.data?.token) {
          localStorage.setItem('washflow_token', res.data.token);
          localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
          if (res.data.customer) {
            localStorage.setItem('washflow_customer', JSON.stringify(res.data.customer));
          }
        }
        return res.data;
      },
      () => mockCustomerApi.register(data)
    );
  },

  login: async (credentials) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/customer/login', credentials);
        if (res.data?.token) {
          localStorage.setItem('washflow_token', res.data.token);
          localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
          if (res.data.customer) {
            localStorage.setItem('washflow_customer', JSON.stringify(res.data.customer));
          }
        }
        return res.data;
      },
      () => mockCustomerApi.login(credentials)
    );
  },

  getDashboard: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/customer/dashboard');
        return res.data;
      },
      () => mockCustomerApi.getDashboard()
    );
  },

  getOrders: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/customer/orders');
        return res.data;
      },
      () => mockCustomerApi.getOrders()
    );
  },

  bookOrder: async (orderData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/customer/orders', orderData);
        return res.data;
      },
      () => mockCustomerApi.bookOrder(orderData)
    );
  },

  getProfile: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/customer/profile');
        return res.data;
      },
      () => mockCustomerApi.getProfile()
    );
  },

  updateProfile: async (profileData) => {
    return withFallback(
      async () => {
        const res = await apiClient.put('/customer/profile', profileData);
        if (res.data?.customer) {
          localStorage.setItem('washflow_customer', JSON.stringify(res.data.customer));
        }
        return res.data;
      },
      () => mockCustomerApi.updateProfile(profileData)
    );
  },
};

// ==========================================
// 3. DASHBOARD & METRICS API (ADMIN)
// ==========================================
export const dashboardApi = {
  getMetrics: async (period = 'all') => {
    return withFallback(
      async () => {
        const res = await apiClient.get(`/dashboard/metrics?period=${period}`);
        return res.data;
      },
      () => mockDashboardApi.getMetrics(period)
    );
  },
};

// ==========================================
// 4. ORDERS & PIPELINE API
// ==========================================
export const ordersApi = {
  getPipeline: async (params = {}) => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/orders/pipeline', { params });
        return res.data;
      },
      () => mockOrdersApi.getPipeline(params)
    );
  },

  updateStage: async (orderId, stage) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/orders/${orderId}/stage`, { stage });
        return res.data;
      },
      () => mockOrdersApi.updateStage(orderId, stage)
    );
  },

  getOrders: async (params = {}) => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/orders', { params });
        return res.data;
      },
      () => mockOrdersApi.getOrders(params)
    );
  },

  createOrder: async (orderData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/orders', orderData);
        return res.data;
      },
      () => mockOrdersApi.createOrder(orderData)
    );
  },

  getOrder: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.get(`/orders/${id}`);
        return res.data;
      },
      () => mockOrdersApi.getOrder(id)
    );
  },
};

// ==========================================
// 5. CUSTOMERS API
// ==========================================
export const customersApi = {
  getCustomers: async (params = {}) => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/customers', { params });
        return res.data;
      },
      () => mockCustomersApi.getCustomers(params)
    );
  },

  getCustomer: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.get(`/customers/${id}`);
        return res.data;
      },
      () => mockCustomersApi.getCustomer(id)
    );
  },

  createCustomer: async (customerData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/customers', customerData);
        return res.data;
      },
      () => mockCustomersApi.createCustomer(customerData)
    );
  },

  updateCustomer: async (id, customerData) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/customers/${id}`, customerData);
        return res.data;
      },
      () => mockCustomersApi.updateCustomer(id, customerData)
    );
  },

  deleteCustomer: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.delete(`/customers/${id}`);
        return res.data;
      },
      () => mockCustomersApi.deleteCustomer(id)
    );
  },
};

// ==========================================
// 6. SERVICES & PRICING API
// ==========================================
export const servicesApi = {
  getServices: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/services');
        return res.data;
      },
      () => mockServicesApi.getServices()
    );
  },

  createService: async (serviceData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/services', serviceData);
        return res.data;
      },
      () => mockServicesApi.createService(serviceData)
    );
  },

  updateService: async (id, serviceData) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/services/${id}`, serviceData);
        return res.data;
      },
      () => mockServicesApi.updateService(id, serviceData)
    );
  },

  deleteService: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.delete(`/services/${id}`);
        return res.data;
      },
      () => mockServicesApi.deleteService(id)
    );
  },

  toggleActive: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.patch(`/services/${id}/toggle-active`);
        return res.data;
      },
      () => mockServicesApi.toggleActive(id)
    );
  },
};

// ==========================================
// 7. COUPONS & OFFERS API
// ==========================================
export const couponsApi = {
  getCoupons: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/coupons');
        return res.data;
      },
      () => mockCouponsApi.getCoupons()
    );
  },

  createCoupon: async (couponData) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/coupons', couponData);
        return res.data;
      },
      () => mockCouponsApi.createCoupon(couponData)
    );
  },

  updateCoupon: async (id, couponData) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/coupons/${id}`, couponData);
        return res.data;
      },
      () => mockCouponsApi.updateCoupon(id, couponData)
    );
  },

  deleteCoupon: async (id) => {
    return withFallback(
      async () => {
        const res = await apiClient.delete(`/coupons/${id}`);
        return res.data;
      },
      () => mockCouponsApi.deleteCoupon(id)
    );
  },

  validateCoupon: async (code, cartValue) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/coupons/validate', {
          code,
          cart_value: cartValue,
        });
        return res.data;
      },
      () => mockCouponsApi.validateCoupon(code, cartValue)
    );
  },
};

// ==========================================
// 8. STAFF & PAYROLL API
// ==========================================
export const payrollApi = {
  getStaff: async (month) => {
    const params = month ? { month } : {};
    return withFallback(
      async () => {
        const res = await apiClient.get('/staff', { params });
        return res.data;
      },
      () => mockPayrollApi.getStaff(month)
    );
  },

  createStaff: async (data) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/staff', data);
        return res.data;
      },
      () => mockPayrollApi.createStaff(data)
    );
  },

  updateStaff: async (id, data) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/staff/${id}`, data);
        return res.data;
      },
      () => mockPayrollApi.updateStaff(id, data)
    );
  },

  paySalary: async (payload) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/payroll/pay', payload);
        return res.data;
      },
      () => mockPayrollApi.paySalary(payload)
    );
  },

  payAll: async (month) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/payroll/pay-all', { month });
        return res.data;
      },
      () => mockPayrollApi.payAll(month)
    );
  },

  getStaffProfile: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/staff/profile');
        return res.data;
      },
      () => mockPayrollApi.getStaffProfile()
    );
  },

  updateStaffProfile: async (data) => {
    return withFallback(
      async () => {
        const res = await apiClient.put('/staff/profile', data);
        return res.data;
      },
      () => mockPayrollApi.updateStaffProfile(data)
    );
  },

  getStaffPayouts: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/staff/payouts');
        return res.data;
      },
      () => mockPayrollApi.getStaffPayouts()
    );
  },
};

// ==========================================
// 9. LEAVES MANAGEMENT API
// ==========================================
export const leavesApi = {
  getLeaves: async (params = {}) => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/leaves', { params });
        return res.data;
      },
      () => mockLeavesApi.getLeaves(params)
    );
  },

  reviewLeave: async (id, data) => {
    return withFallback(
      async () => {
        const res = await apiClient.put(`/leaves/${id}/review`, data);
        return res.data;
      },
      () => mockLeavesApi.reviewLeave(id, data)
    );
  },

  getStaffLeaves: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/staff/leaves');
        return res.data;
      },
      () => mockLeavesApi.getStaffLeaves()
    );
  },

  applyLeave: async (data) => {
    return withFallback(
      async () => {
        const res = await apiClient.post('/staff/leaves', data);
        return res.data;
      },
      () => mockLeavesApi.applyLeave(data)
    );
  },
};

// ==========================================
// 10. STORE SETTINGS API (ADMIN & PUBLIC)
// ==========================================
export const storeSettingsApi = {
  getSettings: async () => {
    return withFallback(
      async () => {
        const res = await apiClient.get('/store-settings');
        return res.data;
      },
      () => mockStoreSettingsApi.getSettings()
    );
  },

  updateSettings: async (settingsData) => {
    return withFallback(
      async () => {
        const res = await apiClient.put('/store-settings', settingsData);
        return res.data;
      },
      () => mockStoreSettingsApi.updateSettings(settingsData)
    );
  },
};
