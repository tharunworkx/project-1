import * as React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import expenseStore from "../../services/expenseStore";

const defaultTransactions = [
  {
    id: "EXP-1042",
    name: "Arun Kumar",
    email: "arun.kumar@company.com",
    avatarFallback: "AK",
    category: "Travel & Flight",
    date: "05 Oct 2026",
    amount: "₹4,850.00",
    status: "paid",
    paymentMethod: "Corporate Card",
  },
  {
    id: "EXP-1041",
    name: "Priya Sharma",
    email: "priya.s@company.com",
    avatarFallback: "PS",
    category: "Food & Dining",
    date: "04 Oct 2026",
    amount: "₹1,240.00",
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "EXP-1040",
    name: "Rahul Sundaram",
    email: "rahul.s@company.com",
    avatarFallback: "RS",
    category: "Fuel & Transit",
    date: "04 Oct 2026",
    amount: "₹2,100.00",
    status: "paid",
    paymentMethod: "Corporate Card",
  },
  {
    id: "EXP-1039",
    name: "Karthik Mohan",
    email: "karthik.m@company.com",
    avatarFallback: "KM",
    category: "Office Equipment",
    date: "03 Oct 2026",
    amount: "₹3,450.00",
    status: "processing",
    paymentMethod: "UPI Reimbursement",
  },
  {
    id: "EXP-1038",
    name: "Divya Ramesh",
    email: "divya.r@company.com",
    avatarFallback: "DR",
    category: "Accommodation",
    date: "02 Oct 2026",
    amount: "₹7,800.00",
    status: "paid",
    paymentMethod: "Corporate Card",
  },
];

function StatusBadge({ status }) {
  if (status === "paid" || status === "approved") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium capitalize">
        Approved
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-medium capitalize">
        Pending
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium capitalize">
      In Review
    </Badge>
  );
}

export default function RecentExpenses() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  const liveTransactions = React.useMemo(() => {
    try {
      const stored = expenseStore.getExpenses();
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.slice(0, 6).map((item) => ({
          id: item.id,
          name: typeof item.claimant === "object" ? item.claimant?.name : (item.claimant || "Employee"),
          email: item.email || "employee@company.com",
          avatarFallback: item.avatarFallback || "EM",
          category: item.category || "General",
          date: item.date || "Today",
          amount: item.amount || "₹0.00",
          status: item.status?.toLowerCase() === "approved" ? "paid" : (item.status?.toLowerCase() || "pending"),
          paymentMethod: item.paymentMode || "Corporate Card",
        }));
      }
    } catch (e) {
      console.warn("Could not read recent expenses:", e);
    }
    return defaultTransactions;
  }, []);

  const filtered = liveTransactions.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-xs overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Expense Claims</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Click any employee claim row to inspect details and audit records
          </CardDescription>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter claims..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs">
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Mobile View: Clean, Responsive Cards with no horizontal scrolling */}
        <div className="md:hidden divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-muted-foreground">
              No recent claims found.
            </div>
          ) : (
            filtered.map((row) => (
              <div
                key={row.id}
                onClick={() => navigate(`/expenses/${row.id}`)}
                className="p-3.5 flex flex-col gap-2 cursor-pointer hover:bg-muted/40 active:bg-muted/60 transition-colors"
                title="Click to view expense details"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar className="size-8.5 rounded-full border border-border/60 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {row.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left leading-tight min-w-0">
                      <span className="text-xs font-semibold text-foreground truncate">{row.name}</span>
                      <span className="text-[11px] text-muted-foreground truncate">{row.email}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-foreground font-mono">{row.amount}</div>
                    <StatusBadge status={row.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span className="truncate">{row.category}</span>
                  <span className="shrink-0">{row.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Clean Clickable Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Employee</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => navigate(`/expenses/${row.id}`)}
                  className="cursor-pointer hover:bg-muted/60 transition-colors group"
                  title="Click row to view expense details"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8.5 rounded-full border border-border/60">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {row.avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{row.name}</span>
                        <span className="text-[11px] text-muted-foreground">{row.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.date}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {row.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-right text-xs font-bold text-foreground font-mono">
                    {row.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Datatable Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
          <span>Showing 1 to {filtered.length} of {liveTransactions.length} entries</span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled>
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="size-7 bg-primary text-primary-foreground font-semibold shadow-xs">
              1
            </Button>
            <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs">
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}