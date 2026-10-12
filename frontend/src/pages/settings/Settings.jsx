import React, { useState, useEffect } from 'react';
import {
  Save,
  User,
  Bell,
  Globe,
  CheckCircle2,
  Mail,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomSelect } from "@/components/ui/select";
import { useAuth } from '../../context/AuthContext';

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@company.com',
    department: user?.department || 'Finance & Operations',
    currency: 'INR (₹)',
    notifyApproval: true,
    notifyThreshold: true,
    weeklyReport: false,
  });

  const userInitials = (formData.name || 'AM')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        department: user.department || prev.department,
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSuccess('');
    setError('');
    setIsSaving(true);
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        department: formData.department,
      });
      setSuccess('Profile name and settings updated permanently to Supabase.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Settings save error:', err);
      setError(typeof err === 'string' ? err : err?.message || 'Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            System & Account Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your personal workspace preferences and security configurations.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 cursor-pointer"
        >
          <Save className="size-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </Button>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 animate-in fade-in">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. User Profile Card */}
        <Card className="rounded-2xl border border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  User Profile
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Update your personal details, profile picture, and corporate department
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-4 pb-4 border-b border-border/60">
              <Avatar className="size-14 rounded-full border border-border/80 shadow-xs">
                <AvatarImage src={user?.avatar} alt={formData.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">Profile Photo</div>
                <div className="text-[11px] text-muted-foreground">
                  Supported formats: JPG, PNG, WEBP (Max 2MB)
                </div>
              </div>
            </div>

            {/* Profile Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="h-9 text-xs rounded-xl bg-muted/30 focus-visible:bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Work Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex.morgan@company.com"
                  className="h-9 text-xs rounded-xl bg-muted/30 focus-visible:bg-background"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Department
              </label>
              <Input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Finance & Operations"
                className="h-9 text-xs rounded-xl bg-muted/30 focus-visible:bg-background"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Localization & Currency Card */}
        <Card className="rounded-2xl border border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Globe className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Localization & Currency
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Select your primary currency format and financial computation standards
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-semibold text-foreground">
                Preferred Reporting Currency
              </label>
              <CustomSelect
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                triggerClassName="h-9 rounded-xl text-xs"
                options={[
                  { value: "INR (₹)", label: "INR - Indian Rupee (₹)" },
                  { value: "USD ($)", label: "USD - US Dollar ($)" },
                  { value: "EUR (€)", label: "EUR - Euro (€)" },
                  { value: "GBP (£)", label: "GBP - British Pound (£)" },
                  { value: "CAD ($)", label: "CAD - Canadian Dollar ($)" },
                  { value: "JPY (¥)", label: "JPY - Japanese Yen (¥)" },
                ]}
              />
              <p className="text-[11px] text-muted-foreground pt-1">
                All ledger conversions and claim valuations will reference this standard.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Notification Alerts Card */}
        <Card className="rounded-2xl border border-border/80 shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bell className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Notification Alerts
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Configure automated email dispatch and system-level spending thresholds
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Checkbox Row 1 */}
            <div
              className="flex items-start gap-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setFormData({ ...formData, notifyApproval: !formData.notifyApproval })}
            >
              <Checkbox
                checked={formData.notifyApproval}
                onCheckedChange={(checked) => setFormData({ ...formData, notifyApproval: checked })}
                className="mt-0.5"
              />
              <div className="flex-1 space-y-0.5">
                <div className="text-xs font-semibold text-foreground">
                  Expense Approval Direct Dispatch
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Email me immediately whenever an expense claim requires my manual sign-off
                </div>
              </div>
            </div>

            {/* Checkbox Row 2 */}
            <div
              className="flex items-start gap-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setFormData({ ...formData, notifyThreshold: !formData.notifyThreshold })}
            >
              <Checkbox
                checked={formData.notifyThreshold}
                onCheckedChange={(checked) => setFormData({ ...formData, notifyThreshold: checked })}
                className="mt-0.5"
              />
              <div className="flex-1 space-y-0.5">
                <div className="text-xs font-semibold text-foreground">
                  Budget Capacity Threshold Alert
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Alert me when departmental budget reaches &gt; 85% capacity threshold
                </div>
              </div>
            </div>

            {/* Checkbox Row 3 */}
            <div
              className="flex items-start gap-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => setFormData({ ...formData, weeklyReport: !formData.weeklyReport })}
            >
              <Checkbox
                checked={formData.weeklyReport}
                onCheckedChange={(checked) => setFormData({ ...formData, weeklyReport: checked })}
                className="mt-0.5"
              />
              <div className="flex-1 space-y-0.5">
                <div className="text-xs font-semibold text-foreground">
                  Automated Weekly Digest
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Deliver automated weekly executive expenditure summary report directly to inbox
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pt-2 pb-5 px-6 border-t border-border/60">
            <Button
              type="submit"
              className="gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-2"
            >
              <Save className="size-3.5" />
              <span>Save Preferences</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Settings;
