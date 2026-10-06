import { initialReimbursementsData, initialBudgetsData, mockEmployees } from './financeMockData';

export const REPORT_TYPES = [
  'Expense Report',
  'Reimbursement Report',
  'Department Spending Report',
  'Category Spending Report',
  'Budget Report',
  'Policy Violation Report',
  'Employee Expense Report',
  'Monthly Financial Report',
];

export const reportMockService = {
  getReportTypes: () => REPORT_TYPES,

  generateReport: async (criteria = {}) => {
    await new Promise((res) => setTimeout(res, 120));
    const type = criteria.reportType || 'Expense Report';

    let records = [];
    let summaryMetrics = {};
    let title = `${type} - Q4 2026`;

    if (type === 'Budget Report') {
      records = initialBudgetsData.map((b) => ({
        id: b.id,
        primaryText: b.name,
        secondaryText: b.department,
        category: b.category,
        period: b.period,
        allocated: b.allocated,
        spent: b.spent,
        remaining: b.remaining,
        metric: `${b.utilization}%`,
        status: b.status,
      }));

      const totalAllocated = records.reduce((acc, r) => acc + r.allocated, 0);
      const totalSpent = records.reduce((acc, r) => acc + r.spent, 0);

      summaryMetrics = {
        totalRecords: records.length,
        totalAmount: totalSpent,
        totalAllocated,
        averageUtilization: `${(totalAllocated ? (totalSpent / totalAllocated) * 100 : 0).toFixed(1)}%`,
        complianceStatus: '2 Near Limit, 1 Over Budget',
      };
    } else if (type === 'Policy Violation Report') {
      records = initialReimbursementsData
        .filter((r) => !r.policyValidation?.isCompliant || r.status === 'On Hold')
        .map((r) => ({
          id: r.id,
          primaryText: r.employeeName,
          secondaryText: r.policyValidation?.ruleName || 'Spending Cap Violation',
          category: r.category,
          date: r.approvedDate,
          department: r.department,
          amount: r.amount,
          status: 'Flagged / Exception',
          notes: r.policyValidation?.notes || 'Room or meal allowance threshold exceeded',
        }));

      // Add a couple synthetic policy violation examples for richer analytics
      if (records.length < 3) {
        records.push({
          id: 'EXP-0992',
          primaryText: 'Michael Brown',
          secondaryText: 'Missing GST Receipt Exemption',
          category: 'Client Entertainment',
          date: '2026-10-01',
          department: 'Sales',
          amount: 6800,
          status: 'Flagged',
          notes: 'Invoice missing vendor tax identification number.',
        });
      }

      const totalViolationsAmount = records.reduce((acc, r) => acc + r.amount, 0);
      summaryMetrics = {
        totalRecords: records.length,
        totalAmount: totalViolationsAmount,
        resolvedExceptions: 1,
        pendingReview: records.length - 1,
        riskScore: 'Medium',
      };
    } else if (type === 'Reimbursement Report') {
      records = initialReimbursementsData.map((r) => ({
        id: r.id,
        claimId: r.expenseId,
        primaryText: r.employeeName,
        secondaryText: r.employeeId,
        category: r.category,
        date: r.approvedDate,
        department: r.department,
        amount: r.amount,
        status: r.status,
        paymentMethod: r.paymentMethod,
        referenceId: r.paymentReferenceId,
      }));

      const totalAmount = records.reduce((acc, r) => acc + r.amount, 0);
      const settled = records.filter((r) => r.status === 'Reimbursed');

      summaryMetrics = {
        totalRecords: records.length,
        totalAmount: totalAmount,
        settledAmount: settled.reduce((acc, r) => acc + r.amount, 0),
        settledCount: settled.length,
        pendingCount: records.length - settled.length,
      };
    } else {
      // Default: Expense Report or Category/Department/Monthly Financial Report
      records = initialReimbursementsData.map((r) => ({
        id: r.expenseId,
        claimId: r.id,
        primaryText: r.employeeName,
        secondaryText: r.description,
        category: r.category,
        date: r.approvedDate,
        department: r.department,
        amount: r.amount,
        status: r.status,
        merchant: r.merchant,
      }));

      // Apply department/employee filters if specified
      if (criteria.department && criteria.department !== 'All') {
        records = records.filter((r) => r.department === criteria.department);
      }
      if (criteria.employee && criteria.employee !== 'All') {
        records = records.filter((r) => r.primaryText === criteria.employee);
      }
      if (criteria.category && criteria.category !== 'All') {
        records = records.filter((r) => r.category === criteria.category);
      }

      const totalAmount = records.reduce((acc, r) => acc + r.amount, 0);
      summaryMetrics = {
        totalRecords: records.length,
        totalAmount: totalAmount,
        averageClaimAmount: records.length ? Math.round(totalAmount / records.length) : 0,
        approvedCount: records.filter((r) => r.status === 'Approved' || r.status === 'Reimbursed').length,
        pendingCount: records.filter((r) => r.status !== 'Approved' && r.status !== 'Reimbursed').length,
      };
    }

    return {
      title,
      type,
      generatedAt: new Date().toISOString(),
      generatedBy: criteria.user || 'Karthik Mohan',
      filtersApplied: {
        reportType: type,
        dateRange: criteria.dateRange || 'This Month (Oct 2026)',
        department: criteria.department || 'All Departments',
        employee: criteria.employee || 'All Employees',
        category: criteria.category || 'All Categories',
        currency: criteria.currency || 'INR',
      },
      summaryMetrics,
      records,
      totalAmount: summaryMetrics.totalAmount || 0,
    };
  },

  exportReport: async (reportData, format = 'csv') => {
    // Generate real downloadable CSV/Text data for CSV/Excel
    if (format === 'csv' || format === 'excel') {
      const records = reportData.records || [];
      if (records.length === 0) return true;

      const headers = Object.keys(records[0]).join(',');
      const rows = records.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v || '').replace(/"/g, '""')}"`)
          .join(',')
      );
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `${reportData.type.replace(/\s+/g, '_')}_${new Date().toISOString().substring(0, 10)}.${
          format === 'excel' ? 'csv' : 'csv'
        }`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }

    // PDF format mock preview
    return true;
  },
};

export default reportMockService;

