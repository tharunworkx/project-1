import { initialBudgetsData } from './financeMockData';

const STORAGE_KEY = 'ems_person3_budgets';

const getStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading budgets from storage', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBudgetsData));
  return initialBudgetsData;
};

const saveStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving budgets to storage', e);
  }
};

export const budgetMockService = {
  getBudgets: async (filters = {}) => {
    await new Promise((res) => setTimeout(res, 60));
    let items = getStore();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.department.toLowerCase().includes(q) ||
          i.project.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    if (filters.department && filters.department !== 'All') {
      items = items.filter((i) => i.department.toLowerCase() === filters.department.toLowerCase());
    }

    if (filters.status && filters.status !== 'All') {
      items = items.filter((i) => i.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.period && filters.period !== 'All') {
      items = items.filter((i) => i.period.toLowerCase() === filters.period.toLowerCase());
    }

    if (filters.sortBy) {
      const field = filters.sortBy;
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        if (field === 'allocated') return (a.allocated - b.allocated) * order;
        if (field === 'spent') return (a.spent - b.spent) * order;
        if (field === 'utilization') return (a.utilization - b.utilization) * order;
        if (field === 'department') return a.department.localeCompare(b.department) * order;
        return 0;
      });
    }

    return items;
  },

  getBudgetById: async (id) => {
    const items = getStore();
    return items.find((i) => i.id === id) || null;
  },

  getBudgetMetrics: async () => {
    const items = getStore();
    const totalAllocated = items.reduce((acc, i) => acc + (i.allocated || 0), 0);
    const totalSpent = items.reduce((acc, i) => acc + (i.spent || 0), 0);
    const totalRemaining = totalAllocated - totalSpent;
    const utilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    const overBudgetList = items.filter((i) => i.status === 'Over Budget' || i.utilization > 100);
    const nearLimitList = items.filter((i) => i.status === 'Near Limit' || (i.utilization >= 80 && i.utilization <= 100));

    // Department spending breakdown
    const deptMap = {};
    items.forEach((i) => {
      deptMap[i.department] = (deptMap[i.department] || 0) + (i.spent || 0);
    });

    return {
      totalCompanyBudget: 5000000, // Overall annual authorized pool
      totalAllocatedBudget: totalAllocated,
      totalSpent: totalSpent,
      remainingBudget: totalRemaining,
      utilizationPercentage: Number(utilization.toFixed(1)),
      overBudgetDepartmentsCount: overBudgetList.length,
      nearLimitCount: nearLimitList.length,
      monthlySpending: 520000,
      departmentSpending: deptMap,
    };
  },

  createBudget: async (data) => {
    const items = getStore();
    const allocated = Number(data.allocatedAmount || data.allocated || 0);
    const spent = Number(data.spent || 0);
    const remaining = allocated - spent;
    const utilization = allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0;

    let status = 'Active';
    if (utilization > 100) status = 'Over Budget';
    else if (utilization >= 85) status = 'Near Limit';

    const newBudget = {
      id: `BDG-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || `${data.department} ${data.category || 'General'} Budget`,
      department: data.department || 'Engineering',
      project: data.project || 'General Operations',
      category: data.category || 'Travel',
      period: data.period || 'Q1 2026',
      startDate: data.startDate || '2026-01-01',
      endDate: data.endDate || '2026-03-31',
      allocated,
      spent,
      remaining,
      utilization,
      status,
      currency: data.currency || 'INR',
      description: data.description || '',
    };

    items.unshift(newBudget);
    saveStore(items);
    return newBudget;
  },

  updateBudget: async (id, updates) => {
    const items = getStore();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Budget not found');

    const existing = items[index];
    const allocated = updates.allocated !== undefined ? Number(updates.allocated) : existing.allocated;
    const spent = updates.spent !== undefined ? Number(updates.spent) : existing.spent;
    const remaining = allocated - spent;
    const utilization = allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0;

    let status = updates.status || existing.status;
    if (status !== 'Closed') {
      if (utilization > 100) status = 'Over Budget';
      else if (utilization >= 85) status = 'Near Limit';
      else status = 'Active';
    }

    const updated = {
      ...existing,
      ...updates,
      allocated,
      spent,
      remaining,
      utilization,
      status,
    };

    items[index] = updated;
    saveStore(items);
    return updated;
  },

  deleteOrCloseBudget: async (id, action = 'close') => {
    const items = getStore();
    if (action === 'delete') {
      const filtered = items.filter((i) => i.id !== id);
      saveStore(filtered);
      return { success: true, message: `Budget ${id} deleted` };
    }
    // Default: mark as Closed
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], status: 'Closed' };
      saveStore(items);
      return { success: true, message: `Budget ${id} marked as closed` };
    }
    throw new Error('Budget not found');
  },

  getDepartmentBudgetCards: async () => {
    const items = getStore();
    const deptMap = {};

    items.forEach((b) => {
      if (!deptMap[b.department]) {
        deptMap[b.department] = {
          department: b.department,
          allocated: 0,
          spent: 0,
          budgetsCount: 0,
          hasOverBudget: false,
        };
      }
      deptMap[b.department].allocated += b.allocated;
      deptMap[b.department].spent += b.spent;
      deptMap[b.department].budgetsCount += 1;
      if (b.status === 'Over Budget') deptMap[b.department].hasOverBudget = true;
    });

    return Object.values(deptMap).map((d) => {
      const remaining = d.allocated - d.spent;
      const utilization = d.allocated > 0 ? Number(((d.spent / d.allocated) * 100).toFixed(1)) : 0;
      return {
        ...d,
        remaining,
        utilization,
      };
    });
  },

  getMonthlyBudgetTrend: async () => {
    return [
      { month: 'Jan', allocated: 450000, spent: 380000 },
      { month: 'Feb', allocated: 450000, spent: 410000 },
      { month: 'Mar', allocated: 450000, spent: 465000 },
      { month: 'Apr', allocated: 500000, spent: 430000 },
      { month: 'May', allocated: 500000, spent: 490000 },
      { month: 'Jun', allocated: 500000, spent: 520000 },
    ];
  },

  resetData: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBudgetsData));
    return initialBudgetsData;
  },
};

export default budgetMockService;

