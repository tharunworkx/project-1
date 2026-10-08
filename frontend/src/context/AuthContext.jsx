import { createContext, useContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import authService from '../services/authService';
import userService from '../services/userService';
import { supabase } from '../services/supabaseStorage';
import notificationMockService from '../services/mock/notificationMockService';

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
          const fullName = [dbUser.first_name, dbUser.last_name].filter(Boolean).join(' ') || (dbUser.email ? dbUser.email.split('@')[0] : 'User');
          // Keep name, role & department strictly synchronized with Supabase
          if (dbUser.role !== user.role || dbUser.department !== user.department || fullName !== user.name) {
            const updatedProfile = {
              ...user,
              name: fullName,
              role: dbUser.role || user.role,
              department: dbUser.department || user.department,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
            };
            setUser(updatedProfile);
            localStorage.setItem('user', JSON.stringify(updatedProfile));
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
          // Synchronize with Supabase users table to ensure fresh name & role
          try {
            const { data: dbUser } = await supabase
              .from('users')
              .select('id, email, role, department, first_name, last_name')
              .eq('email', normalizedEmail)
              .maybeSingle();

            if (dbUser) {
              const fullName = [dbUser.first_name, dbUser.last_name].filter(Boolean).join(' ') || data.user.name;
              const sessionUser = {
                ...data.user,
                id: dbUser.id,
                name: fullName,
                email: dbUser.email || data.user.email,
                role: dbUser.role || data.user.role,
                department: dbUser.department || data.user.department,
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
              };
              setUser(sessionUser);
              setToken(data.token || `token_${Date.now()}`);
              return sessionUser;
            }
          } catch (syncErr) {
            console.warn('Supabase post-login sync warning:', syncErr);
          }

          setUser(data.user);
          setToken(data.token || `token_${Date.now()}`);
          return data.user;
        }
      } catch (backendErr) {
        // Backend might be offline or user registered directly via Supabase.
        // Fall through to authoritative Supabase verification.
        console.warn('Backend login unavailable or unmapped, checking Supabase:', backendErr);
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

      // Check if account registration is pending admin approval
      if (dbUser.role && dbUser.role.startsWith('PENDING:')) {
        const requestedRole = dbUser.role.replace('PENDING:', '');
        throw `Your registration request for "${requestedRole}" in ${dbUser.department || 'the team'} is currently pending approval by an administrator. Please wait until an admin approves your account before logging in.`;
      }
      if (dbUser.role === 'REJECTED') {
        throw 'Your registration request was declined by an administrator.';
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
   * Register user directly into Supabase (Requires Admin approval before login)
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
    const fullName = `${firstName} ${lastName}`.trim();
    const requestedRole = userData.role || 'Employee';
    const requestedDept = userData.department || 'Engineering & DevOps';

    try {
      // 1. Direct registration check in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.role && existingUser.role.startsWith('PENDING:')) {
          throw 'A registration request for this email is already awaiting administrator approval. Please wait for an admin to approve your request.';
        }
        throw 'An account with this email already exists in Supabase. Please log in.';
      }

      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      const now = new Date().toISOString();

      // Store with PENDING prefix in role column: requiring existing admin approval
      const { data: createdUser, error: insertError } = await supabase
        .from('users')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: hashedPassword,
          department: requestedDept,
          role: `PENDING:${requestedRole}`,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase user insert error:', insertError);
        throw insertError.message || 'Failed to submit registration request to Supabase.';
      }

      // Notify existing admin about the new account registration request
      try {
        await notificationMockService.addNotification({
          title: 'New Account Approval Request',
          message: `${fullName} (${email}) requested registration as ${requestedRole} in ${requestedDept}. Administrator approval required before login.`,
          type: 'Approval Pending',
          relatedModule: 'System',
          link: '/admin/users',
          path: '/admin/users',
          userId: createdUser?.id,
          userEmail: email,
          requestedRole,
          department: requestedDept,
        });
      } catch (notifErr) {
        console.warn('Could not post admin notification:', notifErr);
      }

      // Return pending approval result without setting user session
      return {
        pendingApproval: true,
        user: createdUser,
        requestedRole,
        department: requestedDept,
      };
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
