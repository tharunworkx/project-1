import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  AlertCircle,
  Building,
  User,
  Calendar,
  CreditCard,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Modal from '../../components/common/Modal';

export const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [status, setStatus] = useState('Pending');

  // Mock details for the selected expense
  const expense = {
    id: id || 'EXP-2026-080',
    merchant: 'Amazon Web Services',
    title: 'Production Cluster Compute & Storage',
    amount: 104200.00,
    currency: 'INR',
    date: '04 Oct 2026',
    category: 'Software & Cloud',
    department: 'DevOps & Infrastructure',
    project: 'PRJ-Alpha (Cloud Migration)',
    claimant: {
      name: 'David Kim',
      email: 'david.kim@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      role: 'Senior DevOps Lead',
    },
    justification: 'Quarterly compute overage charges for multi-region active replication cluster supporting enterprise onboarding phase.',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    auditHistory: [
      { step: 'Claim Submitted', user: 'David Kim', time: '04 Oct 2026, 09:14 AM', status: 'completed' },
      { step: 'Automated Policy Screening', user: 'System AI Engine', time: '04 Oct 2026, 09:15 AM', status: 'completed' },
      { step: 'Manager Review', user: 'James Wilson', time: '04 Oct 2026, 02:40 PM', status: 'completed' },
      { step: 'Finance VP Approval', user: 'Alex Morgan', time: 'Awaiting Sign-off', status: 'current' },
      { step: 'Payout Disbursement', user: 'Automated Batch', time: 'Pending prior sign-offs', status: 'upcoming' },
    ],
  };

  const handleApprove = () => {
    setStatus('Approved');
  };

  const handleConfirmReject = () => {
    setStatus('Rejected');
    setRejectModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Link
            to="/expenses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Expenses</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {expense.id}
            </h1>
            <Badge
              variant="outline"
              className={
                status === 'Approved'
                  ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : status === 'Rejected'
                  ? 'border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10'
                  : 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
              }
            >
              {status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === 'Pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
                className="text-xs h-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <XCircle className="size-3.5 mr-1.5" />
                <span>Reject Claim</span>
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <CheckCircle2 className="size-3.5 mr-1.5" />
                <span>Approve Claim</span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs h-9 cursor-pointer"
          >
            <a href={expense.receiptUrl} target="_blank" rel="noreferrer">
              <Download className="size-3.5 mr-1.5" />
              <span>Download Invoice</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details & Audit */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Summary Card */}
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Merchant & Purpose
                  </span>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">
                    {expense.merchant}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{expense.title}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <div className="text-2xl font-black text-foreground mt-0.5">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Claimant</span>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={expense.claimant.avatar}
                      alt=""
                      className="size-6 rounded-full border border-border"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-foreground truncate">{expense.claimant.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{expense.claimant.role}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Department</span>
                  <div className="font-semibold text-foreground mt-1.5">{expense.department}</div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Category</span>
                  <div className="font-semibold text-foreground mt-1.5">{expense.category}</div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Expense Date</span>
                  <div className="font-semibold text-foreground mt-1.5 font-mono">{expense.date}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Business Justification
                </span>
                <p className="text-xs text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/60">
                  {expense.justification}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Timeline Card */}
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Approval Workflow & Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {expense.auditHistory.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-1 size-4 rounded-full border-2 border-background flex items-center justify-center ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : item.status === 'current'
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                      }`}
                    >
                      <div className="size-1 rounded-full bg-white" />
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-foreground block">{item.step}</span>
                        <span className="text-[11px] text-muted-foreground mt-0.5 block">
                          Handled by: <span className="text-foreground font-medium">{item.user}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Receipt Preview & Compliance */}
        <div className="flex flex-col gap-6">
          {/* Policy Compliance Card */}
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Policy Compliance Verification</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Valid tax invoice attached</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Within project allocation limits</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>Over ₹25,000 threshold (Requires VP)</span>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Document Card */}
          <Card className="shadow-xs border-border overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Attached Invoice</CardTitle>
                <CardDescription className="text-[11px]">invoice-aws-10294.pdf</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Verified
              </Badge>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="relative group overflow-hidden bg-muted/40 aspect-4/3 flex items-center justify-center">
                <img
                  src={expense.receiptUrl}
                  alt="Receipt Scan"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>View Full Size</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Expense Claim"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              className="text-xs cursor-pointer"
            >
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-muted-foreground">
            Please state the reason for rejecting claim <strong className="text-foreground">{expense.id}</strong>. The employee will receive an automated notification.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Missing detailed itemized invoice breakdown; Please re-submit with merchant GST tax invoice."
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-1 focus:ring-ring resize-y"
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ExpenseDetails;
