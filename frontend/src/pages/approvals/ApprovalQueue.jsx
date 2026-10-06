import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  X,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
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
import { Checkbox } from "@/components/ui/checkbox";

const pendingApprovalsData = [
  {
    id: 'EXP-2026-085',
    claimant: 'Lisa Ray',
    email: 'lisa.ray@company.com',
    avatarFallback: 'LR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    department: 'Sales',
    merchant: 'United Airlines',
    title: 'Roundtrip Flights to Enterprise Workshop',
    category: 'Travel & Flight',
    paymentMode: 'Corporate Card',
    amount: '₹58,400.00',
    date: '05 Oct 2026',
    status: 'pending',
    policyFlag: null,
  },
  {
    id: 'EXP-2026-084',
    claimant: 'James Wilson',
    email: 'james.w@company.com',
    avatarFallback: 'JW',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    department: 'Marketing',
    merchant: 'Metropolitan Bistro',
    title: 'Q1 Partner Dinner',
    category: 'Food & Dining',
    paymentMode: 'Bank Transfer',
    amount: '₹12,250.00',
    date: '04 Oct 2026',
    status: 'pending',
    policyFlag: 'Meal limit exceeded',
  },
  {
    id: 'EXP-2026-083',
    claimant: 'Elena Rostova',
    email: 'elena.r@company.com',
    avatarFallback: 'ER',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    department: 'Engineering',
    merchant: 'JetBrains Inc',
    title: 'All Products Pack Licenses',
    category: 'Software & Tools',
    paymentMode: 'UPI Reimbursement',
    amount: '₹94,500.00',
    date: '04 Oct 2026',
    status: 'processing',
    policyFlag: 'Requires VP Sign-off',
  },
  {
    id: 'EXP-2026-082',
    claimant: 'Carlos Gomez',
    email: 'carlos.g@company.com',
    avatarFallback: 'CG',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    department: 'Operations',
    merchant: 'Staples Store',
    title: 'Standing Desk Accessories',
    category: 'Office Equipment',
    paymentMode: 'Corporate Card',
    amount: '₹17,800.00',
    date: '03 Oct 2026',
    status: 'pending',
    policyFlag: null,
  },
  {
    id: 'EXP-2026-081',
    claimant: 'Divya Ramesh',
    email: 'divya.r@company.com',
    avatarFallback: 'DR',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
    department: 'Design',
    merchant: 'Hilton Downtown',
    title: 'Client Onsite Accommodation',
    category: 'Accommodation',
    paymentMode: 'Corporate Card',
    amount: '₹42,000.00',
    date: '02 Oct 2026',
    status: 'pending',
    policyFlag: null,
  },
];

function StatusBadge({ status }) {
  if (status === 'approved' || status === 'paid') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium capitalize">
        Approved
      </Badge>
    );
  }
  if (status === 'pending') {
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

export const ApprovalQueue = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(pendingApprovalsData);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [notification, setNotification] = useState('');

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

  const handleApprove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setNotification(`Claim ${id} approved successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleReject = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setNotification(`Claim ${id} rejected`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleBatchApprove = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setNotification(`Batch approved ${selectedIds.length} expense claims`);
    setSelectedIds([]);
    setTimeout(() => setNotification(''), 4000);
  };

  const filtered = items.filter(
    (item) =>
      item.claimant.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.merchant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Datatable Card matching Image 2 */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Manager Approval Queue
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
              <Button size="sm" className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xs" onClick={handleBatchApprove}>
                <Check className="size-3.5" />
                <span>Approve ({selectedIds.length})</span>
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
                    <CheckCircle2 className="size-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-foreground">Queue is completely cleared!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">No pending claims requiring review</p>
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
                            <AvatarImage src={row.avatar} alt={row.claimant} />
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
                          {row.policyFlag && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                              <AlertTriangle className="size-2.5" />
                              {row.policyFlag}
                            </span>
                          )}
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
                            <DropdownMenuItem
                              onClick={() => handleApprove(row.id)}
                              className="cursor-pointer text-emerald-600 focus:text-emerald-600 flex items-center gap-2"
                            >
                              <Check className="size-4" />
                              <span>Approve Claim</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(row.id)}
                              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                            >
                              <X className="size-4" />
                              <span>Reject Claim</span>
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

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>Showing 1 to {filtered.length} of {items.length} entries</span>
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

export default ApprovalQueue;
