import React from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Clock3,
  CheckCircle2,
  Banknote,
  Plus,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import StatCard from "../../components/dashboard/StatCard";
import ExpenseTrend from "../../components/dashboard/ExpenseTrend";
import ExpenseBreakdown from "../../components/dashboard/ExpenseBreakdown";
import RecentExpenses from "../../components/dashboard/RecentExpenses";
import BudgetProgress from "../../components/dashboard/BudgetProgress";
import expenseStore from "../../services/expenseStore";

export default function Dashboard() {
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