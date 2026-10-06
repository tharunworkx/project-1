import * as React from "react";
import {
  Search,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  CheckCheck,
  XCircle,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
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
  if (status === "paid") {
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
  const [search, setSearch] = React.useState("");

  const filtered = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-xs">
      {/* Datatable Header matching template */}
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Recent Expense Claims</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Audit and verify submitted reimbursements across all departments
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

      {/* Datatable Table */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Employee</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-12 pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8.5 rounded-full border border-border/60">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {row.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-foreground">{row.name}</span>
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
                <TableCell className="text-xs font-bold text-foreground">
                  {row.amount}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                        <EllipsisVertical className="size-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={`/expenses/${row.id}`} className="flex items-center gap-2">
                          <Eye className="size-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-600 flex items-center gap-2">
                        <CheckCheck className="size-4" />
                        <span>Approve Claim</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2">
                        <XCircle className="size-4" />
                        <span>Reject Claim</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Datatable Pagination Footer matching template */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
          <span>Showing 1 to {filtered.length} of {transactions.length} entries</span>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled>
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="size-7 bg-primary text-primary-foreground font-semibold shadow-xs">
              1
            </Button>
            <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs">
              2
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