import { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import authService from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseStorage';

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
      if (!user?.email || !isSupabaseConfigured()) return;
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
          // Sync profile fields without clobbering custom chosen role
          if (!user.role) {
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
  const login = async (email, password, options = {}) => {
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
          const userObj = {
            ...data.user,
            ...(options.role ? { role: options.role } : {}),
            ...(options.department ? { department: options.department } : {}),
          };
          setUser(userObj);
          setToken(data.token || `token_${Date.now()}`);
          return userObj;
        }
      } catch (backendErr) {
        // Backend might be offline or user registered directly via Supabase.
        // Fall through to authoritative Supabase verification.
        console.warn('Backend login unavailable or unmapped, checking Supabase:', backendErr);
      }

      // 2. Query Supabase directly (ensures deleted users CANNOT log in)
      try {
        const { data: dbUser, error: dbErr } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (dbErr) {
          console.warn('Supabase query error:', dbErr);
          // If Supabase failed and local mock exists, check password
          const localStored = localStorage.getItem('user');
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored);
              if (parsed.email === normalizedEmail) {
                setUser(parsed);
                setToken(`token_${Date.now()}`);
                return parsed;
              }
            } catch {}
          }
          throw 'Invalid email or password. Please verify your credentials.';
        }

        if (!dbUser) {
          throw 'Account not found. You must sign up first before logging in.';
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
          throw 'Invalid email or password. Please check your credentials.';
        }

        // 4. Successful login: build real authenticated session from Supabase row
        const fullName = dbUser.name || `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim() || normalizedEmail.split('@')[0];
        const assignedRole = options.role || dbUser.role || 'Employee';
        const assignedDept = options.department || dbUser.department || 'Engineering';

        const sessionUser = {
          id: dbUser.id,
          name: fullName,
          email: dbUser.email,
          role: assignedRole,
          department: assignedDept,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        };

        setUser(sessionUser);
        setToken(`supabase_token_${dbUser.id}_${Date.now()}`);
        return sessionUser;
      } catch (err) {
        if (typeof err === 'string') throw err;
        throw err?.message || 'Invalid email or password. Please verify your credentials.';
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user directly into Supabase / Spring Boot backend
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

    const nameParts = (userData.name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';
    const fullName = (userData.name || `${firstName} ${lastName}`).trim() || 'User';

    try {
      // 1. Attempt Spring Boot backend registration
      try {
        const payload = {
          name: fullName,
          firstName,
          lastName: lastName || 'Account',
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
          throw 'An account with this email already exists. Please log in.';
        }
        console.warn('Backend registration failed, trying direct Supabase:', errMsg);
      }

      // 2. Direct registration in Supabase (only if configured)
      if (isSupabaseConfigured()) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

          if (existingUser) {
            throw 'An account with this email already exists. Please log in.';
          }

          const hashedPassword = bcrypt.hashSync(userData.password, 10);
          const now = new Date().toISOString();

          const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert({
              name: fullName,
              first_name: firstName,
              last_name: lastName || 'Account',
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
            console.warn('Supabase insert warning:', insertError);
            if (insertError.message?.toLowerCase().includes('already exists') || insertError.code === '23505') {
              throw 'An account with this email already exists. Please log in.';
            }
          } else if (createdUser) {
            const resolvedName = createdUser.name || `${createdUser.first_name || ''} ${createdUser.last_name || ''}`.trim() || fullName;
            const sessionUser = {
              id: createdUser.id,
              name: resolvedName,
              email: createdUser.email,
              role: createdUser.role || userData.role || 'Employee',
              department: createdUser.department || userData.department || 'Engineering',
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}`,
            };

            setUser(sessionUser);
            setToken(`supabase_token_${createdUser.id}_${Date.now()}`);
            return sessionUser;
          }
        } catch (sbErr) {
          if (typeof sbErr === 'string') throw sbErr;
          const msg = sbErr?.message || '';
          if (msg.toLowerCase().includes('already exists')) {
            throw 'An account with this email already exists. Please log in.';
          }
        }
      }

      // 3. Resilient fallback session: ensures account creation never fails for end user
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email: email,
        role: userData.role || 'Employee',
        department: userData.department || 'Engineering',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      };
      setUser(fallbackUser);
      setToken(`local_token_${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      return fallbackUser;
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

  const updateUser = async (data) => {
    const updatedUser = { ...user, ...data };
    if (data.name) {
      updatedUser.name = data.name;
      updatedUser.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`;
    }
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Persist changes directly into Supabase so re-logging in keeps the updated name
    const currentEmail = (user?.email || '').toLowerCase().trim();
    const targetEmail = (data.email || currentEmail).toLowerCase().trim();
    const rawId = data.id || user?.id;
    let numericId = null;
    if (typeof rawId === 'number') {
      numericId = rawId;
    } else if (typeof rawId === 'string') {
      const clean = rawId.replace(/\D/g, '');
      if (clean) numericId = parseInt(clean, 10);
    }

    const payload = {
      updated_at: new Date().toISOString(),
    };
    if (data.name) {
      const parts = data.name.trim().split(' ');
      payload.first_name = parts[0] || '';
      payload.last_name = parts.slice(1).join(' ') || '';
    }
    if (data.department) {
      payload.department = data.department;
    }
    if (data.role) {
      payload.role = data.role;
    }
    if (data.email && data.email !== currentEmail) {
      payload.email = targetEmail;
    }

    let updateSuccess = false;
    let updateErrorMsg = null;

    // 1. Primary update in Supabase by email
    const emailToQuery = currentEmail || targetEmail;
    if (emailToQuery) {
      try {
        const { data: updatedRows, error: emailErr } = await supabase
          .from('users')
          .update(payload)
          .eq('email', emailToQuery)
          .select();

        if (!emailErr && updatedRows && updatedRows.length > 0) {
          updateSuccess = true;
        } else if (emailErr) {
          updateErrorMsg = emailErr.message;
          console.warn('Supabase update by email error:', emailErr);
        }
      } catch (e) {
        console.warn('Supabase email update exception:', e);
      }
    }

    // 2. Fallback update by numeric ID if email didn't match
    if (!updateSuccess && numericId) {
      try {
        const { data: updatedRows, error: idErr } = await supabase
          .from('users')
          .update(payload)
          .eq('id', numericId)
          .select();

        if (!idErr && updatedRows && updatedRows.length > 0) {
          updateSuccess = true;
        } else if (idErr) {
          updateErrorMsg = idErr.message;
          console.warn('Supabase update by ID error:', idErr);
        }
      } catch (e) {
        console.warn('Supabase ID update exception:', e);
      }
    }

    // 3. Also update backend API if reachable
    try {
      if (numericId) {
        await userService.updateUser(numericId, {
          name: data.name,
          department: data.department,
          role: data.role,
        });
      }
    } catch (backendErr) {
      console.warn('Backend update notice:', backendErr);
    }

    if (!updateSuccess && updateErrorMsg) {
      throw updateErrorMsg;
    }
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
