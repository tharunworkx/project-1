import React, { useState } from 'react';
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
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from '../../components/common/Modal';

const initialBudgets = [
  {
    id: 'BDG-001',
    name: 'Engineering & Infrastructure',
    code: 'ENG-2026',
    allocated: 100000,
    spent: 82500,
    owner: 'Alex Morgan',
    period: 'Q1 2026',
    category: 'Engineering',
    icon: Terminal,
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'BDG-002',
    name: 'Marketing & Digital Acquisition',
    code: 'MKT-2026',
    allocated: 50000,
    spent: 47200,
    owner: 'Sarah Jenkins',
    period: 'Q1 2026',
    category: 'Growth & Ads',
    icon: Megaphone,
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  {
    id: 'BDG-003',
    name: 'Enterprise Sales & BD',
    code: 'SLS-2026',
    allocated: 60000,
    spent: 34100,
    owner: 'Michael Brown',
    period: 'Q1 2026',
    category: 'Direct Sales',
    icon: Briefcase,
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'BDG-004',
    name: 'Product Design & Research',
    code: 'PRD-2026',
    allocated: 30000,
    spent: 18300,
    owner: 'Emily Stone',
    period: 'Q1 2026',
    category: 'UX & Prototyping',
    icon: Palette,
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    id: 'BDG-005',
    name: 'People Operations & HR',
    code: 'HR-2026',
    allocated: 20000,
    spent: 9800,
    owner: 'David Kim',
    period: 'Q1 2026',
    category: 'People & Culture',
    icon: UsersIcon,
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
];

export const Budgets = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    allocated: '',
    owner: 'Alex Morgan',
    period: 'Q2 2026',
  });

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const remaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const handleCreateBudget = (e) => {
    e.preventDefault();
    const newBudget = {
      id: `BDG-${String(budgets.length + 1).padStart(3, '0')}`,
      name: formData.name,
      code: formData.code,
      allocated: parseFloat(formData.allocated) || 50000,
      spent: 0,
      owner: formData.owner,
      period: formData.period,
      category: 'Department Pool',
      icon: Building2,
      iconBg: 'bg-primary/10 text-primary border-primary/20',
    };
    setBudgets([newBudget, ...budgets]);
    setModalOpen(false);
    setFormData({ name: '', code: '', allocated: '', owner: 'Alex Morgan', period: 'Q2 2026' });
    setNotification(`Budget pool "${formData.name}" established successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Budgets & Spend Caps
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure and audit spending caps across business units and quarterly cycles.
          </p>
        </div>

        <Button
          size="sm"
          className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="size-3.5" />
          <span>New Budget Pool</span>
        </Button>
      </div>

      {/* Aggregate Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Allocated Pool
          </span>
          <div className="text-2xl md:text-3xl font-extrabold text-foreground mt-1 tracking-tight">
            ₹{totalAllocated.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">
            Across {budgets.length} active departments
          </span>
        </div>

        <div className="bg-white dark:bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Actual Spend to Date
          </span>
          <div className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 tracking-tight">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">
            {overallPercentage}% of total company pool utilized
          </span>
        </div>

        <div className="bg-white dark:bg-card text-card-foreground rounded-2xl border border-border/80 shadow-xs p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Remaining Balance
          </span>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">
            ₹{remaining.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-muted-foreground mt-1.5 block">
            {100 - overallPercentage}% remaining headroom
          </span>
        </div>
      </div>

      {/* Budgets List Grid - Inspired by Image 1 (Amazon, Google reference cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((budget) => {
          const pct = Math.min(100, Math.round((budget.spent / budget.allocated) * 100));
          const isDanger = pct >= 90;
          const isWarn = pct >= 80;
          const remainingAmount = budget.allocated - budget.spent;
          const Icon = budget.icon || Building2;

          return (
            <div
              key={budget.id}
              className="group relative bg-white dark:bg-card text-card-foreground rounded-2xl border border-border/80 dark:border-border p-6 shadow-xs flex flex-col justify-between gap-5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer select-none"
            >
              {/* Card Top Row: Circular Avatar/Logo on Left, Pill Badge on Right */}
              <div className="flex items-center justify-between">
                <div className={`size-11 rounded-full border flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-105 ${budget.iconBg}`}>
                  <Icon className="size-5" />
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                    isDanger
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      : isWarn
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  <span className={`size-1.5 rounded-full mr-1.5 ${
                    isDanger ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  {pct}% Utilized
                </Badge>
              </div>

              {/* Title & Subtitle Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-foreground/80">{budget.code}</span>
                  <span>•</span>
                  <span>{budget.period}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                  {budget.name}
                </h3>
              </div>

              {/* Pill Tags (Matching Part-time / Senior level tags from Image 1) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                  {budget.owner}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                  Cap: ₹{budget.allocated.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress Bar & Alert */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>Spent: <strong className="text-foreground font-semibold">₹{budget.spent.toLocaleString('en-IN')}</strong></span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger
                        ? 'bg-rose-500'
                        : isWarn
                        ? 'bg-amber-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Bottom Row: Metric on Left, Primary Black Button on Right (Matching Apply now in Image 1) */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div>
                  <div className="text-base font-bold text-foreground">
                    ₹{remainingAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">
                    Remaining balance
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Budget Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Department Budget Pool"
      >
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Department / Unit Name *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AI Research Lab"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Budget Code *</label>
              <Input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. AI-2026"
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Allocation Amount (₹) *</label>
              <Input
                type="number"
                required
                value={formData.allocated}
                onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
                placeholder="50000"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Budget Owner</label>
              <Input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Quarterly Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Q1 2026">Q1 2026</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="Q3 2026">Q3 2026</option>
                <option value="Q4 2026">Q4 2026</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
