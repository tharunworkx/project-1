import { initialReimbursementsData } from './financeMockData';

const STORAGE_KEY = 'ems_person3_reimbursements';

const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reimbursements from storage', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReimbursementsData));
  return initialReimbursementsData;
};

const saveStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving reimbursements to storage', e);
  }
};

function filterReimbursementItems(items, filters = {}) {
  let result = [...items];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (i) =>
        i.id?.toLowerCase().includes(q) ||
        i.expenseId?.toLowerCase().includes(q) ||
        i.employeeName?.toLowerCase().includes(q) ||
        i.employeeId?.toLowerCase().includes(q) ||
        i.department?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        (i.paymentReferenceId && i.paymentReferenceId.toLowerCase().includes(q))
    );
  }

  if (filters.status && filters.status !== 'All') {
    result = result.filter((i) => i.status?.toLowerCase() === filters.status.toLowerCase());
  }

  if (filters.department && filters.department !== 'All') {
    result = result.filter((i) => i.department?.toLowerCase() === filters.department.toLowerCase());
  }

  if (filters.employee && filters.employee !== 'All') {
    result = result.filter((i) => i.employeeName?.toLowerCase() === filters.employee.toLowerCase());
  }

  if (filters.amountRange && filters.amountRange !== 'All') {
    if (filters.amountRange === 'under-2500') result = result.filter((i) => i.amount < 2500);
    else if (filters.amountRange === '2500-10000') result = result.filter((i) => i.amount >= 2500 && i.amount <= 10000);
    else if (filters.amountRange === '10000-50000') result = result.filter((i) => i.amount > 10000 && i.amount <= 50000);
    else if (filters.amountRange === 'over-50000') result = result.filter((i) => i.amount > 50000);
  }

  if (filters.dateRange && filters.dateRange !== 'All') {
    if (filters.dateRange === 'this-month') {
      result = result.filter((i) => i.approvedDate?.startsWith('2026-10'));
    }
  }

  if (filters.onlyEmployee) {
    const target = filters.onlyEmployee.toLowerCase();
    const selfItems = result.filter(
      (i) =>
        i.employeeName?.toLowerCase() === target ||
        i.employeeId?.toLowerCase() === target ||
        i.email?.toLowerCase().includes(target)
    );
    // If user has specific claims, show them; otherwise fallback to sample claims so view isn't blank
    if (selfItems.length > 0) {
      result = selfItems;
    }
  }

  if (filters.sortBy) {
    const field = filters.sortBy;
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      if (field === 'amount') return (a.amount - b.amount) * order;
      if (field === 'approvedDate') return (new Date(a.approvedDate) - new Date(b.approvedDate)) * order;
      if (field === 'employeeName') return (a.employeeName || '').localeCompare(b.employeeName || '') * order;
      if (field === 'status') return (a.status || '').localeCompare(b.status || '') * order;
      return 0;
    });
  } else {
    result.sort((a, b) => new Date(b.approvedDate) - new Date(a.approvedDate));
  }

  return result;
}

