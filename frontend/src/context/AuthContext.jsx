import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex.morgan@company.com',
  role: 'Admin',
  department: 'Finance & Operations',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
};

const INITIAL_REGISTERED_USERS = [
  {
    id: 'usr_tharun',
    name: 'Tharun',
    email: 'tharun@mail.com',
    password: 'Tharun@123',
    role: 'Admin',
    department: 'Engineering & DevOps',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tharun',
  },
  {
    id: 'usr_001',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    password: 'password123',
    role: 'Admin',
    department: 'Executive Management',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_002',
    name: 'Karthik Mohan',
    email: 'karthik.m@company.com',
    password: 'password123',
    role: 'Finance Executive',
    department: 'Finance & Accounts',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Karthik',
  },
  {
    id: 'usr_003',
    name: 'Anita Desai',
    email: 'anita.d@company.com',
    password: 'password123',
    role: 'Finance Manager / CFO',
    department: 'Finance & Accounts',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Anita',
  },
  {
    id: 'usr_004',
    name: 'Priya Sharma',
    email: 'priya.s@company.com',
    password: 'password123',
    role: 'Manager',
    department: 'Growth & Marketing',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya',
  },
  {
    id: 'usr_005',
    name: 'Arun Kumar',
    email: 'arun.kumar@company.com',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering & DevOps',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arun',
  },
];

const getRegisteredUsers = () => {
  try {
    const stored = localStorage.getItem('registered_users');
    if (!stored) {
      localStorage.setItem('registered_users', JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    const parsed = JSON.parse(stored);
    let updated = false;
    INITIAL_REGISTERED_USERS.forEach((initUser) => {
      if (!parsed.some((u) => u.email?.toLowerCase() === initUser.email.toLowerCase())) {
        parsed.push(initUser);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('registered_users', JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_REGISTERED_USERS;
  }
};

const saveRegisteredUser = (userRecord) => {
  try {
    const users = getRegisteredUsers();
    const index = users.findIndex(
      (u) => u.email?.toLowerCase() === userRecord.email?.toLowerCase()
    );
    if (index >= 0) {
      users[index] = { ...users[index], ...userRecord };
    } else {
      users.push(userRecord);
    }
    localStorage.setItem('registered_users', JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered user:', err);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password, roleOrOptions = null, maybeDept = null) => {
    setLoading(true);
    let roleOverride = null;
    let departmentOverride = null;

    if (roleOrOptions && typeof roleOrOptions === 'object') {
      roleOverride = roleOrOptions.role;
      departmentOverride = roleOrOptions.department;
    } else {
      roleOverride = roleOrOptions;
      departmentOverride = maybeDept;
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    try {
      // 1. Attempt backend API call first
      try {
        const data = await authService.login({ email: normalizedEmail, password });
        if (data?.user) {
          const userWithOverrides = {
            ...data.user,
            ...(roleOverride ? { role: roleOverride } : {}),
            ...(departmentOverride ? { department: departmentOverride } : {}),
          };
          setUser(userWithOverrides);
          setToken(data.token || `token_${Date.now()}`);
          return userWithOverrides;
        }
      } catch (backendErr) {
        console.warn('Backend unavailable, verifying locally:', backendErr);
      }

      // 2. Check local registered users store
      const users = getRegisteredUsers();
      const registered = users.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (registered) {
        if (registered.password && registered.password !== password) {
          throw 'Invalid login credentials';
        }
        const assignedRole = roleOverride || registered.role || 'Employee';
        const assignedDept = departmentOverride || registered.department || 'Engineering & DevOps';

        const sessionUser = {
          id: registered.id || `usr_${Date.now()}`,
          name: registered.name || 'User',
          email: registered.email,
          role: assignedRole,
          department: assignedDept,
          avatar: registered.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(registered.name || 'User')}`,
        };

        // Persist updated role & department selection
        saveRegisteredUser({
          ...registered,
          role: assignedRole,
          department: assignedDept,
        });

        setUser(sessionUser);
        setToken(`session-token-${Date.now()}`);
        return sessionUser;
      }

      // 3. Demo accounts mapping
      const demoAccounts = [
        { email: 'alex.morgan@company.com', name: 'Alex Morgan', role: 'Admin', department: 'Executive Management' },
        { email: 'karthik@company.com', name: 'Karthik Mohan', role: 'Finance Executive', department: 'Finance & Accounts' },
        { email: 'anita@company.com', name: 'Anita Desai', role: 'Finance Manager / CFO', department: 'Finance & Accounts' },
        { email: 'arun@company.com', name: 'Arun Kumar', role: 'Employee', department: 'Engineering & DevOps' },
        { email: 'priya@company.com', name: 'Priya Sharma', role: 'Manager', department: 'Growth & Marketing' },
        { email: 'user@company.com', name: 'Alex Morgan', role: 'Admin', department: 'Executive Management' },
      ];

      const matchedDemo = demoAccounts.find((d) =>
        normalizedEmail.includes(d.email.split('@')[0])
      );

      if (matchedDemo) {
        const assignedRole = roleOverride || matchedDemo.role;
        const assignedDept = departmentOverride || matchedDemo.department;
        const demoUser = {
          ...DEFAULT_DEMO_USER,
          email: normalizedEmail,
          name: matchedDemo.name,
          role: assignedRole,
          department: assignedDept,
        };
        setUser(demoUser);
        setToken(`demo-session-token-${Date.now()}`);
        return demoUser;
      }

      // 4. Fallback: dynamic session with chosen credentials, role & department
      const dynamicUser = {
        id: `usr_${Date.now()}`,
        name: normalizedEmail.split('@')[0] || 'User',
        email: normalizedEmail,
        password: password,
        role: roleOverride || 'Employee',
        department: departmentOverride || 'Engineering & DevOps',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      };
      saveRegisteredUser(dynamicUser);
      setUser(dynamicUser);
      setToken(`session-token-${Date.now()}`);
      return dynamicUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const email = (userData.email || '').toLowerCase().trim();
      const newUser = {
        id: `usr_${Date.now()}`,
        name: userData.name?.trim() || (email ? email.split('@')[0] : 'New User'),
        email: email,
        password: userData.password,
        role: userData.role || 'Employee',
        department: userData.department || 'Engineering',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || 'User')}`,
      };

      // Always save to persistent registered_users store in localStorage
      saveRegisteredUser(newUser);

      // Attempt backend registration if available
      try {
        const data = await authService.register(userData);
        if (data?.user) {
          setUser(data.user);
          setToken(data.token || `token_${Date.now()}`);
          return data.user;
        }
      } catch (backendErr) {
        console.warn('Backend unavailable, continuing with local session:', backendErr);
      }

      // Establish local session
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        avatar: newUser.avatar,
      };
      setUser(sessionUser);
      setToken(`demo-session-token-${Date.now()}`);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth was called outside of AuthProvider, using default demo session.');
    return {
      user: DEFAULT_DEMO_USER,
      token: 'demo-jwt-token-12345',
      isAuthenticated: true,
      loading: false,
      login: async () => DEFAULT_DEMO_USER,
      register: async () => DEFAULT_DEMO_USER,
      logout: () => {},
      updateUser: () => {},
    };
  }
  return context;
};

export default AuthContext;
