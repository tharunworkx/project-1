import { mockNotificationsData } from './financeMockData';
import { supabase } from '../supabaseStorage';

const NOTIFS_STORAGE_KEY = 'ems_person3_notifications';
const PREFS_STORAGE_KEY = 'ems_person3_notification_preferences';

export const NOTIFICATION_EVENT = 'ems_notification_update';
export const EXPENSES_EVENT = 'ems_expenses_updated';

let broadcastChannelInstance = null;
const getBroadcastChannel = () => {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!broadcastChannelInstance) {
    try {
      broadcastChannelInstance = new BroadcastChannel('ems_realtime_sync');
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }
  }
  return broadcastChannelInstance;
};

/**
 * Real-time event dispatcher supporting local window events and persistent cross-tab BroadcastChannel
 */
export const dispatchRealtimeEvent = (eventName, detail = {}) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    try {
      const bc = getBroadcastChannel();
      if (bc) {
        bc.postMessage({ eventName, detail, timestamp: Date.now() });
      }
    } catch (e) {
      // ignore
    }
  }
};

/**
 * Subscribe to real-time notifications with automatic cleanup
 */
export const subscribeToNotifications = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleEvent = (e) => {
    callback(e?.detail);
  };

  const handleStorage = (e) => {
    if (e.key === NOTIFS_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(NOTIFICATION_EVENT, handleEvent);
  window.addEventListener('storage', handleStorage);

  const bc = getBroadcastChannel();
  const handleBcMessage = (msg) => {
    if (msg.data?.eventName === NOTIFICATION_EVENT) {
      callback(msg.data?.detail);
    }
  };

  if (bc) {
    bc.addEventListener('message', handleBcMessage);
  }

  return () => {
    window.removeEventListener(NOTIFICATION_EVENT, handleEvent);
    window.removeEventListener('storage', handleStorage);
    if (bc) {
      try {
        bc.removeEventListener('message', handleBcMessage);
      } catch (e) {
        // ignore
      }
    }
  };
};

// Set up Supabase real-time cloud listeners if supported
if (typeof window !== 'undefined') {
  try {
    supabase
      .channel('ems_users_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        dispatchRealtimeEvent(NOTIFICATION_EVENT, { source: 'supabase_users', payload });
      })
      .subscribe();

    supabase
      .channel('ems_expenses_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, (payload) => {
        dispatchRealtimeEvent(EXPENSES_EVENT, { source: 'supabase_expenses', payload });
        dispatchRealtimeEvent(NOTIFICATION_EVENT, { source: 'supabase_expenses', payload });
      })
      .subscribe();
  } catch (err) {
    // silently continue if Supabase realtime is unavailable
  }
}

const defaultPreferences = {
  inAppNotifications: true,
  emailNotifications: true,
  approvalNotifications: true,
  reimbursementNotifications: true,
  budgetAlerts: true,
  reportNotifications: true,
  frequency: 'Instant Real-time',
};

const getStore = () => {
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading notifications', e);
  }
  localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(mockNotificationsData));
  return mockNotificationsData;
};

const saveStore = (data) => {
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
};

/**
 * Fetch real-time pending account registration requests directly from Supabase
 * Ensures any admin on any device (laptop, desktop, mobile, tablet) sees new signups immediately.
 */
export const getPendingUserNotifications = async () => {
  try {
    const { data: supaUsers, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, role, department, created_at')
      .order('id', { ascending: false });

    if (!error && Array.isArray(supaUsers)) {
      return supaUsers
        .filter((u) => typeof u.role === 'string' && u.role.startsWith('PENDING:'))
        .map((u) => {
          const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0];
          const cleanRole = u.role.replace('PENDING:', '').trim();
          return {
            id: `pending_reg_${u.id}`,
            userId: u.id,
            userEmail: u.email,
            fullName,
            requestedRole: cleanRole,
            department: u.department || 'General',
            title: 'New Account Approval Request',
            message: `${fullName} (${u.email}) requested registration as ${cleanRole} in ${u.department || 'the team'}. Administrator approval required before login.`,
            type: 'Approval Pending',
            relatedModule: 'System',
            link: '/admin/users?tab=pending',
            path: '/admin/users?tab=pending',
            isPendingUserApproval: true,
            isRead: false,
            priority: 'high',
            createdAt: u.created_at || new Date().toISOString(),
            time: 'Action Required',
          };
        });
    }
  } catch (err) {
    console.warn('Could not query pending registrations from Supabase:', err);
  }
  return [];
};

/**
 * Smart resolver to map any notification to its corresponding application workspace
 */
export const resolveNotificationLink = (item) => {
  if (!item) return '/dashboard';

  const title = (item.title || '').toLowerCase();
  const type = (item.type || '').toLowerCase();
  const module = (item.relatedModule || '').toLowerCase();
  const message = (item.message || '').toLowerCase();

  // 1. User Signup / Access Requests -> Admin Users Pending Tab
  if (
    title.includes('signup') ||
    title.includes('registration') ||
    title.includes('new account') ||
    type.includes('access request') ||
    type.includes('approval pending') ||
    item.isPendingUserApproval ||
    (module === 'users' && (title.includes('approval') || message.includes('requested') || message.includes('signup'))) ||
    (module === 'system' && (title.includes('account') || title.includes('registration')))
  ) {
    return '/admin/users?tab=pending';
  }

  // 2. Active User Approvals / General User actions
  if (title.includes('user approved') || module === 'users') {
    return '/admin/users';
  }

  // 3. Approvals queue (claims requiring manager/finance review)
  if (
    type.includes('expense submission') ||
    title.includes('claim submitted') ||
    title.includes('pending approval') ||
    module === 'approvals'
  ) {
    return '/approvals';
  }

  // 4. General Expenses list
  if (type.includes('expense approved') || type.includes('expense rejected') || module === 'expenses') {
    return '/expenses';
  }

  // 5. Reimbursements
  if (type.includes('reimbursement') || module === 'reimbursements' || module === 'reimbursement') {
    return '/reimbursements';
  }

  // 6. Budgets
  if (type.includes('budget') || module === 'budgets' || module === 'budget') {
    return '/budgets';
  }

  // 7. Reports & Analytics
  if (type.includes('report') || module === 'reports' || module === 'analytics') {
    return '/reports';
  }

  // 8. Fraud & Policy violations
  if (type.includes('policy') || type.includes('fraud') || module === 'compliance' || module === 'fraud') {
    return '/fraud-detection';
  }

  // 9. Normalize raw links
  const rawTarget = item.link || item.path || '';
  if (rawTarget) {
    if (rawTarget.includes('/organization/users') || rawTarget.includes('/users')) {
      return '/admin/users?tab=pending';
    }
    return rawTarget;
  }

  return '/notifications';
};

