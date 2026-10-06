import api from './api';
import reimbursementMockService from './mock/reimbursementMockService';

export const reimbursementService = {
  getReimbursements: async (params = {}) => {
    try {
      const response = await api.get('/reimbursements', { params });
      return response.data;
    } catch (err) {
      console.warn('Reimbursement backend unavailable, using mock service:', err);
      return reimbursementMockService.getReimbursements(params);
    }
  },
  processPayment: async (id, paymentData = {}) => {
    try {
      const response = await api.post(`/reimbursements/${id}/pay`, paymentData);
      return response.data;
    } catch (err) {
      console.warn('Reimbursement backend unavailable, using mock service:', err);
      return reimbursementMockService.updateStatus(id, 'Reimbursed', paymentData);
    }
  },
  batchProcess: async (ids) => {
    try {
      const response = await api.post('/reimbursements/batch-pay', { ids });
      return response.data;
    } catch (err) {
      console.warn('Reimbursement backend unavailable, using mock service:', err);
      return reimbursementMockService.batchUpdateStatus(ids, 'Reimbursed');
    }
  },
};

export default reimbursementService;
