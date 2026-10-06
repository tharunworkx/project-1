import React from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatDate } from '@/lib/currency';
import {
  PieChart,
  Calendar,
  Building,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const BudgetDetailsModal = ({
  isOpen,
  onClose,
  budget,
  onEdit,
  canManage = true,
}) => {
  if (!budget) return null;

  const getStatusBadge = (status, utilization) => {
    if (status === 'Over Budget' || utilization > 100) {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 font-semibold">
          Over Budget
        </Badge>
      );
    }
    if (status === 'Near Limit' || utilization >= 80) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 font-semibold">
          Near Limit
        </Badge>
      );
    }
    if (status === 'Closed') {
      return (
        <Badge className="bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-semibold">
          Closed
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
        Active
      </Badge>
    );
  };

  const getProgressColor = (utilization) => {
    if (utilization > 100) return 'bg-rose-600';
    if (utilization >= 85) return 'bg-amber-500';
    return 'bg-emerald-600';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-foreground">Budget: {budget.id}</span>
          {getStatusBadge(budget.status, budget.utilization)}
        </div>
      }
      maxWidth="580px"
      footer={
        <div className="w-full flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-mono">
            ID: {budget.id}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {canManage && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(budget);
                }}
              >
                Edit Budget
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Name & department banner */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border">
          <h4 className="text-base font-bold text-foreground">{budget.name}</h4>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-muted-foreground text-[11px]">
            <span className="flex items-center gap-1">
              <Building className="size-3 text-primary" />
              <strong className="text-foreground">{budget.department}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Briefcase className="size-3" />
              <span>{budget.project || 'General Operations'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{budget.period}</span>
            </span>
          </div>
        </div>

        {/* Visual Budget Utilization Indicator Card */}
        <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-foreground uppercase tracking-wider">
              Budget Utilization
            </span>
            <span className="font-bold text-sm text-foreground">
              {budget.utilization}%
            </span>
          </div>

          <Progress
            value={Math.min(budget.utilization, 100)}
            className="h-2.5 bg-muted"
            indicatorClassName={getProgressColor(budget.utilization)}
          />

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                Allocated
              </span>
              <span className="text-xs font-bold text-foreground mt-0.5 block">
                {formatCurrency(budget.allocated, budget.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                Spent
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                {formatCurrency(budget.spent, budget.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                Remaining
              </span>
              <span
                className={`text-xs font-bold mt-0.5 block ${
                  budget.remaining < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {formatCurrency(budget.remaining, budget.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Warning or Critical Alert Banner if high utilization */}
        {budget.utilization > 100 && (
          <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <span className="font-semibold block">Critical: Budget Cap Exceeded</span>
              <p className="text-[11px] opacity-90 mt-0.5">
                Expenditures have exceeded the authorized allocation by{' '}
                {formatCurrency(Math.abs(budget.remaining), budget.currency)}. New claims require CFO override.
              </p>
            </div>
          </div>
        )}

        {budget.utilization >= 85 && budget.utilization <= 100 && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold block">Warning: Approaching Threshold (85%+)</span>
              <p className="text-[11px] opacity-90 mt-0.5">
                This budget has only {formatCurrency(budget.remaining, budget.currency)} remaining before limit closure.
              </p>
            </div>
          </div>
        )}

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-card text-[11px]">
          <div>
            <span className="text-muted-foreground block">Expense Category:</span>
            <span className="font-semibold text-foreground">{budget.category}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Currency:</span>
            <span className="font-semibold text-foreground">{budget.currency || 'INR'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Period Validity:</span>
            <span className="font-semibold text-foreground">
              {formatDate(budget.startDate)} – {formatDate(budget.endDate)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block">Status:</span>
            <span className="font-semibold text-foreground">{budget.status}</span>
          </div>
        </div>

        {/* Description */}
        {budget.description && (
          <div className="p-3 rounded-lg border border-border bg-card">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Description & Scope
            </span>
            <p className="text-foreground text-xs leading-relaxed">
              {budget.description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BudgetDetailsModal;

