import { mockNotificationsData } from './financeMockData';

const NOTIFS_STORAGE_KEY = 'ems_person3_notifications';
const PREFS_STORAGE_KEY = 'ems_person3_notification_preferences';

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

export const notificationMockService = {
  getNotifications: async (filter = 'All') => {
    await new Promise((res) => setTimeout(res, 40));
    let items = getStore();

    if (filter === 'Unread') {
      items = items.filter((n) => !n.isRead);
    } else if (filter && filter !== 'All') {
      items = items.filter((n) => n.relatedModule.toLowerCase() === filter.toLowerCase());
    }

    return items;
  },

  getUnreadCount: async () => {
    const items = getStore();
    return items.filter((n) => !n.isRead).length;
  },

  markAsRead: async (id) => {
    const items = getStore();
    const updated = items.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveStore(updated);
    return updated;
  },

  markAllAsRead: async () => {
    const items = getStore();
    const updated = items.map((n) => ({ ...n, isRead: true }));
    saveStore(updated);
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
    return newNotif;
  },

  deleteNotification: async (id) => {
    const items = getStore();
    const updated = items.filter((n) => n.id !== id);
    saveStore(updated);
    return updated;
  },

  clearAll: async () => {
    saveStore([]);
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
    return updated;
  },

  resetNotifications: () => {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(mockNotificationsData));
    return mockNotificationsData;
  },
};

export default notificationMockService;

