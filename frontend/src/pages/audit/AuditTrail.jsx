import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Eye,
  Hash,
  Lock,
  User,
  History,
  Laptop,
  Globe,
  Copy,
  Check,
  ChevronRight,
  FileSpreadsheet,
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

const mockAuditLogs = [
  {
    id: 'AUD-892401',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '06 Oct 2026, 15:42:10 IST',
    relativeTime: '8 mins ago',
    actor: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com',
      role: 'Finance Admin',
      avatarFallback: 'AM',
      ip: '192.168.1.104',
      device: 'Chrome 129 / macOS Sonoma',
    },
    action: 'APPROVED',
    entityType: 'Expense Claim',
    entityId: 'EXP-2026-081',
    description: 'Approved travel flight reimbursement for Sarah Jenkins',
    fieldChanges: [
      { field: 'status', oldValue: 'Pending Approval', newValue: 'Approved' },
      { field: 'approvedBy', oldValue: 'null', newValue: 'Alex Morgan (usr_001)' },
      { field: 'approvedAt', oldValue: 'null', newValue: '2026-10-06T10:12:10Z' },
    ],
    approvalHistory: [
      { step: 'Claim Submitted', actor: 'Sarah Jenkins', role: 'Employee', date: '05 Oct 2026, 09:30 AM', status: 'Completed', note: 'Flight ticket for Q1 Tech Summit' },
      { step: 'Policy Compliance Check', actor: 'System AI Engine', role: 'Automated Bot', date: '05 Oct 2026, 09:31 AM', status: 'Passed', note: 'Within travel flight cap (₹60,000)' },
      { step: 'Manager Review', actor: 'James Wilson', role: 'Engineering Manager', date: '05 Oct 2026, 14:15 PM', status: 'Approved', note: 'Approved as per summit delegation budget' },
      { step: 'Finance Sign-off', actor: 'Alex Morgan', role: 'Finance Admin', date: '06 Oct 2026, 15:42 PM', status: 'Approved', note: 'Final finance approval verified' },
    ],
    immutable: true,
  },
  {
    id: 'AUD-892400',
    hash: '9f83c68f7000d8f7fae519bdd2025a0fe6416f4d18ec996f4fcf6274488be6c8',
    timestamp: '06 Oct 2026, 14:20:05 IST',
    relativeTime: '1 hr ago',
    actor: {
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      role: 'Approver / Manager',
      avatarFallback: 'JW',
      ip: '192.168.1.189',
      device: 'Edge 128 / Windows 11',
    },
    action: 'POLICY_OVERRIDE',
    entityType: 'Approval Policy',
    entityId: 'POL-TRAVEL-02',
    description: 'Authorized exceptions for overseas accommodation policy threshold',
    fieldChanges: [
      { field: 'hotel_per_diem_cap', oldValue: '₹12,000 / night', newValue: '₹18,500 / night' },
      { field: 'override_reason', oldValue: 'None', newValue: 'Peak season hotel rate surge during GITEX conference' },
      { field: 'authorized_by', oldValue: 'None', newValue: 'James Wilson' },
    ],
    approvalHistory: [
      { step: 'Exception Requested', actor: 'Michael Chang', role: 'Sales Lead', date: '06 Oct 2026, 11:00 AM', status: 'Completed', note: 'Hotel rates tripled due to GITEX' },
      { step: 'VP Finance Approval', actor: 'James Wilson', role: 'Manager', date: '06 Oct 2026, 14:20 PM', status: 'Approved', note: 'One-time exception granted for GITEX 2026' },
    ],
    immutable: true,
  },
  {
    id: 'AUD-892399',
    hash: '5d41402abc4b2a76b9719d911017c5926c043e0d8692790938f6b5f4f8f41656',
    timestamp: '06 Oct 2026, 12:45:18 IST',
    relativeTime: '3 hrs ago',
    actor: {
      name: 'Lisa Ray',
      email: 'lisa.ray@company.com',
      role: 'Employee',
      avatarFallback: 'LR',
      ip: '192.168.1.72',
      device: 'Mobile Safari / iOS 18',
    },
    action: 'CREATED',
    entityType: 'Expense Claim',
    entityId: 'EXP-2026-085',
    description: 'Submitted client lunch receipt at The Taj Palace',
    fieldChanges: [
      { field: 'amount', oldValue: 'null', newValue: '₹4,850.00' },
      { field: 'merchant', oldValue: 'null', newValue: 'The Taj Palace' },
      { field: 'category', oldValue: 'null', newValue: 'Client Entertainment' },
    ],
    approvalHistory: [
      { step: 'Claim Submitted', actor: 'Lisa Ray', role: 'Employee', date: '06 Oct 2026, 12:45 PM', status: 'Completed', note: 'Initial submission with receipt' },
      { step: 'Manager Review', actor: 'James Wilson', role: 'Manager', date: 'Pending', status: 'In Review', note: 'Awaiting manager sign-off' },
    ],
    immutable: true,
  },
  {
    id: 'AUD-892398',
    hash: 'b10a8db164e0754105b7a99be72e3fe5da448c4ae8f815a1c0188dd3e3a89774',
    timestamp: '06 Oct 2026, 10:15:33 IST',
    relativeTime: '5 hrs ago',
    actor: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com',
      role: 'Finance Admin',
      avatarFallback: 'AM',
      ip: '192.168.1.104',
      device: 'Chrome 129 / macOS Sonoma',
    },
    action: 'REIMBURSED',
    entityType: 'Batch Payment',
    entityId: 'BATCH-2026-042',
    description: 'Executed NEFT batch reimbursement disbursement of ₹3,42,800',
    fieldChanges: [
      { field: 'batch_status', oldValue: 'Processing', newValue: 'Settled' },
      { field: 'utr_reference', oldValue: 'Pending', newValue: 'HDFC261006094821' },
      { field: 'claims_cleared', oldValue: '0', newValue: '18 Claims' },
    ],
    approvalHistory: [
      { step: 'Batch Formed', actor: 'System Scheduler', role: 'Automated Bot', date: '06 Oct 2026, 08:00 AM', status: 'Completed', note: '18 approved claims queued' },
      { step: 'Banking Integration Auth', actor: 'Alex Morgan', role: 'Finance Admin', date: '06 Oct 2026, 10:15 AM', status: 'Approved', note: '2FA token verified for corporate banking' },
    ],
    immutable: true,
  },
  {
    id: 'AUD-892397',
    hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    timestamp: '05 Oct 2026, 18:30:12 IST',
    relativeTime: '21 hrs ago',
    actor: {
      name: 'James Wilson',
      email: 'james.wilson@company.com',
      role: 'Approver / Manager',
      avatarFallback: 'JW',
      ip: '192.168.1.189',
      device: 'Edge 128 / Windows 11',
    },
    action: 'REJECTED',
    entityType: 'Expense Claim',
    entityId: 'EXP-2026-079',
    description: 'Rejected unitemized weekend spa voucher claim',
    fieldChanges: [
      { field: 'status', oldValue: 'Pending Approval', newValue: 'Rejected' },
      { field: 'rejectionReason', oldValue: 'null', newValue: 'Personal wellness service not covered under standard travel policy' },
    ],
    approvalHistory: [
      { step: 'Claim Submitted', actor: 'Kevin Vance', role: 'Sales Exec', date: '05 Oct 2026, 16:20 PM', status: 'Completed', note: 'Spa & Wellness voucher' },
      { step: 'Manager Review', actor: 'James Wilson', role: 'Manager', date: '05 Oct 2026, 18:30 PM', status: 'Rejected', note: 'Policy violation: Personal care not reimbursable' },
    ],
    immutable: true,
  },
  {
    id: 'AUD-892396',
    hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    timestamp: '05 Oct 2026, 14:10:00 IST',
    relativeTime: '1 day ago',
    actor: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com',
      role: 'Finance Admin',
      avatarFallback: 'AM',
      ip: '192.168.1.104',
      device: 'Chrome 129 / macOS Sonoma',
    },
    action: 'MODIFIED',
    entityType: 'Department Budget',
    entityId: 'BUD-ENG-Q4',
    description: 'Increased Q4 Engineering cloud compute budget ceiling',
    fieldChanges: [
      { field: 'allocated_budget', oldValue: '₹15,00,000', newValue: '₹18,50,000' },
      { field: 'hard_cap_alert', oldValue: '₹14,50,000', newValue: '₹17,80,000' },
    ],
    approvalHistory: [
      { step: 'Budget Adjustment Request', actor: 'David Kim', role: 'DevOps Lead', date: '04 Oct 2026, 16:00 PM', status: 'Completed', note: 'AWS GPU infrastructure upgrade for AI model' },
      { step: 'CFO Approval', actor: 'Alex Morgan', role: 'Finance Admin', date: '05 Oct 2026, 14:10 PM', status: 'Approved', note: 'Approved under Q4 R&D expansion initiative' },
    ],
    immutable: true,
  },
];

