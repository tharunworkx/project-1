import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Save,
  BadgeCheck,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Tharun R',
    email: user?.email || 'tharun@company.com',
    department: user?.department || 'Engineering',
    role: user?.role || 'Admin',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const userInitials = (formData.name || 'TR')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Tharun R',
        email: user.email || 'tharun@company.com',
        department: user.department || 'Engineering',
        role: user.role || 'Admin',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setProfileMsg('');
    setSavingProfile(true);

    try {
      await updateUser({
        name: formData.name,
        department: formData.department,
      });
      setProfileMsg('Personal account information updated successfully.');
      toastSuccess('Account details updated.', 'Profile Saved');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      console.error('Update profile error:', err);
      toastError('Could not update profile details.', 'Update Error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (!passwordData.newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      // Simulate/trigger password change
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPasswordMsg('Password changed successfully.');
      toastSuccess('Your account password was updated.', 'Password Changed');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordError('Failed to change password. Please verify current credentials.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          View and manage your personal identity, credentials, and company permissions.
        </p>
      </div>

      {/* Account Overview Hero Card */}
      <Card className="shadow-xs border-border/80">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-2 border-border/80">
                <AvatarImage src={user?.avatar} alt={formData.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{formData.name}</h2>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                    Active Account
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{formData.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    {formData.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground font-medium">{formData.department}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground sm:text-right space-y-1">
              <div>User ID: <span className="font-mono text-foreground font-semibold">{user?.id || 'USR-2026-01'}</span></div>
              <div className="flex items-center sm:justify-end gap-1 text-[11px]">
                <Calendar className="size-3 text-muted-foreground" />
                <span>Member since Oct 2026</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Update your public display name and departmental details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {profileMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="name">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleProfileChange}
                className="h-10 text-xs sm:text-sm bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="email">
                Work Email (Read Only)
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="h-10 text-xs sm:text-sm bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="department">
                Department
              </label>
              <Input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleProfileChange}
                className="h-10 text-xs sm:text-sm bg-background border-border"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="role">
                Assigned Role
              </label>
              <Input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                disabled
                className="h-10 text-xs sm:text-sm bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="text-xs gap-2 rounded-xl px-4 py-2 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <KeyRound className="size-4 text-muted-foreground" />
            <span>Security & Password</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Ensure your account is using a strong, unique password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {passwordMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="currentPassword">
                Current Password
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="h-10 text-xs sm:text-sm bg-background border-border pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="h-10 text-xs sm:text-sm bg-background border-border pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="h-10 text-xs sm:text-sm bg-background border-border"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleUpdatePassword}
              disabled={savingPassword}
              variant="outline"
              className="text-xs gap-2 rounded-xl px-4 py-2 cursor-pointer"
            >
              <Lock className="size-3.5" />
              <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
