import React, { useState, useEffect } from 'react';
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
  ZoomIn,
  ShieldCheck,
  FileEdit,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Modal from '../../components/common/Modal';
import expenseStore from '../../services/expenseStore';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseStorage';
import expenseService from '../../services/expenseService';

export const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  // Role check: Only Manager, Finance Executive, CFO, and Admin can approve or reject!
  const roleLower = (user?.role || 'employee').toLowerCase();
  const isAdmin = roleLower === 'admin';
  const isManager = roleLower.includes('manager') || roleLower.includes('cfo') || isAdmin;
  const isFinance = roleLower.includes('finance') || isAdmin;
  const canApproveOrReject = isManager || isFinance || isAdmin;

  // Load expense from store
  const [expense, setExpense] = useState(() => {
    return expenseStore.getExpenseById(id);
  });

  useEffect(() => {
    let isMounted = true;
    const fetchExpense = async () => {
      if (!id) return;
      setLoading(true);

      // 1. Check local store first
      const local = expenseStore.getExpenseById(id);
      if (local && isMounted) {
        setExpense(local);
      }

      // 2. Fetch live from Supabase / Backend database
      const cleanId = id.replace(/^(EXP-|RMB-DB-)/, '');
      try {
        let dbData = null;

        // Try backend API first if online
        try {
          dbData = await expenseService.getExpenseById(cleanId);
        } catch (apiErr) {
          // Fall back to Supabase
        }

        // If not found in backend, query Supabase directly
        if (!dbData) {
          const { data: supaData, error: supaErr } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', cleanId)
            .maybeSingle();

          if (!supaErr && supaData) {
            dbData = supaData;
          }
        }

        if (dbData && isMounted) {
          const claimantName = (dbData.submitted_by || dbData.submittedBy)?.includes('@')
            ? (dbData.submitted_by || dbData.submittedBy).split('@')[0]
            : (dbData.submitted_by || dbData.submittedBy || 'Employee');
          const rawAmount = Number(dbData.amount) || 0;
          const formattedAmount = `₹${rawAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
          const rawDate = dbData.date || (dbData.created_at || dbData.createdAt ? new Date(dbData.created_at || dbData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today');
          const rawStatus = dbData.status ? (dbData.status.charAt(0).toUpperCase() + dbData.status.slice(1).toLowerCase()) : 'Pending';
          const receiptUrl = dbData.receipt_url || dbData.receiptUrl;

          setExpense({
            id: `EXP-${dbData.id}`,
            dbId: dbData.id,
            merchant: dbData.title || dbData.merchant || 'Corporate Vendor',
            title: dbData.description || dbData.title || 'Expense Claim',
            description: dbData.description || '',
            amount: formattedAmount,
            numericAmount: rawAmount,
            category: dbData.category || 'General',
            claimant: claimantName,
            email: dbData.submitted_by || dbData.submittedBy || 'employee@company.com',
            department: dbData.department || 'Engineering',
            paymentMode: 'Direct Reimbursement',
            date: rawDate,
            status: rawStatus,
            receiptUrl: receiptUrl,
            proofImage: receiptUrl,
            receiptName: receiptUrl ? `receipt_${dbData.id}.jpg` : null,
            receiptAttached: !!receiptUrl,
            approvedBy: dbData.approved_by || dbData.approvedBy,
            auditHistory: [
              {
                step: 'Claim Submitted',
                actor: claimantName,
                role: 'Claimant',
                date: rawDate,
                status: 'Submitted',
                note: 'Expense filed for reimbursement verification.'
              },
              ...(dbData.status === 'APPROVED' ? [{
                step: 'Manager Approval Granted',
                actor: dbData.approved_by || dbData.approvedBy || 'Manager',
                role: 'Approver',
                date: 'Recently',
                status: 'Approved',
                note: 'Claim audited and verified for settlement.'
              }] : []),
              ...(dbData.status === 'REJECTED' ? [{
                step: 'Claim Rejected',
                actor: dbData.approved_by || dbData.approvedBy || 'Manager',
                role: 'Approver',
                date: 'Recently',
                status: 'Rejected',
                note: 'Claim rejected during audit review.'
              }] : []),
              ...(dbData.status === 'REIMBURSED' ? [{
                step: 'Funds Disbursed',
                actor: 'Finance Department',
                role: 'Disbursement Executive',
                date: 'Recently',
                status: 'Settled',
                note: 'Disbursement transaction processed via bank transfer.'
              }] : [])
            ]
          });
        }
      } catch (err) {
        console.warn('Could not fetch expense details from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExpense();
    return () => { isMounted = false; };
  }, [id]);

  if (loading && !expense) {
    return (
      <div className="card text-center py-16">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted-foreground">Loading expense claim details from Supabase...</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-bold">Expense record not found</h3>
        <p className="text-xs text-muted-foreground mt-1">The requested expense ID does not exist.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/expenses')}>
          Return to Expenses
        </Button>
      </div>
    );
  }

  const isDraft = expense.status?.toLowerCase() === 'draft';
  const isPending = expense.status?.toLowerCase() === 'pending';
  const isApproved = expense.status?.toLowerCase() === 'approved';
  const isRejected = expense.status?.toLowerCase() === 'rejected';

  const proofImg = expense.proofImage || expense.receiptUrl;

  const handleApprove = async () => {
    if (!canApproveOrReject) {
      alert('Only Managers and Finance Executives have permission to approve expenses.');
      return;
    }
    const cleanId = expense.dbId || expense.id?.replace(/^(EXP-|RMB-DB-)/, '');
    const approverName = user?.name || user?.email || 'Approver';
    if (cleanId) {
      try {
        await expenseService.approveExpense(cleanId, { approver: approverName });
      } catch (e) {
        console.warn('Backend approve offline:', e);
      }
      try {
        await supabase
          .from('expenses')
          .update({
            status: 'APPROVED',
            approved_by: approverName,
            updated_at: new Date().toISOString()
          })
          .eq('id', cleanId);
      } catch (dbErr) {
        console.error('Supabase approve error:', dbErr);
      }
    }
    try {
      expenseStore.updateStatus(expense.id, 'Approved');
    } catch (e) {}
    setExpense((prev) => ({ ...prev, status: 'Approved', approvedBy: approverName }));
    setNotification('Expense claim approved successfully!');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleConfirmReject = async () => {
    if (!canApproveOrReject) {
      alert('Only Managers and Finance Executives have permission to reject expenses.');
      return;
    }
    const cleanId = expense.dbId || expense.id?.replace(/^(EXP-|RMB-DB-)/, '');
    if (cleanId) {
      try {
        await expenseService.rejectExpense(cleanId, { reason: rejectReason });
      } catch (e) {
        console.warn('Backend reject offline:', e);
      }
      try {
        await supabase
          .from('expenses')
          .update({
            status: 'REJECTED',
            updated_at: new Date().toISOString()
          })
          .eq('id', cleanId);
      } catch (dbErr) {
        console.error('Supabase reject error:', dbErr);
      }
    }
    try {
      expenseStore.updateStatus(expense.id, 'Rejected', rejectReason);
    } catch (e) {}
    setExpense((prev) => ({ ...prev, status: 'Rejected' }));
    setRejectModalOpen(false);
    setNotification('Expense claim rejected.');
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeleteDraft = () => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      expenseStore.deleteExpense(expense.id);
      navigate('/expenses');
    }
  };

  const handleDownloadProof = () => {
    if (!proofImg) return;
    const a = document.createElement('a');
    a.href = proofImg;
    a.download = expense.receiptName || `receipt_${expense.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Draft Notification Banner */}
      {isDraft && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                This expense is currently a Draft
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                It has not been submitted to your manager yet. You can edit the details, check your proof, and submit for sign-off.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate(`/expenses/new?draftId=${expense.id}`)}
              className="text-xs gap-1.5"
            >
              <FileEdit className="size-3.5" />
              <span>Edit & Submit Draft</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteDraft}
              className="text-xs gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <button
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Expenses</span>
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {expense.id}
            </h1>
            <Badge
              className={
                isApproved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : isRejected
                  ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
                  : isDraft
                  ? "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400"
              }
            >
              {expense.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPending && canApproveOrReject && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
                className="text-xs gap-1.5"
              >
                <XCircle className="size-3.5" />
                <span>Reject Claim</span>
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Approve Claim</span>
              </Button>
            </>
          )}

          {isPending && !canApproveOrReject && (
            <span className="text-xs text-muted-foreground italic flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/60">
              <Clock className="size-3.5 text-amber-500" />
              <span>Awaiting Manager / Finance Sign-off</span>
            </span>
          )}

          {isDraft && (
            <Button
              size="sm"
              onClick={() => navigate(`/expenses/new?draftId=${expense.id}`)}
              className="text-xs gap-1.5"
            >
              <FileEdit className="size-3.5" />
              <span>Resume & Submit</span>
            </Button>
          )}

          {proofImg && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadProof}
              className="text-xs gap-1.5"
            >
              <Download className="size-3.5" />
              <span>Download Proof</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-3 border-b border-border flex flex-row items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Merchant & Purpose
                </span>
                <CardTitle className="text-xl font-bold mt-0.5">{expense.merchant}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{expense.title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </span>
                <div className="text-2xl font-extrabold text-foreground font-mono mt-0.5">
                  {expense.amount}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Claimant</span>
                  <div className="flex items-center gap-1.5 mt-1 font-semibold text-foreground">
                    <img
                      src={expense.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(expense.claimant || 'User')}`}
                      alt=""
                      className="size-5 rounded-full"
                    />
                    <span className="truncate">{typeof expense.claimant === 'object' ? expense.claimant.name : expense.claimant}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Department</span>
                  <span className="font-semibold text-foreground mt-1 block truncate">{expense.department}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Category</span>
                  <span className="font-semibold text-foreground mt-1 block truncate">{expense.category}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Expense Date</span>
                  <span className="font-semibold text-foreground mt-1 block truncate">{expense.date}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                  Business Justification
                </span>
                <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/60">
                  {expense.justification || 'No justification provided.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Audit Timeline */}
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <CardTitle className="text-base font-semibold">Approval Workflow & Audit Trail</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {expense.auditHistory && expense.auditHistory.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div
                      className={`size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-600'
                          : item.status === 'current'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : item.status === 'rejected' ? (
                        <XCircle className="size-3.5" />
                      ) : (
                        <Clock className="size-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{item.step}</span>
                        <span className="text-[11px] text-muted-foreground">{item.time}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Assigned to: {item.user}
                      </span>
                      {item.notes && (
                        <span className="text-[11px] text-rose-600 italic block mt-1">
                          Reason: {item.notes}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Receipt Proof */}
        <div className="space-y-6">
          <Card className="shadow-xs border-border">
            <CardHeader className="p-5 pb-3 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Receipt & Proof</CardTitle>
                <CardDescription className="text-xs">Manager verification artifact</CardDescription>
              </div>
              {proofImg ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck size={12} /> Verified
                </span>
              ) : (
                <span className="text-[11px] text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  No Proof
                </span>
              )}
            </CardHeader>

            <CardContent className="p-5">
              {proofImg ? (
                <div className="space-y-3">
                  <div
                    className="relative h-60 w-full rounded-xl overflow-hidden border border-border bg-muted/40 cursor-pointer group"
                    onClick={() => setProofModalOpen(true)}
                  >
                    <img
                      src={proofImg}
                      alt="Proof"
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity gap-2">
                      <ZoomIn className="size-5" />
                      <span className="text-xs font-semibold">Inspect Full Proof</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono text-muted-foreground truncate max-w-[170px]">
                      {expense.receiptName || 'receipt_proof.jpg'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProofModalOpen(true)}
                      className="text-xs h-7 gap-1"
                    >
                      <ZoomIn className="size-3" />
                      <span>Enlarge</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="size-8 mx-auto mb-2 text-muted-foreground/60" />
                  <p className="text-xs font-semibold">No receipt proof uploaded</p>
                </div>
              )}
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
          <>
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmReject}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <p className="text-xs text-muted-foreground mb-3">
          Please provide a reason for rejecting claim <strong>{expense.id}</strong>.
        </p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="e.g. Missing detailed itemized invoice breakdown..."
          className="w-full p-2.5 rounded-lg border border-border text-xs text-foreground bg-card focus:outline-none"
          rows={3}
        />
      </Modal>

      {/* Proof Lightbox Modal */}
      {proofImg && (
        <Modal
          isOpen={proofModalOpen}
          onClose={() => setProofModalOpen(false)}
          title={`Proof of Purchase — ${expense.merchant} (${expense.id})`}
          maxWidth="850px"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted-foreground">Verified audit document</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={Download} onClick={handleDownloadProof}>
                  Download
                </Button>
                <Button size="sm" onClick={() => setProofModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="flex items-center justify-center p-2 bg-muted/30 rounded-lg border">
            <img
              src={proofImg}
              alt="Proof"
              className="max-h-[600px] w-auto max-w-full rounded object-contain shadow"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExpenseDetails;
