import React, { useState } from 'react';
import {
  Plus,
  Search,
  UserCheck,
  Shield,
  Mail,
  Edit2,
  Trash2,
  Download,
  EllipsisVertical,
  KeyRound,
  UserX,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
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
import { CustomSelect } from "@/components/ui/select";
import Modal from '../../components/common/Modal';

const initialUsers = [
  {
    id: 'usr_001',
    name: 'Arun Kumar',
    email: 'arun.kumar@company.com',
    avatarFallback: 'AK',
    role: 'Admin',
    department: 'Executive Office',
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'usr_002',
    name: 'Priya Sharma',
    email: 'priya.s@company.com',
    avatarFallback: 'PS',
    role: 'Manager',
    department: 'Marketing',
    status: 'Active',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr_003',
    name: 'Rahul Sundaram',
    email: 'rahul.s@company.com',
    avatarFallback: 'RS',
    role: 'Employee',
    department: 'Engineering',
    status: 'Active',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr_004',
    name: 'Karthik Mohan',
    email: 'karthik.m@company.com',
    avatarFallback: 'KM',
    role: 'Finance Admin',
    department: 'Finance & Accounts',
    status: 'Active',
    lastActive: 'Yesterday',
  },
  {
    id: 'usr_005',
    name: 'Divya Ramesh',
    email: 'divya.r@company.com',
    avatarFallback: 'DR',
    role: 'Manager',
    department: 'Product & Design',
    status: 'Active',
    lastActive: '2 days ago',
  },
  {
    id: 'usr_006',
    name: 'Alex Morgan',
    email: 'alex.m@company.com',
    avatarFallback: 'AM',
    role: 'Employee',
    department: 'Operations',
    status: 'Active',
    lastActive: '03 Oct 2026',
  },
  {
    id: 'usr_007',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    avatarFallback: 'SJ',
    role: 'Employee',
    department: 'Engineering',
    status: 'Inactive',
    lastActive: '18 Sep 2026',
  },
];

function RoleBadge({ role }) {
  const r = (role || '').toLowerCase();
  if (r === 'admin') {
    return (
      <Badge className="bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 font-medium">
        Admin
      </Badge>
    );
  }
  if (r === 'manager') {
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium">
        Manager
      </Badge>
    );
  }
  if (r === 'finance admin') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium">
        Finance Admin
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="font-medium text-muted-foreground border-border/80">
      {role || 'Employee'}
    </Badge>
  );
}

function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-medium">
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="font-medium text-muted-foreground">
      Inactive
    </Badge>
  );
}

export const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'Engineering',
  });

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = (e) => {
    e.preventDefault();
    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      avatarFallback: initials,
      role: formData.role,
      department: formData.department,
      status: 'Active',
      lastActive: 'Just now',
    };
    setUsers([newUser, ...users]);
    setModalOpen(false);
    setFormData({ name: '', email: '', role: 'Employee', department: 'Engineering' });
    setNotification(`Invitation successfully sent to ${formData.email}`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeactivate = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
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
              User Management
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Manage staff credentials, assigned roles, and departmental permissions
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter users..."
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
              <span>Invite Member</span>
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
                <TableHead className="pl-6">EMPLOYEE</TableHead>
                <TableHead>ROLE</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>LAST ACTIVE</TableHead>
                <TableHead className="w-12 pr-6 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8.5 rounded-full border border-border/60">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {user.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-foreground">{user.name}</span>
                          <span className="text-[11px] text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.department}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {user.lastActive}
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
                            <span>Edit Role & Access</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                            <KeyRound className="size-4" />
                            <span>Reset Credentials</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                            onClick={() => handleDeactivate(user.id)}
                          >
                            <UserX className="size-4" />
                            <span>{user.status === 'Active' ? 'Deactivate User' : 'Reactivate User'}</span>
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
              Showing 1 to {filtered.length} of {users.length} users
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

      {/* Invite Member Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Full Name *</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rachel Adams"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Work Email *</label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rachel@company.com"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Role</label>
              <CustomSelect
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                triggerClassName="h-9 rounded-md text-xs"
                options={[
                  { value: "Employee", label: "Employee" },
                  { value: "Manager", label: "Manager" },
                  { value: "Finance Admin", label: "Finance Admin" },
                  { value: "Admin", label: "Admin" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Department</label>
              <CustomSelect
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                triggerClassName="h-9 rounded-md text-xs"
                options={[
                  { value: "Engineering", label: "Engineering" },
                  { value: "Marketing", label: "Marketing" },
                  { value: "Sales", label: "Sales" },
                  { value: "Product & Design", label: "Product & Design" },
                  { value: "Finance & Accounts", label: "Finance & Accounts" },
                  { value: "Operations", label: "Operations" },
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
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
