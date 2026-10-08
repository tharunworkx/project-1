/**
 * Central Expense Data Store
 * Persists expenses, drafts, and proof images to localStorage
 * so that draft saving, image proof upload, and manager approvals work seamlessly.
 */

const STORAGE_KEY = 'corporate_expenses_records';

const INITIAL_EXPENSES = [
  {
    id: 'EXP-2026-085',
    merchant: 'United Airlines',
    title: 'Roundtrip Flights to Enterprise Workshop',
    category: 'Travel & Flight',
    claimant: 'Lisa Ray',
    email: 'lisa.ray@company.com',
    avatarFallback: 'LR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    department: 'Sales',
    project: 'PRJ-Gamma (Enterprise Sales)',
    paymentMode: 'Corporate Card',
    amount: '₹58,400.00',
    numericAmount: 58400,
    currency: 'INR',
    date: '05 Oct 2026',
    status: 'Pending',
    policyFlag: null,
    justification: 'Client pitch presentation in Mumbai for enterprise licensing deal.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    receiptName: 'airline_ticket_invoice.pdf',
    receiptSize: 245000,
    auditHistory: [
      { step: 'Claim Submitted with Proof', user: 'Lisa Ray', time: '05 Oct 2026, 10:15 AM', status: 'completed' },
      { step: 'Automated Policy Screening', user: 'System Bot', time: '05 Oct 2026, 10:16 AM', status: 'completed' },
      { step: 'Manager Sign-off & Audit', user: 'Sarah Connor', time: 'Awaiting Manager Sign-off', status: 'current' },
      { step: 'Disbursement & Reimbursement', user: 'Finance Batch', time: 'Pending Sign-off', status: 'upcoming' },
    ],
  },
  {
    id: 'EXP-2026-084',
    merchant: 'Metropolitan Bistro',
    title: 'Q1 Partner Dinner',
    category: 'Food & Dining',
    claimant: 'James Wilson',
    email: 'james.w@company.com',
    avatarFallback: 'JW',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    department: 'Marketing',
    project: 'PRJ-Beta (Mobile App)',
    paymentMode: 'Bank Transfer',
    amount: '₹12,250.00',
    numericAmount: 12250,
    currency: 'INR',
    date: '04 Oct 2026',
    status: 'Pending',
    policyFlag: 'Meal limit exceeded',
    justification: 'Quarterly partner networking banquet with key distributors.',
    receiptUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    proofImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    receiptName: 'dinner_receipt.jpg',
    receiptSize: 184000,
    auditHistory: [
      { step: 'Claim Submitted with Proof', user: 'James Wilson', time: '04 Oct 2026, 09:30 PM', status: 'completed' },
      { step: 'Automated Policy Screening', user: 'System Bot', time: '04 Oct 2026, 09:31 PM', status: 'completed' },
      { step: 'Manager Sign-off & Audit', user: 'Sarah Connor', time: 'Awaiting Manager Sign-off', status: 'current' },
    ],
  },
  {
    id: 'EXP-2026-081',
    merchant: 'Delta Airlines',
    title: 'Flight to Q1 Tech Summit',
    category: 'Travel & Flight',
    claimant: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    avatarFallback: 'SJ',
    department: 'Engineering',
    project: 'PRJ-Alpha (Cloud Migration)',
    paymentMode: 'Corporate Card',
    amount: '₹53,400.00',
    numericAmount: 53400,
    currency: 'INR',
    date: '05 Oct 2026',
    status: 'Approved',
    justification: 'Attending Google Cloud Next as keynote technical speaker.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    receiptName: 'delta_booking_pass.png',
    receiptSize: 312000,
    auditHistory: [
      { step: 'Claim Submitted with Proof', user: 'Sarah Jenkins', time: '05 Oct 2026, 08:00 AM', status: 'completed' },
      { step: 'Manager Sign-off & Audit', user: 'Alex Morgan', time: '05 Oct 2026, 11:30 AM', status: 'completed' },
    ],
  },
  {
    id: 'EXP-2026-080',
    merchant: 'Amazon Web Services',
    title: 'Production Cluster Compute & Storage',
    category: 'Software & Cloud',
    claimant: 'David Kim',
    email: 'david.k@company.com',
    avatarFallback: 'DK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    department: 'DevOps',
    project: 'PRJ-Alpha (Cloud Migration)',
    paymentMode: 'Corporate Card',
    amount: '₹1,04,200.00',
    numericAmount: 104200,
    currency: 'INR',
    date: '04 Oct 2026',
    status: 'Pending',
    justification: 'Quarterly compute overage charges for multi-region active replication cluster supporting enterprise onboarding phase.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    receiptName: 'aws_invoice_inv10294.pdf',
    receiptSize: 450000,
    auditHistory: [
      { step: 'Claim Submitted with Proof', user: 'David Kim', time: '04 Oct 2026, 09:14 AM', status: 'completed' },
      { step: 'Automated Policy Screening', user: 'System Bot', time: '04 Oct 2026, 09:15 AM', status: 'completed' },
      { step: 'Manager Sign-off & Audit', user: 'Sarah Connor', time: 'Awaiting Manager Sign-off', status: 'current' },
    ],
  },
  {
    id: 'EXP-DRAFT-001',
    merchant: 'Uber Business',
    title: 'Client site transit in Bangalore',
    category: 'Fuel & Transit',
    claimant: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    avatarFallback: 'AM',
    department: 'Finance & Operations',
    project: 'PRJ-Beta (Mobile App)',
    paymentMode: 'UPI Reimbursement',
    amount: '₹1,850.00',
    numericAmount: 1850,
    currency: 'INR',
    date: '06 Oct 2026',
    status: 'Draft',
    justification: 'Travel between office and client headquarters for audit review.',
    receiptUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    proofImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
    receiptName: 'uber_receipt_trip99.jpg',
    receiptSize: 95000,
    auditHistory: [
      { step: 'Draft Created / Saved', user: 'Alex Morgan', time: '06 Oct 2026, 04:15 PM', status: 'completed' },
    ],
  },
];

