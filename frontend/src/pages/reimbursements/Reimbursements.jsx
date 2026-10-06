import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Clock,
  Building,
  Search,
  Download,
  Check,
  EllipsisVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wallet,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

const initialReimbursements = [
  {
    id: 'RMB-2026-042',
    claimId: 'EXP-2026-079',
    employee: 'Arun Kumar',
    email: 'arun.kumar@company.com',
    avatarFallback: 'AK',
    department: 'Sales',
    category: 'Travel & Flight',
    method: 'Corporate Card',
    accountLast4: '4821',
    amount: '₹4,850.00',
    numericAmount: 4850,
    status: 'Approved',
    date: '05 Oct 2026',
  },
  {
    id: 'RMB-2026-041',
    claimId: 'EXP-2026-076',
    employee: 'Priya Sharma',
    email: 'priya.s@company.com',
    avatarFallback: 'PS',
    department: 'Marketing',
    category: 'Food & Dining',
    method: 'Bank Transfer',
    accountLast4: '9012',
    amount: '₹1,240.00',
    numericAmount: 1240,
    status: 'Pending',
    date: '04 Oct 2026',
  },
  {
    id: 'RMB-2026-040',
    claimId: 'EXP-2026-081',
    employee: 'Rahul Sundaram',
    email: 'rahul.s@company.com',
    avatarFallback: 'RS',
    department: 'Engineering',
    category: 'Fuel & Transit',
    method: 'Corporate Card',
    accountLast4: '1149',
    amount: '₹2,100.00',
    numericAmount: 2100,
    status: 'Approved',
    date: '04 Oct 2026',
  },
  {
    id: 'RMB-2026-039',
    claimId: 'EXP-2026-077',
    employee: 'Karthik Mohan',
    email: 'karthik.m@company.com',
    avatarFallback: 'KM',
    department: 'Operations',
    category: 'Office Equipment',
    method: 'UPI Reimbursement',
    accountLast4: '7723',
    amount: '₹3,450.00',
    numericAmount: 3450,
    status: 'In Review',
    date: '03 Oct 2026',
  },
  {
    id: 'RMB-2026-038',
    claimId: 'EXP-2026-075',
    employee: 'Divya Ramesh',
    email: 'divya.r@company.com',
    avatarFallback: 'DR',
    department: 'Design',
    category: 'Accommodation',
    method: 'Corporate Card',
    accountLast4: '3321',
    amount: '₹7,800.00',
    numericAmount: 7800,
    status: 'Approved',
    date: '02 Oct 2026',
  },
  {
    id: 'RMB-2026-037',
    claimId: 'EXP-2026-071',
    employee: 'Michael Brown',
    email: 'michael.b@company.com',
    avatarFallback: 'MB',
    department: 'Sales',
    category: 'Client Entertainment',
    method: 'Direct Deposit (ACH)',
    accountLast4: '4821',
    amount: '₹3,250.00',
    numericAmount: 3250,
    status: 'Pending',
    date: '01 Oct 2026',
  },
  {
    id: 'RMB-2026-036',
    claimId: 'EXP-2026-068',
    employee: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    avatarFallback: 'SJ',
    department: 'Engineering',
    category: 'Software & Tools',
    method: 'Bank Transfer',
    accountLast4: '9941',
    amount: '₹14,200.00',
    numericAmount: 14200,
    status: 'Disbursed',
    date: '30 Sep 2026',
  },
];

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  if (s === 'approved' || s === 'disbursed') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium capitalize">
        {status}
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
  return (
    <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium capitalize">
      {status || 'In Review'}
    </Badge>
  );
}

export const Reimbursements = () => {
  const [list, setList] = useState(initialReimbursements);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const readyItems = list.filter((item) => item.status === 'Approved' || item.status === 'Pending');
  const readyTotal = readyItems.reduce((acc, item) => acc + item.numericAmount, 0);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((i) => i.id));
    }
  };

  const handleDisburseSelected = () => {
    if (selectedIds.length === 0) return;
    setProcessing(true);
    setTimeout(() => {
      setList((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id) ? { ...item, status: 'Disbursed' } : item
        )
      );
      setProcessing(false);
      setSuccessMsg(`Successfully disbursed ${selectedIds.length} reimbursements via settlement batch`);
      setSelectedIds([]);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 800);
  };

  const handleDisburseSingle = (id) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Disbursed' } : item))
    );
    setSuccessMsg(`Disbursement completed for claim ${id}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filtered = list.filter(
    (item) =>
      item.employee.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.method.toLowerCase().includes(search.toLowerCase()) ||
      item.claimId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ready for Payout
            </CardDescription>
            <Wallet className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{readyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {readyItems.length} claims cleared for direct settlement
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Transit (ACH Rails)
            </CardDescription>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹14,200.00
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated settlement: 1–2 business days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed YTD
            </CardDescription>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹1,92,840.00
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              100% on-time disbursement compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Datatable matching Image 2 */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Expense Claims
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Audit and verify submitted reimbursements across all departments
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
            {selectedIds.length > 0 ? (
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xs"
                onClick={handleDisburseSelected}
                disabled={processing}
              >
                <Send className="size-3.5" />
                <span>Disburse ({selectedIds.length})</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs">
                <Download className="size-3.5" />
                <span>Export</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 pl-6">
                  <Checkbox
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>EMPLOYEE</TableHead>
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
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No reimbursement claims found matching your filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <TableRow key={row.id} className={isChecked ? "bg-muted/40" : ""}>
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelect(row.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8.5 rounded-full border border-border/60">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {row.avatarFallback}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-foreground">{row.employee}</span>
                            <span className="text-[11px] text-muted-foreground">{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {row.category}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.date}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.method}
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
                            {row.status !== 'Disbursed' && (
                              <DropdownMenuItem
                                className="cursor-pointer text-emerald-600 focus:text-emerald-600 flex items-center gap-2"
                                onClick={() => handleDisburseSingle(row.id)}
                              >
                                <Send className="size-4" />
                                <span>Disburse Payout</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <Eye className="size-4" />
                              <span>View Claim Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <Download className="size-4" />
                              <span>Download Receipt</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Datatable Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing 1 to {filtered.length} of {list.length} claims
            </span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled>
                <ChevronLeft className="size-3.5" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button variant="outline" size="icon" className="size-7 bg-card hover:bg-muted border-border/80 shadow-2xs" disabled={filtered.length <= 10}>
                <ChevronRight className="size-3.5" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reimbursements;