export default function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState('ALL');
  const [activeRecord, setActiveRecord] = useState(null);
  const [copiedHash, setCopiedHash] = useState('');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const matchesEntity = selectedEntityType === 'ALL' || log.entityType === selectedEntityType;

    return matchesSearch && matchesAction && matchesEntity;
  });

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(''), 2500);
  };

  const exportAuditLog = (format) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockAuditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-trail-${new Date().toISOString().slice(0, 10)}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'APPROVED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold">APPROVED</Badge>;
      case 'REJECTED':
        return <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold">REJECTED</Badge>;
      case 'POLICY_OVERRIDE':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold">OVERRIDE</Badge>;
      case 'REIMBURSED':
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-semibold">REIMBURSED</Badge>;
      case 'CREATED':
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-semibold">CREATED</Badge>;
      case 'MODIFIED':
        return <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20 font-semibold">MODIFIED</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Audit Trail & Compliance Ledger
            </h1>
            <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[11px] font-medium">
              <Lock className="size-3" />
              Immutable Ledger
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tamper-proof chronological records of all financial events, policy changes, and approval lifecycle states.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAuditLog('json')}
            className="gap-2 text-xs cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export JSON</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAuditLog('csv')}
            className="gap-2 text-xs cursor-pointer"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Audit Events</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">14,289</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">100% Cryptographically signed</p>
            </div>
            <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <History className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Approvals & Signoffs</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">1,842</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Dual-authorization compliant</p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Policy Overrides</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">12</h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Flagged for board audit review</p>
            </div>
            <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Chain Integrity</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Verified</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Zero tamper discrepancies</p>
            </div>
            <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Shield className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by Actor, Entity ID (EXP-...), or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="POLICY_OVERRIDE">Policy Override</option>
              <option value="REIMBURSED">Reimbursed</option>
              <option value="CREATED">Created</option>
              <option value="MODIFIED">Modified</option>
            </select>

            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="ALL">All Entity Types</option>
              <option value="Expense Claim">Expense Claim</option>
              <option value="Approval Policy">Approval Policy</option>
              <option value="Batch Payment">Batch Payment</option>
              <option value="Department Budget">Department Budget</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Trail Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Ledger Activity Records</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredLogs.length} verified events matching active filter criteria
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time ingestion active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="text-xs font-semibold">
                <TableHead className="w-28 pl-5">Event ID</TableHead>
                <TableHead className="w-52">Actor (Who)</TableHead>
                <TableHead className="w-28">Action</TableHead>
                <TableHead className="w-40">Target Entity</TableHead>
                <TableHead>What Changed & Details</TableHead>
                <TableHead className="w-40">Timestamp</TableHead>
                <TableHead className="w-24 text-right pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-36 text-center text-muted-foreground text-sm">
                    No audit records found matching your query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/40 transition-colors text-xs">
                    {/* Event ID with Immutable Icon */}
                    <TableCell className="font-mono font-medium pl-5 text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{log.id}</span>
                      </div>
                    </TableCell>

                    {/* Actor */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7 rounded-full border border-border">
                          <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                            {log.actor.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground leading-tight">{log.actor.name}</span>
                          <span className="text-[11px] text-muted-foreground">{log.actor.role}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Action */}
                    <TableCell>{getActionBadge(log.action)}</TableCell>

                    {/* Target Entity */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{log.entityId}</span>
                        <span className="text-[11px] text-muted-foreground">{log.entityType}</span>
                      </div>
                    </TableCell>

                    {/* Description & What Changed */}
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-md">
                        <span className="text-foreground font-medium">{log.description}</span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {log.fieldChanges.map((change, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground border border-border/60"
                            >
                              <span className="font-semibold text-foreground">{change.field}:</span>
                              <span className="line-through text-rose-500/80">{change.oldValue}</span>
                              <ArrowRight className="size-2.5 text-muted-foreground" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">{change.newValue}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>

                    {/* Timestamp */}
                    <TableCell>
                      <div className="flex flex-col text-[11px]">
                        <span className="font-medium text-foreground">{log.timestamp}</span>
                        <span className="text-muted-foreground">{log.relativeTime}</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveRecord(log)}
                        className="h-8 px-2.5 text-xs gap-1.5 cursor-pointer hover:bg-muted"
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

      {/* Detailed Modal: Approval History & Immutable Cryptographic Proof */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Audit Record: {activeRecord.id}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Target {activeRecord.entityType} ({activeRecord.entityId})
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveRecord(null)}
                className="size-8 p-0 rounded-full cursor-pointer hover:bg-muted"
              >
                ✕
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Cryptographic Ledger Block */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Hash className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    Cryptographic SHA-256 Ledger Signature
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                    Immutable & Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-2 bg-background p-2.5 rounded-lg border border-border font-mono text-[11px] text-muted-foreground break-all">
                  <span className="flex-1">{activeRecord.hash}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyHash(activeRecord.hash)}
                    className="h-7 px-2 text-xs shrink-0 cursor-pointer"
                  >
                    {copiedHash === activeRecord.hash ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Actor & Session Metadata */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Session & Actor Details
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-border bg-background text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">User Account</span>
                    <span className="font-semibold text-foreground">{activeRecord.actor.name} ({activeRecord.actor.email})</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Assigned Role</span>
                    <span className="font-semibold text-foreground">{activeRecord.actor.role}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Client IP Address</span>
                    <span className="font-mono text-foreground">{activeRecord.actor.ip}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Operating Client</span>
                    <span className="text-foreground">{activeRecord.actor.device}</span>
                  </div>
                </div>
              </div>

              {/* Field-level Delta (What Changed) */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Field-Level Modifications (Delta)
                </h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="text-xs">
                        <TableHead className="w-36">Field</TableHead>
                        <TableHead>Previous Value</TableHead>
                        <TableHead>New Updated Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeRecord.fieldChanges.map((change, i) => (
                        <TableRow key={i} className="text-xs">
                          <TableCell className="font-mono font-semibold text-foreground">{change.field}</TableCell>
                          <TableCell className="text-rose-600 dark:text-rose-400 bg-rose-500/5 font-mono">{change.oldValue}</TableCell>
                          <TableCell className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-mono">{change.newValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Approval History Timeline */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Full Approval History & Workflow Stages
                </h4>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {activeRecord.approvalHistory.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 top-1 size-4 rounded-full border-2 border-background flex items-center justify-center ${
                        step.status === 'Approved' || step.status === 'Completed' || step.status === 'Passed'
                          ? 'bg-emerald-500'
                          : step.status === 'Rejected'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}>
                        <div className="size-1 rounded-full bg-white" />
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-background text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{step.step}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">{step.date}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Actor: <span className="font-medium text-foreground">{step.actor}</span> ({step.role})
                        </div>
                        <div className="text-[11px] text-muted-foreground italic">
                          "{step.note}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveRecord(null)}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
