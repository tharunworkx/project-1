import { mockNotificationsData } from './financeMockData';
import { supabase } from '../supabaseStorage';

const NOTIFS_STORAGE_KEY = 'ems_person3_notifications';
const PREFS_STORAGE_KEY = 'ems_person3_notification_preferences';

export const NOTIFICATION_EVENT = 'ems_notification_update';
export const EXPENSES_EVENT = 'ems_expenses_updated';

/**
 * Real-time event dispatcher supporting both local window events and cross-tab BroadcastChannel
 */
export const dispatchRealtimeEvent = (eventName, detail = {}) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('ems_realtime_sync');
        bc.postMessage({ eventName, detail, timestamp: Date.now() });
        bc.close();
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

  let bc = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('ems_realtime_sync');
      bc.onmessage = (msg) => {
        if (msg.data?.eventName === NOTIFICATION_EVENT) {
          callback(msg.data?.detail);
        }
      };
    }
  } catch (e) {
    // ignore
  }

  return () => {
    window.removeEventListener(NOTIFICATION_EVENT, handleEvent);
    window.removeEventListener('storage', handleStorage);
    if (bc) {
      try {
        bc.close();
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        dispatchRealtimeEvent(NOTIFICATION_EVENT, { source: 'supabase_users' });
      })
      .subscribe();

    supabase
      .channel('ems_expenses_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        dispatchRealtimeEvent(EXPENSES_EVENT, { source: 'supabase_expenses' });
        dispatchRealtimeEvent(NOTIFICATION_EVENT, { source: 'supabase_expenses' });
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
            link: '/admin/users',
            path: '/admin/users',
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

  approveUserRegistration: async (userId, targetRole) => {
    const cleanRole = targetRole || 'Employee';
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('users')
      .update({ role: cleanRole, updated_at: now })
      .eq('id', userId);
    dispatchRealtimeEvent(NOTIFICATION_EVENT, { action: 'approveUser', userId });
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
};

export default notificationMockService;

