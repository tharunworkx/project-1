import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  CreditCard,
  PieChart,
  ShieldAlert,
  Clock,
  Info,
  Settings,
  Mail,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import notificationMockService from '@/services/mock/notificationMockService';

const getNotifIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('reimbursement processed')) {
    return <CreditCard className="size-4 text-emerald-600" />;
  }
  if (t.includes('reimbursement failed')) {
    return <AlertCircle className="size-4 text-rose-600" />;
  }
  if (t.includes('budget exceeded')) {
    return <AlertCircle className="size-4 text-rose-600" />;
  }
  if (t.includes('budget near limit')) {
    return <AlertTriangle className="size-4 text-amber-600" />;
  }
  if (t.includes('policy violation')) {
    return <ShieldAlert className="size-4 text-rose-500" />;
  }
  if (t.includes('expense approved')) {
    return <CheckCircle2 className="size-4 text-emerald-600" />;
  }
  if (t.includes('expense rejected')) {
    return <AlertCircle className="size-4 text-rose-600" />;
  }
  if (t.includes('report generated')) {
    return <FileText className="size-4 text-blue-600" />;
  }
  if (t.includes('approval pending')) {
    return <Clock className="size-4 text-indigo-600" />;
  }
  return <Info className="size-4 text-primary" />;
};

