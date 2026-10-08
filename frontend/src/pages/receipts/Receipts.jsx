import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import expenseService from '../../services/expenseService';
import { supabase } from '../../services/supabaseStorage';
import {
  Receipt,
  Search,
  Download,
  Eye,
  ZoomIn,
  ShieldCheck,
  Plus,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Clock3,
  Bookmark,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from '../../components/common/Modal';
import expenseStore from '../../services/expenseStore';
import { CustomSelect } from "@/components/ui/select";

function StatusBadge({ status }) {
  const s = status ? status.toLowerCase() : '';
  if (s === 'approved' || s === 'reimbursed') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium capitalize text-xs">
        Approved
      </Badge>
    );
  }
  if (s === 'pending') {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-medium capitalize text-xs">
        Pending
      </Badge>
    );
  }
  if (s === 'draft') {
    return (
      <Badge className="bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium capitalize text-xs">
        Draft
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium capitalize text-xs">
      {status}
    </Badge>
  );
}

export default function Receipts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [allExpenses, setAllExpenses] = useState(() => expenseStore.getExpenses());

  useEffect(() => {
    const fetchLiveReceipts = async () => {
      try {
        let dbExpenses = [];
        try {
          dbExpenses = await expenseService.getExpenses();
        } catch (apiErr) {
          console.warn('Backend API getExpenses offline, querying Supabase for receipts:', apiErr);
        }

        if (!Array.isArray(dbExpenses) || dbExpenses.length === 0) {
          const { data: supaExpenses, error: supaErr } = await supabase
            .from('expenses')
            .select('*')
            .not('receipt_url', 'is', null)
            .order('created_at', { ascending: false });

          if (!supaErr && Array.isArray(supaExpenses)) {
            dbExpenses = supaExpenses.map((e) => ({
              id: e.id,
              title: e.title,
              description: e.description,
              amount: e.amount,
              category: e.category,
              department: e.department,
              submittedBy: e.submitted_by,
              status: e.status,
              createdAt: e.created_at,
              receiptUrl: e.receipt_url,
            }));
          }
        }

        if (Array.isArray(dbExpenses) && dbExpenses.length > 0) {
          const liveItems = dbExpenses
            .filter((e) => !!(e.receiptUrl))
            .map((e) => {
              const claimantName = e.submittedBy?.includes('@')
                ? e.submittedBy.split('@')[0]
                : (e.submittedBy || 'Employee');
              const initials = claimantName.slice(0, 2).toUpperCase();
              const formattedAmount = e.amount
                ? `₹${Number(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                : '₹0.00';
              const formattedDate = e.createdAt
                ? new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Today';

              return {
                id: `EXP-${e.id}`,
                merchant: e.title || 'Corporate Vendor',
                title: e.description || e.title || 'Expense Claim',
                category: e.category || 'General',
                claimant: claimantName,
                email: e.submittedBy || 'employee@company.com',
                avatarFallback: initials,
                department: e.department || 'General',
                amount: formattedAmount,
                date: formattedDate,
                status: e.status ? (e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase()) : 'Pending',
                receiptUrl: e.receiptUrl,
                proofImage: e.receiptUrl,
                receiptName: `receipt_EXP-${e.id}.jpg`,
                receiptAttached: true,
              };
            });

          if (liveItems.length > 0) {
            setAllExpenses((prev) => {
              const liveIds = new Set(liveItems.map((i) => i.id));
              const remaining = prev.filter((i) => !liveIds.has(i.id));
              return [...liveItems, ...remaining];
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch receipts from backend/Supabase:', err);
      }
    };

    fetchLiveReceipts();
  }, []);

  // Filter to items that have an uploaded receipt or proof
  const receiptItems = allExpenses.filter(
    (item) => !!(item.proofImage || item.receiptUrl || item.receiptAttached)
  );

  const pendingCount = receiptItems.filter((i) => i.status?.toLowerCase() === 'pending').length;
  const approvedCount = receiptItems.filter((i) => i.status?.toLowerCase() === 'approved').length;
  const draftCount = receiptItems.filter((i) => i.status?.toLowerCase() === 'draft').length;

  const filtered = receiptItems.filter((item) => {
    const claimant = (item.claimant || '').toLowerCase();
    const merchant = (item.merchant || '').toLowerCase();
    const title = (item.title || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const receiptName = (item.receiptName || '').toLowerCase();
    const s = search.toLowerCase();

    const matchesSearch =
      claimant.includes(s) ||
      merchant.includes(s) ||
      title.includes(s) ||
      category.includes(s) ||
      receiptName.includes(s);

    const matchesStatus =
      statusFilter === 'ALL' || (item.status && item.status.toUpperCase() === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const handleDownload = (e, item) => {
    e.stopPropagation();
    const imgUrl = item.proofImage || item.receiptUrl;
    if (!imgUrl) return;

    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = item.receiptName || `receipt_${item.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Receipts & Proof Documents
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              {receiptItems.length} Uploaded Proofs
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Central repository of all invoices, receipts, and proofs uploaded by employees for manager audit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Download className="size-3.5" />
            <span>Export Archive</span>
          </Button>
          <Button asChild size="sm" className="gap-2 text-xs">
            <Link to="/expenses/new">
              <Plus className="size-3.5" />
              <span>Upload New Receipt</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Proofs</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">{receiptItems.length}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across all departments</p>
            </div>
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Receipt className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting manager sign-off</p>
            </div>
            <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock3 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Approved Proofs</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{approvedCount}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Audit verified & passed</p>
            </div>
            <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Draft Proofs</p>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-0.5">{draftCount}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Saved by employee</p>
            </div>
            <div className="size-10 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
              <Bookmark className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search, Status Filter, and View Toggle */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              All Uploaded Receipts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Inspect uploaded document proofs, verify merchant details, and download records
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <div className="relative w-44 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search receipts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="w-36">
              <CustomSelect
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val)}
                triggerClassName="h-8 rounded-full border border-border/80 bg-muted/50 px-3 text-xs text-foreground outline-none shadow-xs"
                options={[
                  { value: 'ALL', label: 'All Status' },
                  { value: 'PENDING', label: 'Pending Review' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'DRAFT', label: 'Drafts' },
                  { value: 'REJECTED', label: 'Rejected' },
                ]}
              />
            </div>

            {/* Grid / Table Toggle */}
            <div className="flex items-center rounded-lg border border-border/80 p-0.5 bg-muted/40">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid Gallery View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Table List View"
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
              <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                <Receipt className="size-7" />
              </div>
              <p className="font-semibold text-foreground text-base">No receipts found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                No uploaded receipts match your current filters. Upload a receipt or clear your search term.
              </p>
              <Button asChild size="sm" className="mt-4 gap-1.5 text-xs">
                <Link to="/expenses/new">
                  <Plus className="size-3.5" />
                  <span>Upload Receipt</span>
                </Link>
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((item) => {
                const proofImg = item.proofImage || item.receiptUrl;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {/* Image Preview Container */}
                    <div
                      className="relative h-48 w-full bg-muted/40 cursor-pointer overflow-hidden border-b border-border/60"
                      onClick={() => setSelectedReceipt(item)}
                    >
                      {proofImg ? (
                        <img
                          src={proofImg}
                          alt={`Receipt for ${item.merchant}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <FileText className="size-12" />
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30 opacity-70 group-hover:opacity-85 transition-opacity" />

                      {/* Status Badge top right */}
                      <div className="absolute top-2.5 right-2.5">
                        <StatusBadge status={item.status} />
                      </div>

                      {/* Proof Tag top left */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
                          <ShieldCheck className="size-3 text-emerald-400" />
                          Proof
                        </span>
                      </div>

                      {/* Amount & Filename bottom overlay */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                        <div>
                          <div className="text-base font-bold drop-shadow-sm">
                            {item.amount}
                          </div>
                          <div className="text-[11px] text-white/80 truncate max-w-[160px] font-medium drop-shadow-xs">
                            {item.receiptName || 'receipt_proof.jpg'}
                          </div>
                        </div>

                        {/* Zoom button */}
                        <div className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-xs transition-colors">
                          <ZoomIn className="size-4" />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between bg-card">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground mt-0.5 truncate">
                          {item.merchant}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {item.title}
                        </p>
                      </div>

                      {/* Claimant and footer buttons */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Avatar className="size-5.5 rounded-full border border-border/80">
                            {item.avatar && <AvatarImage src={item.avatar} alt={item.claimant} />}
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                              {item.avatarFallback || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[11px] font-medium text-foreground truncate max-w-[95px]">
                            {item.claimant}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {proofImg && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 text-muted-foreground hover:text-foreground"
                              onClick={(e) => handleDownload(e, item)}
                              title="Download Receipt Image"
                            >
                              <Download className="size-3" />
                            </Button>
                          )}
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-6 text-muted-foreground hover:text-foreground"
                            title="Open Expense Claim"
                          >
                            <Link to={`/expenses/${item.id}`}>
                              <ExternalLink className="size-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="rounded-lg border border-border/80 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16 pl-4">PROOF</TableHead>
                    <TableHead>CLAIMANT</TableHead>
                    <TableHead>MERCHANT & PURPOSE</TableHead>
                    <TableHead>CATEGORY</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead className="w-12 pr-4 text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => {
                    const proofImg = row.proofImage || row.receiptUrl;

                    return (
                      <TableRow
                        key={row.id}
                        onClick={() => navigate(`/expenses/${row.id}`)}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        title="Click row to view full claim details"
                      >
                        <TableCell className="pl-4">
                          <div
                            className="size-10 rounded-md overflow-hidden border border-border bg-muted cursor-pointer shrink-0 relative group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(row);
                            }}
                            title="Click to zoom proof"
                          >
                            {proofImg ? (
                              <img
                                src={proofImg}
                                alt="Proof"
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-muted-foreground">
                                <FileText className="size-4" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <ZoomIn className="size-3.5" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-7 rounded-full border border-border/60">
                              {row.avatar && <AvatarImage src={row.avatar} alt={row.claimant} />}
                              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                                {row.avatarFallback || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col text-left leading-tight">
                              <span className="text-xs font-semibold text-foreground">{row.claimant}</span>
                              <span className="text-[10px] text-muted-foreground">{row.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          <div>
                            <div className="font-semibold">{row.merchant}</div>
                            <span className="text-[11px] text-muted-foreground">{row.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.category}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.date}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-xs font-bold text-foreground">
                          {row.amount}
                        </TableCell>
                        <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                              onClick={() => setSelectedReceipt(row)}
                              title="Inspect Receipt Proof"
                            >
                              <ZoomIn className="size-3.5" />
                            </Button>
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                              title="View Full Claim"
                            >
                              <Link to={`/expenses/${row.id}`}>
                                <ExternalLink className="size-3.5" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal for Full Proof Inspection */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title={`Proof Document — ${selectedReceipt.merchant} (${selectedReceipt.id})`}
          maxWidth="850px"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-muted-foreground">
                Employee: <strong>{selectedReceipt.claimant}</strong> • Total: <strong>{selectedReceipt.amount}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={(e) => handleDownload(e, selectedReceipt)}
                >
                  Download Receipt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => navigate(`/expenses/${selectedReceipt.id}`)}
                >
                  View Claim
                </Button>
                <Button variant="primary" size="sm" onClick={() => setSelectedReceipt(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b">
              <span><strong>File:</strong> {selectedReceipt.receiptName || 'receipt_proof.jpg'}</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck size={14} /> Attached as proof for manager sign-off
              </span>
            </div>
            <div className="p-2 bg-muted/40 border rounded-lg flex items-center justify-center">
              <img
                src={selectedReceipt.proofImage || selectedReceipt.receiptUrl}
                alt={`Proof for ${selectedReceipt.merchant}`}
                className="max-h-[580px] w-auto max-w-full rounded object-contain shadow-md"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

