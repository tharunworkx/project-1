import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('alex.morgan@company.com');
  const [password, setPassword] = useState('Password@123');
  const [workspace, setWorkspace] = useState('company.com');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState('admin');

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid login credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await login(email || 'alex.morgan@company.com', password || 'Password@123');
      navigate('/dashboard');
    } catch (err) {
      setError('Google authentication failed');
    }
  };

  const handleQuickDemo = (role) => {
    setActiveRole(role);
    if (role === 'admin') {
      setEmail('alex.morgan@company.com');
      setPassword('AdminPass123!');
      setWorkspace('company.com');
    } else if (role === 'manager') {
      setEmail('james.wilson@company.com');
      setPassword('ManagerPass123!');
      setWorkspace('company.com');
    } else {
      setEmail('lisa.ray@company.com');
      setPassword('EmployeePass123!');
      setWorkspace('company.com');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#090d16] overflow-hidden select-none">
      {/* Background Animated Glowing Dots Pattern preserved as requested */}
      <DottedGlowBackground
        className="pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]"
        opacity={0.85}
        gap={14}
        radius={1.7}
        color="rgba(100, 116, 139, 0.4)"
        darkColor="rgba(148, 163, 184, 0.35)"
        glowColor="rgba(159, 232, 112, 0.9)"
        darkGlowColor="rgba(159, 232, 112, 0.9)"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.4}
        speedScale={1}
      />

      {/* Main Folk-Inspired Centered Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800 p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header: Title and Subtitle matching Folk reference */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
            Welcome to ExpenseHub
          </h1>
          <p className="text-xs sm:text-[13px] text-zinc-500 dark:text-zinc-400 mt-2 font-normal">
            Expense management designed for teams and individuals
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-11 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 active:scale-[0.99] text-zinc-800 dark:text-zinc-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer mb-5"
        >
          <svg className="size-4.5 shrink-0" viewBox="0 0 24 24">
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

        {/* Form fields as required for corporate expense management */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Work Email field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
              className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-800/40 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Password
              </label>
              <a
                href="#trouble"
                onClick={(e) => {
                  e.preventDefault();
                  alert('For demo accounts, use password "Password@123" or click the demo buttons below.');
                }}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
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
                className="w-full h-11 px-3.5 pr-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-800/40 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Organization / Workspace Domain required for Expense Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-zinc-400" />
                <span>Company Workspace</span>
              </label>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                Auto-assigned
              </span>
            </div>
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="e.g. company.com or acme-corp"
              className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-800/40 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 transition-colors"
            />
          </div>

          {/* Remember me option */}
          <div className="flex items-center gap-2 pt-0.5">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className="rounded-[5px] data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white dark:data-[state=checked]:text-zinc-900"
            />
            <label
              htmlFor="remember"
              className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
            >
              Remember this device for 30 days
            </label>
          </div>

          {/* Submit button: "Continue with email" (exact match to Folk reference) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#1c1c1e] hover:bg-black active:scale-[0.99] text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-sm transition-all shadow-xs flex items-center justify-center cursor-pointer mt-2 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Continue with email'}
          </button>
        </form>

        {/* Quick Demo Autofill section for frictionless evaluation */}
        <div className="pt-5 mt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Quick Demo Autofill
            </span>
            <span className="text-[10px] text-zinc-400">One-click roles</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer text-center ${
                activeRole === 'admin'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('manager')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer text-center ${
                activeRole === 'manager'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('employee')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer text-center ${
                activeRole === 'employee'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              Employee
            </button>
          </div>
        </div>

        {/* Footer sign up link */}
        <div className="mt-5 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-zinc-900 dark:text-zinc-100 underline hover:text-zinc-700"
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
