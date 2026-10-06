import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Download,
  Eye,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomSelect } from "@/components/ui/select";

const mockExpenses = [
  {
    id: 'EXP-2026-081',
    merchant: 'Delta Airlines',
    title: 'Flight to Q1 Tech Summit',
    category: 'Travel & Flight',
    claimant: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    avatarFallback: 'SJ',
    department: 'Engineering',
    paymentMode: 'Corporate Card',
    amount: '₹53,400.00',
    date: '05 Oct 2026',
    status: 'Approved',
  },
  {
    id: 'EXP-2026-080',
    merchant: 'Amazon Web Services',
    title: 'Production Cluster Compute',
    category: 'Software & Cloud',
    claimant: 'David Kim',
    email: 'david.k@company.com',
    avatarFallback: 'DK',
    department: 'DevOps',
    paymentMode: 'Corporate Card',
    amount: '₹1,04,200.00',
    date: '04 Oct 2026',
    status: 'Pending',
  },
  {
    id: 'EXP-2026-079',
    merchant: 'Hilton Downtown Austin',
    title: '3 Nights Lodging - Client Meeting',
    category: 'Accommodation',
    claimant: 'Michael Brown',
    email: 'michael.b@company.com',
    avatarFallback: 'MB',
    department: 'Sales',
    paymentMode: 'Corporate Card',
    amount: '₹34,500.00',
    date: '04 Oct 2026',
    status: 'Approved',
  },
  {
    id: 'EXP-2026-078',
    merchant: 'The Capital Grille',
    title: 'Executive Team Dinner',
    category: 'Food & Dining',
    claimant: 'Emily Stone',
    email: 'emily.s@company.com',
    avatarFallback: 'ES',
    department: 'Executive',
    paymentMode: 'Bank Transfer',
    amount: '₹26,800.00',
    date: '03 Oct 2026',
    status: 'Rejected',
  },
  {
    id: 'EXP-2026-077',
    merchant: 'Apple Store NYC',
    title: 'M3 USB-C Power Adapter & Cables',
    category: 'Office Equipment',
    claimant: 'Alex Morgan',
    email: 'alex.m@company.com',
    avatarFallback: 'AM',
    department: 'Product',
    paymentMode: 'UPI Reimbursement',
    amount: '₹10,750.00',
    date: '02 Oct 2026',
    status: 'Approved',
  },
  {
    id: 'EXP-2026-076',
    merchant: 'Uber Technologies',
    title: 'Airport Transit to Conference',
    category: 'Fuel & Transit',
    claimant: 'Marcus Vance',
    email: 'marcus.v@company.com',
    avatarFallback: 'MV',
    department: 'Marketing',
    paymentMode: 'Corporate Card',
    amount: '₹4,500.00',
    date: '01 Oct 2026',
    status: 'Approved',
  },
];

function StatusBadge({ status }) {
  const s = status.toLowerCase();
  if (s === 'approved' || s === 'reimbursed') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium capitalize">
        Approved
      </Badge>
    );
  }
  if (s === 'pending') {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-medium capitalize">
        Pending
      </Badge>
    );
  }
  if (s === 'rejected') {
    return (
      <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 font-medium capitalize">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium capitalize">
      {status}
    </Badge>
  );
}

export const Expenses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = mockExpenses.filter((item) => {
    const matchesSearch =
      item.claimant.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.merchant.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Expense Records
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Comprehensive audit log of all filed corporate claims and disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button asChild size="sm" className="gap-2 text-xs">
            <Link to="/expenses/new">
              <Plus className="size-3.5" />
              <span>Create Expense</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Datatable Card matching Image 2 */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              All Expense Claims
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Filter by employee, category or approval status
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter claims..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs"
              />
            </div>
            <CustomSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              triggerClassName="h-8 rounded-full border border-border/80 bg-muted/50 px-3 text-xs w-[125px]"
              options={[
                { value: "ALL", label: "All Status" },
                { value: "APPROVED", label: "Approved" },
                { value: "PENDING", label: "Pending" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">EMPLOYEE</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>PAYMENT MODE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <p className="font-semibold text-foreground">No matching expenses found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Try clearing filters or search term</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8.5 rounded-full border border-border/60">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {row.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left leading-tight">
                          <span className="text-xs font-semibold text-foreground">{row.claimant}</span>
                          <span className="text-[11px] text-muted-foreground">{row.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      <div>
                        <div>{row.category}</div>
                        <span className="text-[10px] text-muted-foreground">{row.merchant}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.date}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.paymentMode}
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
                          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground">
                            <EllipsisVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/expenses/${row.id}`)}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Eye className="size-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>Showing 1 to {filtered.length} of {mockExpenses.length} entries</span>
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
    </div>
  );
};

export default Expenses;