export const expenseStore = {
  getExpenses: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with default expenses
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    } catch (err) {
      console.warn('Storage read failed, returning initial dataset:', err);
      return INITIAL_EXPENSES;
    }
  },

  getExpenseById: (id) => {
    const list = expenseStore.getExpenses();
    const found = list.find((item) => item.id === id);
    if (found) return found;

    // Default fallback mock if id isn't in store
    return list[0] || null;
  },

  saveExpense: (data, currentUser) => {
    const list = expenseStore.getExpenses();
    const isDraft = data.status === 'Draft';
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    let expenseId = data.id;
    if (!expenseId) {
      if (isDraft) {
        const rand = Math.floor(100 + Math.random() * 900);
        expenseId = `EXP-DRAFT-${rand}`;
      } else {
        const rand = Math.floor(100 + Math.random() * 900);
        expenseId = `EXP-2026-${rand}`;
      }
    } else if (!isDraft && expenseId.startsWith('EXP-DRAFT-')) {
      // Promoting draft to full submitted claim
      const rand = Math.floor(100 + Math.random() * 900);
      expenseId = `EXP-2026-${rand}`;
    }

    const claimantName = currentUser?.name || data.claimant || 'Alex Morgan';
    const claimantEmail = currentUser?.email || data.email || 'alex.morgan@company.com';
    const initials = claimantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AM';

    const numAmt = parseFloat(data.amount) || parseFloat(data.numericAmount) || 0;
    const formattedAmount = data.currency === 'USD' ? `$${numAmt.toFixed(2)}` : `₹${numAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const newAuditHistory = data.auditHistory ? [...data.auditHistory] : [];
    if (isDraft) {
      if (newAuditHistory.length === 0) {
        newAuditHistory.push({
          step: 'Draft Created / Saved',
          user: claimantName,
          time: timeFormatted,
          status: 'completed',
        });
      }
    } else {
      newAuditHistory.push({
        step: 'Claim Submitted with Proof',
        user: claimantName,
        time: timeFormatted,
        status: 'completed',
      });
      newAuditHistory.push({
        step: 'Automated Policy Screening',
        user: 'System Bot',
        time: timeFormatted,
        status: 'completed',
      });
      newAuditHistory.push({
        step: 'Manager Sign-off & Audit',
        user: 'Sarah Connor',
        time: 'Awaiting Manager Sign-off',
        status: 'current',
      });
      newAuditHistory.push({
        step: 'Disbursement & Reimbursement',
        user: 'Finance Batch',
        time: 'Pending Sign-off',
        status: 'upcoming',
      });
    }

    const newExpense = {
      id: expenseId,
      merchant: data.merchant || 'Unspecified Merchant',
      title: data.title || (isDraft ? 'Untitled Draft' : 'Expense Claim'),
      category: data.category || 'General',
      claimant: claimantName,
      email: claimantEmail,
      avatarFallback: initials,
      avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(claimantName)}`,
      department: data.department || currentUser?.department || 'Engineering',
      project: data.project || 'General Overhead',
      paymentMode: data.paymentMode || 'Corporate Card',
      amount: formattedAmount,
      numericAmount: numAmt,
      currency: data.currency || 'INR',
      date: data.date || dateFormatted,
      status: isDraft ? 'Draft' : 'Pending',
      policyFlag: numAmt > 75000 ? 'Requires VP Sign-off' : (numAmt > 5000 && data.category === 'Meals' ? 'Meal limit exceeded' : null),
      justification: data.description || data.justification || '',
      receiptUrl: data.receiptUrl || data.proofImage || null,
      proofImage: data.proofImage || data.receiptUrl || null,
      receiptName: data.receiptName || (data.proofImage ? 'receipt_proof.jpg' : null),
      receiptSize: data.receiptSize || 0,
      receiptAttached: !!(data.proofImage || data.receiptUrl || data.receiptAttached),
      auditHistory: newAuditHistory,
      updatedAt: now.toISOString(),
    };

    // Filter out previous version if updating existing
    const filtered = list.filter((item) => item.id !== data.id && item.id !== expenseId);
    const updatedList = [newExpense, ...filtered];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Failed saving to localStorage (possibly quota exceeded):', err);
      // If quota exceeded due to huge proof image, retry without image
      try {
        const fallbackExpense = { ...newExpense, proofImage: null };
        const safeList = [fallbackExpense, ...filtered];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeList));
      } catch (e) {
        console.error('Critical localStorage write error:', e);
      }
    }

    return newExpense;
  },

  updateStatus: (id, newStatus, reason = '') => {
    const list = expenseStore.getExpenses();
    const now = new Date();
    const timeFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updatedList = list.map((item) => {
      if (item.id === id) {
        const history = [...(item.auditHistory || [])];
        history.push({
          step: `Manager Review: ${newStatus}`,
          user: 'Sarah Connor (Manager)',
          time: timeFormatted,
          status: newStatus === 'Approved' ? 'completed' : 'rejected',
          notes: reason,
        });

        return {
          ...item,
          status: newStatus,
          auditHistory: history,
        };
      }
      return item;
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Status update localStorage error:', err);
    }
    return updatedList;
  },

  deleteExpense: (id) => {
    const list = expenseStore.getExpenses();
    const filtered = list.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Delete expense localStorage error:', err);
    }
    return filtered;
  },

  addExpense: (data, user) => {
    return expenseStore.saveExpense(data, user);
  },

  updateExpenseStatus: (id, newStatus, reason = '') => {
    return expenseStore.updateStatus(id, newStatus, reason);
  },

  getPendingApprovals: () => {
    const list = expenseStore.getExpenses();
    return list.filter((item) => item.status && item.status.toLowerCase() === 'pending');
  },

  getDrafts: () => {
    const list = expenseStore.getExpenses();
    return list.filter((item) => item.status && item.status.toLowerCase() === 'draft');
  },
};

export default expenseStore;

