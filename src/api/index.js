import apiClient from './client';

// ==========================================
// 1. ADMIN & STAFF AUTHENTICATION API
// ==========================================
export const authApi = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('washflow_token', res.data.token);
      localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('washflow_token', res.data.token);
      localStorage.setItem('washflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('washflow_token');
      localStorage.removeItem('washflow_user');
      localStorage.removeItem('washflow_customer');
    }
  },

  getUser: async () => {
    const res = await apiClient.get('/user');
    return res.data;
  },
};

// ==========================================
// 2. CUSTOMER PORTAL DEDICATED API
// ==========================================
export const customerApi = {
  register: async (data) => {
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

  login: async (credentials) => {
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

  getDashboard: async () => {
    const res = await apiClient.get('/customer/dashboard');
    return res.data;
  },

  getOrders: async () => {
    const res = await apiClient.get('/customer/orders');
    return res.data;
  },

  bookOrder: async (orderData) => {
    const res = await apiClient.post('/customer/orders', orderData);
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/customer/profile');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/customer/profile', profileData);
    if (res.data?.customer) {
      localStorage.setItem('washflow_customer', JSON.stringify(res.data.customer));
    }
    return res.data;
  },
};

// ==========================================
// 3. DASHBOARD & METRICS API (ADMIN)
// ==========================================
export const dashboardApi = {
  getMetrics: async (period = 'all') => {
    const res = await apiClient.get(`/dashboard/metrics?period=${period}`);
    return res.data;
  },
};

// ==========================================
// 4. ORDERS & PIPELINE API
// ==========================================
export const ordersApi = {
  getPipeline: async (params = {}) => {
    const res = await apiClient.get('/orders/pipeline', { params });
    return res.data;
  },

  updateStage: async (orderId, stage) => {
    const res = await apiClient.put(`/orders/${orderId}/stage`, { stage });
    return res.data;
  },

  getOrders: async (params = {}) => {
    const res = await apiClient.get('/orders', { params });
    return res.data;
  },

  createOrder: async (orderData) => {
    const res = await apiClient.post('/orders', orderData);
    return res.data;
  },

  getOrder: async (id) => {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },
};

// ==========================================
// 5. CUSTOMERS API
// ==========================================
export const customersApi = {
  getCustomers: async (params = {}) => {
    const res = await apiClient.get('/customers', { params });
    return res.data;
  },

  getCustomer: async (id) => {
    const res = await apiClient.get(`/customers/${id}`);
    return res.data;
  },

  createCustomer: async (customerData) => {
    const res = await apiClient.post('/customers', customerData);
    return res.data;
  },

  updateCustomer: async (id, customerData) => {
    const res = await apiClient.put(`/customers/${id}`, customerData);
    return res.data;
  },

  deleteCustomer: async (id) => {
    const res = await apiClient.delete(`/customers/${id}`);
    return res.data;
  },
};

// ==========================================
// 6. SERVICES & PRICING API
// ==========================================
export const servicesApi = {
  getServices: async () => {
    const res = await apiClient.get('/services');
    return res.data;
  },

  createService: async (serviceData) => {
    const res = await apiClient.post('/services', serviceData);
    return res.data;
  },

  updateService: async (id, serviceData) => {
    const res = await apiClient.put(`/services/${id}`, serviceData);
    return res.data;
  },

  deleteService: async (id) => {
    const res = await apiClient.delete(`/services/${id}`);
    return res.data;
  },

  toggleActive: async (id) => {
    const res = await apiClient.patch(`/services/${id}/toggle-active`);
    return res.data;
  },
};

// ==========================================
// 7. COUPONS & OFFERS API
// ==========================================
export const couponsApi = {
  getCoupons: async () => {
    const res = await apiClient.get('/coupons');
    return res.data;
  },

  createCoupon: async (couponData) => {
    const res = await apiClient.post('/coupons', couponData);
    return res.data;
  },

  updateCoupon: async (id, couponData) => {
    const res = await apiClient.put(`/coupons/${id}`, couponData);
    return res.data;
  },

  deleteCoupon: async (id) => {
    const res = await apiClient.delete(`/coupons/${id}`);
    return res.data;
  },

  validateCoupon: async (code, cartValue) => {
    const res = await apiClient.post('/coupons/validate', {
      code,
      cart_value: cartValue,
    });
    return res.data;
  },
};

// ==========================================
// 8. STAFF & PAYROLL API
// ==========================================
export const payrollApi = {
  getStaff: async (month) => {
    const params = month ? { month } : {};
    const res = await apiClient.get('/staff', { params });
    return res.data;
  },

  createStaff: async (data) => {
    const res = await apiClient.post('/staff', data);
    return res.data;
  },

  updateStaff: async (id, data) => {
    const res = await apiClient.put(`/staff/${id}`, data);
    return res.data;
  },

  paySalary: async (payload) => {
    const res = await apiClient.post('/payroll/pay', payload);
    return res.data;
  },

  payAll: async (month) => {
    const res = await apiClient.post('/payroll/pay-all', { month });
    return res.data;
  },

  // Staff Self-Service Endpoints
  getStaffProfile: async () => {
    const res = await apiClient.get('/staff/profile');
    return res.data;
  },

  updateStaffProfile: async (data) => {
    const res = await apiClient.put('/staff/profile', data);
    return res.data;
  },

  getStaffPayouts: async () => {
    const res = await apiClient.get('/staff/payouts');
    return res.data;
  },
};

// ==========================================
// 9. LEAVES MANAGEMENT API
// ==========================================
export const leavesApi = {
  // Admin: Get all leave requests
  getLeaves: async (params = {}) => {
    const res = await apiClient.get('/leaves', { params });
    return res.data;
  },

  // Admin: Review leave (approve with paid/unpaid deduction or reject)
  reviewLeave: async (id, data) => {
    const res = await apiClient.put(`/leaves/${id}/review`, data);
    return res.data;
  },

  // Staff: Get own leaves
  getStaffLeaves: async () => {
    const res = await apiClient.get('/staff/leaves');
    return res.data;
  },

  // Staff: Apply for leave
  applyLeave: async (data) => {
    const res = await apiClient.post('/staff/leaves', data);
    return res.data;
  },
};

// ==========================================
// 10. STORE SETTINGS API (ADMIN & PUBLIC)
// ==========================================
export const storeSettingsApi = {
  getSettings: async () => {
    const res = await apiClient.get('/store-settings');
    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await apiClient.put('/store-settings', settingsData);
    return res.data;
  },
};
