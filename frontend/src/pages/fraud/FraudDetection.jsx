import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Copy,
  Receipt,
  TrendingUp,
  FileCheck2,
  XCircle,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowUpRight,
  Sparkles,
  Ban,
  HelpCircle,
  Layers,
  Calendar,
  DollarSign,
  User,
  Building,
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
import { AnimatedSearchBar } from "@/components/ui/AnimatedSearchBar";

const mockFraudFlags = [
  {
    id: 'FRD-1092',
    type: 'DUPLICATE_RECEIPT',
    title: 'Perceptual Image Hash Match (99.4%)',
    description: 'Receipt image identical to EXP-2026-042 submitted 3 days ago by another employee.',
    claimant: 'Kevin Vance',
    department: 'Sales',
    avatarFallback: 'KV',
    expenseId: 'EXP-2026-084',
    merchant: 'The Oberoi Grand Hotel',
    amount: '₹34,500.00',
    date: '06 Oct 2026',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    indicators: [
      'Identical perceptual image fingerprint SHA256 (d41d8cd...)',
      'Original claim EXP-2026-042 was already reimbursed on 03 Oct',
      'Different employee name printed on invoice header vs submitter',
    ],
    receiptA: {
      id: 'EXP-2026-084 (Current Claim)',
      submitter: 'Kevin Vance',
      date: '06 Oct 2026',
      amount: '₹34,500.00',
      merchant: 'The Oberoi Grand Hotel',
      invoiceNo: 'OB-99214',
    },
    receiptB: {
      id: 'EXP-2026-042 (Original Settled Claim)',
      submitter: 'Michael Chang',
      date: '03 Oct 2026',
      amount: '₹34,500.00',
      merchant: 'The Oberoi Grand Hotel',
      invoiceNo: 'OB-99214',
    },
  },
  {
    id: 'FRD-1091',
    type: 'SPLIT_TRANSACTION',
    title: 'Threshold Avoidance / Structuring Pattern',
    description: '3 claims of ₹24,800 submitted within 4 hours to bypass ₹25,000 manager signoff threshold.',
    claimant: 'Rachel Adams',
    department: 'Marketing',
    avatarFallback: 'RA',
    expenseId: 'EXP-2026-082, 083, 085',
    merchant: 'Digital Media Ads Agency',
    amount: '₹74,400.00 Total',
    date: '05 Oct 2026',
    riskScore: 89,
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    indicators: [
      'Transactions split: ₹24,800, ₹24,800, and ₹24,800 within 240 mins',
      'Approval tier limit for single-signature signoff is ₹25,000',
      'Merchant invoice indicates single cumulative campaign PO',
    ],
  },
  {
    id: 'FRD-1090',
    type: 'UNUSUAL_SPENDING',
    title: 'Weekend Nightclub & Alcohol Spending Anomaly',
    description: 'Transaction flagged on Sunday 01:45 AM categorized as "Client Business Lunch".',
    claimant: 'Marcus Brody',
    department: 'Product Operations',
    avatarFallback: 'MB',
    expenseId: 'EXP-2026-077',
    merchant: 'Skyline Rooftop Lounge & Bar',
    amount: '₹18,900.00',
    date: '04 Oct 2026 (01:45 AM)',
    riskScore: 78,
    riskLevel: 'HIGH',
    status: 'INVESTIGATING',
    indicators: [
      'Merchant category code (MCC 5813: Drinking Places / Nightclub)',
      'Timestamp: Sunday 01:45 AM (Non-standard business window)',
      'Itemized OCR reveals alcoholic beverages representing 85% of total',
    ],
  },
  {
    id: 'FRD-1089',
    type: 'DUPLICATE_EXPENSE',
    title: 'Identical Card & Cash Double Submission',
    description: 'Automated corporate card feed matched manual cash reimbursement submission.',
    claimant: 'David Kim',
    department: 'Engineering',
    avatarFallback: 'DK',
    expenseId: 'EXP-2026-073',
    merchant: 'Uber Technologies Inc',
    amount: '₹840.00',
    date: '04 Oct 2026',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    status: 'RESOLVED',
    indicators: [
      'Same amount (₹840.00) and same merchant (Uber) on same ride timestamp',
      'Corporate card feed auto-reconciled; manual claim also filed',
      'Resolved: Employee withdrew manual claim',
    ],
  },
  {
    id: 'FRD-1088',
    type: 'UNUSUAL_SPENDING',
    title: 'Historical Airfare Benchmark Deviation (+140%)',
    description: 'Flight ticket rate exceeds normal historical route average for Mumbai-Bangalore.',
    claimant: 'Sarah Jenkins',
    department: 'Sales',
    avatarFallback: 'SJ',
    expenseId: 'EXP-2026-068',
    merchant: 'Vistara Airlines (Business Class)',
    amount: '₹58,400.00',
    date: '02 Oct 2026',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    status: 'RESOLVED',
    indicators: [
      'Median benchmark price for BOM-BLR: ₹8,500 - ₹12,000',
      'Claim submitted is for Business Class without approved VP exception',
      'Resolved: Approved under urgent emergency client escalation policy',
    ],
  },
  {
    id: 'FRD-1087',
    type: 'SUSPICIOUS_TRANSACTION',
    title: 'Ghost / Unregistered Merchant Warning',
    description: 'Vendor GSTIN / Tax ID does not match national registry records.',
    claimant: 'Amit Sharma',
    department: 'Procurement',
    avatarFallback: 'AS',
    expenseId: 'EXP-2026-061',
    merchant: 'Apex Logistics Global Ltd',
    amount: '₹42,000.00',
    date: '01 Oct 2026',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    indicators: [
      'GSTIN: 27AAAAA0000A1Z5 failed official checksum verification',
      'No active commercial registration found on Ministry of Corporate Affairs',
      'Vendor address resolves to residential apartment complex',
    ],
  },
];

