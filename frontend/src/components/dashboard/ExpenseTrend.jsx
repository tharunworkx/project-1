import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock3,
  Receipt,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "cn";

const PERIOD_CONFIGS = {
  "7D": {
    description: "Daily expenditures vs cleared disbursements for the past 7 days",
    data: [
      { label: "02 Oct", expenses: 8400, approved: 6200 },
      { label: "03 Oct", expenses: 12500, approved: 10400 },
      { label: "04 Oct", expenses: 4200, approved: 3500 },
      { label: "05 Oct", expenses: 3100, approved: 2800 },
      { label: "06 Oct", expenses: 15800, approved: 13200 },
      { label: "07 Oct", expenses: 11400, approved: 9800 },
      { label: "08 Oct", expenses: 9200, approved: 7500 },
    ],
    metrics: [
      {
        icon: TrendingUp,
        title: "Expense Trend",
        value: "₹64,600",
        change: "+5.8%",
        positive: true,
      },
      {
        icon: CheckCircle2,
        title: "Approved Claims",
        value: "₹53,400",
        change: "+7.4%",
        positive: true,
      },
      {
        icon: Clock3,
        title: "Pending Approval",
        value: "₹11,200",
        change: "-3.1%",
        positive: false,
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        value: "₹5,800",
        change: "+2.2%",
        positive: true,
      },
    ],
  },
  "30D": {
    description: "Weekly expenditures vs cleared disbursements for the past 30 days",
    data: [
      { label: "Week 1", expenses: 48500, approved: 41200 },
      { label: "Week 2", expenses: 56200, approved: 49800 },
      { label: "Week 3", expenses: 62400, approved: 53100 },
      { label: "Week 4", expenses: 51800, approved: 46500 },
      { label: "Week 5", expenses: 26900, approved: 22400 },
    ],
    metrics: [
      {
        icon: TrendingUp,
        title: "Expense Trend",
        value: "₹2,45,800",
        change: "+8.6%",
        positive: true,
      },
      {
        icon: CheckCircle2,
        title: "Approved Claims",
        value: "₹2,13,000",
        change: "+9.4%",
        positive: true,
      },
      {
        icon: Clock3,
        title: "Pending Approval",
        value: "₹32,800",
        change: "-5.2%",
        positive: false,
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        value: "₹21,400",
        change: "+3.8%",
        positive: true,
      },
    ],
  },
  "3M": {
    description: "Monthly expenditures vs cleared disbursements for the past quarter (3 Months)",
    data: [
      { label: "Aug", expenses: 74500, approved: 65200 },
      { label: "Sep", expenses: 88200, approved: 78400 },
      { label: "Oct", expenses: 95400, approved: 84100 },
    ],
    metrics: [
      {
        icon: TrendingUp,
        title: "Expense Trend",
        value: "₹4,58,100",
        change: "+10.5%",
        positive: true,
      },
      {
        icon: CheckCircle2,
        title: "Approved Claims",
        value: "₹3,92,700",
        change: "+9.1%",
        positive: true,
      },
      {
        icon: Clock3,
        title: "Pending Approval",
        value: "₹65,400",
        change: "-4.2%",
        positive: false,
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        value: "₹41,200",
        change: "+4.6%",
        positive: true,
      },
    ],
  },
  "6M": {
    description: "Semi-annual expenditures vs cleared disbursements (6 Months)",
    data: [
      { label: "May", expenses: 62000, approved: 55000 },
      { label: "Jun", expenses: 79000, approved: 72000 },
      { label: "Jul", expenses: 84000, approved: 76000 },
      { label: "Aug", expenses: 74500, approved: 65200 },
      { label: "Sep", expenses: 88200, approved: 78400 },
      { label: "Oct", expenses: 95400, approved: 84100 },
    ],
    metrics: [
      {
        icon: TrendingUp,
        title: "Expense Trend",
        value: "₹8,42,450",
        change: "+12.4%",
        positive: true,
      },
      {
        icon: CheckCircle2,
        title: "Approved Claims",
        value: "₹6,20,450",
        change: "+8.1%",
        positive: true,
      },
      {
        icon: Clock3,
        title: "Pending Approval",
        value: "₹1,42,000",
        change: "-3.2%",
        positive: false,
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        value: "₹79,800",
        change: "+4.5%",
        positive: true,
      },
    ],
  },
  "1Y": {
    description: "Full year 12-month expenditures vs cleared disbursements",
    data: [
      { label: "Nov", expenses: 48000, approved: 42000 },
      { label: "Dec", expenses: 53000, approved: 47000 },
      { label: "Jan", expenses: 42000, approved: 35000 },
      { label: "Feb", expenses: 54000, approved: 48000 },
      { label: "Mar", expenses: 49000, approved: 42000 },
      { label: "Apr", expenses: 68000, approved: 61000 },
      { label: "May", expenses: 62000, approved: 55000 },
      { label: "Jun", expenses: 79000, approved: 72000 },
      { label: "Jul", expenses: 84000, approved: 76000 },
      { label: "Aug", expenses: 74500, approved: 65200 },
      { label: "Sep", expenses: 88200, approved: 78400 },
      { label: "Oct", expenses: 95400, approved: 84100 },
    ],
    metrics: [
      {
        icon: TrendingUp,
        title: "Expense Trend",
        value: "₹16,84,000",
        change: "+15.2%",
        positive: true,
      },
      {
        icon: CheckCircle2,
        title: "Approved Claims",
        value: "₹13,92,000",
        change: "+12.4%",
        positive: true,
      },
      {
        icon: Clock3,
        title: "Pending Approval",
        value: "₹2,15,000",
        change: "-2.1%",
        positive: false,
      },
      {
        icon: Receipt,
        title: "Tax & Compliance",
        value: "₹1,48,000",
        change: "+5.6%",
        positive: true,
      },
    ],
  },
};

