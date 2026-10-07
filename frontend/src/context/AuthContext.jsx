import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = null;

const INITIAL_REGISTERED_USERS = [];

const getRegisteredUsers = () => {
  try {
    const stored = localStorage.getItem('registered_users');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    const exampleEmails = [
      'alex.morgan@company.com',
      'karthik.m@company.com',
      'anita.d@company.com',
      'priya.s@company.com',
      'arun.kumar@company.com',
      'alex.m@company.com',
      'rahul.s@company.com',
      'sarah.j@company.com',
      'divya.r@company.com'
    ];
    const filtered = parsed.filter((u) => !exampleEmails.includes(u.email?.toLowerCase()));
    if (filtered.length !== parsed.length) {
      localStorage.setItem('registered_users', JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
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
            role: data.user.role || roleOverride || 'Employee',
            department: data.user.department || departmentOverride || 'Engineering & DevOps',
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
        const assignedRole = registered.role || roleOverride || 'Employee';
        const assignedDept = registered.department || departmentOverride || 'Engineering & DevOps';

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
        const payload = {
          name: userData.name,
          firstName: userData.name ? userData.name.split(' ')[0] : 'User',
          lastName: userData.name && userData.name.includes(' ') ? userData.name.substring(userData.name.indexOf(' ') + 1) : 'Account',
          email: email,
          password: userData.password,
          department: userData.department || 'Engineering',
          role: userData.role || 'Employee',
        };
        const data = await authService.register(payload);
        if (data?.user) {
          setUser(data.user);
          setToken(data.token || data.accessToken || `token_${Date.now()}`);
          return data.user;
        }
      } catch (backendErr) {
        console.error('Backend registration error:', backendErr);
        if (typeof backendErr === 'string' && (backendErr.includes('already exists') || backendErr.includes('Password') || backendErr.includes('valid'))) {
          throw backendErr;
        }
        throw backendErr;
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
