import { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import authService from '../services/authService';
import { supabase } from '../services/supabaseStorage';

const AuthContext = createContext(null);

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

  // Sync session state to localStorage
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

  // Clean stale mock stores and continuously verify that active user STILL exists in Supabase
  useEffect(() => {
    localStorage.removeItem('registered_users');

    const verifyUserStillExistsInSupabase = async () => {
      if (!user?.email) return;
      try {
        const { data: dbUser, error } = await supabase
          .from('users')
          .select('id, email, role, department, first_name, last_name')
          .eq('email', user.email.toLowerCase().trim())
          .maybeSingle();

        // If the user record was deleted from Supabase, immediately invalidate session
        if (!error && !dbUser) {
          console.warn('Session revoked: User account was deleted from Supabase.');
          setUser(null);
          setToken(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        } else if (dbUser) {
          // Keep role & department strictly synchronized with Supabase
          if (dbUser.role !== user.role || dbUser.department !== user.department) {
            setUser((prev) => ({
              ...prev,
              role: dbUser.role || prev.role,
              department: dbUser.department || prev.department,
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase existence check warning:', err);
      }
    };

    verifyUserStillExistsInSupabase();
  }, []);

  /**
   * Log in user strictly against Supabase
   * If the user does not exist in Supabase (or was deleted), login is denied.
   */
  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = (email || '').toLowerCase().trim();

    if (!normalizedEmail || !password) {
      setLoading(false);
      throw 'Please provide both email and password.';
    }

    try {
      // 1. Attempt Spring Boot backend login if server is running
      try {
        const data = await authService.login({ email: normalizedEmail, password });
        if (data?.user) {
          setUser(data.user);
          setToken(data.token || `token_${Date.now()}`);
          return data.user;
        }
      } catch (backendErr) {
        const errMsg = typeof backendErr === 'string' ? backendErr : backendErr?.message || '';
        // If backend explicitly rejected invalid credentials, fail immediately
        if (
          errMsg.toLowerCase().includes('bad credentials') ||
          errMsg.toLowerCase().includes('invalid') ||
          errMsg.toLowerCase().includes('not found') ||
          errMsg.toLowerCase().includes('unauthorized')
        ) {
          throw 'Invalid email or password. Please verify your credentials.';
        }
        // If backend is unreachable (e.g. on hosted Vercel site), fall through to Supabase query
      }

      // 2. Query Supabase directly (ensures deleted users CANNOT log in)
      const { data: dbUser, error: dbErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (dbErr) {
        console.error('Supabase query error:', dbErr);
        throw dbErr.message || 'Database error connecting to Supabase.';
      }

      // STRICT CHECK: User MUST exist in Supabase
      if (!dbUser) {
        throw 'Account not found in Supabase. You must sign up first before logging in.';
      }

      // 3. Verify Password against BCrypt hash stored in Supabase
      let isPasswordValid = false;
      if (dbUser.password) {
        if (dbUser.password.startsWith('$2')) {
          try {
            isPasswordValid = bcrypt.compareSync(password, dbUser.password);
          } catch (e) {
            console.error('BCrypt comparison error:', e);
          }
        } else {
          isPasswordValid = (dbUser.password === password);
        }
      }

      if (!isPasswordValid) {
        throw 'Invalid password. Please check your credentials.';
      }

      // 4. Successful login: build real authenticated session from Supabase row
      const fullName = `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim() || normalizedEmail.split('@')[0];
      const sessionUser = {
        id: dbUser.id,
        name: fullName,
        email: dbUser.email,
        role: dbUser.role || 'Employee',
        department: dbUser.department || 'Engineering',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      };

      setUser(sessionUser);
      setToken(`supabase_token_${dbUser.id}_${Date.now()}`);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user directly into Supabase
   */
  const register = async (userData) => {
    setLoading(true);
    const email = (userData.email || '').toLowerCase().trim();

    if (!email) {
      setLoading(false);
      throw 'Email is required to sign up.';
    }
    if (!userData.password) {
      setLoading(false);
      throw 'Password is required to sign up.';
    }

    const nameParts = (userData.name || '').trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Account';

    try {
      // 1. Attempt Spring Boot backend registration if online
      try {
        const payload = {
          name: userData.name,
          firstName,
          lastName,
          email,
          password: userData.password,
          department: userData.department || 'Engineering',
          role: userData.role || 'Employee',
        };
        const data = await authService.register(payload);
        if (data?.user) {
          setUser(data.user);
          setToken(data.token || `token_${Date.now()}`);
          return data.user;
        }
      } catch (backendErr) {
        const errMsg = typeof backendErr === 'string' ? backendErr : backendErr?.message || '';
        if (errMsg.toLowerCase().includes('already exists')) {
          throw 'An account with this email already exists in Supabase. Please log in.';
        }
        // If backend was unreachable (e.g. hosted on Vercel), fall through to direct Supabase registration
      }

      // 2. Direct registration in Supabase (required for hosted site without backend)
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw 'An account with this email already exists in Supabase. Please log in.';
      }

      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      const now = new Date().toISOString();

      const { data: createdUser, error: insertError } = await supabase
        .from('users')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: hashedPassword,
          department: userData.department || 'Engineering',
          role: userData.role || 'Employee',
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase user insert error:', insertError);
        throw insertError.message || 'Failed to create user in Supabase.';
      }

      const fullName = `${createdUser.first_name || ''} ${createdUser.last_name || ''}`.trim() || email.split('@')[0];
      const sessionUser = {
        id: createdUser.id,
        name: fullName,
        email: createdUser.email,
        role: createdUser.role || 'Employee',
        department: createdUser.department || 'Engineering',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      };

      setUser(sessionUser);
      setToken(`supabase_token_${createdUser.id}_${Date.now()}`);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
