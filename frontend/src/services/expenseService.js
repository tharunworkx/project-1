import api from './api';

export const expenseService = {
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
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
    const response = await api.post(`/expenses/${id}/approve`, { comments });
    return response.data;
  },

  rejectExpense: async (id, reason = '') => {
    const response = await api.post(`/expenses/${id}/reject`, { reason });
    return response.data;
  },

  reimburseExpense: async (id, paymentData = {}) => {
    const response = await api.post(`/expenses/${id}/reimburse`, paymentData);
    return response.data;
  },

  batchReimburse: async (ids) => {
    const response = await api.post('/expenses/batch-reimburse', { ids });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/expenses/stats/dashboard');
    return response.data;
  },
};

export default expenseService;
