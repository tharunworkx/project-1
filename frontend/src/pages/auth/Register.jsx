import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wallet,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { CustomSelect } from '@/components/ui/select';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: 'Employee',
    password: '',
    confirmPassword: '',
  });

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
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed');
    }
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

      {/* Permanently Dark Themed Clean Register Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-[#121214] text-zinc-100 rounded-xl shadow-2xl border border-zinc-800 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
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

          {/* Role Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-200 mb-1" htmlFor="role">
              Role
            </label>
            <CustomSelect
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
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
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
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
      </div>
    </div>
  );
};

export default Register;
