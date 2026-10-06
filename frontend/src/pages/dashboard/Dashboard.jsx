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

export default function Dashboard() {
  const statsData = [
    {
      icon: Wallet,
      value: "₹8,42,450",
      title: "Total Expenses",
      changePercentage: "+18.2%",
      isPositive: true,
    },
    {
      icon: Clock3,
      value: "24",
      title: "Pending Approvals",
      changePercentage: "-8.7%",
      isPositive: false,
    },
    {
      icon: CheckCircle2,
      value: "₹6,20,450",
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

      {/* 1. Statistics Cards (matching statistics-card-01.tsx) */}
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

      {/* 2. Charts & Insights Row (matching chart-sales-metrics & widget-total-earning) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ExpenseTrend />
        </div>
        <div>
          <ExpenseBreakdown />
        </div>
      </div>

      {/* 3. Datatable & Progress Row (matching datatable-transaction & budget widget) */}
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