import api from './api';

export const budgetService = {
  getBudgets: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },
  createBudget: async (data) => {
    const response = await api.post('/budgets', data);
    return response.data;
  },
  updateBudget: async (id, data) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },
  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  }
};

export default budgetService;
