import api from './api';

export const policyService = {
  getPolicies: async (params = {}) => {
    const response = await api.get('/policies', { params });
    return response.data;
  },

  getPolicyById: async (id) => {
    const response = await api.get(`/policies/${id}`);
    return response.data;
  },

  createPolicy: async (policyData) => {
    const response = await api.post('/policies', policyData);
    return response.data;
  },

  updatePolicy: async (id, policyData) => {
    const response = await api.put(`/policies/${id}`, policyData);
    return response.data;
  },

  deletePolicy: async (id) => {
    const response = await api.delete(`/policies/${id}`);
    return response.data;
  },

  checkCompliance: async (expenseData) => {
    const response = await api.post('/policies/check-compliance', expenseData);
    return response.data;
  },
};

export default policyService;
