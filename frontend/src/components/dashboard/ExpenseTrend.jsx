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
  Cell,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock3,
  Receipt,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// Distinct datasets for each time period
const periodConfigs = {
  "7D": {
    subTitle: "Daily company expenditures vs cleared disbursements (Last 7 Days)",
    peakLabel: "Fri • ₹35,000",
    chart: [
      { name: "Mon", expenses: 14500, approved: 12000, date: "Mon, Oct 2" },
      { name: "Tue", expenses: 22000, approved: 18500, date: "Tue, Oct 3" },
      { name: "Wed", expenses: 18200, approved: 15800, date: "Wed, Oct 4" },
      { name: "Thu", expenses: 28400, approved: 24100, date: "Thu, Oct 5" },
      { name: "Fri", expenses: 35000, approved: 31200, date: "Fri, Oct 6" },
      { name: "Sat", expenses: 8400, approved: 7200, date: "Sat, Oct 7" },
      { name: "Sun", expenses: 6200, approved: 5100, date: "Sun, Oct 8" },
    ],
    formatTick: (val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`,
    metrics: [
      { title: "Weekly Spend", value: "₹1,32,700", change: "+4.2%", positive: true, icon: TrendingUp },
      { title: "Approved Claims", value: "₹1,13,900", change: "+6.8%", positive: true, icon: CheckCircle2 },
      { title: "Pending Claims", value: "₹18,800", change: "-2.1%", positive: false, icon: Clock3 },
      { title: "Tax & Compliance", value: "₹14,500", change: "+3.1%", positive: true, icon: Receipt },
    ],
  },
  "30D": {
    subTitle: "Weekly company expenditures vs cleared disbursements (Last 30 Days)",
    peakLabel: "Week 4 • ₹2,10,000",
    chart: [
      { name: "W1", expenses: 142000, approved: 128000, date: "Week 1 (Sep 8-14)" },
      { name: "W2", expenses: 185000, approved: 162000, date: "Week 2 (Sep 15-21)" },
      { name: "W3", expenses: 164000, approved: 149000, date: "Week 3 (Sep 22-28)" },
      { name: "W4", expenses: 210000, approved: 188000, date: "Week 4 (Sep 29-Oct 5)" },
      { name: "W5", expenses: 95000, approved: 82000, date: "Week 5 (Oct 6-8)" },
    ],
    formatTick: (val) => `₹${(val / 1000).toFixed(0)}k`,
    metrics: [
      { title: "Monthly Spend", value: "₹7,96,000", change: "+8.4%", positive: true, icon: TrendingUp },
      { title: "Approved Claims", value: "₹7,09,000", change: "+11.2%", positive: true, icon: CheckCircle2 },
      { title: "Pending Claims", value: "₹87,000", change: "-5.3%", positive: false, icon: Clock3 },
      { title: "Tax & Compliance", value: "₹68,400", change: "+2.9%", positive: true, icon: Receipt },
    ],
  },
  "3M": {
    subTitle: "Bi-weekly expenditures vs cleared disbursements (Last 3 Months)",
    peakLabel: "Sep Late • ₹3,60,000",
    chart: [
      { name: "Aug Early", expenses: 260000, approved: 230000, date: "Aug 1 - 15" },
      { name: "Aug Late", expenses: 310000, approved: 275000, date: "Aug 16 - 31" },
      { name: "Sep Early", expenses: 280000, approved: 245000, date: "Sep 1 - 15" },
      { name: "Sep Late", expenses: 360000, approved: 320000, date: "Sep 16 - 30" },
      { name: "Oct MTD", expenses: 185000, approved: 165000, date: "Oct 1 - 8" },
    ],
    formatTick: (val) => `₹${(val / 1000).toFixed(0)}k`,
    metrics: [
      { title: "Quarterly Spend", value: "₹13,95,000", change: "+14.1%", positive: true, icon: TrendingUp },
      { title: "Approved Claims", value: "₹12,35,000", change: "+10.5%", positive: true, icon: CheckCircle2 },
      { title: "Pending Claims", value: "₹1,60,000", change: "-4.7%", positive: false, icon: Clock3 },
      { title: "Tax & Compliance", value: "₹1,24,000", change: "+5.3%", positive: true, icon: Receipt },
    ],
  },
  "6M": {
    subTitle: "Monthly company expenditures vs cleared disbursements (Last 6 Months)",
    peakLabel: "Oct • ₹98,000",
    chart: [
      { name: "May", expenses: 62000, approved: 55000, date: "May 2026" },
      { name: "Jun", expenses: 79000, approved: 72000, date: "Jun 2026" },
      { name: "Jul", expenses: 84000, approved: 76000, date: "Jul 2026" },
      { name: "Aug", expenses: 92000, approved: 83000, date: "Aug 2026" },
      { name: "Sep", expenses: 88000, approved: 79000, date: "Sep 2026" },
      { name: "Oct", expenses: 98000, approved: 89000, date: "Oct 2026" },
    ],
    formatTick: (val) => `₹${(val / 1000).toFixed(0)}k`,
    metrics: [
      { title: "Expense Trend", value: "₹8,42,450", change: "+12.4%", positive: true, icon: TrendingUp },
      { title: "Approved Claims", value: "₹6,20,450", change: "+8.1%", positive: true, icon: CheckCircle2 },
      { title: "Pending Approval", value: "₹1,42,000", change: "-3.2%", positive: false, icon: Clock3 },
      { title: "Tax & Compliance", value: "₹79,800", change: "+4.5%", positive: true, icon: Receipt },
    ],
  },
  "1Y": {
    subTitle: "Annual company expenditures vs cleared disbursements (Last 12 Months)",
    peakLabel: "Oct • ₹98,000",
    chart: [
      { name: "Nov", expenses: 58000, approved: 51000, date: "Nov 2025" },
      { name: "Dec", expenses: 72000, approved: 64000, date: "Dec 2025" },
      { name: "Jan", expenses: 42000, approved: 35000, date: "Jan 2026" },
      { name: "Feb", expenses: 54000, approved: 48000, date: "Feb 2026" },
      { name: "Mar", expenses: 49000, approved: 42000, date: "Mar 2026" },
      { name: "Apr", expenses: 68000, approved: 61000, date: "Apr 2026" },
      { name: "May", expenses: 62000, approved: 55000, date: "May 2026" },
      { name: "Jun", expenses: 79000, approved: 72000, date: "Jun 2026" },
      { name: "Jul", expenses: 84000, approved: 76000, date: "Jul 2026" },
      { name: "Aug", expenses: 92000, approved: 83000, date: "Aug 2026" },
      { name: "Sep", expenses: 88000, approved: 79000, date: "Sep 2026" },
      { name: "Oct", expenses: 98000, approved: 89000, date: "Oct 2026" },
    ],
    formatTick: (val) => `₹${(val / 1000).toFixed(0)}k`,
    metrics: [
      { title: "Annual Spend", value: "₹84,60,000", change: "+16.8%", positive: true, icon: TrendingUp },
      { title: "Approved Claims", value: "₹75,50,000", change: "+14.2%", positive: true, icon: CheckCircle2 },
      { title: "Pending Claims", value: "₹9,10,000", change: "-2.6%", positive: false, icon: Clock3 },
      { title: "Tax & Compliance", value: "₹7,20,000", change: "+7.9%", positive: true, icon: Receipt },
    ],
  },
};

// Enhanced high-contrast tooltip highlighting the active position
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const expVal = data.expenses || 0;
    const appVal = data.approved || 0;
    const rate = expVal > 0 ? ((appVal / expVal) * 100).toFixed(0) : 0;

    return (
      <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-3 shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95 duration-150 z-50">
        <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
          <span className="font-bold text-xs text-foreground tracking-tight">
            {data.date || label}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {rate}% Cleared
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2.5 rounded-full bg-zinc-600 dark:bg-zinc-200" />
              Total Expenses:
            </span>
            <span className="font-semibold text-foreground">
              ₹{expVal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2.5 rounded-full bg-[oklch(0.6_0.118_184.704)]" />
              Approved Claims:
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ₹{appVal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function ExpenseTrend() {
  const [period, setPeriod] = React.useState("6M");
  const [activeBarIndex, setActiveBarIndex] = React.useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const config = periodConfigs[period] || periodConfigs["6M"];
  const currentChartData = config.chart;
  const currentMetrics = config.metrics;

  // In dark mode: white/zinc-200. In light mode: sleek charcoal (#475569)
  const expenseBarFill = isDark ? "#ffffff" : "#475569";
  const approvedBarFill = "oklch(0.6 0.118 184.704)";

  return (
    <Card className="shadow-xs border border-border/80 rounded-2xl">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-foreground">
              Expense Metrics
            </CardTitle>
            {config.peakLabel && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="size-3" />
                Peak: {config.peakLabel}
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {config.subTitle}
          </CardDescription>
        </div>

        {/* Prominently Highlighted Period Selector for all screen views */}
        <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-muted/60 p-1 self-start sm:self-auto shadow-2xs">
          {["7D", "30D", "3M", "6M", "1Y"].map((item) => {
            const isSelected = period === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPeriod(item);
                  setActiveBarIndex(null);
                }}
                className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-2 ring-primary/40 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Responsive Bar Chart with Enhanced Position Highlighting */}
        <div className="h-[260px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentChartData}
              margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setActiveBarIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveBarIndex(null)}
              onClick={(state) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setActiveBarIndex(state.activeTooltipIndex);
                }
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/50"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 500 }}
                tickFormatter={config.formatTick}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                  stroke: isDark ? "rgba(56, 189, 248, 0.6)" : "rgba(2, 132, 199, 0.5)",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                  rx: 8,
                }}
              />
              <Bar
                dataKey="expenses"
                name="Total Expenses"
                fill={expenseBarFill}
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              >
                {currentChartData.map((entry, index) => (
                  <Cell
                    key={`exp-${index}`}
                    fill={expenseBarFill}
                    opacity={activeBarIndex === null || activeBarIndex === index ? 1 : 0.65}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="approved"
                name="Approved Claims"
                fill={approvedBarFill}
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              >
                {currentChartData.map((entry, index) => (
                  <Cell
                    key={`app-${index}`}
                    fill={approvedBarFill}
                    opacity={activeBarIndex === null || activeBarIndex === index ? 1 : 0.65}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Bottom Highlight Cards dynamically matching selected period */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-border/60 pt-4">
          {currentMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="flex flex-col gap-1 p-3 rounded-xl bg-muted/30 border border-border/60 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Icon className="size-3.5 text-primary" />
                  <span className="truncate">{m.title}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {m.value}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    m.positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  }`}
                >
                  {m.change} vs prev. period
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}