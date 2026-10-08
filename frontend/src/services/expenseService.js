import api from './api';

let expenseCache = null;
let cacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

export const expenseService = {
  getExpenses: async (params = {}) => {
    const isDefault = Object.keys(params).length === 0;
    if (isDefault && expenseCache && Date.now() - cacheTime < CACHE_TTL) {
      return expenseCache;
    }
    const response = await api.get('/expenses', { params });
    if (isDefault && Array.isArray(response.data)) {
      expenseCache = response.data;
      cacheTime = Date.now();
    }
    return response.data;
  },

  getExpenseById: async (id) => {
    if (expenseCache) {
      const match = expenseCache.find((e) => String(e.id) === String(id));
      if (match) return match;
    }
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    expenseCache = null;
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    expenseCache = null;
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    expenseCache = null;
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  uploadReceipt: async (file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await api.post('/expenses/upload-receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  approveExpense: async (id, comments = '') => {
    expenseCache = null;
    const response = await api.post(`/expenses/${id}/approve`, { comments });
    return response.data;
  },

  rejectExpense: async (id, reason = '') => {
    expenseCache = null;
    const response = await api.post(`/expenses/${id}/reject`, { reason });
    return response.data;
  },

  reimburseExpense: async (id, paymentData = {}) => {
    expenseCache = null;
    const response = await api.post(`/expenses/${id}/reimburse`, paymentData);
    return response.data;
  },

  batchReimburse: async (ids) => {
    expenseCache = null;
    const response = await api.post('/expenses/batch-reimburse', { ids });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/expenses/stats/dashboard');
    return response.data;
  },

  clearCache: () => {
    expenseCache = null;
    cacheTime = 0;
  },
};

export default expenseService;
