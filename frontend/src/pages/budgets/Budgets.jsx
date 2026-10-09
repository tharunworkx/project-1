import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building2,
  Terminal,
  Megaphone,
  Briefcase,
  Palette,
  Users as UsersIcon,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  ArrowUpRight,
  Search,
  Filter,
  RotateCcw,
  ArrowUpDown,
  Download,
  AlertCircle,
  Eye,
  Edit2,
  Trash2,
  Lock,
  EllipsisVertical,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSearchBar } from "@/components/ui/AnimatedSearchBar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import { useFinanceRole } from '@/hooks/useFinanceRole';
import { useToast } from '@/context/ToastContext';
import budgetMockService from '@/services/mock/budgetMockService';
import { formatCurrency, formatDate } from '@/lib/currency';
import BudgetModal from '@/components/finance/budgets/BudgetModal';
import BudgetDetailsModal from '@/components/finance/budgets/BudgetDetailsModal';
import ConfirmDialog from '@/components/finance/common/ConfirmDialog';
import { mockDepartments } from '@/services/mock/financeMockData';
import FilterSelect from '@/components/common/FilterSelect';

const BUDGET_STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Near Limit', label: 'Near Limit' },
  { value: 'Over Budget', label: 'Over Budget' },
  { value: 'Closed', label: 'Closed' },
];

function BudgetStatusBadge({ status, utilization }) {
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
}

