import React, { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Clock,
  Building,
  Search,
  Download,
  Check,
  EllipsisVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wallet,
  AlertTriangle,
  XCircle,
  FileText,
  Filter,
  RotateCcw,
  ArrowUpDown,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/context/AuthContext';
import { useFinanceRole } from '@/hooks/useFinanceRole';
import { useToast } from '@/context/ToastContext';
import reimbursementMockService from '@/services/mock/reimbursementMockService';
import expenseService from '@/services/expenseService';
import { formatCurrency, formatDate } from '@/lib/currency';
import ReimbursementDetailsModal from '@/components/finance/reimbursements/ReimbursementDetailsModal';
import ConfirmDialog from '@/components/finance/common/ConfirmDialog';
import { mockDepartments, mockEmployees } from '@/services/mock/financeMockData';
import FilterSelect from '@/components/common/FilterSelect';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Pending Reimbursement', label: 'Pending Reimbursement' },
  { value: 'Processing', label: 'Processing' },
  { value: 'Reimbursed', label: 'Reimbursed' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Failed', label: 'Failed' },
];

const AMOUNT_FILTER_OPTIONS = [
  { value: 'All', label: 'All Amounts' },
  { value: 'under-2500', label: 'Under ₹2,500' },
  { value: '2500-10000', label: '₹2,500 – ₹10,000' },
  { value: '10000-50000', label: '₹10,000 – ₹50,000' },
  { value: 'over-50000', label: 'Over ₹50,000' },
];

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  if (s === 'reimbursed' || s === 'disbursed') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium">
        Reimbursed
      </Badge>
    );
  }
  if (s === 'processing') {
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium">
        Processing
      </Badge>
    );
  }
  if (s === 'on hold') {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-medium">
        On Hold
      </Badge>
    );
  }
  if (s === 'failed') {
    return (
      <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 font-medium">
        Failed
      </Badge>
    );
  }
  if (s === 'pending reimbursement') {
    return (
      <Badge className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-300 font-medium">
        Pending Reimbursement
      </Badge>
    );
  }
  return (
    <Badge className="bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-medium">
      {status || 'Approved'}
    </Badge>
  );
}