export default function ExpenseTrend() {
  const [period, setPeriod] = React.useState("6M");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // In dark mode: white. In light mode: light black (soft charcoal #4b5563)
  const expenseBarFill = isDark ? "#ffffff" : "#4b5563";

  const currentConfig = PERIOD_CONFIGS[period] || PERIOD_CONFIGS["6M"];

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Expense Metrics</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {currentConfig.description}
          </CardDescription>
        </div>

        {/* High-contrast segmented timeline control - clearly visible in both light & dark modes */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200/90 bg-zinc-100/90 dark:border-zinc-800 dark:bg-zinc-900/90 p-1 shadow-xs">
          {["7D", "30D", "3M", "6M", "1Y"].map((item) => {
            const isSelected = period === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer select-none",
                  isSelected
                    ? "bg-white text-zinc-950 font-bold shadow-sm border border-zinc-300/90 ring-1 ring-zinc-950/5 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:ring-white/10 dark:shadow-xs"
                    : "border border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/40"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="h-[250px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={period}
              data={currentConfig.data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/60"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => (value >= 1000 ? `₹${Math.round(value / 1000)}k` : `₹${value}`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  color: "var(--foreground)",
                }}
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name === "expenses" ? "Total Expenses" : "Approved Claims",
                ]}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Bar
                dataKey="expenses"
                name="Total Expenses"
                fill={expenseBarFill}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="approved"
                name="Approved Claims"
                fill="oklch(0.6 0.118 184.704)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Bottom Highlight Cards dynamically synchronizing with selected timeline */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-border/60 pt-4">
          {currentConfig.metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="flex flex-col gap-1 p-2.5 rounded-lg bg-muted/40 border border-border/40">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Icon className="size-3.5 text-primary" />
                  <span className="truncate">{m.title}</span>
                </div>
                <div className="text-base font-bold text-foreground">
                  {m.value}
                </div>
                <span className={`text-[11px] font-medium ${m.positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                  {m.change}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}