export const Budgets = () => {
  const { user } = useAuth();
  const { canManageBudgets, isEmployee, role } = useFinanceRole();
  const { toastSuccess, toastError, toastInfo, toastWarning } = useToast();

  const [budgets, setBudgets] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [deptCards, setDeptCards] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All');
  const [sortBy, setSortBy] = useState('utilization');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [viewBudget, setViewBudget] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'warning',
    confirmText: 'Confirm',
    onConfirm: () => {},
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        search,
        department: deptFilter,
        status: statusFilter,
        period: periodFilter,
        sortBy,
        sortOrder,
      };

      const [items, m, dCards, trend] = await Promise.all([
        budgetMockService.getBudgets(filters),
        budgetMockService.getBudgetMetrics(),
        budgetMockService.getDepartmentBudgetCards(),
        budgetMockService.getMonthlyBudgetTrend(),
      ]);

      setBudgets(items);
      setMetrics(m);
      setDeptCards(dCards);
      setTrendData(trend);
    } catch (e) {
      console.error(e);
      toastError('Failed to load budget records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, deptFilter, statusFilter, periodFilter, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('All');
    setStatusFilter('All');
    setPeriodFilter('All');
    setCurrentPage(1);
    toastInfo('Budget filters reset to default');
  };

  // Pagination
  const totalPages = Math.ceil(budgets.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return budgets.slice(start, start + pageSize);
  }, [budgets, currentPage]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // Create / Edit Budget
  const handleSaveBudget = async (formData) => {
    try {
      if (editingBudget) {
        await budgetMockService.updateBudget(editingBudget.id, formData);
        toastSuccess(`Budget ${editingBudget.id} updated successfully`);
      } else {
        const created = await budgetMockService.createBudget(formData);
        toastSuccess(`Budget ${created.id} created successfully`);
      }
      setEditingBudget(null);
      loadData();
    } catch (e) {
      toastError('Failed to save budget');
    }
  };

  // Close / Delete Budget
  const handleCloseBudget = (budget) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Close Budget Allocation',
      description: `Are you sure you want to close budget "${budget.name}" (${budget.id})? Closed budgets cannot accept new claims.`,
      type: 'warning',
      confirmText: 'Close Budget',
      onConfirm: async () => {
        await budgetMockService.deleteOrCloseBudget(budget.id, 'close');
        toastWarning(`Budget ${budget.id} marked as Closed`);
        loadData();
      },
    });
  };

  const handleDeleteBudget = (budget) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Budget Record',
      description: `Permanently delete budget record "${budget.name}" (${budget.id})? This cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete Permanently',
      onConfirm: async () => {
        await budgetMockService.deleteOrCloseBudget(budget.id, 'delete');
        toastError(`Budget ${budget.id} removed`);
        loadData();
      },
    });
  };

  // Utilization progress color
  const getProgressColor = (util) => {
    if (util > 100) return 'bg-rose-600';
    if (util >= 85) return 'bg-amber-500';
    return 'bg-emerald-600';
  };

  return (
    <div className="w-full min-w-0 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Budget Management & Monitoring</span>
            {!canManageBudgets && (
              <Badge variant="outline" className="text-xs font-normal">
                Read-Only Overview
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {canManageBudgets
              ? 'Allocate department funding pools, enforce limits, monitor run-rates, and manage risk.'
              : 'Review enterprise departmental budgets, remaining pools, and utilization metrics.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageBudgets && (
            <Button
              size="sm"
              className="gap-1.5 text-xs h-8 shadow-xs"
              onClick={() => {
                setEditingBudget(null);
                setModalOpen(true);
              }}
            >
              <Plus className="size-3.5" />
              <span>Create Budget</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs"
            onClick={() => {
              const csv =
                'data:text/csv;charset=utf-8,Budget ID,Name,Department,Category,Period,Allocated,Spent,Remaining,Utilization,Status\n' +
                budgets
                  .map(
                    (b) =>
                      `"${b.id}","${b.name}","${b.department}","${b.category}","${b.period}","${b.allocated}","${b.spent}","${b.remaining}","${b.utilization}%","${b.status}"`
                  )
                  .join('\n');
              const link = document.createElement('a');
              link.setAttribute('href', encodeURI(csv));
              link.setAttribute('download', `budgets_export_${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toastSuccess('Exported budgets to CSV');
            }}
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 1. Main Budget KPI Dashboard Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Allocated Pool
              </CardDescription>
              <PieChart className="size-4 text-primary" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {formatCurrency(metrics.totalAllocatedBudget)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Authorized departmental pools
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Spend to Date
              </CardDescription>
              <TrendingUp className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(metrics.totalSpent)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Current burn across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Remaining Capital
              </CardDescription>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(metrics.remainingBudget)}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Available uncommitted liquidity
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-4 px-4">
              <CardDescription className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Company Utilization
              </CardDescription>
              <AlertTriangle className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {metrics.utilizationPercentage}%
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {metrics.overBudgetDepartmentsCount > 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    {metrics.overBudgetDepartmentsCount} Over Budget
                  </span>
                ) : (
                  'Within standard targets'
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. Visual Budget Utilization Indicator Card (Example from Person 3 Spec) */}
      <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-gradient-to-r from-muted/40 to-background shadow-xs space-y-3 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Company Budget Health & Utilization Indicator
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                Target: &lt;80%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live run-rate visualizer with automatic threshold warnings for executive oversight.
            </p>
          </div>

          <div className="text-xs font-semibold text-foreground">
            Travel & Engineering Lead Pool: <span className="text-primary font-bold">75%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Progress
            value={metrics?.utilizationPercentage || 68.4}
            className="h-3 bg-muted"
            indicatorClassName={getProgressColor(metrics?.utilizationPercentage || 68.4)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-semibold block">
              Total Budget
            </span>
            <span className="font-bold text-foreground text-sm">
              ₹50,00,000.00
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-semibold block">
              Allocated
            </span>
            <span className="font-bold text-foreground text-sm">
              {formatCurrency(metrics?.totalAllocatedBudget || 3500000)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-semibold block">
              Spent to Date
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
              {formatCurrency(metrics?.totalSpent || 2395000)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-semibold block">
              Remaining Liquidity
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {formatCurrency(metrics?.remainingBudget || 1105000)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Monthly Budget Trend & Department Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full min-w-0">
        {/* Monthly Budget Trend Chart */}
        <Card className="lg:col-span-2 shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Monthly Budget vs. Actual Expenditure Trend
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Comparison between authorized monthly allocations and actual booked expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `₹${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, undefined]}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="allocated" name="Allocated Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" name="Actual Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department-wise Budget Summary Cards */}
        <Card className="shadow-xs border-border/80 flex flex-col min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Department Budget Allocation
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Current burn rates by operating unit
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-64 space-y-3 pr-1 text-xs">
            {deptCards.map((d) => (
              <div
                key={d.department}
                className="p-2.5 rounded-lg border border-border/70 bg-card space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-xs">{d.department}</span>
                  <span
                    className={`font-bold text-[11px] ${
                      d.utilization > 100
                        ? 'text-rose-600'
                        : d.utilization >= 85
                        ? 'text-amber-600'
                        : 'text-foreground'
                    }`}
                  >
                    {d.utilization}%
                  </span>
                </div>
                <Progress
                  value={Math.min(d.utilization, 100)}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(d.utilization)}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Spent: {formatCurrency(d.spent, 'INR', false)}</span>
                  <span>Pool: {formatCurrency(d.allocated, 'INR', false)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Budget Records Table */}
      <Card className="shadow-xs border-border/80 w-full min-w-0 overflow-hidden">
        <CardHeader className="pb-3 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Corporate Budget Records
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Active allocations, burn metrics, and spending caps
              </CardDescription>
            </div>
            <span className="text-xs text-muted-foreground">
              Showing {paginatedList.length} of {budgets.length} budgets
            </span>
          </div>

          {/* Filter Bar Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 text-xs">
            {/* Search input */}
            <div className="lg:col-span-2">
              <AnimatedSearchBar
                placeholder="Search budget title, project, department..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearch('');
                  setCurrentPage(1);
                }}
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

            {/* Status filter */}
            <div>
              <FilterSelect
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                options={BUDGET_STATUS_OPTIONS}
                placeholder="All Statuses"
              />
            </div>

            {/* Reset */}
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-full gap-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={handleResetFilters}
              >
                <RotateCcw className="size-3" />
                <span>Reset Filters</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[850px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6 cursor-pointer select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      <span>BUDGET ID</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead>DEPARTMENT & PROJECT</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead>PERIOD</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('allocated')}>
                    <div className="flex items-center gap-1">
                      <span>ALLOCATED</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('spent')}>
                    <div className="flex items-center gap-1">
                      <span>SPENT</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead>REMAINING</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => handleSort('utilization')}>
                    <div className="flex items-center gap-1">
                      <span>UTILIZATION</span>
                      <ArrowUpDown className="size-3" />
                    </div>
                  </TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-xs text-muted-foreground">
                      Loading budget allocations...
                    </TableCell>
                  </TableRow>
                ) : paginatedList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-xs text-muted-foreground">
                      No budget records matching criteria found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="pl-6 font-mono text-xs font-semibold text-foreground">
                        {row.id}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-foreground leading-tight">
                            {row.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {row.department} {row.project && `• ${row.project}`}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground">
                        {row.category}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {row.period}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-foreground">
                        {formatCurrency(row.allocated, row.currency)}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(row.spent, row.currency)}
                      </TableCell>

                      <TableCell
                        className={`text-xs font-bold ${
                          row.remaining < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {formatCurrency(row.remaining, row.currency)}
                      </TableCell>

                      <TableCell>
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span>{row.utilization}%</span>
                          </div>
                          <Progress
                            value={Math.min(row.utilization, 100)}
                            className="h-1.5"
                            indicatorClassName={getProgressColor(row.utilization)}
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <BudgetStatusBadge status={row.status} utilization={row.utilization} />
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
                          <DropdownMenuContent align="end" className="w-44 text-xs">
                            <DropdownMenuItem
                              onClick={() => {
                                setViewBudget(row);
                                setViewModalOpen(true);
                              }}
                              className="cursor-pointer flex items-center gap-2"
                            >
                              <Eye className="size-3.5 text-primary" />
                              <span>View Budget</span>
                            </DropdownMenuItem>

                            {canManageBudgets && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingBudget(row);
                                    setModalOpen(true);
                                  }}
                                  className="cursor-pointer flex items-center gap-2"
                                >
                                  <Edit2 className="size-3.5 text-muted-foreground" />
                                  <span>Edit Budget</span>
                                </DropdownMenuItem>

                                {row.status !== 'Closed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleCloseBudget(row)}
                                    className="cursor-pointer text-amber-600 focus:text-amber-600 flex items-center gap-2"
                                  >
                                    <Lock className="size-3.5" />
                                    <span>Close Budget</span>
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={() => handleDeleteBudget(row)}
                                  className="cursor-pointer text-rose-600 focus:text-rose-600 flex items-center gap-2"
                                >
                                  <Trash2 className="size-3.5" />
                                  <span>Delete Record</span>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, budgets.length)} of {budgets.length} budgets
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

      {/* Create / Edit Budget Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingBudget}
        onSave={handleSaveBudget}
      />

      {/* View Budget Details Modal */}
      <BudgetDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        budget={viewBudget}
        canManage={canManageBudgets}
        onEdit={(b) => {
          setEditingBudget(b);
          setModalOpen(true);
        }}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
      />
    </div>
  );
};

export default Budgets;
