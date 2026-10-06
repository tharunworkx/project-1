import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Send,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getTimelineIcon = (action, status) => {
  const a = (action || '').toLowerCase();
  const s = (status || '').toLowerCase();

  if (s === 'failed') return <XCircle className="size-4 text-rose-500" />;
  if (s === 'hold') return <AlertTriangle className="size-4 text-amber-500" />;
  if (s === 'in progress') return <Clock className="size-4 text-blue-500 animate-spin" />;

  if (a.includes('submitted')) return <FileText className="size-4 text-zinc-500" />;
  if (a.includes('manager')) return <UserCheck className="size-4 text-indigo-500" />;
  if (a.includes('finance verified') || a.includes('verified')) return <ShieldCheck className="size-4 text-emerald-500" />;
  if (a.includes('approved')) return <CheckCircle2 className="size-4 text-emerald-500" />;
  if (a.includes('processing')) return <Clock className="size-4 text-blue-500" />;
  if (a.includes('reimbursed') || a.includes('disbursed') || a.includes('settled')) return <CreditCard className="size-4 text-emerald-600" />;

  return <CheckCircle2 className="size-4 text-muted-foreground" />;
};

export const Timeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-muted-foreground">
        No timeline history available yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/80">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isPending = event.status === 'Pending';
        const isFailed = event.status === 'Failed';
        const isHold = event.status === 'Hold';

        return (
          <div key={index} className="relative group">
            {/* Dot / Icon */}
            <div
              className={`absolute -left-6 top-0.5 size-5 rounded-full border flex items-center justify-center bg-card shadow-xs transition-colors ${
                isFailed
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                  : isHold
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                  : isPending
                  ? 'border-border bg-muted/60 text-muted-foreground'
                  : 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-600'
              }`}
            >
              {getTimelineIcon(event.action, event.status)}
            </div>

            {/* Content card */}
            <div className={`p-3 rounded-lg border text-xs transition-all ${
              isFailed
                ? 'border-rose-200/80 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/20'
                : isHold
                ? 'border-amber-200/80 bg-amber-50/30 dark:border-amber-900/60 dark:bg-amber-950/20'
                : isPending
                ? 'border-dashed border-border/70 bg-muted/20 opacity-75'
                : 'border-border/70 bg-card hover:border-border'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                <span className="font-semibold text-foreground text-xs">
                  {event.action}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {event.timestamp}
                </span>
              </div>

              {(event.user || event.role) && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1.5">
                  <span className="font-medium text-foreground">{event.user}</span>
                  {event.role && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                      {event.role}
                    </Badge>
                  )}
                </div>
              )}

              {event.comment && (
                <p className="text-xs text-foreground/85 bg-muted/40 dark:bg-muted/20 p-2 rounded-md border border-border/40 mt-1.5">
                  {event.comment}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;