export const reimbursementMockService = {
  getReimbursementsSync: (filters = {}) => {
    const items = getStore();
    return filterReimbursementItems(items, filters);
  },

  getReimbursements: async (filters = {}) => {
    return reimbursementMockService.getReimbursementsSync(filters);
  },

  getReimbursementById: async (id) => {
    const items = getStore();
    return items.find((i) => i.id === id || i.expenseId === id) || null;
  },

  getDashboardMetricsSync: () => {
    const items = getStore();
    const approvedExpenses = items.length;
    const pendingItems = items.filter((i) => i.status === 'Pending Reimbursement' || i.status === 'Approved');
    const processingItems = items.filter((i) => i.status === 'Processing');
    const reimbursedItems = items.filter((i) => i.status === 'Reimbursed');
    const failedOrHeldItems = items.filter((i) => i.status === 'Failed' || i.status === 'On Hold');

    const totalReimbursementAmount = items.reduce((acc, i) => acc + (i.amount || 0), 0);
    const reimbursedTotal = reimbursedItems.reduce((acc, i) => acc + (i.amount || 0), 0);
    const pendingTotal = pendingItems.reduce((acc, i) => acc + (i.amount || 0), 0);

    const thisMonthReimbursements = items
      .filter((i) => i.approvedDate && i.approvedDate.startsWith('2026-10'))
      .reduce((acc, i) => acc + (i.amount || 0), 0);

    return {
      totalApprovedExpenses: approvedExpenses,
      pendingReimbursementCount: pendingItems.length,
      pendingReimbursementAmount: pendingTotal,
      processingReimbursementCount: processingItems.length,
      successfullyReimbursedCount: reimbursedItems.length,
      successfullyReimbursedAmount: reimbursedTotal,
      failedOrHeldCount: failedOrHeldItems.length,
      totalReimbursementAmount: totalReimbursementAmount,
      thisMonthReimbursementAmount: thisMonthReimbursements,
      pendingPaymentCount: pendingItems.length + processingItems.length,
    };
  },

  getDashboardMetrics: async () => {
    return reimbursementMockService.getDashboardMetricsSync();
  },

  updateStatus: async (id, newStatus, options = {}) => {
    const items = getStore();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Reimbursement claim not found');

    const item = { ...items[index] };
    item.status = newStatus;

    if (options.referenceId) {
      item.paymentReferenceId = options.referenceId;
    }
    if (options.paymentMethod) {
      item.paymentMethod = options.paymentMethod;
    }

    // Add entry to timeline
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let actionName = `Marked as ${newStatus}`;
    if (newStatus === 'Processing') actionName = 'Payment Processing Initiated';
    if (newStatus === 'Reimbursed') actionName = 'Payment Disbursed & Settled';
    if (newStatus === 'On Hold') actionName = 'Placed On Hold by Finance';
    if (newStatus === 'Failed') actionName = 'Payment Disbursement Failed';

    item.timeline = [
      ...(item.timeline || []),
      {
        action: actionName,
        user: options.user || 'Karthik Mohan',
        role: options.role || 'Finance Executive',
        timestamp: now,
        comment: options.comment || `Status updated to ${newStatus}`,
        status: newStatus === 'Failed' ? 'Failed' : newStatus === 'On Hold' ? 'Hold' : 'Completed',
      },
    ];

    if (options.comment) {
      item.financeComments = [
        ...(item.financeComments || []),
        {
          id: `fc-${Date.now()}`,
          author: options.user || 'Finance Executive',
          role: options.role || 'Finance Executive',
          timestamp: now,
          comment: options.comment,
        },
      ];
    }

    items[index] = item;
    saveStore(items);
    return item;
  },

  addFinanceComment: async (id, commentText, author = 'Karthik Mohan', role = 'Finance Executive') => {
    const items = getStore();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Reimbursement claim not found');

    const item = { ...items[index] };
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newComment = {
      id: `fc-${Date.now()}`,
      author,
      role,
      timestamp: now,
      comment: commentText,
    };

    item.financeComments = [...(item.financeComments || []), newComment];
    items[index] = item;
    saveStore(items);
    return newComment;
  },

  batchUpdateStatus: async (ids, newStatus, options = {}) => {
    const items = getStore();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let updatedCount = 0;

    const newItems = items.map((item) => {
      if (ids.includes(item.id)) {
        updatedCount++;
        return {
          ...item,
          status: newStatus,
          paymentReferenceId:
            newStatus === 'Reimbursed'
              ? `BATCH-REF-${Math.floor(100000 + Math.random() * 900000)}`
              : item.paymentReferenceId,
          timeline: [
            ...(item.timeline || []),
            {
              action: `Batch Marked as ${newStatus}`,
              user: options.user || 'Finance Executive',
              role: 'Finance Team',
              timestamp: now,
              comment: `Processed via settlement batch for ${ids.length} claims.`,
              status: 'Completed',
            },
          ],
        };
      }
      return item;
    });

    saveStore(newItems);
    return { success: true, count: updatedCount };
  },

  resetData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReimbursementsData));
    return initialReimbursementsData;
  },
};

export default reimbursementMockService;

