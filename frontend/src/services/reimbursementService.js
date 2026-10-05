import api from './api';

export const reimbursementService = {
  getReimbursements: async (params = {}) => {
    const response = await api.get('/reimbursements', { params });
    return response.data;
  },
  processPayment: async (id, paymentData) => {
    const response = await api.post(`/reimbursements/${id}/pay`, paymentData);
    return response.data;
  },
  batchProcess: async (ids) => {
    const response = await api.post('/reimbursements/batch-pay', { ids });
    return response.data;
  }
};

export default reimbursementService;
