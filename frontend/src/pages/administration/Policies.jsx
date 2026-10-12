import React, { useState } from 'react';
import {
  Plus,
  ShieldCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Check,
  Search,
  Download,
  EllipsisVertical,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSearchBar } from "@/components/ui/AnimatedSearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomSelect } from "@/components/ui/select";
import Modal from '../../components/common/Modal';

const defaultPolicies = [
  {
    id: 'POL-01',
    title: 'Mandatory Receipt Requirement',
    description: 'Requires an itemized merchant receipt for any single expense transaction exceeding ₹500.00.',
    scope: 'All Departments',
    severity: 'Hard Block',
    enabled: true,
  },
  {
    id: 'POL-02',
    title: 'Daily Meal & Per-Diem Cap',
    description: 'Caps individual daily meal expenses at ₹2,500.00 per employee. Overage triggers automated manager review.',
    scope: 'All Employees',
    severity: 'Soft Warning',
    enabled: true,
  },
  {
    id: 'POL-03',
    title: 'Executive VP Sign-off Threshold',
    description: 'Any single expenditure claim greater than ₹50,000.00 mandates secondary sign-off from Finance VP.',
    scope: 'Enterprise Wide',
    severity: 'Hard Block',
    enabled: true,
  },
  {
    id: 'POL-04',
    title: 'Advance Travel Booking Policy',
    description: 'Domestic flights and rail must be booked at least 7 days in advance of departure date.',
    scope: 'Sales & Executive',
    severity: 'Soft Warning',
    enabled: true,
  },
  {
    id: 'POL-05',
    title: 'Alcohol Expense Exclusions',
    description: 'Alcohol purchases are non-reimbursable unless designated under pre-approved client entertainment accounts.',
    scope: 'All Employees',
    severity: 'Audit Review',
    enabled: false,
  },
];

function SeverityBadge({ severity }) {
  if (severity.includes('Hard')) {
    return (
      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 font-medium">
        Hard Block
      </Badge>
    );
  }
  if (severity.includes('Warning') || severity.includes('Soft')) {
    return (
      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 font-medium">
        Soft Warning
      </Badge>
    );
  }
  return (
    <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 font-medium">
      Audit Review
    </Badge>
  );
}

export const Policies = () => {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: 'All Departments',
    severity: 'Soft Warning',
  });

  const togglePolicy = (id) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.enabled;
          setNotification(`Rule "${p.title}" ${nextState ? 'enforced' : 'disabled'}`);
          setTimeout(() => setNotification(''), 4000);
          return { ...p, enabled: nextState };
        }
        return p;
      })
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const newPolicy = {
      id: `POL-0${policies.length + 1}`,
      title: formData.title,
      description: formData.description,
      scope: formData.scope,
      severity: formData.severity,
      enabled: true,
    };
    setPolicies([...policies, newPolicy]);
    setModalOpen(false);
    setFormData({ title: '', description: '', scope: 'All Departments', severity: 'Soft Warning' });
    setNotification(`Policy "${formData.title}" created successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const filtered = policies.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.scope.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Datatable Card matching Image 2 */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Expense Policies & Governance
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Establish automated validation guardrails, per-diem caps, and multi-tier approval rules
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-48 sm:w-64">
              <AnimatedSearchBar
                placeholder="Filter policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
              />
            </div>

            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xs"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="size-3.5" />
              <span>New Rule</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs">
              <Download className="size-3.5" />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">POLICY RULE</TableHead>
                <TableHead>APPLIED SCOPE</TableHead>
                <TableHead>ENFORCEMENT ACTION</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No policy rules found matching your filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((policy) => (
                  <TableRow key={policy.id} className={!policy.enabled ? 'opacity-60' : ''}>
                    <TableCell className="pl-6 max-w-md">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-md mt-0.5 ${policy.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <ShieldCheck className="size-3.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-foreground">{policy.title}</span>
                          <span className="text-[11px] text-muted-foreground line-clamp-1">{policy.description}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {policy.scope}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={policy.severity} />
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => togglePolicy(policy.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                          policy.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                        }`}
                      >
                        {policy.enabled ? (
                          <>
                            <ToggleRight className="size-5 text-emerald-600 dark:text-emerald-400" />
                            <span>Enforced</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="size-5 text-muted-foreground" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
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
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <Edit2 className="size-4" />
                            <span>Edit Parameters</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer flex items-center gap-2"
                            onClick={() => togglePolicy(policy.id)}
                          >
                            <ShieldAlert className="size-4" />
                            <span>{policy.enabled ? 'Disable Enforcement' : 'Enable Enforcement'}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Datatable Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing 1 to {filtered.length} of {policies.length} policies
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

      {/* New Policy Rule Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Define Expense Policy Rule"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Rule Title *</label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Rideshare Surge Fare Restriction"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Policy Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="State clear parameters under which this rule fires..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Scope</label>
              <CustomSelect
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                triggerClassName="h-9 rounded-md text-xs"
                options={[
                  { value: "All Departments", label: "All Departments" },
                  { value: "Sales Only", label: "Sales Only" },
                  { value: "Engineering", label: "Engineering" },
                  { value: "Executive", label: "Executive" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Rule Action</label>
              <CustomSelect
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                triggerClassName="h-9 rounded-md text-xs"
                options={[
                  { value: "Soft Warning", label: "Soft Warning" },
                  { value: "Hard Block", label: "Hard Block" },
                  { value: "Audit Review", label: "Flag for Manual Audit" },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Policy Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Policies;
