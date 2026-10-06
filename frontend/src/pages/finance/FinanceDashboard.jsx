import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  Download,
  Calendar,
  ShieldAlert,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { useFinanceRole } from '@/hooks/useFinanceRole';
import { useToast } from '@/context/ToastContext';
import financeMockService from '@/services/mock/financeMockService';
import { formatCurrency } from '@/lib/currency';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

export const FinanceDashboard = () => {
  const { user } = useAuth();
  const { canViewCompanyAnalytics, role } = useFinanceRole();
  const { toastSuccess, toastInfo } = useToast();

  const [dateRange, setDateRange] = useState('This Month');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [expenseTrend, setExpenseTrend] = useState([]);
  const [deptSpending, setDeptSpending] = useState([]);
  const [catSpending, setCatSpending] = useState([]);
  const [reimbursementAnalytics, setReimbursementAnalytics] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [ov, trend, dept, cat, reim, status] = await Promise.all([
        financeMockService.getFinancialOverview(dateRange),
        financeMockService.getExpenseTrend(),
        financeMockService.getDepartmentSpending(),
        financeMockService.getCategorySpending(),
        financeMockService.getReimbursementAnalytics(),
        financeMockService.getExpenseStatusDistribution(),
      ]);

      setOverview(ov);
      setExpenseTrend(trend);
      setDeptSpending(dept);
      setCatSpending(cat);
      setReimbursementAnalytics(reim);
      setStatusDistribution(status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const handleExport = (format) => {
    toastSuccess(`Generating ${format} financial executive summary export for ${dateRange}...`, 'Report Export');
  };

  return (
    <div className="w-full min-w-0 space-y-6 animate-fade-in">
      {/* Page Title & Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>Corporate Financial Analytics & Dashboard</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enterprise overview of spend burn rates, budget utilization, settlement compliance, and audit risks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date range filter */}
          <div className="flex items-center gap-1.5 bg-card border border-border/80 rounded-lg p-1 text-xs shadow-2xs">
            <Calendar className="size-3.5 text-muted-foreground ml-1.5" />
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                toastInfo(`Filtered analytics by ${e.target.value}`);
              }}
              className="h-7 bg-transparent border-none text-xs font-semibold text-foreground focus:outline-none pr-2 cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="This Year">This Year</option>
              <option value="Custom Range">Custom Fiscal Range</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={() => handleExport('CSV')}
            >
              <Download className="size-3.5" />
              <span>CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              onClick={() => handleExport('Excel')}
            >
              <Download className="size-3.5" />
              <span>Excel</span>
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1 bg-primary text-primary-foreground"
              onClick={() => handleExport('PDF')}
            >
              <Download className="size-3.5" />
              <span>PDF Summary</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Company Level Financial KPI Overview Grid */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full min-w-0">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(overview.totalExpenses)}
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                +14.2% YoY
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Approved Spend
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(overview.approvedExpenses)}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {Math.round((overview.approvedExpenses / overview.totalExpenses) * 100)}% approval rate
              </span>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending Claims
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(overview.pendingExpenses)}
              </div>
              <span className="text-[10px] text-muted-foreground">Under active audit</span>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Reimbursed YTD
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(overview.reimbursedAmount)}
              </div>
              <span className="text-[10px] text-muted-foreground">Settled to bank accounts</span>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pending Payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(overview.pendingReimbursement)}
              </div>
              <span className="text-[10px] text-muted-foreground">Queued in treasury</span>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Average Claim
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(overview.averageExpense)}
              </div>
              <span className="text-[10px] text-muted-foreground">Per employee claim</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Highlights Banner */}
      {overview && (
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full min-w-0">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
              Highest Spending Unit
            </span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
              <Building className="size-3.5 text-primary" />
              <span>{overview.highestSpendingDepartment}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
              Top Expense Category
            </span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
              <PieIcon className="size-3.5 text-emerald-500" />
              <span>{overview.highestExpenseCategory}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
              Overall Budget Utilization
            </span>
            <span className="font-bold text-foreground text-sm flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="size-3.5 text-blue-500" />
              <span>{overview.budgetUtilization}%</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
              Policy Flagged / Violations
            </span>
            <span className="font-bold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-1.5 mt-0.5">
              <ShieldAlert className="size-3.5 text-rose-500" />
              <span>{overview.policyViolations} Claims Flagged</span>
            </span>
          </div>
        </div>
      )}

      {/* 2. Charts Row: Section A (Expense Trend) & Section B (Department Spending) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* Section A: Expense Trend Over Time (Jan - Jun) */}
        <Card className="shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              A. Expense Incurrence & Reimbursement Trend
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Monthly expenditures vs. disbursed settlement run-rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorReimbursed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Incurred Claims"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                  <Area
                    type="monotone"
                    dataKey="reimbursed"
                    name="Disbursed Settlement"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorReimbursed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section B: Department Spending */}
        <Card className="shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              B. Department Spending vs. Authorized Budget
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Operating division expenditure comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSpending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
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
                  <Bar dataKey="allocated" name="Budget Cap" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" name="Actual Spend" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts Row: Section C (Category Spending), Section D (Reimbursement Analytics), Section F (Status Distribution) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full min-w-0">
        {/* Section C: Category Spending */}
        <Card className="shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              C. Category Spend Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Breakdown by expense purpose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catSpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {catSpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, undefined]}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px]">
              {catSpending.slice(0, 6).map((c, idx) => (
                <div key={c.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.color || COLORS[idx] }}
                  />
                  <span className="text-muted-foreground truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section D: Reimbursement Analytics */}
        <Card className="shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              D. Reimbursement Pipeline Status
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Volume across settlement lifecycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-1 text-xs">
              {reimbursementAnalytics.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground">{item.status}</span>
                    <span className="text-muted-foreground font-mono">
                      {item.count} claims • {formatCurrency(item.amount, 'INR', false)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: item.color,
                        width: `${Math.min((item.count / 42) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section F: Expense Status Distribution */}
        <Card className="shadow-xs border-border/80 min-w-0 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              F. Workflow Status Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              All submitted claims across stages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`status-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, props) => [`${val} claims (${props.payload.percentage}%)`, props.payload.name]}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px]">
              {statusDistribution.slice(0, 6).map((s, idx) => (
                <div key={s.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-muted-foreground truncate">{s.name} ({s.percentage}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;

