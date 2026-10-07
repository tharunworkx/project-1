import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  Shield,
  Check,
} from 'lucide-react';
import { CustomSelect } from '@/components/ui/select';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  // Fresh, empty state for new user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Engineering & DevOps');
  const [role, setRole] = useState('Employee');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Handle department change with smart role defaults
  const handleDepartmentChange = (newDept) => {
    setDepartment(newDept);
    if (newDept === 'Finance & Accounts') {
      if (role === 'Employee') setRole('Finance Executive');
    } else if (newDept === 'Executive Management') {
      setRole('Admin');
    } else {
      if (role === 'Finance Executive' || role === 'Finance Manager / CFO') {
        setRole('Employee');
      }
    }
  };

  // Always enforce dark theme on the login page
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = localStorage.getItem('theme') || 'light';
    root.classList.add('dark');

    return () => {
      // Restore user's previous preference when leaving the login screen
      if (previousTheme === 'light') {
        root.classList.remove('dark');
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid login credentials');
    }
  };

  const handleGoogleLogin = () => {
    setError('Single Sign-On is disabled. Please log in with your Supabase-registered email and password.');
  };
  return (
    <div className="dark relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-black text-zinc-100 overflow-hidden select-none">
      {/* Background Animated Glowing Dots Pattern on Pure Black */}
      <DottedGlowBackground
        className="pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]"
        opacity={0.85}
        gap={14}
        radius={1.7}
        color="rgba(120, 120, 120, 0.4)"
        darkColor="rgba(140, 140, 140, 0.35)"
        glowColor="rgba(159, 232, 112, 0.85)"
        darkGlowColor="rgba(159, 232, 112, 0.85)"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.4}
        speedScale={1}
      />

      {/* Permanently Dark Themed Clean Login Card */}
      <div className="relative z-10 w-full max-w-[390px] sm:max-w-[410px] bg-[#121214] text-zinc-100 rounded-xl shadow-2xl border border-zinc-800 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            Welcome to ExpenseHub
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            Sign in with your department and assigned role
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-3.5 flex items-center gap-2 p-2.5 text-xs rounded-lg bg-rose-950/40 border border-rose-900 text-rose-300">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-10 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 active:scale-[0.99] text-zinc-200 hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
        >
          <svg className="size-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider with "or" */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative bg-[#121214] px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            or
          </div>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
              className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-200">
                Password
              </label>
              <a
                href="#trouble"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please enter your account password, or sign in using Google.');
                }}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 underline"
              >
                Trouble logging in?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 pr-9 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 focus:bg-zinc-900 transition-colors"
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

          {/* Choose Department & Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="login-dept">
                <span className="flex items-center gap-1">
                  <Building2 className="size-3.5 text-zinc-400" />
                  <span>Department</span>
                </span>
              </label>
              <CustomSelect
                id="login-dept"
                name="department"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
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

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="login-role">
                <span className="flex items-center gap-1">
                  <Shield className="size-3.5 text-zinc-400" />
                  <span>Role</span>
                </span>
              </label>
              <CustomSelect
                id="login-role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                triggerClassName="h-10 rounded-lg border border-zinc-800 bg-zinc-900/90 text-xs sm:text-sm text-zinc-100 font-medium hover:border-zinc-700"
                contentClassName="bg-zinc-900 border-zinc-800 text-zinc-100"
                options={[
                  { value: "Employee", label: "Employee" },
                  { value: "Manager", label: "Manager" },
                  { value: "Finance Executive", label: "Finance Executive" },
                  { value: "Finance Manager / CFO", label: "Finance Manager / CFO" },
                  { value: "Admin", label: "Admin" },
                ]}
              />
            </div>
          </div>

          {/* Remember me option */}
          <div
            role="checkbox"
            aria-checked={rememberMe}
            tabIndex={0}
            onClick={() => setRememberMe(!rememberMe)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setRememberMe(!rememberMe);
              }
            }}
            className="flex items-center gap-2 pt-0.5 cursor-pointer select-none group outline-none w-fit focus-visible:ring-1 focus-visible:ring-zinc-400 rounded-sm"
          >
            <div
              className={`size-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0 ${
                rememberMe
                  ? "bg-white border-white text-zinc-950 shadow-xs"
                  : "border-zinc-700 bg-zinc-900/90 group-hover:border-zinc-500"
              }`}
            >
              {rememberMe && <Check className="size-3 stroke-[3]" />}
            </div>
            <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
              Remember this device for 30 days
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-white hover:bg-zinc-200 active:scale-[0.99] text-zinc-950 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center cursor-pointer mt-1.5 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Footer sign up link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-white underline hover:text-zinc-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
