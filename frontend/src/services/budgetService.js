import api from './api';
import budgetMockService from './mock/budgetMockService';

export const budgetService = {
  getBudgets: async (params = {}) => {
    try {
      const response = await api.get('/budgets', { params });
      return response.data;
    } catch (err) {
      console.warn('Budget backend unavailable, using mock service:', err);
      return budgetMockService.getBudgets(params);
    }
  },
  createBudget: async (data) => {
    try {
      const response = await api.post('/budgets', data);
      return response.data;
    } catch (err) {
      console.warn('Budget backend unavailable, using mock service:', err);
      return budgetMockService.createBudget(data);
    }
  },
  updateBudget: async (id, data) => {
    try {
      const response = await api.put(`/budgets/${id}`, data);
      return response.data;
    } catch (err) {
      console.warn('Budget backend unavailable, using mock service:', err);
      return budgetMockService.updateBudget(id, data);
    }
  },
  deleteBudget: async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Budget backend unavailable, using mock service:', err);
      return budgetMockService.deleteOrCloseBudget(id, 'delete');
    }
  },
};

export default budgetService;