export const Notifications = () => {
  const { user } = useAuth();
  const { toastSuccess, toastInfo } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'preferences'
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const items = await notificationMockService.getNotifications(filter);
      setNotifications(items);
      const prefs = await notificationMockService.getPreferences();
      setPreferences(prefs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id) => {
    await notificationMockService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await notificationMockService.markAllAsRead();
    loadNotifications();
    toastSuccess('All notifications marked as read', 'Notifications');
  };

  const handleDelete = async (id) => {
    await notificationMockService.deleteNotification(id);
    loadNotifications();
    toastInfo('Notification deleted');
  };

  const handleClearAll = async () => {
    await notificationMockService.clearAll();
    loadNotifications();
    toastInfo('Notification history cleared');
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    await notificationMockService.updatePreferences(preferences);
    toastSuccess('Notification preferences saved successfully');
  };

  const handleTogglePref = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenRecord = (n) => {
    if (!n.isRead) {
      notificationMockService.markAsRead(n.id);
    }
    if (n.link) {
      navigate(n.link);
    }
  };

  const filterTabs = [
    { key: 'All', label: 'All' },
    { key: 'Unread', label: 'Unread' },
    { key: 'Finance', label: 'Finance' },
    { key: 'Expense', label: 'Expense' },
    { key: 'Reimbursement', label: 'Reimbursement' },
    { key: 'Budget', label: 'Budget' },
    { key: 'System', label: 'System' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time corporate notifications, policy warnings, treasury disbursements, and budget alerts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Notification Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preferences'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="size-3.5" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <Card className="shadow-xs border-border/80">
          <CardHeader className="space-y-3 pb-3">
            {/* Filter Pills and Global Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1">
                {filterTabs.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setFilter(t.key)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      filter === t.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Actions: Mark all read / Clear */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={handleMarkAllRead}
                >
                  <CheckCheck className="size-3.5" />
                  <span>Mark All Read</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={handleClearAll}
                >
                  <Trash2 className="size-3.5" />
                  <span>Clear All</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {loading ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
                  <Bell className="size-8 text-muted-foreground/40 mx-auto" />
                  <p className="font-semibold text-foreground">No notifications in this view</p>
                  <p>You're all caught up with your financial workflows!</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => {
                      notificationMockService.resetNotifications();
                      loadNotifications();
                      toastSuccess('Reset demo notification feed');
                    }}
                  >
                    Reset Sample Notifications
                  </Button>
                </div>
              ) : (
                notifications.map((n, index) => (
                  <div
                    key={`${filter}-${n.id}`}
                    style={{
                      animationDelay: `${index * 45}ms`,
                    }}
                    className={`animate-jitter-card-in p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-muted/40 transition-all duration-200 group ${
                      !n.isRead ? 'bg-primary/5 dark:bg-primary/10 border-l-3 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="p-2.5 rounded-xl bg-card border border-border/80 shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 group-hover:border-primary/40 transition-all duration-200">
                        {getNotifIcon(n.type)}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-foreground">
                            {n.title}
                          </h4>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                            {n.type}
                          </Badge>
                          {n.priority === 'High' && (
                            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] px-1.5 py-0 font-semibold">
                              High Priority
                            </Badge>
                          )}
                          {!n.isRead && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                          <span>{n.timestamp}</span>
                          <span>•</span>
                          <span className="capitalize">{n.relatedModule} Module</span>
                          {n.relatedId && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-foreground font-medium">
                                {n.relatedId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions on Item */}
                    <div className="flex items-center gap-2 sm:self-center shrink-0 pt-2 sm:pt-0">
                      {n.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1 cursor-pointer"
                          onClick={() => handleOpenRecord(n)}
                        >
                          <span>Open Record</span>
                          <ExternalLink className="size-3" />
                        </Button>
                      )}

                      {!n.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-primary cursor-pointer"
                          onClick={() => handleMarkAsRead(n.id)}
                        >
                          Mark Read
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                        title="Delete notification"
                        onClick={() => handleDelete(n.id)}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 2. Notification Preferences UI */
        <Card className="shadow-xs border-border/80">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Sliders className="size-4 text-primary" />
              <span>Notification Channel & Routing Preferences</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Configure in-app alerts, email dispatch frequencies, and threshold warnings
            </CardDescription>
          </CardHeader>

          <CardContent>
            {preferences && (
              <form onSubmit={handleSavePreferences} className="space-y-6 text-xs">
                {/* General Channels */}
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border/60 pb-1">
                    Delivery Channels
                  </h4>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground">In-App Alerts</div>
                      <p className="text-muted-foreground text-[11px]">
                        Live badge indicator in topbar and real-time banner notifications
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.inAppNotifications}
                      onCheckedChange={() => handleTogglePref('inAppNotifications')}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Mail className="size-3.5 text-muted-foreground" />
                        <span>Email Notifications (Mock Gateway)</span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Send digest summaries to registered corporate work email
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.emailNotifications}
                      onCheckedChange={() => handleTogglePref('emailNotifications')}
                    />
                  </div>
                </div>

                {/* Event Triggers */}
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border/60 pb-1">
                    Finance & Reimbursement Event Triggers
                  </h4>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground">Approval & Submission Alerts</div>
                      <p className="text-muted-foreground text-[11px]">
                        Notify when employee claims are approved, rejected, or sent for correction
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.approvalNotifications}
                      onCheckedChange={() => handleTogglePref('approvalNotifications')}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground">Reimbursement Settlement Releases</div>
                      <p className="text-muted-foreground text-[11px]">
                        Notify on batch disbursements, UTR updates, and gateway failures
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.reimbursementNotifications}
                      onCheckedChange={() => handleTogglePref('reimbursementNotifications')}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground">Budget Cap & Run-Rate Threshold Alerts</div>
                      <p className="text-muted-foreground text-[11px]">
                        Trigger instant high-priority warnings at 85% and 100% budget consumption
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.budgetAlerts}
                      onCheckedChange={() => handleTogglePref('budgetAlerts')}
                    />
                  </div>

                  <div className="flex items-start justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-semibold text-foreground">Scheduled Financial Report Releases</div>
                      <p className="text-muted-foreground text-[11px]">
                        Alert when monthly reconciliations and tax audit packages are ready
                      </p>
                    </div>
                    <Checkbox
                      checked={preferences.reportNotifications}
                      onCheckedChange={() => handleTogglePref('reportNotifications')}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" size="sm" className="shadow-xs text-xs">
                    Save Notification Preferences
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;

