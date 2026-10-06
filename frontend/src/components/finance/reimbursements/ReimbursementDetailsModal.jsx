import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Timeline from '../common/Timeline';
import { formatCurrency, formatDate } from '@/lib/currency';
import {
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  FileText,
  CreditCard,
  Building,
  User,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Hash,
} from 'lucide-react';

export const ReimbursementDetailsModal = ({
  isOpen,
  onClose,
  item,
  onUpdateStatus,
  onAddComment,
  canTakeActions = true,
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'timeline', 'comments'
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!item) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      await onAddComment(item.id, newComment);
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'reimbursed') {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold">
          Reimbursed
        </Badge>
      );
    }
    if (s === 'processing') {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 font-semibold">
          Processing
        </Badge>
      );
    }
    if (s === 'on hold') {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 font-semibold">
          On Hold
        </Badge>
      );
    }
    if (s === 'failed') {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 font-semibold">
          Failed
        </Badge>
      );
    }
    if (s === 'pending reimbursement') {
      return (
        <Badge className="bg-amber-50/70 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-300 font-semibold">
          Pending Reimbursement
        </Badge>
      );
    }
    return (
      <Badge className="bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 font-semibold">
        {status || 'Approved'}
      </Badge>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">Claim Details: {item.id}</span>
          {getStatusBadge(item.status)}
        </div>
      }
      maxWidth="680px"
      footer={
        <div className="w-full flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Ref:</span>
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] text-foreground">
              {item.paymentReferenceId || 'UNASSIGNED'}
            </code>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>

            {canTakeActions && item.status !== 'Reimbursed' && (
              <>
                {item.status !== 'Processing' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    onClick={() => onUpdateStatus(item.id, 'Processing')}
                  >
                    Mark Processing
                  </Button>
                )}
                {item.status !== 'On Hold' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    onClick={() => onUpdateStatus(item.id, 'On Hold')}
                  >
                    Put On Hold
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  onClick={() => onUpdateStatus(item.id, 'Reimbursed')}
                >
                  <Send className="size-3.5" />
                  <span>Disburse / Reimbursed</span>
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      {/* Navigation tabs */}
      <div className="flex border-b border-border -mt-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Claim Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Approval & Settlement Timeline</span>
          <span className="size-1.5 rounded-full bg-emerald-500" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('comments')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'comments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>Finance Audit Comments</span>
          <span className="bg-muted px-1.5 py-0.2 rounded-full text-[10px]">
            {item.financeComments?.length || 0}
          </span>
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Top Amount Banner */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Total Reimbursement Amount
              </span>
              <div className="text-2xl font-bold text-foreground mt-0.5">
                {formatCurrency(item.amount, item.currency)}
              </div>
              <span className="text-[11px] text-muted-foreground">
                Approved Amount: {formatCurrency(item.approvedAmount || item.amount, item.currency)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Payment Channel
              </span>
              <div className="text-xs font-bold text-foreground mt-0.5 flex items-center gap-1.5 justify-end">
                <CreditCard className="size-3.5 text-primary" />
                <span>{item.paymentMethod || 'Bank Transfer (NEFT)'}</span>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                {item.paymentReferenceId || 'Awaiting Batch Reference'}
              </span>
            </div>
          </div>

          {/* Employee & Organization info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground border-b border-border/60 pb-1.5">
                <User className="size-3.5 text-muted-foreground" />
                <span>Beneficiary Employee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-9 rounded-full border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {item.avatarFallback || 'EM'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-foreground">{item.employeeName}</div>
                  <div className="text-[11px] text-muted-foreground">{item.employeeId} • {item.email}</div>
                  <div className="text-[11px] text-muted-foreground font-medium">{item.department}</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 font-semibold text-foreground border-b border-border/60 pb-1.5">
                <Building className="size-3.5 text-muted-foreground" />
                <span>Expense Classification</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-foreground">{item.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expense ID:</span>
                  <span className="font-mono text-foreground">{item.expenseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved Date:</span>
                  <span className="text-foreground">{formatDate(item.approvedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved By:</span>
                  <span className="text-foreground">{item.approvedBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Merchant */}
          <div className="p-3 rounded-lg border border-border bg-card text-xs space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Expense Description & Merchant
            </span>
            <p className="text-foreground font-medium leading-relaxed">
              {item.description}
            </p>
            {item.merchant && (
              <div className="text-[11px] text-muted-foreground pt-1">
                Vendor: <span className="font-semibold text-foreground">{item.merchant}</span>
              </div>
            )}
          </div>

          {/* Policy Validation Card */}
          <div className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
            item.policyValidation?.isCompliant
              ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100'
              : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100'
          }`}>
            {item.policyValidation?.isCompliant ? (
              <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="size-4.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-xs flex items-center gap-2">
                <span>Policy Validation:</span>
                <span>{item.policyValidation?.ruleName || 'Standard Expense Policy'}</span>
                <Badge variant="outline" className="text-[10px] ml-auto">
                  {item.policyValidation?.isCompliant ? 'Compliant' : 'Audit Required'}
                </Badge>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">
                {item.policyValidation?.notes || 'All requirements satisfied.'}
              </p>
            </div>
          </div>

          {/* Attached Receipt Preview */}
          <div className="p-3 rounded-lg border border-border bg-card space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Attached Receipt Verification
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1.5 text-primary"
                onClick={() => alert(`Simulating receipt download: ${item.receipt?.fileName || 'receipt.pdf'}`)}
              >
                <Download className="size-3" />
                <span>Download Invoice</span>
              </Button>
            </div>

            <div className="p-2.5 rounded-md bg-muted/30 border border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-xs">
                    {item.receipt?.fileName || `${item.expenseId}_tax_invoice.pdf`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {item.receipt?.fileSize || '380 KB'} • PDF Tax Invoice
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-3 py-1">
          <div className="text-xs text-muted-foreground mb-3">
            Chronological audit trail of expense review, managerial sign-off, and treasury disbursement.
          </div>
          <Timeline events={item.timeline || []} />
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {(!item.financeComments || item.financeComments.length === 0) ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No finance comments recorded yet. Add an internal verification note below.
              </div>
            ) : (
              item.financeComments.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                    {c.role}
                  </Badge>
                  <p className="text-foreground/90 mt-1 leading-relaxed">{c.comment}</p>
                </div>
              ))
            )}
          </div>

          {canTakeActions && (
            <form onSubmit={handleAddComment} className="pt-2 border-t border-border space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Add Finance Comment / Audit Note
              </label>
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="e.g. Tax invoice verified with GSTIN portal..."
                  className="h-9 text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  disabled={submittingComment || !newComment.trim()}
                >
                  <MessageSquare className="size-3.5" />
                  <span>{submittingComment ? 'Posting...' : 'Comment'}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReimbursementDetailsModal;

