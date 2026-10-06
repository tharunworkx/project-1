import React, { useState } from 'react';
import {
  Plus,
  Building2,
  Users as UsersIcon,
  DollarSign,
  Edit2,
  Search,
  Download,
  EllipsisVertical,
  Archive,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserCheck,
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
import Modal from '../../components/common/Modal';

const initialDepartments = [
  { id: 'DEP-1', name: 'Engineering & DevOps', lead: 'Sarah Jenkins', leadFallback: 'SJ', employees: 42, budget: '₹10,00,000.00', status: 'Active' },
  { id: 'DEP-2', name: 'Growth & Marketing', lead: 'Priya Sharma', leadFallback: 'PS', employees: 18, budget: '₹5,00,000.00', status: 'Active' },
  { id: 'DEP-3', name: 'Enterprise Sales', lead: 'Arun Kumar', leadFallback: 'AK', employees: 24, budget: '₹6,00,000.00', status: 'Active' },
  { id: 'DEP-4', name: 'Product & Design', lead: 'Divya Ramesh', leadFallback: 'DR', employees: 14, budget: '₹3,00,000.00', status: 'Active' },
  { id: 'DEP-5', name: 'People & Operations', lead: 'Alex Morgan', leadFallback: 'AM', employees: 9, budget: '₹2,00,000.00', status: 'Active' },
  { id: 'DEP-6', name: 'Finance & Accounts', lead: 'Karthik Mohan', leadFallback: 'KM', employees: 12, budget: '₹4,50,000.00', status: 'Active' },
];

export const Departments = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({ name: '', lead: '', employees: '', budget: '' });

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.lead.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e) => {
    e.preventDefault();
    const numBudget = parseFloat(formData.budget) || 100000;
    const initials = formData.lead
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'LD';

    const newDept = {
      id: `DEP-${departments.length + 1}`,
      name: formData.name,
      lead: formData.lead,
      leadFallback: initials,
      employees: parseInt(formData.employees) || 1,
      budget: `₹${numBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      status: 'Active',
    };
    setDepartments([...departments, newDept]);
    setModalOpen(false);
    setFormData({ name: '', lead: '', employees: '', budget: '' });
    setNotification(`Department "${formData.name}" created successfully`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleToggleStatus = (id) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'Active' ? 'Archived' : 'Active' } : d
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
              Departments
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Configure corporate organizational units and spending authorities
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter departments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs rounded-full bg-muted/60 border-border/80 focus-visible:bg-background shadow-xs"
              />
            </div>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-xs"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="size-3.5" />
              <span>New Department</span>
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
                <TableHead className="pl-6">DEPARTMENT</TableHead>
                <TableHead>DEPARTMENT LEAD</TableHead>
                <TableHead>TEAM SIZE</TableHead>
                <TableHead>Q1 BUDGET LIMIT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No departments found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                          <Building2 className="size-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7 rounded-full border border-border/60">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                            {dept.leadFallback}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground font-medium">{dept.lead}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {dept.employees} Members
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {dept.budget}
                    </TableCell>
                    <TableCell>
                      {dept.status === 'Active' ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-medium text-muted-foreground">
                          Archived
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
                            <span>Edit Department</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-muted-foreground flex items-center gap-2"
                            onClick={() => handleToggleStatus(dept.id)}
                          >
                            <Archive className="size-4" />
                            <span>{dept.status === 'Active' ? 'Archive Department' : 'Restore Department'}</span>
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
              Showing 1 to {filtered.length} of {departments.length} departments
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

      {/* New Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Department"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Department Name *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Legal & Compliance"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Department Lead *</label>
            <Input
              type="text"
              required
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              placeholder="e.g. Marcus Vance"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Team Size *</label>
              <Input
                type="number"
                required
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                placeholder="e.g. 8"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Q1 Budget (₹) *</label>
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
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