export default function FraudDetection() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectItem, setInspectItem] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const filteredFlags = mockFraudFlags.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'ALL') return matchesSearch;
    if (activeTab === 'DUPLICATE_RECEIPT') return matchesSearch && item.type === 'DUPLICATE_RECEIPT';
    if (activeTab === 'DUPLICATE_EXPENSE') return matchesSearch && item.type === 'DUPLICATE_EXPENSE';
    if (activeTab === 'UNUSUAL_SPENDING') return matchesSearch && item.type === 'UNUSUAL_SPENDING';
    if (activeTab === 'SUSPICIOUS') return matchesSearch && (item.type === 'SPLIT_TRANSACTION' || item.type === 'SUSPICIOUS_TRANSACTION');
    return matchesSearch;
  });

  const handleResolveAction = (flagId, actionName) => {
    setActionSuccessMessage(`Flag ${flagId} successfully updated with action: ${actionName}`);
    setTimeout(() => setActionSuccessMessage(''), 3500);
    setInspectItem(null);
  };

  const getRiskBadge = (level, score) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-bold">
            <ShieldAlert className="size-3" />
            CRITICAL ({score})
          </Badge>
        );
      case 'HIGH':
        return (
          <Badge className="bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 gap-1 font-bold">
            <AlertTriangle className="size-3" />
            HIGH ({score})
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-medium">
            <AlertTriangle className="size-3" />
            MEDIUM ({score})
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            LOW ({score})
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Fraud & Duplicate Detection Engine
            </h1>

          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time heuristic & perceptual AI analysis detecting duplicated receipts, split transactions, and spending anomalies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs py-1 px-3 gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Scanner Active: 1,420 Checks / hr
          </Badge>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Anomalies Flagged</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">4 Claims</h3>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">2 Critical risk requiring signoff</p>
            </div>
            <div className="size-11 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Loss Prevented This Quarter</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹3,48,200</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across 18 duplicate submissions</p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Duplicate Receipts Caught</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">14 Receipts</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">OCR & image fingerprint match</p>
            </div>
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Receipt className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Precision Accuracy</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">99.1%</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">&lt;0.9% False positive rate</p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border">
          <Button
            variant={activeTab === 'ALL' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('ALL')}
            className="text-xs h-8 rounded-lg cursor-pointer"
          >
            All Flags ({mockFraudFlags.length})
          </Button>
          <Button
            variant={activeTab === 'DUPLICATE_RECEIPT' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('DUPLICATE_RECEIPT')}
            className="text-xs h-8 rounded-lg cursor-pointer"
          >
            Duplicate Receipts
          </Button>
          <Button
            variant={activeTab === 'DUPLICATE_EXPENSE' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('DUPLICATE_EXPENSE')}
            className="text-xs h-8 rounded-lg cursor-pointer"
          >
            Duplicate Expenses
          </Button>
          <Button
            variant={activeTab === 'UNUSUAL_SPENDING' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('UNUSUAL_SPENDING')}
            className="text-xs h-8 rounded-lg cursor-pointer"
          >
            Unusual Spending
          </Button>
          <Button
            variant={activeTab === 'SUSPICIOUS' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('SUSPICIOUS')}
            className="text-xs h-8 rounded-lg cursor-pointer"
          >
            Split / Suspicious
          </Button>
        </div>

        <div className="w-full md:w-72">
          <AnimatedSearchBar
            size="md"
            placeholder="Search claimant, merchant, or flag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
        </div>

      </div>

      {/* Main Table of Flagged Items */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border">
          <CardTitle className="text-base font-semibold">Flagged Claims Investigation Queue</CardTitle>
          <CardDescription className="text-xs">
            Review AI confidence findings, compare duplicate receipts, and dispatch compliance actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="text-xs font-semibold">
                <TableHead className="w-24 pl-5">Flag ID</TableHead>
                <TableHead className="w-32">Risk Severity</TableHead>
                <TableHead className="w-48">Claimant & Dept</TableHead>
                <TableHead>Anomaly Description & Indicators</TableHead>
                <TableHead className="w-32">Amount</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-24 text-right pr-5">Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                    No flagged violations match active filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFlags.map((flag) => (
                  <TableRow key={flag.id} className="hover:bg-muted/40 transition-colors text-xs">
                    {/* Flag ID */}
                    <TableCell className="font-mono font-medium pl-5 text-foreground">
                      {flag.id}
                    </TableCell>

                    {/* Risk Badge */}
                    <TableCell>{getRiskBadge(flag.riskLevel, flag.riskScore)}</TableCell>

                    {/* Claimant */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7 rounded-full border border-border">
                          <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                            {flag.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{flag.claimant}</span>
                          <span className="text-[11px] text-muted-foreground">{flag.department}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-md">
                        <span className="font-bold text-foreground">{flag.title}</span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{flag.description}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="font-semibold text-foreground">Merchant: {flag.merchant}</span>
                          <span>•</span>
                          <span>Claim: {flag.expenseId}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="font-bold text-foreground">
                      {flag.amount}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {flag.status === 'ACTIVE' && (
                        <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[10px]">
                          Pending Action
                        </Badge>
                      )}
                      {flag.status === 'INVESTIGATING' && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]">
                          Under Review
                        </Badge>
                      )}
                      {flag.status === 'RESOLVED' && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                          Resolved
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInspectItem(flag)}
                        className="h-8 px-2.5 text-xs gap-1 cursor-pointer hover:bg-muted"
                      >
                        <Eye className="size-3.5" />
                        <span>Inspect</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal: Deep Dive Inspection, Receipt Side-by-Side Comparison & Actions */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ShieldAlert className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {inspectItem.title}
                    </h3>
                    {getRiskBadge(inspectItem.riskLevel, inspectItem.riskScore)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Flag ID: {inspectItem.id} • Target Expense: {inspectItem.expenseId}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInspectItem(null)}
                className="size-8 p-0 rounded-full cursor-pointer hover:bg-muted"
              >
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Anomaly Description & Submitter Info */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <span className="font-bold text-foreground block">Anomaly Explanation</span>
                <p className="text-muted-foreground leading-relaxed">{inspectItem.description}</p>
                <div className="pt-2 border-t border-border/80 grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Claimant</span>
                    <span className="font-semibold text-foreground">{inspectItem.claimant} ({inspectItem.department})</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Amount</span>
                    <span className="font-semibold text-foreground">{inspectItem.amount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Merchant</span>
                    <span className="font-semibold text-foreground">{inspectItem.merchant}</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Duplicate Receipt Comparison if applicable */}
              {inspectItem.receiptA && inspectItem.receiptB && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Receipt className="size-3.5 text-primary" />
                    Side-by-Side Duplicate Receipt Hash Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Receipt A (Current) */}
                    <div className="p-3.5 rounded-xl border-2 border-rose-500/40 bg-rose-500/5 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                        <span className="font-bold text-rose-600 dark:text-rose-400">Current Submission</span>
                        <Badge className="bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px]">Duplicate Image</Badge>
                      </div>
                      <div className="space-y-1 font-mono text-[11px]">
                        <div><span className="text-muted-foreground">Claim:</span> {inspectItem.receiptA.id}</div>
                        <div><span className="text-muted-foreground">Submitter:</span> {inspectItem.receiptA.submitter}</div>
                        <div><span className="text-muted-foreground">Date:</span> {inspectItem.receiptA.date}</div>
                        <div><span className="text-muted-foreground">Amount:</span> {inspectItem.receiptA.amount}</div>
                        <div><span className="text-muted-foreground">Invoice No:</span> {inspectItem.receiptA.invoiceNo}</div>
                      </div>
                    </div>

                    {/* Receipt B (Existing Settled) */}
                    <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <span className="font-bold text-foreground">Previously Paid Claim</span>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">Settled on 03 Oct</Badge>
                      </div>
                      <div className="space-y-1 font-mono text-[11px]">
                        <div><span className="text-muted-foreground">Claim:</span> {inspectItem.receiptB.id}</div>
                        <div><span className="text-muted-foreground">Submitter:</span> {inspectItem.receiptB.submitter}</div>
                        <div><span className="text-muted-foreground">Date:</span> {inspectItem.receiptB.date}</div>
                        <div><span className="text-muted-foreground">Amount:</span> {inspectItem.receiptB.amount}</div>
                        <div><span className="text-muted-foreground">Invoice No:</span> {inspectItem.receiptB.invoiceNo}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Forensic Anomaly Indicators */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Forensic Rule Violations & Triggers
                </h4>
                <div className="space-y-1.5">
                  {inspectItem.indicators.map((ind, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-background border border-border">
                      <AlertTriangle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-foreground font-medium">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-border flex flex-wrap items-center justify-between gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleResolveAction(inspectItem.id, 'Dismissed as False Positive')}
                className="text-xs cursor-pointer gap-1.5"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Dismiss (False Positive)</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolveAction(inspectItem.id, 'Requested Clarification from Submitter')}
                  className="text-xs cursor-pointer gap-1.5"
                >
                  <HelpCircle className="size-3.5" />
                  <span>Request Clarification</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleResolveAction(inspectItem.id, 'Rejected Claim & Blocked for Audit')}
                  className="text-xs cursor-pointer gap-1.5"
                >
                  <Ban className="size-3.5" />
                  <span>Block & Reject Claim</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