export const Reimbursements = () => {
  const { user } = useAuth();
  const { isEmployee, canTakeActions, role } = useFinanceRole();
  const { toastSuccess, toastError, toastWarning, toastInfo } = useToast();

  const [list, setList] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Sorting
  const [sortBy, setSortBy] = useState('approvedDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Selection & Details Modal
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'warning',
    confirmText: 'Confirm',
    requiresInput: false,
    inputLabel: '',
    inputPlaceholder: '',
    defaultValue: '',
    onConfirm: () => {},
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        status: statusFilter,
        department: deptFilter,
        employee: employeeFilter,
        amountRange: amountFilter,
        dateRange: dateFilter,
        sortBy,
        sortOrder,
        onlyEmployee: isEmployee ? user?.name : null,
      };

      const [mockItems, m] = await Promise.all([
        reimbursementMockService.getReimbursements(filters),
        reimbursementMockService.getDashboardMetrics(),
      ]);

      // Fetch real database expenses
      let dbClaims = [];
      try {
        const dbExpenses = await expenseService.getExpenses();
        if (Array.isArray(dbExpenses)) {
          // Keep claims that are APPROVED, REIMBURSED, or PROCESSING
          const relevantDbExpenses = dbExpenses.filter((e) => {
            const st = (e.status || '').toUpperCase();
            return st === 'APPROVED' || st === 'REIMBURSED' || st === 'PROCESSING';
          });

          dbClaims = relevantDbExpenses.map((e) => {
            const empName = e.submittedBy?.includes('@')
              ? e.submittedBy.split('@')[0]
              : (e.submittedBy || 'Employee');
            const initials = empName.slice(0, 2).toUpperCase();
            const numAmount = Number(e.amount) || 0;
            const isReimbursed = (e.status || '').toUpperCase() === 'REIMBURSED';
            const displayStatus = isReimbursed ? 'Reimbursed' : 'Approved';

            return {
              id: `RMB-DB-${e.id}`,
              dbId: e.id,
              expenseId: `EXP-${e.id}`,
              employeeName: empName,
              employeeId: `EMP-${e.id}`,
              email: e.submittedBy || 'employee@company.com',
              avatarFallback: initials,
              department: e.department || 'Engineering',
              category: e.category || 'General',
              amount: numAmount,
              approvedAmount: numAmount,
              reimbursementAmount: numAmount,
              currency: e.currency || 'INR',
              submittedDate: e.createdAt ? e.createdAt.split('T')[0] : '2026-10-07',
              approvedDate: e.updatedAt ? e.updatedAt.split('T')[0] : (e.createdAt ? e.createdAt.split('T')[0] : '2026-10-07'),
              approvedBy: e.approvedBy || 'Manager',
              status: displayStatus,
              paymentMethod: 'Bank Transfer (NEFT)',
              paymentReferenceId: isReimbursed ? `TXN-DB-${e.id}` : null,
              description: e.description || e.title || 'Corporate Expense Claim',
              merchant: e.title || 'Corporate Vendor',
              receipt: e.receiptUrl ? {
                fileName: 'receipt_invoice.pdf',
                fileSize: '320 KB',
                uploadedAt: e.createdAt || new Date().toISOString(),
                fileType: 'pdf',
              } : null,
              policyValidation: {
                isCompliant: true,
                violations: [],
                ruleName: 'Standard Expense Policy',
                notes: 'All mandatory receipts and managerial approvals verified.',
              },
              bankDetails: {
                bankName: 'HDFC Bank',
                accountNumber: '••••••••4821',
                ifsc: 'HDFC0001234',
                upiId: `${empName.toLowerCase()}@okhdfcbank`,
              },
              timeline: [
                {
                  step: 'Claim Submitted',
                  date: e.createdAt || new Date().toISOString(),
                  by: empName,
                  status: 'completed',
                },
                {
                  step: 'Manager Approval Granted',
                  date: e.updatedAt || new Date().toISOString(),
                  by: e.approvedBy || 'Manager',
                  status: 'completed',
                },
                {
                  step: 'Disbursement & Settlement',
                  date: isReimbursed ? (e.updatedAt || new Date().toISOString()) : null,
                  by: isReimbursed ? 'Finance Disbursed' : 'Pending Settlement',
                  status: isReimbursed ? 'completed' : 'pending',
                },
              ],
            };
          });

          // Apply filters to dbClaims
          if (search) {
            const q = search.toLowerCase();
            dbClaims = dbClaims.filter(
              (c) =>
                c.id.toLowerCase().includes(q) ||
                c.expenseId.toLowerCase().includes(q) ||
                c.employeeName.toLowerCase().includes(q) ||
                c.department.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                (c.paymentReferenceId && c.paymentReferenceId.toLowerCase().includes(q))
            );
          }

          if (statusFilter && statusFilter !== 'All') {
            dbClaims = dbClaims.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());
          }

          if (deptFilter && deptFilter !== 'All') {
            dbClaims = dbClaims.filter((c) => c.department.toLowerCase() === deptFilter.toLowerCase());
          }

          if (employeeFilter && employeeFilter !== 'All') {
            dbClaims = dbClaims.filter((c) => c.employeeName.toLowerCase() === employeeFilter.toLowerCase());
          }

          if (amountFilter && amountFilter !== 'All') {
            if (amountFilter === 'under-2500') dbClaims = dbClaims.filter((c) => c.amount < 2500);
            else if (amountFilter === '2500-10000') dbClaims = dbClaims.filter((c) => c.amount >= 2500 && c.amount <= 10000);
            else if (amountFilter === '10000-50000') dbClaims = dbClaims.filter((c) => c.amount > 10000 && c.amount <= 50000);
            else if (amountFilter === 'over-50000') dbClaims = dbClaims.filter((c) => c.amount > 50000);
          }

          if (isEmployee && user?.name) {
            dbClaims = dbClaims.filter(
              (c) =>
                c.employeeName.toLowerCase() === user.name.toLowerCase() ||
                c.email.toLowerCase() === user.email?.toLowerCase()
            );
          }
        }
      } catch (err) {
        console.warn('Could not load database expenses for reimbursements:', err);
      }

      // Merge metrics
      const combinedMetrics = { ...m };
      if (dbClaims.length > 0 && combinedMetrics) {
        const dbPending = dbClaims.filter((c) => c.status === 'Approved');
        const dbReimbursed = dbClaims.filter((c) => c.status === 'Reimbursed');
        combinedMetrics.pendingReimbursementCount = (combinedMetrics.pendingReimbursementCount || 0) + dbPending.length;
        combinedMetrics.pendingReimbursementAmount = (combinedMetrics.pendingReimbursementAmount || 0) + dbPending.reduce((sum, c) => sum + c.amount, 0);
        combinedMetrics.successfullyReimbursedCount = (combinedMetrics.successfullyReimbursedCount || 0) + dbReimbursed.length;
        combinedMetrics.successfullyReimbursedAmount = (combinedMetrics.successfullyReimbursedAmount || 0) + dbReimbursed.reduce((sum, c) => sum + c.amount, 0);
        combinedMetrics.pendingPaymentCount = (combinedMetrics.pendingPaymentCount || 0) + dbPending.length;
      }

      setList([...dbClaims, ...mockItems]);
      setMetrics(combinedMetrics);
    } catch (e) {
      console.error(e);
      toastError('Failed to load reimbursement claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, deptFilter, employeeFilter, amountFilter, dateFilter, sortBy, sortOrder, isEmployee, user?.name]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setDeptFilter('All');
    setEmployeeFilter('All');
    setAmountFilter('All');
    setDateFilter('All');
    setCurrentPage(1);
    toastInfo('Reimbursement filters reset to defaults');
  };

  // Pagination calculation
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, currentPage]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedList.length && paginatedList.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map((i) => i.id));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Status transitions with confirmation dialogs
  const handleInitiateStatusChange = (id, newStatus) => {
    const claim = list.find((i) => i.id === id);
    if (!claim) return;

    if (newStatus === 'Processing') {
      setConfirmDialog({
        isOpen: true,
        title: 'Mark Claim as Processing',
        description: `Are you ready to move claim ${id} (${formatCurrency(claim.amount, claim.currency)}) into the processing queue?`,
        type: 'info',
        confirmText: 'Mark Processing',
        requiresInput: false,
        onConfirm: async () => {
          await reimbursementMockService.updateStatus(id, 'Processing', {
            user: user?.name,
            role,
          });
          toastSuccess(`Claim ${id} moved to processing status`);
          loadData();
          if (activeItem?.id === id) {
            setActiveItem((prev) => ({ ...prev, status: 'Processing' }));
          }
        },
      });
    } else if (newStatus === 'Reimbursed') {
      const generatedRef = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setConfirmDialog({
        isOpen: true,
        title: 'Confirm Disbursement / Reimbursed',
        description: `Verify final settlement of ${formatCurrency(claim.amount, claim.currency)} to ${claim.employeeName}. Enter the UTR / Payment Reference ID:`,
        type: 'success',
        confirmText: 'Confirm Settlement',
        requiresInput: true,
        inputLabel: 'Bank UTR / Transaction Reference ID',
        inputPlaceholder: 'e.g. TXN-NEFT-992140',
        defaultValue: generatedRef,
        onConfirm: async (refId) => {
          if (claim.dbId) {
            try {
              await expenseService.reimburseExpense(claim.dbId, { referenceId: refId || generatedRef });
            } catch (err) {
              console.error('Failed to reimburse in database:', err);
            }
          }
          await reimbursementMockService.updateStatus(id, 'Reimbursed', {
            referenceId: refId || generatedRef,
            user: user?.name,
            role,
          });
          toastSuccess(`Claim ${id} successfully disbursed and settled`);
          loadData();
          if (activeItem?.id === id) {
            setActiveItem((prev) => ({ ...prev, status: 'Reimbursed', paymentReferenceId: refId || generatedRef }));
          }
        },
      });
    } else if (newStatus === 'On Hold') {
      setConfirmDialog({
        isOpen: true,
        title: 'Put Reimbursement On Hold',
        description: `Placing claim ${id} on hold pauses disbursement until clarifications are provided. Please enter the hold reason:`,
        type: 'warning',
        confirmText: 'Put On Hold',
        requiresInput: true,
        inputLabel: 'Reason for Hold',
        inputPlaceholder: 'e.g. Rate exceeds Tier-1 hotel cap, awaiting VP sign-off',
        defaultValue: '',
        onConfirm: async (comment) => {
          await reimbursementMockService.updateStatus(id, 'On Hold', {
            comment: comment || 'Placed on hold by finance auditor',
            user: user?.name,
            role,
          });
          toastWarning(`Claim ${id} placed on hold`);
          loadData();
          if (activeItem?.id === id) {
            setActiveItem((prev) => ({ ...prev, status: 'On Hold' }));
          }
        },
      });
    } else if (newStatus === 'Failed') {
      setConfirmDialog({
        isOpen: true,
        title: 'Mark Payment as Failed',
        description: `Record a gateway or banking failure for claim ${id}. Please specify the error reason:`,
        type: 'danger',
        confirmText: 'Mark Failed',
        requiresInput: true,
        inputLabel: 'Failure Reason',
        inputPlaceholder: 'e.g. Beneficiary IFSC account verification failed',
        defaultValue: '',
        onConfirm: async (comment) => {
          await reimbursementMockService.updateStatus(id, 'Failed', {
            comment: comment || 'Disbursement dispatch failure recorded',
            user: user?.name,
            role,
          });
          toastError(`Claim ${id} recorded as failed`);
          loadData();
          if (activeItem?.id === id) {
            setActiveItem((prev) => ({ ...prev, status: 'Failed' }));
          }
        },
      });
    }
  };

  const handleBatchAction = (newStatus) => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: `Batch ${newStatus} (${selectedIds.length} Claims)`,
      description: `Are you sure you want to update ${selectedIds.length} claims to "${newStatus}"?`,
      type: newStatus === 'Reimbursed' ? 'success' : 'info',
      confirmText: `Confirm Batch ${newStatus}`,
      onConfirm: async () => {
        const dbItems = list.filter((i) => selectedIds.includes(i.id) && i.dbId);
        if (dbItems.length > 0 && newStatus === 'Reimbursed') {
          try {
            await expenseService.batchReimburse(dbItems.map((i) => i.dbId));
          } catch (err) {
            console.error('Failed to batch reimburse database claims:', err);
          }
        }
        await reimbursementMockService.batchUpdateStatus(selectedIds, newStatus, {
          user: user?.name,
        });
        toastSuccess(`Successfully updated ${selectedIds.length} claims to ${newStatus}`);
        setSelectedIds([]);
        loadData();
      },
    });
  };

  const handleAddComment = async (id, commentText) => {
    await reimbursementMockService.addFinanceComment(id, commentText, user?.name, role);
    toastSuccess('Finance audit note added to claim record');
    const updated = await reimbursementMockService.getReimbursementById(id);
    setActiveItem(updated);
    loadData();
  };

  const handleViewDetails = (item) => {
    setActiveItem(item);
    setDetailsModalOpen(true);
  };

  return (
    <div className="w-full min-w-0 space-y-6 animate-fade-in">
      {/* Page Title & Context Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Reimbursement Management</span>
            {isEmployee && (
              <Badge variant="outline" className="text-xs font-normal">
                Personal Claims View
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEmployee
              ? 'Track the real-time settlement status and bank payment trails for your submitted expense claims.'
              : 'Audit approved claims, dispatch corporate treasury disbursements, and manage payment rails.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canTakeActions && selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8"
                onClick={() => handleBatchAction('Reimbursed')}
              >
                <Send className="size-3.5" />
                <span>Disburse Batch ({selectedIds.length})</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => handleBatchAction('Processing')}
              >
                Mark Processing
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs"
            onClick={() => {
              const csvContent =
                'data:text/csv;charset=utf-8,Claim ID,Expense ID,Employee,Department,Category,Amount,Status,Ref ID\n' +
                list
                  .map(
                    (i) =>
                      `"${i.id}","${i.expenseId}","${i.employeeName}","${i.department}","${i.category}","${i.amount}","${i.status}","${i.paymentReferenceId || ''}"`
                  )
                  .join('\n');
              const link = document.createElement('a');
              link.setAttribute('href', encodeURI(csvContent));
              link.setAttribute('download', `reimbursements_export_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toastSuccess('Exported claims to CSV successfully');
            }}
          >
            <Download className="size-3.5" />
            <span>Export Table</span>
          </Button>
        </div>
      </div>

      {/* Reimbursement Dashboard Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Approved
              </CardDescription>
              <CheckCircle2 className="size-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {metrics.totalApprovedExpenses}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Total claims cleared for payout
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Reimbursement
              </CardDescription>
              <Clock className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(metrics.pendingReimbursementAmount)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.pendingReimbursementCount} claims awaiting batch release
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Processing Rail
              </CardDescription>
              <Wallet className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.processingReimbursementCount} Claims
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                In transit via ACH / UPI rails
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Successfully Settled
              </CardDescription>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(metrics.successfullyReimbursedAmount)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.successfullyReimbursedCount} claims settled YTD
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Secondary Metrics Bar */}
      {metrics && (
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 flex flex-wrap items-center justify-between gap-4 text-xs w-full min-w-0">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-muted-foreground text-[11px] block">This Month Payouts:</span>
              <span className="font-bold text-foreground">
                {formatCurrency(metrics.thisMonthReimbursementAmount)}
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-muted-foreground text-[11px] block">Total Reimbursement Volume:</span>
              <span className="font-bold text-foreground">
                {formatCurrency(metrics.totalReimbursementAmount)}
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <span className="text-muted-foreground text-[11px] block">Held / Failed Claims:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {metrics.failedOrHeldCount} Needs Attention
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground">
            Total Queue: <strong>{metrics.pendingPaymentCount}</strong> claims pending execution
          </div>
        </div>
      )}

      {/* Datatable & Comprehensive Filter Card */}
      <Card className="shadow-xs border-border/80 w-full min-w-0 overflow-hidden">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Reimbursement Settlements
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Search, filter, audit, and disburse corporate expense claims
              </CardDescription>
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {paginatedList.length} of {list.length} claims
            </span>
          </div>

          {/* Filter Bar Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 pt-1 text-xs">
            {/* Search input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID, employee, ref #..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 pl-8 text-xs bg-muted/50 border-border/80"
              />
            </div>

            {/* Status filter */}
            <div>
              <FilterSelect
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                options={STATUS_FILTER_OPTIONS}
                placeholder="All Statuses"
              />
            </div>

            {/* Department filter */}
            <div>
              <FilterSelect
                value={deptFilter}
                onChange={(val) => {
                  setDeptFilter(val);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 'All', label: 'All Departments' },
                  ...mockDepartments.map((d) => ({ value: d, label: d })),
                ]}
                placeholder="All Departments"
              />
            </div>

            {/* Amount range filter */}
            <div>
              <FilterSelect
                value={amountFilter}
                onChange={(val) => {
                  setAmountFilter(val);
                  setCurrentPage(1);
                }}
                options={AMOUNT_FILTER_OPTIONS}
                placeholder="All Amounts"
              />
            </div>

            {/* Reset button */}
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleResetFilters}
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[850px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {canTakeActions && (
                    <TableHead className="w-10 pl-6">
                      <Checkbox
                        checked={paginatedList.length > 0 && selectedIds.length === paginatedList.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      <span>EXPENSE ID</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('employeeName')}>
                    <div className="flex items-center gap-1">
                      <span>EMPLOYEE</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead>DEPARTMENT</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">
                      <span>AMOUNT</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('approvedDate')}>
                    <div className="flex items-center gap-1">
                      <span>APPROVED</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">
                      <span>STATUS</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead>PAYMENT METHOD & REF</TableHead>
                  <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-xs text-muted-foreground">
                      Loading reimbursement claims...
                    </TableCell>
                  </TableRow>
                ) : paginatedList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-xs text-muted-foreground">
                      No reimbursement claims found matching your filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedList.map((row) => {
                    const isChecked = selectedIds.includes(row.id);
                    return (
                      <TableRow key={row.id} className={isChecked ? 'bg-muted/40' : ''}>
                        {canTakeActions && (
                          <TableCell className="pl-6">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleSelect(row.id)}
                            />
                          </TableCell>
                        )}

                        <TableCell>
                          <div className="flex flex-col text-left">
                            <span className="font-mono text-xs font-semibold text-foreground">
                              {row.expenseId}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {row.id}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7 rounded-full border border-border/60">
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                {row.avatarFallback || 'EM'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-semibold text-foreground leading-tight">
                                {row.employeeName}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {row.employeeId}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {row.department}
                        </TableCell>

                        <TableCell className="text-xs font-medium text-foreground">
                          {row.category}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-foreground">
                          {formatCurrency(row.amount, row.currency)}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col text-left text-xs">
                            <span className="text-foreground">{formatDate(row.approvedDate)}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-28">
                              By: {row.approvedBy?.split(' ')[0] || 'Manager'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col text-left text-xs">
                            <span className="text-foreground truncate max-w-32">{row.paymentMethod}</span>
                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-32">
                              {row.paymentReferenceId || 'Pending ref'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <EllipsisVertical className="size-3.5" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 text-xs">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(row)}
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <Eye className="size-3.5 text-primary" />
                                <span>View Details & Timeline</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  alert(`Attached Receipt: ${row.receipt?.fileName || 'tax_invoice.pdf'}\nSize: ${row.receipt?.fileSize || '380 KB'}\nStatus: Verified`);
                                }}
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <FileText className="size-3.5 text-muted-foreground" />
                                <span>View Receipt</span>
                              </DropdownMenuItem>

                              {canTakeActions && (
                                <>
                                  <DropdownMenuSeparator />

                                  {row.status !== 'Processing' && row.status !== 'Reimbursed' && (
                                    <DropdownMenuItem
                                      onClick={() => handleInitiateStatusChange(row.id, 'Processing')}
                                      className="cursor-pointer text-blue-600 focus:text-blue-600 flex items-center gap-2"
                                    >
                                      <Clock className="size-3.5" />
                                      <span>Mark as Processing</span>
                                    </DropdownMenuItem>
                                  )}

                                  {row.status !== 'Reimbursed' && (
                                    <DropdownMenuItem
                                      onClick={() => handleInitiateStatusChange(row.id, 'Reimbursed')}
                                      className="cursor-pointer text-emerald-600 focus:text-emerald-600 flex items-center gap-2"
                                    >
                                      <Send className="size-3.5" />
                                      <span>Mark as Reimbursed</span>
                                    </DropdownMenuItem>
                                  )}

                                  {row.status !== 'On Hold' && row.status !== 'Reimbursed' && (
                                    <DropdownMenuItem
                                      onClick={() => handleInitiateStatusChange(row.id, 'On Hold')}
                                      className="cursor-pointer text-amber-600 focus:text-amber-600 flex items-center gap-2"
                                    >
                                      <AlertTriangle className="size-3.5" />
                                      <span>Put On Hold</span>
                                    </DropdownMenuItem>
                                  )}

                                  {row.status !== 'Failed' && row.status !== 'Reimbursed' && (
                                    <DropdownMenuItem
                                      onClick={() => handleInitiateStatusChange(row.id, 'Failed')}
                                      className="cursor-pointer text-rose-600 focus:text-rose-600 flex items-center gap-2"
                                    >
                                      <XCircle className="size-3.5" />
                                      <span>Mark as Failed</span>
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Datatable Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, list.length)} of {list.length} claims
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs cursor-pointer"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs cursor-pointer"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                >
                  <ChevronRight className="size-3.5" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details & Timeline Modal */}
      <ReimbursementDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        item={activeItem}
        canTakeActions={canTakeActions}
        onUpdateStatus={handleInitiateStatusChange}
        onAddComment={handleAddComment}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        requiresInput={confirmDialog.requiresInput}
        inputLabel={confirmDialog.inputLabel}
        inputPlaceholder={confirmDialog.inputPlaceholder}
        defaultValue={confirmDialog.defaultValue}
      />
    </div>
  );
};

export default Reimbursements;