export const notificationMockService = {
  getNotifications: async (filter = 'All') => {
    await new Promise((res) => setTimeout(res, 40));
    const pendingNotifs = await getPendingUserNotifications();
    const localItems = getStore();

    // Prepend pending registration requests so admins see them first
    let items = [...pendingNotifs, ...localItems];

    if (filter === 'Unread') {
      items = items.filter((n) => !n.isRead);
    } else if (filter && filter !== 'All') {
      items = items.filter((n) => n.relatedModule.toLowerCase() === filter.toLowerCase());
    }

    return items;
  },

  getUnreadCount: async () => {
    const pendingNotifs = await getPendingUserNotifications();
    const items = getStore();
    return pendingNotifs.length + items.filter((n) => !n.isRead).length;
  },

  approveUserRegistration: async (userId, targetRole, userEmail = null) => {
    const cleanRole = targetRole || 'Employee';
    const now = new Date().toISOString();

    let targetEmail = userEmail;
    let targetDept = 'General';

    try {
      const { data } = await supabase
        .from('users')
        .select('id, email, department')
        .eq('id', userId)
        .maybeSingle();
      if (data) {
        if (!targetEmail) targetEmail = data.email;
        if (data.department) targetDept = data.department;
      }
    } catch (e) {}

    const { error } = await supabase
      .from('users')
      .update({ role: cleanRole, updated_at: now })
      .eq('id', userId);

    dispatchRealtimeEvent(NOTIFICATION_EVENT, {
      action: 'approveUser',
      userId,
      email: targetEmail?.toLowerCase().trim(),
      role: cleanRole,
      department: targetDept,
    });
    return { success: !error, error };
  },

  markAsRead: async (id) => {
    const items = getStore();
    const updated = items.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveStore(updated);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'markAsRead', id });
    return updated;
  },

  markAllAsRead: async () => {
    const items = getStore();
    const updated = items.map((n) => ({ ...n, isRead: true }));
    saveStore(updated);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'markAllAsRead' });
    return updated;
  },

  addNotification: async (notif) => {
    const items = getStore();
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      priority: 'high',
      ...notif,
    };
    const updated = [newNotif, ...items];
    saveStore(updated);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'addNotification', notif: newNotif });
    return newNotif;
  },

  deleteNotification: async (id) => {
    const items = getStore();
    const updated = items.filter((n) => n.id !== id);
    saveStore(updated);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'deleteNotification', id });
    return updated;
  },

  clearAll: async () => {
    saveStore([]);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'clearAll' });
    return [];
  },

  getPreferences: async () => {
    try {
      const raw = localStorage.getItem(PREFS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading notification preferences', e);
    }
    return defaultPreferences;
  },

  updatePreferences: async (prefs) => {
    const updated = { ...defaultPreferences, ...prefs };
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'preferences' });
    return updated;
  },

  resetNotifications: () => {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(mockNotificationsData));
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'reset' });
    return mockNotificationsData;
  },

  simulateRealtimeNotification: async () => {
    const samples = [
      {
        title: 'High-Value Claim Submitted',
        message: 'A travel expense claim of ₹45,200 for international conference flight was submitted by Rahul Sharma.',
        type: 'Approval Pending',
        relatedModule: 'Expense',
        link: '/approvals',
        priority: 'high',
        time: 'Just now',
      },
      {
        title: 'Budget Threshold Warning',
        message: 'Engineering Q4 Cloud Infrastructure budget reached 85% of allocated limits.',
        type: 'Budget Near Limit',
        relatedModule: 'Budget',
        link: '/budgets',
        priority: 'high',
        time: 'Just now',
      },
      {
        title: 'Perceptual AI Fraud Flag',
        message: 'Heuristic engine flagged duplicate receipt pattern for Hotel Hilton claim #EXP-908.',
        type: 'Policy Violation',
        relatedModule: 'System',
        link: '/fraud-detection',
        priority: 'high',
        time: 'Just now',
      },
      {
        title: 'Treasury Settlement Dispatched',
        message: 'Batch payment disbursement of ₹1,24,000 processed via Corporate Direct Deposit.',
        type: 'Reimbursement Processed',
        relatedModule: 'Reimbursement',
        link: '/reimbursements',
        priority: 'normal',
        time: 'Just now',
      },
      {
        title: 'Expense Claim Approved',
        message: 'Your recent business meal expense for ₹3,450 was approved by Department Head.',
        type: 'Expense Approved',
        relatedModule: 'Expense',
        link: '/expenses',
        priority: 'normal',
        time: 'Just now',
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    return notificationMockService.addNotification(picked);
  },
};

export default notificationMockService;

