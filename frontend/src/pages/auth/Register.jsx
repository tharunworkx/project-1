import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wallet,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { CustomSelect } from '@/components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../services/supabaseStorage';
import { subscribeToNotifications, NOTIFICATION_EVENT } from '../../services/mock/notificationMockService';
import userService from '../../services/userService';
import authService from '../../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const { register, login, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering & DevOps',
    role: 'Employee',
    password: '',
    confirmPassword: '',
  });

  const [pendingAuthInfo, setPendingAuthInfo] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ems_pending_auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem('ems_pending_auth'));
    } catch {
      return false;
    }
  });

  const [autoLoginStatus, setAutoLoginStatus] = useState('waiting'); // 'waiting' | 'logging_in' | 'rejected'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Always enforce dark theme on the register page matching login
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = localStorage.getItem('theme') || 'light';
    root.classList.add('dark');

    return () => {
      if (previousTheme === 'light') {
        root.classList.remove('dark');
      }
    };
  }, []);

  // Real-time approval listener & automatic login
  useEffect(() => {
    if (!submittedSuccess || !pendingAuthInfo?.email) return;

    let isMounted = true;
    let isProcessingLogin = false;

    const performAutoLogin = async (approvedRole, approvedDept) => {
      if (isProcessingLogin || !isMounted) return;
      isProcessingLogin = true;

      try {
        setAutoLoginStatus('logging_in');

        // Smooth transition pause so user observes successful approval
        await new Promise((res) => setTimeout(res, 600));

        await login(pendingAuthInfo.email, pendingAuthInfo.password, {
          role: approvedRole || pendingAuthInfo.role,
          department: approvedDept || pendingAuthInfo.department,
        });

        sessionStorage.removeItem('ems_pending_auth');

        if (isMounted) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.warn('Auto-login error:', err);
        const errMsg = typeof err === 'string' ? err : err?.message || '';
        if (errMsg.toLowerCase().includes('declined') || errMsg.toLowerCase().includes('rejected')) {
          if (isMounted) {
            setAutoLoginStatus('rejected');
            sessionStorage.removeItem('ems_pending_auth');
          }
        } else {
          // If still waiting or network synchronization timing, let next interval retry
          if (isMounted) {
            setAutoLoginStatus('waiting');
            isProcessingLogin = false;
          }
        }
      }
    };

    const checkStatus = async () => {
      if (isProcessingLogin || !isMounted) return;
      const normalizedEmail = pendingAuthInfo.email.toLowerCase().trim();

      // 1. Direct Supabase check
      if (isSupabaseConfigured()) {
        try {
          const { data: dbUser, error } = await supabase
            .from('users')
            .select('id, email, role, department')
            .eq('email', normalizedEmail)
            .maybeSingle();

          if (!error && dbUser) {
            if (dbUser.role && !dbUser.role.startsWith('PENDING:') && dbUser.role !== 'REJECTED') {
              await performAutoLogin(dbUser.role, dbUser.department);
              return;
            } else if (dbUser.role === 'REJECTED') {
              if (isMounted) {
                setAutoLoginStatus('rejected');
                sessionStorage.removeItem('ems_pending_auth');
              }
              return;
            }
          }
        } catch (e) {
          // ignore error and try backend
        }
      }

      // 2. Direct Backend Check via public login endpoint
      try {
        const res = await authService.login({
          email: pendingAuthInfo.email,
          password: pendingAuthInfo.password,
        });
        if (res?.user?.role) {
          if (!res.user.role.startsWith('PENDING:') && res.user.role !== 'REJECTED') {
            await performAutoLogin(res.user.role, res.user.department);
            return;
          } else if (res.user.role === 'REJECTED') {
            if (isMounted) {
              setAutoLoginStatus('rejected');
              sessionStorage.removeItem('ems_pending_auth');
            }
            return;
          }
        }
      } catch (e) {
        // Fallback: try userService.getUsers if accessible
        try {
          const users = await userService.getUsers();
          if (Array.isArray(users)) {
            const match = users.find(
              (u) => u.email?.toLowerCase().trim() === normalizedEmail
            );
            if (match) {
              if (match.role && !match.role.startsWith('PENDING:') && match.role !== 'REJECTED') {
                await performAutoLogin(match.role, match.department);
                return;
              } else if (match.role === 'REJECTED') {
                if (isMounted) {
                  setAutoLoginStatus('rejected');
                  sessionStorage.removeItem('ems_pending_auth');
                }
                return;
              }
            }
          }
        } catch (ignored) {}
      }
    };

    // Immediate check
    checkStatus();

    // Polling fallback interval every 1.5 seconds
    const interval = setInterval(checkStatus, 1500);

    // Cross-tab & broadcast event listener
    const unsubscribeNotifications = subscribeToNotifications((detail) => {
      const normalizedEmail = pendingAuthInfo.email.toLowerCase().trim();
      if (detail?.action === 'approveUser') {
        if (!detail.email || detail.email.toLowerCase().trim() === normalizedEmail) {
          performAutoLogin(detail.role, detail.department);
        }
      } else if (detail?.action === 'rejectUser') {
        if (detail.email && detail.email.toLowerCase().trim() === normalizedEmail) {
          setAutoLoginStatus('rejected');
          sessionStorage.removeItem('ems_pending_auth');
        }
      } else {
        checkStatus();
      }
    });

    // Supabase real-time websocket channel
    let channel = null;
    if (isSupabaseConfigured()) {
      try {
        const safeChannelName = `user_approval_${pendingAuthInfo.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        channel = supabase
          .channel(safeChannelName)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'users',
            },
            (payload) => {
              const updated = payload.new;
              if (updated?.email?.toLowerCase().trim() === pendingAuthInfo.email.toLowerCase().trim()) {
                if (updated.role && !updated.role.startsWith('PENDING:') && updated.role !== 'REJECTED') {
                  performAutoLogin(updated.role, updated.department);
                } else if (updated.role === 'REJECTED') {
                  setAutoLoginStatus('rejected');
                  sessionStorage.removeItem('ems_pending_auth');
                }
              }
            }
          )
          .subscribe();
      } catch (e) {
        console.warn('Realtime channel error:', e);
      }
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      }
    };
  }, [submittedSuccess, pendingAuthInfo]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await register(formData);
      if (res?.pendingApproval) {
        const authInfo = {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
          department: formData.department,
          name: formData.name,
        };
        setPendingAuthInfo(authInfo);
        sessionStorage.setItem('ems_pending_auth', JSON.stringify(authInfo));
        setSubmittedSuccess(true);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed');
    }
  };

  const displayRole = pendingAuthInfo?.role || formData.role || 'Employee';
  const displayDepartment = pendingAuthInfo?.department || formData.department || 'Engineering & DevOps';

  return (
    <div className="dark relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-black text-zinc-100 overflow-hidden select-none">
      {/* Background Animated Glowing Dots Pattern on Pure Black */}
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
        opacity={0.45}
        gap={13}
        radius={1.3}
        color="rgba(255, 255, 255, 0.3)"
        darkColor="rgba(255, 255, 255, 0.3)"
        glowColor="rgba(255, 255, 255, 0.7)"
        darkGlowColor="rgba(255, 255, 255, 0.7)"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.5}
        speedScale={1}
      />

      {/* Permanently Dark Themed Clean Register Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-[#121214] text-zinc-100 rounded-xl shadow-2xl border border-zinc-800 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        {submittedSuccess ? (
          <div className="text-center py-2 space-y-4">
            <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="size-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Registration Request Submitted</h2>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Your request to join as <strong className="text-zinc-200 font-semibold">{displayRole}</strong> in <strong className="text-zinc-200 font-semibold">{displayDepartment}</strong> has been forwarded for admin verification.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
                <Shield className="size-3.5" />
                <span>Admin Permission Required</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Existing system administrators have received a notification about your signup request. Once an administrator approves your account, you will be logged in automatically.
              </p>
            </div>

            {/* Real-time Approval & Auto-login Status Indicator */}
            {autoLoginStatus === 'logging_in' ? (
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
                <CheckCircle2 className="size-4 text-emerald-400 animate-bounce shrink-0" />
                <span>Request approved! Logging you in automatically...</span>
              </div>
            ) : autoLoginStatus === 'rejected' ? (
              <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-medium">
                  <AlertCircle className="size-4 text-rose-400 shrink-0" />
                  <span>Registration request was declined by an administrator.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('ems_pending_auth');
                    setPendingAuthInfo(null);
                    setSubmittedSuccess(false);
                    setAutoLoginStatus('waiting');
                  }}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  Return to registration form
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2.5 pt-1 text-xs text-zinc-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Waiting for administrator approval...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex size-11 items-center justify-center rounded-xl bg-zinc-900 text-white border border-zinc-800 shadow-sm mb-3">
                <Wallet className="size-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-normal">
                Join your organization's expense management platform
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 flex items-center gap-2 p-2.5 text-xs rounded-lg bg-rose-950/40 border border-rose-900 text-rose-300">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full h-10 pl-9.5 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="reg-email">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.doe@company.com"
                    className="w-full h-10 pl-9.5 pr-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
                  />
                </div>
              </div>

              {/* Department & Role Sections in Signup Page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="reg-dept">
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3.5 text-zinc-400" />
                      <span>Department</span>
                    </span>
                  </label>
                  <CustomSelect
                    id="reg-dept"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    triggerClassName="h-10 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 font-medium hover:border-zinc-700"
                    contentClassName="bg-zinc-900 border-zinc-800 text-zinc-100"
                    options={[
                      { value: "Engineering & DevOps", label: "Engineering & DevOps" },
                      { value: "Finance & Accounts", label: "Finance & Accounts" },
                      { value: "Growth & Marketing", label: "Growth & Marketing" },
                      { value: "Enterprise Sales", label: "Enterprise Sales" },
                      { value: "People & Operations", label: "People & Operations" },
                      { value: "Executive Management", label: "Executive Management" },
                    ]}
                  />
                </div>

                {/* Requested Role */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="reg-role">
                    <span className="flex items-center gap-1">
                      <Shield className="size-3.5 text-zinc-400" />
                      <span>Requested Role</span>
                    </span>
                  </label>
                  <CustomSelect
                    id="reg-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    triggerClassName="h-10 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 font-medium hover:border-zinc-700"
                    contentClassName="bg-zinc-900 border-zinc-800 text-zinc-100"
                    options={[
                      { value: "Employee", label: "Employee" },
                      { value: "Manager", label: "Manager" },
                      { value: "Finance Manager / CFO", label: "Finance Manager / CFO" },
                      { value: "Admin", label: "Admin" },
                    ]}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="reg-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-9.5 pr-9 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-9.5 pr-9 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
              >
                <span>{loading ? 'Submitting Request...' : 'Complete Registration'}</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Footer Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-zinc-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-white underline hover:text-zinc-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Register;

