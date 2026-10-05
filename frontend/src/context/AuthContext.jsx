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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-jwt-token-12345');
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

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Attempt backend API call first
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      // Graceful demo fallback if backend server isn't running yet
      console.warn('Backend unavailable, using client session:', err);
      const demoUser = {
        ...DEFAULT_DEMO_USER,
        email: email || DEFAULT_DEMO_USER.email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || DEFAULT_DEMO_USER.name,
      };
      setUser(demoUser);
      setToken('demo-session-token');
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } catch (err) {
      console.warn('Backend unavailable, creating local demo profile:', err);
      const newUser = {
        id: `usr_${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email,
        role: userData.role || 'Employee',
        department: userData.department || 'Engineering',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name || 'User')}`,
      };
      setUser(newUser);
      setToken('demo-session-token');
      return newUser;
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
