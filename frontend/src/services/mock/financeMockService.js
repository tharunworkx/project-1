import { mockFinancialAnalyticsData } from './financeMockData';

export const financeMockService = {
  getFinancialOverview: async (dateRange = 'This Month') => {
    await new Promise((res) => setTimeout(res, 60));
    // Provide slight dynamic variation depending on selected date filter
    const multiplier =
      dateRange === 'Last 7 Days'
        ? 0.25
        : dateRange === 'Last 30 Days'
        ? 0.95
        : dateRange === 'This Month'
        ? 1.0
        : dateRange === 'Last Month'
        ? 0.9
        : dateRange === 'This Quarter'
        ? 2.8
        : dateRange === 'This Year'
        ? 6.2
        : 1.0;

    const base = mockFinancialAnalyticsData.overview;
    return {
      ...base,
      totalExpenses: Math.round(base.totalExpenses * multiplier),
      approvedExpenses: Math.round(base.approvedExpenses * multiplier),
      pendingExpenses: Math.round(base.pendingExpenses * multiplier),
      reimbursedAmount: Math.round(base.reimbursedAmount * multiplier),
      pendingReimbursement: Math.round(base.pendingReimbursement * multiplier),
    };
  },

  getExpenseTrend: async () => {
    return mockFinancialAnalyticsData.monthlyTrend;
  },

  getDepartmentSpending: async () => {
    return mockFinancialAnalyticsData.departmentSpending;
  },

  getCategorySpending: async () => {
    return mockFinancialAnalyticsData.categorySpending;
  },

  getReimbursementAnalytics: async () => {
    return mockFinancialAnalyticsData.reimbursementStatusDistribution;
  },

  getExpenseStatusDistribution: async () => {
    return mockFinancialAnalyticsData.expenseStatusDistribution;
  },
};

export default financeMockService;

