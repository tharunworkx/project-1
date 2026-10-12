import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Clock3,
  CheckCircle2,
  Banknote,
  Plus,
  Download,
  Check,
  X,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { supabase } from "../../services/supabaseStorage";
import StatCard from "../../components/dashboard/StatCard";
import ExpenseTrend from "../../components/dashboard/ExpenseTrend";
import ExpenseBreakdown from "../../components/dashboard/ExpenseBreakdown";
import RecentExpenses from "../../components/dashboard/RecentExpenses";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import expenseStore from "../../services/expenseStore";

export default function Dashboard() {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvingId, setApprovingId] = useState(null);

  const roleLower = (user?.role || '').toLowerCase();
  const isAdminOrManager = roleLower === 'admin' || roleLower.includes('manager') || roleLower.includes('cfo');

  const loadPendingRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });
      if (!error && Array.isArray(data)) {
        setPendingUsers(data.filter((u) => typeof u.role === 'string' && u.role.startsWith('PENDING:')));
      }
    } catch (e) {
      console.warn('Dashboard pending registrations query error:', e);
    }
  };

  useEffect(() => {
    loadPendingRegistrations();
    const interval = setInterval(loadPendingRegistrations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickApprove = async (pUser) => {
    try {
      setApprovingId(pUser.id);
      const cleanRole = pUser.role.replace('PENDING:', '').trim() || 'Employee';
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('users')
        .update({ role: cleanRole, updated_at: now })
        .eq('id', pUser.id);

      if (error) {
        toastError('Failed to approve user: ' + error.message);
        return;
      }

      setPendingUsers((prev) => prev.filter((u) => u.id !== pUser.id));
      toastSuccess(`Approved registration for ${pUser.email}! User can now log in as ${cleanRole}.`, 'User Approved');
    } catch (err) {
      toastError('Error approving registration request');
    } finally {
      setApprovingId(null);
    }
  };

  const handleQuickDecline = async (pUser) => {
    if (!window.confirm(`Decline registration request for ${pUser.email}?`)) return;
    try {
      setApprovingId(pUser.id);
      await supabase.from('users').delete().eq('id', pUser.id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== pUser.id));
      toastSuccess(`Declined registration for ${pUser.email}`);
    } catch (err) {
      toastError('Error declining registration');
    } finally {
      setApprovingId(null);
    }
  };

  const allExpenses = expenseStore.getExpenses();

  const pendingCount = allExpenses.filter(
    (e) => e.status && e.status.toLowerCase() === "pending"
  ).length;

  const totalExpenseSum = allExpenses.reduce((acc, curr) => {
    return acc + (curr.numericAmount || 0);
  }, 0);

  const approvedSum = allExpenses
    .filter((e) => e.status && e.status.toLowerCase() === "approved")
    .reduce((acc, curr) => acc + (curr.numericAmount || 0), 0);

  const formattedTotal = `₹${totalExpenseSum.toLocaleString("en-IN")}`;
  const formattedApproved = `₹${approvedSum.toLocaleString("en-IN")}`;

  const statsData = [
    {
      icon: Wallet,
      value: formattedTotal !== "₹0" ? formattedTotal : "₹8,42,450",
      title: "Total Expenses",
      changePercentage: "+18.2%",
      isPositive: true,
    },
    {
      icon: Clock3,
      value: pendingCount.toString(),
      title: "Pending Approvals",
      changePercentage: "-8.7%",
      isPositive: false,
    },
    {
      icon: CheckCircle2,
      value: formattedApproved !== "₹0" ? formattedApproved : "₹6,20,450",
      title: "Approved Claims",
      changePercentage: "+12.4%",
      isPositive: true,
    },
    {
      icon: Banknote,
      value: "₹1,42,000",
      title: "Reimbursements Due",
      changePercentage: "+4.3%",
      isPositive: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Financial Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time company expenditures, pending employee claims, and department budgets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="size-3.5" />
            <span>Export Report</span>
          </Button>
          <Button asChild size="sm" className="gap-2 text-xs">
            <Link to="/expenses/new">
              <Plus className="size-3.5" />
              <span>Create Expense</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Pending Account Registration Requests Banner Card */}
      {isAdminOrManager && pendingUsers.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Clock3 className="size-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span>Pending Account Registration Requests</span>
                  <Badge className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {pendingUsers.length} Action Needed
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Newly signed-up users are awaiting administrator approval before they can log in.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs shrink-0 self-start sm:self-center border-amber-500/30 hover:bg-amber-500/10">
              <Link to="/admin/users">
                <span>Manage in Users</span>
                <ChevronRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2 pt-1">
            {pendingUsers.map((u) => {
              const fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email;
              const requestedRole = u.role.replace('PENDING:', '').trim();
              return (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-card/90 dark:bg-zinc-900/90 border border-border gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">{fullName}</span>
                      <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-[10px]">
                        {requestedRole}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        {u.department || 'General'}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground block truncate mt-0.5">{u.email}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      disabled={approvingId === u.id}
                      onClick={() => handleQuickApprove(u)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="size-3.5 stroke-[2.5]" />
                      <span>{approvingId === u.id ? 'Approving...' : 'Approve Access'}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={approvingId === u.id}
                      onClick={() => handleQuickDecline(u)}
                      className="h-8 text-xs border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-lg gap-1.5 cursor-pointer"
                    >
                      <X className="size-3.5 stroke-[2.5]" />
                      <span>Decline</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            value={stat.value}
            title={stat.title}
            changePercentage={stat.changePercentage}
            isPositive={stat.isPositive}
          />
        ))}
      </div>

      {/* 2. Charts & Insights Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExpenseTrend />
        </div>
        <div>
          <ExpenseBreakdown />
        </div>
      </div>

      {/* 3. Datatable & Progress Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentExpenses />
        </div>
        <div>
          <BudgetProgress />
        </div>
      </div>
    </div>
  );
}