import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  Mail,
  Webhook,
  Key,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Plus,
  Settings,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Power,
  ChevronRight,
  Database,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/select";

const mockIntegrations = [
  // Corporate Cards
  {
    id: 'int_amex',
    category: 'CARD',
    name: 'American Express Corporate',
    iconColor: '#006FCF',
    iconText: 'AMEX',
    status: 'CONNECTED',
    lastSync: '12 mins ago',
    description: 'Direct transaction feed sync with automatic employee cardholder reconciliation.',
    metrics: { cards: '142 Active Cards', syncedToday: '38 Transactions' },
    config: { autoReconcile: true, syncFrequency: 'Hourly' },
  },
  {
    id: 'int_chase',
    category: 'CARD',
    name: 'Chase Commercial Banking',
    iconColor: '#117ACA',
    iconText: 'CHASE',
    status: 'CONNECTED',
    lastSync: '1 hr ago',
    description: 'Real-time card swipe authorizations and automated receipt matching.',
    metrics: { cards: '86 Active Cards', syncedToday: '21 Transactions' },
    config: { autoReconcile: true, syncFrequency: 'Real-time' },
  },
  {
    id: 'int_brex',
    category: 'CARD',
    name: 'Brex Smart Corporate Cards',
    iconColor: '#F15A24',
    iconText: 'BREX',
    status: 'AVAILABLE',
    lastSync: 'Never',
    description: 'Modern spend management card with instant virtual card issuing.',
    metrics: { cards: '0 Cards', syncedToday: '0 Transactions' },
  },

  // Accounting & ERP
  {
    id: 'int_quickbooks',
    category: 'ERP',
    name: 'QuickBooks Online',
    iconColor: '#2CA01C',
    iconText: 'QBO',
    status: 'CONNECTED',
    lastSync: '25 mins ago',
    description: 'Auto-post approved expense reports to General Ledger and Bills payable.',
    metrics: { glAccounts: '48 Mapped Accounts', syncedToday: '18 Bills Created' },
    config: { syncTarget: 'Accounts Payable', taxMapping: 'GST 18% Standard' },
  },
  {
    id: 'int_netsuite',
    category: 'ERP',
    name: 'Oracle NetSuite ERP',
    iconColor: '#1E497D',
    iconText: 'NS',
    status: 'CONNECTED',
    lastSync: '3 hrs ago',
    description: 'Multi-subsidiary expense journal synchronization and department cost center mapping.',
    metrics: { glAccounts: '124 Mapped Accounts', syncedToday: '4 Journals' },
    config: { subsidiary: 'India Operations Pvt Ltd', currency: 'INR' },
  },
  {
    id: 'int_sap',
    category: 'ERP',
    name: 'SAP S/4HANA Finance',
    iconColor: '#008FD3',
    iconText: 'SAP',
    status: 'AVAILABLE',
    lastSync: 'Never',
    description: 'Enterprise ERP synchronization for cost centers, WBS elements, and vendor clearing.',
    metrics: { glAccounts: 'Enterprise Connector', syncedToday: 'Idle' },
  },
  {
    id: 'int_xero',
    category: 'ERP',
    name: 'Xero Accounting',
    iconColor: '#13B5EA',
    iconText: 'XERO',
    status: 'AVAILABLE',
    lastSync: 'Never',
    description: 'Small & medium business cloud accounting feed and receipt reconciliation.',
    metrics: { glAccounts: 'Ready to connect', syncedToday: 'Idle' },
  },

  // Email Integrations
  {
    id: 'int_gmail',
    category: 'EMAIL',
    name: 'Google Workspace / Gmail Add-in',
    iconColor: '#EA4335',
    iconText: 'GMAIL',
    status: 'CONNECTED',
    lastSync: '5 mins ago',
    description: '1-click expense creation from digital invoices and flight confirmations inside Gmail.',
    metrics: { parsedEmails: '412 Receipts Parsed', confidence: '98.8% OCR Accuracy' },
    config: { forwardAddress: 'receipts@company.expensehub.com' },
  },
  {
    id: 'int_outlook',
    category: 'EMAIL',
    name: 'Microsoft 365 / Outlook',
    iconColor: '#0078D4',
    iconText: 'M365',
    status: 'CONNECTED',
    lastSync: '40 mins ago',
    description: 'Smart contextual sidebar in Outlook to submit PDF invoices directly to approval queue.',
    metrics: { parsedEmails: '280 Receipts Parsed', confidence: '99.1% OCR Accuracy' },
    config: { forwardAddress: 'receipts@company.expensehub.com' },
  },
];

