import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  CreditCard,
  PieChart,
  ShieldAlert,
  Info,
  Clock,
  Check,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import notificationMockService from '@/services/mock/notificationMockService';
import { useToast } from '@/context/ToastContext';

const getNotifIcon = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('approval pending') || t.includes('registration')) {
    return <UserCheck className="size-4 text-amber-600 dark:text-amber-400" />;
  }
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
  return <Info className="size-4 text-primary" />;
};

export const NotificationBellDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();

  const loadNotifications = async () => {
    const list = await notificationMockService.getNotifications();
    setNotifications(list.slice(0, 6)); // show latest 6 in dropdown
    const count = await notificationMockService.getUnreadCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    await notificationMockService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await notificationMockService.markAllAsRead();
    loadNotifications();
    toastSuccess('All notifications marked as read', 'Notifications');
  };

  const handleQuickApprove = async (e, item) => {
    e.stopPropagation();
    try {
      setApprovingId(item.id);
      const res = await notificationMockService.approveUserRegistration(item.userId, item.requestedRole);
      if (res.success) {
        toastSuccess(`Registration approved for ${item.userEmail}! User can now log in as ${item.requestedRole}.`, 'User Approved');
        loadNotifications();
      } else {
        toastError('Failed to approve registration: ' + (res.error?.message || 'Database error'), 'Approval Failed');
      }
    } catch (err) {
      console.error('Approve error:', err);
      toastError('Could not approve registration', 'Error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleOpenItem = (item) => {
    if (!item.isRead) {
      notificationMockService.markAsRead(item.id);
    }
    setOpen(false);
    const target = item.link || item.path;
    if (target) {
      navigate(target);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 relative flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          title="Notification Center"
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-rose-600 border-2 border-card"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-xl rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px] px-1.5 py-0">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <CheckCheck className="size-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* List items */}
        <div className="max-h-84 overflow-y-auto divide-y divide-border/60">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleOpenItem(n)}
                className={`p-3.5 flex items-start gap-3 hover:bg-muted/50 transition-colors cursor-pointer text-xs ${
                  n.isPendingUserApproval
                    ? 'bg-amber-500/10 dark:bg-amber-500/5 border-l-2 border-l-amber-500'
                    : !n.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''
                }`}
              >
                <div className={`p-2 rounded-lg border shrink-0 mt-0.5 shadow-2xs ${
                  n.isPendingUserApproval
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'bg-card border-border/80'
                }`}>
                  {getNotifIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="font-semibold text-foreground truncate">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{n.timestamp || n.time}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                  
                  {n.isPendingUserApproval ? (
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-amber-500/20">
                      <div className="flex items-center gap-1.5">
                        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[9px] px-1.5 py-0 font-semibold">
                          {n.requestedRole}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                          {n.department}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        disabled={approvingId === n.id}
                        onClick={(e) => handleQuickApprove(e, n)}
                        className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-xs gap-1 cursor-pointer"
                      >
                        <Check className="size-3 stroke-[2.5]" />
                        <span>{approvingId === n.id ? 'Approving...' : 'Approve'}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                        {n.relatedModule}
                      </Badge>
                      {n.priority === 'High' && (
                        <Badge className="bg-rose-500/10 text-rose-600 text-[9px] px-1 py-0 font-semibold">
                          High Priority
                        </Badge>
                      )}
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(e, n.id)}
                          className="text-[10px] text-primary hover:underline ml-auto font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-border bg-muted/20 text-center">
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
          >
            <span>View all in Notification Center</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBellDropdown;

