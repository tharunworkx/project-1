import {
  Wallet,
  Clock3,
  CheckCircle2,
  Banknote,
  Plus,
  FileText,
  Users,
  ArrowRight
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import ExpenseTrend from "../../components/dashboard/ExpenseTrend";
import ExpenseBreakdown from "../../components/dashboard/ExpenseBreakdown";
import RecentExpenses from "../../components/dashboard/RecentExpenses";
import BudgetProgress from "../../components/dashboard/BudgetProgress";

export default function Dashboard() {

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-end justify-between">

        <div>

          <p className="text-[11px] text-[#7b878b]">
            Monday, 05 October 2026
          </p>

          <h1 className="
            mt-1
            text-[28px]
            font-semibold
            tracking-[-0.03em]
            text-[#172b35]
          ">
            Good morning, Tharun 👋
          </h1>

          <p className="mt-1 text-[13px] text-[#718087]">
            Here's what's happening with company expenses today.
          </p>

        </div>

        <button className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-[#102522]
          px-4
          py-2.5
          text-[11px]
          font-medium
          text-white
          shadow-sm
          transition
          hover:bg-[#1b3833]
        ">
          <Plus size={16} />
          Create Expense
        </button>

      </div>


      {/* Stats */}

      <div className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <StatCard
          title="Total Expenses"
          value="₹8,42,450"
          subtitle="↑ 8.4% from last month"
          icon={Wallet}
        />

        <StatCard
          title="Pending Approval"
          value="24"
          subtitle="8 require attention today"
          icon={Clock3}
          variant="orange"
        />

        <StatCard
          title="Approved Expenses"
          value="₹6,20,450"
          subtitle="86 approved claims"
          icon={CheckCircle2}
          variant="blue"
        />

        <StatCard
          title="Pending Reimbursement"
          value="₹1,42,000"
          subtitle="18 claims awaiting payout"
          icon={Banknote}
        />

      </div>


      {/* Main Charts */}

      <div className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-[1.7fr_0.9fr]
      ">

        <ExpenseTrend />

        <ExpenseBreakdown />

      </div>


      {/* Tables */}

      <div className="
        grid
        grid-cols-1
        gap-5
        xl:grid-cols-[1.7fr_0.9fr]
      ">

        <RecentExpenses />

        <BudgetProgress />

      </div>


      {/* Quick Actions */}

      <div className="
        grid
        grid-cols-1
        gap-4
        md:grid-cols-3
      ">

        <QuickAction
          icon={Plus}
          title="Create an Expense"
          description="Submit a new expense claim"
        />

        <QuickAction
          icon={CheckCircle2}
          title="Review Approvals"
          description="View expenses waiting for approval"
        />

        <QuickAction
          icon={FileText}
          title="View Reports"
          description="Analyze company spending"
        />

      </div>

    </div>
  );
}


function QuickAction({
  icon: Icon,
  title,
  description
}) {

  return (
    <button className="
      group
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-[#e7e3da]
      bg-white
      p-5
      text-left
      transition
      hover:-translate-y-0.5
      hover:shadow-sm
    ">

      <div className="flex items-center gap-4">

        <div className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[#edf4ed]
          text-[#28786f]
        ">

          <Icon size={18} />

        </div>

        <div>

          <p className="text-[12px] font-semibold text-[#273a40]">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-[#7a858a]">
            {description}
          </p>

        </div>

      </div>

      <ArrowRight
        size={16}
        className="
          text-[#9aa3a6]
          transition
          group-hover:translate-x-1
        "
      />

    </button>
  );
}