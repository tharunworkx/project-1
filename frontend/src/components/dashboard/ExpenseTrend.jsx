import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  LineChart,
  Line,
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
  ArrowUpRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const chartData = [
  { month: "Jan", expenses: 42000, approved: 35000 },
  { month: "Feb", expenses: 54000, approved: 48000 },
  { month: "Mar", expenses: 49000, approved: 42000 },
  { month: "Apr", expenses: 68000, approved: 61000 },
  { month: "May", expenses: 62000, approved: 55000 },
  { month: "Jun", expenses: 79000, approved: 72000 },
  { month: "Jul", expenses: 84000, approved: 76000 },
];

const metrics = [
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
];

export default function ExpenseTrend() {
  const [period, setPeriod] = React.useState("6M");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // In dark mode: white. In light mode: light black (soft charcoal #4b5563)
  const expenseBarFill = isDark ? "#ffffff" : "#4b5563";

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Expense Metrics</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Quarterly company expenditures vs cleared disbursements
          </CardDescription>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
          {["7D", "30D", "3M", "6M", "1Y"].map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                period === item
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="h-[250px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/60"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
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

        {/* 4 Bottom Highlight Cards matching template */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-border/60 pt-4">
          {metrics.map((m) => {
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