const mockWebhooks = [
  { id: 'wh_01', event: 'expense.approved', endpoint: 'https://api.company.com/webhooks/expenses', status: 'ACTIVE', successRate: '100%' },
  { id: 'wh_02', event: 'reimbursement.settled', endpoint: 'https://finance.company.com/disbursements', status: 'ACTIVE', successRate: '99.8%' },
  { id: 'wh_03', event: 'fraud.flagged', endpoint: 'https://security.company.com/alerts/fraud', status: 'ACTIVE', successRate: '100%' },
];

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [integrationsList, setIntegrationsList] = useState(mockIntegrations);
  const [syncingId, setSyncingId] = useState(null);
  const [configModalItem, setConfigModalItem] = useState(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [testWebhookModal, setTestWebhookModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSyncNow = (id, name) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
      setIntegrationsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, lastSync: 'Just now' } : item))
      );
      showToast(`${name} synchronization completed successfully.`);
    }, 1200);
  };

  const handleToggleConnect = (id) => {
    setIntegrationsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'CONNECTED' ? 'AVAILABLE' : 'CONNECTED';
          showToast(`${item.name} is now ${nextStatus === 'CONNECTED' ? 'Connected' : 'Disconnected'}.`);
          return { ...item, status: nextStatus, lastSync: nextStatus === 'CONNECTED' ? 'Just now' : 'Never' };
        }
        return item;
      })
    );
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('exphub_live_99a8b1c4e7f290384716a5b6c');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2500);
  };

  const filteredIntegrations = integrationsList.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              System Integrations & APIs
            </h1>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              6 Connected
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect corporate credit cards, accounting ERP ledgers, email receipt forwarders, and external developer webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTestWebhookModal(true)}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Webhook className="size-3.5" />
            <span>Developer Webhooks</span>
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border w-fit">
        <Button
          variant={activeCategory === 'ALL' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('ALL')}
          className="text-xs h-8 rounded-lg cursor-pointer"
        >
          All Integrations ({mockIntegrations.length})
        </Button>
        <Button
          variant={activeCategory === 'CARD' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('CARD')}
          className="text-xs h-8 rounded-lg cursor-pointer gap-1.5"
        >
          <CreditCard className="size-3.5" />
          <span>Corporate Cards</span>
        </Button>
        <Button
          variant={activeCategory === 'ERP' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('ERP')}
          className="text-xs h-8 rounded-lg cursor-pointer gap-1.5"
        >
          <Building className="size-3.5" />
          <span>Accounting & ERP</span>
        </Button>
        <Button
          variant={activeCategory === 'EMAIL' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveCategory('EMAIL')}
          className="text-xs h-8 rounded-lg cursor-pointer gap-1.5"
        >
          <Mail className="size-3.5" />
          <span>Email & Inboxes</span>
        </Button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => (
          <Card key={item.id} className="shadow-xs hover:shadow-md transition-all flex flex-col justify-between border-border">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="size-11 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs shrink-0"
                    style={{ backgroundColor: item.iconColor }}
                  >
                    {item.iconText}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {item.status === 'CONNECTED' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] gap-1 font-semibold">
                          <CheckCircle2 className="size-2.5" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Available
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground font-medium">Sync: {item.lastSync}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleConnect(item.id)}
                  title={item.status === 'CONNECTED' ? 'Disconnect' : 'Connect'}
                  className={`size-8 p-0 rounded-lg cursor-pointer ${
                    item.status === 'CONNECTED' ? 'text-emerald-600 hover:text-rose-600' : 'text-muted-foreground'
                  }`}
                >
                  <Power className="size-4" />
                </Button>
              </div>

              <CardDescription className="text-xs mt-3 leading-relaxed">
                {item.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              {/* Metrics pill */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 text-[11px] flex items-center justify-between font-mono mb-4">
                <span className="text-foreground font-semibold">{item.metrics.cards || item.metrics.glAccounts || item.metrics.parsedEmails}</span>
                <span className="text-muted-foreground">{item.metrics.syncedToday || item.metrics.confidence}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {item.status === 'CONNECTED' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncNow(item.id, item.name)}
                      disabled={syncingId === item.id}
                      className="flex-1 text-xs gap-1.5 h-8 cursor-pointer"
                    >
                      <RefreshCw className={`size-3.5 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                      <span>{syncingId === item.id ? 'Syncing...' : 'Sync Now'}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfigModalItem(item)}
                      className="size-8 p-0 text-xs cursor-pointer hover:bg-muted"
                      title="Configuration Settings"
                    >
                      <Settings className="size-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleToggleConnect(item.id)}
                    className="w-full text-xs gap-1.5 h-8 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Connect Integration</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* External REST API & Developer Gateway Section */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Key className="size-4.5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">External REST API & Developer Gateway</CardTitle>
                <CardDescription className="text-xs">
                  Integrate custom HRMS, payroll, or ERP software via secure tokenized REST endpoints.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
              API v1.4 Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-muted/30">
            <div>
              <span className="text-xs font-bold text-foreground block">Production API Secret Key</span>
              <span className="text-[11px] text-muted-foreground font-mono">
                exphub_live_••••••••••••••••••••••••••••••••
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
                className="text-xs gap-1.5 cursor-pointer h-8"
              >
                {apiKeyCopied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                <span>{apiKeyCopied ? 'Copied' : 'Copy Key'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('New API secret key generated and previous token revoked.')}
                className="text-xs cursor-pointer h-8"
              >
                Rotate Token
              </Button>
            </div>
          </div>

          {/* Webhook Endpoints Sub-list */}
          <div>
            <span className="text-xs font-bold text-foreground block mb-2">Configured Event Webhook Endpoints</span>
            <div className="space-y-2">
              {mockWebhooks.map((wh) => (
                <div key={wh.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-border bg-background text-xs min-w-0">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0 flex-1">
                    <Badge variant="outline" className="font-mono text-[10px] bg-primary/5 text-primary border-primary/20 shrink-0">
                      {wh.event}
                    </Badge>
                    <span className="font-mono text-muted-foreground text-[11px] break-all truncate sm:truncate flex-1 min-w-0" title={wh.endpoint}>
                      {wh.endpoint}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{wh.successRate} Delivered</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                      {wh.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Modal */}
      {configModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: configModalItem.iconColor }}
                >
                  {configModalItem.iconText}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {configModalItem.name} Settings
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfigModalItem(null)}
                className="size-8 p-0 rounded-full cursor-pointer hover:bg-muted"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Reconciliation Policy</label>
                <CustomSelect
                  defaultValue="Auto-match claims by transaction timestamp & exact amount"
                  className="h-10 text-xs"
                  options={[
                    { value: "Auto-match claims by transaction timestamp & exact amount", label: "Auto-match claims by transaction timestamp & exact amount" },
                    { value: "Manual confirmation required for amounts above ₹10,000", label: "Manual confirmation required for amounts above ₹10,000" },
                    { value: "Strict merchant name OCR and tax invoice verification", label: "Strict merchant name OCR and tax invoice verification" },
                  ]}
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Scheduled Sync Frequency</label>
                <CustomSelect
                  defaultValue="Real-time (Webhooks push)"
                  className="h-10 text-xs"
                  options={[
                    { value: "Real-time (Webhooks push)", label: "Real-time (Webhooks push)" },
                    { value: "Hourly background batch sync", label: "Hourly background batch sync" },
                    { value: "Daily at 23:59 IST", label: "Daily at 23:59 IST" },
                  ]}
                />
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                <span className="font-bold text-foreground block">Notification Alerts</span>
                <p className="text-[11px] text-muted-foreground">
                  Send email digest to finance@company.com if synchronization fails or card feed disconnects.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfigModalItem(null)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  showToast(`${configModalItem.name} configuration updated.`);
                  setConfigModalItem(null);
                }}
                className="text-xs cursor-pointer"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Tester Modal */}
      {testWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <Webhook className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Dispatch Test Webhook Event
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTestWebhookModal(false)}
                className="size-8 p-0 rounded-full cursor-pointer hover:bg-muted"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Event Type</label>
                <CustomSelect
                  defaultValue="expense.approved"
                  className="h-10 text-xs"
                  options={[
                    { value: "expense.approved", label: "expense.approved" },
                    { value: "reimbursement.settled", label: "reimbursement.settled" },
                    { value: "fraud.flagged", label: "fraud.flagged" },
                    { value: "budget.threshold_reached", label: "budget.threshold_reached" },
                  ]}
                />
              </div>
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Sample Payload Preview</label>
                <pre className="p-3 rounded-xl bg-muted font-mono text-[11px] text-foreground overflow-x-auto border border-border">
{`{
  "event": "expense.approved",
  "id": "EXP-2026-081",
  "amount": 53400.00,
  "currency": "INR",
  "claimant": "sarah.j@company.com",
  "approvedBy": "alex.morgan@company.com",
  "timestamp": "${new Date().toISOString()}"
}`}
                </pre>
              </div>
            </div>
            <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestWebhookModal(false)}
                className="text-xs cursor-pointer"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  showToast('Test payload successfully dispatched. Received HTTP 200 OK.');
                  setTestWebhookModal(false);
                }}
                className="text-xs cursor-pointer gap-1.5"
              >
                <Send className="size-3.5" />
                <span>Send Test Event</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
