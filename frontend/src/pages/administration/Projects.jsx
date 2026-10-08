import React, { useState } from 'react';
import {
  Plus,
  Briefcase,
  Calendar,
  CheckCircle2,
  Search,
  Download,
  EllipsisVertical,
  Edit2,
  ExternalLink,
  Archive,
  ChevronLeft,
  ChevronRight,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from '../../components/common/Modal';

const initialProjects = [
  {
    id: 'PRJ-101',
    code: 'PRJ-Alpha',
    title: 'Enterprise Cloud Migration',
    client: 'Acme Global Corp',
    budget: '₹4,50,000.00',
    spent: '₹3,12,000.00',
    rawBudget: 450000,
    rawSpent: 312000,
    status: 'Active',
  },
  {
    id: 'PRJ-102',
    code: 'PRJ-Beta',
    title: 'Mobile Banking iOS/Android Rewrite',
    client: 'Fintech Partners UK',
    budget: '₹6,50,000.00',
    spent: '₹5,89,000.00',
    rawBudget: 650000,
    rawSpent: 589000,
    status: 'Active',
  },
  {
    id: 'PRJ-103',
    code: 'PRJ-Gamma',
    title: 'Internal SOC2 & ISO Compliance Audit',
    client: 'Internal Enterprise',
    budget: '₹2,50,000.00',
    spent: '₹2,48,000.00',
    rawBudget: 250000,
    rawSpent: 248000,
    status: 'Completed',
  },
  {
    id: 'PRJ-104',
    code: 'PRJ-Delta',
    title: 'AI Automated Claim Verification Engine',
    client: 'Operations Core',
    budget: '₹8,00,000.00',
    spent: '₹3,40,000.00',
    rawBudget: 800000,
    rawSpent: 340000,
    status: 'Active',
  },
  {
    id: 'PRJ-105',
    code: 'PRJ-Epsilon',
    title: 'Global Sales Kickoff Summit',
    client: 'Enterprise Sales',
    budget: '₹5,00,000.00',
    spent: '₹4,95,000.00',
    rawBudget: 500000,
    rawSpent: 495000,
    status: 'Completed',
  },
];

export const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({ code: '', title: '', client: '', budget: '' });

  const filtered = projects.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    const numBudget = parseFloat(formData.budget) || 100000;
    const newProj = {
      id: `PRJ-${Date.now()}`,
      code: formData.code,
      title: formData.title,
      client: formData.client,
      budget: `₹${numBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      spent: '₹0.00',
      rawBudget: numBudget,
      rawSpent: 0,
      status: 'Active',
    };
    setProjects([newProj, ...projects]);
    setModalOpen(false);
    setFormData({ code: '', title: '', client: '', budget: '' });
    setNotification(`Project ${formData.code} created successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleToggleStatus = (id) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Active' ? 'Completed' : 'Active' } : p
      )
    );
  };

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
              Projects & Cost Centers
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Attribute billable and non-billable employee expenditures to customer projects
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                className="h-8 flex-1 sm:flex-initial gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xs cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="size-3.5" />
                <span>New Project</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 flex-1 sm:flex-initial gap-1.5 text-xs rounded-full border-border/80 bg-background/50 hover:bg-muted shadow-2xs cursor-pointer">
                <Download className="size-3.5" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full min-w-[700px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">PROJECT CODE</TableHead>
                <TableHead>PROJECT NAME</TableHead>
                <TableHead>CLIENT / ACCOUNT</TableHead>
                <TableHead>EXPENSE BUDGET</TableHead>
                <TableHead>SPENT TO DATE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No projects found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((proj) => {
                  const pct = Math.round((proj.rawSpent / proj.rawBudget) * 100) || 0;
                  return (
                    <TableRow key={proj.id}>
                      <TableCell className="pl-6 font-mono text-xs font-semibold text-primary">
                        {proj.code}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {proj.title}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {proj.client}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {proj.budget}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{proj.spent}</span>
                          <span className="text-[11px] text-muted-foreground">({pct}%)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {proj.status === 'Active' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-medium text-muted-foreground">
                            Completed
                          </Badge>
                        )}
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
                              <span>Edit Project Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                              <ExternalLink className="size-4" />
                              <span>View Associated Expenses</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-muted-foreground flex items-center gap-2"
                              onClick={() => handleToggleStatus(proj.id)}
                            >
                              <Archive className="size-4" />
                              <span>{proj.status === 'Active' ? 'Mark Completed' : 'Reactivate Project'}</span>
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
              Showing 1 to {filtered.length} of {projects.length} projects
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

      {/* New Project Code Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Project Code"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Project Code *</label>
            <Input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. PRJ-Zeta"
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Project Name *</label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Enterprise Data Lake"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Client / Account *</label>
              <Input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Acme Corp"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Budget Limit (₹) *</label>
              <Input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g. 500000"
                className="text-xs"
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
              Save Project Code
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
