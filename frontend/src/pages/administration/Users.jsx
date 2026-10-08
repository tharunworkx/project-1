import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { supabase } from '../../services/supabaseStorage';
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
  Clock,
  Check,
  X,
  ShieldCheck,
  UserPlus,
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

const initialUsers = [];

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
  if (r.includes('finance manager') || r.includes('cfo')) {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 font-medium">
        Finance Manager / CFO
      </Badge>
    );
  }
  if (r.includes('finance exec') || r === 'finance admin' || r === 'finance') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 font-medium">
        Finance Executive
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
  if (status === 'Pending Approval') {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 font-medium flex items-center gap-1 w-fit">
        <Clock className="size-3" />
        Pending Approval
      </Badge>
    );
  }
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
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'active' | 'pending'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    department: 'Engineering',
  });

  const loadUsers = async () => {
    let supaUsersList = [];
    try {
      const { data: supaUsers, error: supaErr } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: false });
      if (!supaErr && Array.isArray(supaUsers)) {
        supaUsersList = supaUsers;
      }
    } catch (supaErr) {
      console.warn('Could not fetch users directly from Supabase:', supaErr);
    }

    let backendUsersList = [];
    try {
      const dbUsers = await userService.getUsers();
      if (Array.isArray(dbUsers)) {
        backendUsersList = dbUsers;
      }
    } catch (err) {
      // Backend optional / offline
    }

    // Authoritative merge: Supabase users take priority for registrations & approvals
    const userMap = new Map();
    for (const u of backendUsersList) {
      if (u.email) userMap.set(u.email.toLowerCase().trim(), u);
    }
    for (const u of supaUsersList) {
      if (u.email) userMap.set(u.email.toLowerCase().trim(), u);
    }
    const finalUsers = Array.from(userMap.values());

    const mapped = finalUsers.map((u) => {
      const fullName = `${u.firstName || u.first_name || ''} ${u.lastName || u.last_name || ''}`.trim() || u.name || u.email.split('@')[0];
      const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
      const isPending = typeof u.role === 'string' && u.role.startsWith('PENDING:');
      const cleanRole = isPending ? u.role.replace('PENDING:', '').trim() : (u.role || 'Employee');

      return {
        id: `usr_${u.id}`,
        rawId: u.id,
        name: fullName,
        email: u.email,
        avatarFallback: initials,
        role: cleanRole,
        rawRole: u.role,
        isPending,
        department: u.department || 'General',
        status: isPending ? 'Pending Approval' : 'Active',
        lastActive: isPending ? 'Awaiting Approval' : 'Active',
        createdAt: u.created_at || u.createdAt,
      };
    });

    setUsers(mapped);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const pendingUsers = users.filter((u) => u.isPending);
  const activeUsers = users.filter((u) => !u.isPending);

  const tabFilteredUsers = users.filter((u) => {
    if (tabFilter === 'pending') return u.isPending;
    if (tabFilter === 'active') return !u.isPending;
    return true;
  });

  const filtered = tabFilteredUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.department.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveUser = async (userToApprove) => {
    try {
      setActionLoadingId(userToApprove.id);
      const cleanRole = userToApprove.role || 'Employee';
      const now = new Date().toISOString();

      let error = null;
      if (userToApprove.rawId) {
        const res = await supabase
          .from('users')
          .update({ role: cleanRole, updated_at: now })
          .eq('id', userToApprove.rawId);
        error = res.error;
      } else {
        const res = await supabase
          .from('users')
          .update({ role: cleanRole, updated_at: now })
          .eq('email', userToApprove.email);
        error = res.error;
      }

      if (error) {
        console.error('Supabase approve error:', error);
        alert('Could not approve user in Supabase: ' + error.message);
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userToApprove.id
            ? { ...u, isPending: false, rawRole: cleanRole, status: 'Active', lastActive: 'Just now' }
            : u
        )
      );

      setNotification(`Registration approved for ${userToApprove.email}! User can now log in as ${cleanRole}.`);
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      console.error('Error approving user:', err);
      alert('Error approving user registration.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectUser = async (userToReject) => {
    if (!window.confirm(`Are you sure you want to decline registration for ${userToReject.email}? This will delete the request and prevent login.`)) {
      return;
    }
    try {
      setActionLoadingId(userToReject.id);
      let error = null;
      if (userToReject.rawId) {
        const res = await supabase.from('users').delete().eq('id', userToReject.rawId);
        error = res.error;
      } else {
        const res = await supabase.from('users').delete().eq('email', userToReject.email);
        error = res.error;
      }

      if (error) {
        console.error('Supabase reject error:', error);
        alert('Could not reject user: ' + error.message);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== userToReject.id));
      setNotification(`Registration request for ${userToReject.email} has been declined and deleted.`);
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      console.error('Error rejecting user:', err);
      alert('Error rejecting user registration.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const created = await userService.createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
      });
      const fullName = `${created.firstName || ''} ${created.lastName || ''}`.trim() || created.name || formData.name;
      const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

      const newUser = {
        id: `usr_${created.id || Date.now()}`,
        rawId: created.id,
        name: fullName,
        email: created.email || formData.email,
        avatarFallback: initials,
        role: created.role || formData.role,
        rawRole: created.role || formData.role,
        isPending: false,
        department: created.department || formData.department,
        status: 'Active',
        lastActive: 'Just now',
      };
      setUsers([newUser, ...users]);
    } catch (err) {
      console.warn('Backend user creation error, adding locally & to Supabase:', err);
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
        rawRole: formData.role,
        isPending: false,
        department: formData.department,
        status: 'Active',
        lastActive: 'Just now',
      };
      setUsers([newUser, ...users]);
    }
    setModalOpen(false);
    setFormData({ name: '', email: '', role: 'Employee', department: 'Engineering' });
    setNotification(`User successfully added: ${formData.email}`);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleDeactivate = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${userToDelete.email} from Supabase? They will immediately be unable to log in.`)) {
      return;
    }
    try {
      if (userToDelete.rawId) {
        await supabase.from('users').delete().eq('id', userToDelete.rawId);
      } else {
        await supabase.from('users').delete().eq('email', userToDelete.email);
      }
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id && u.email !== userToDelete.email));
      setNotification(`User permanently deleted from Supabase: ${userToDelete.email}`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error('Failed to delete user from Supabase:', err);
      alert('Error deleting user from Supabase.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2 p-3 text-xs font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Pending Account Registration Requests Banner Card */}
      {pendingUsers.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-amber-500/20 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="size-4 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>Pending Account Registration Requests</span>
                  <Badge className="bg-amber-500 text-white dark:bg-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingUsers.length} Action Needed
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  The following users signed up and require administrator approval before they can log in.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-amber-500/15">
            {pendingUsers.map((pUser) => (
              <div
                key={pUser.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 hover:bg-amber-500/5 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-9 rounded-full border border-amber-500/30 shrink-0">
                    <AvatarFallback className="bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-xs">
                      {pUser.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">{pUser.name}</span>
                      <RoleBadge role={pUser.role} />
                      <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/80">
                        {pUser.department}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground block truncate">{pUser.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    disabled={actionLoadingId === pUser.id}
                    onClick={() => handleApproveUser(pUser)}
                    className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                  >
                    <Check className="size-3.5 stroke-[2.5]" />
                    <span>{actionLoadingId === pUser.id ? 'Approving...' : 'Approve User'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionLoadingId === pUser.id}
                    onClick={() => handleRejectUser(pUser)}
                    className="h-8 gap-1.5 text-xs border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <X className="size-3.5 stroke-[2.5]" />
                    <span>Decline</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Datatable Card */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              User Management
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Manage staff credentials, assigned roles, and departmental permissions
            </CardDescription>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3">
              <button
                type="button"
                onClick={() => setTabFilter('all')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                  tabFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                All Users ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter('active')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                  tabFilter === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Active ({activeUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter('pending')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  tabFilter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <span>Pending Approvals</span>
                {pendingUsers.length > 0 && (
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 rounded-full font-bold">
                    {pendingUsers.length}
                  </Badge>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter users..."
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
                <span>Invite Member</span>
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
                <TableHead className="pl-6">EMPLOYEE</TableHead>
                <TableHead>ROLE</TableHead>
                <TableHead>DEPARTMENT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>LAST ACTIVE</TableHead>
                <TableHead className="w-24 pr-6 text-right">ACTIONS</TableHead>
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
                      {user.isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            disabled={actionLoadingId === user.id}
                            onClick={() => handleApproveUser(user)}
                            className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-2xs cursor-pointer gap-1"
                            title="Approve user registration"
                          >
                            <Check className="size-3 stroke-[2.5]" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actionLoadingId === user.id}
                            onClick={() => handleRejectUser(user)}
                            className="size-7 text-rose-600 hover:bg-rose-500/10 rounded-md cursor-pointer"
                            title="Decline registration request"
                          >
                            <X className="size-3.5 stroke-[2.5]" />
                          </Button>
                        </div>
                      ) : (
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
                              className="cursor-pointer text-amber-600 focus:text-amber-600 flex items-center gap-2"
                              onClick={() => handleDeactivate(user.id)}
                            >
                              <UserX className="size-4" />
                              <span>{user.status === 'Active' ? 'Deactivate User' : 'Reactivate User'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-rose-600 focus:text-rose-600 flex items-center gap-2 font-medium"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="size-4" />
                              <span>Delete from Supabase</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Datatable Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Showing 1 to {filtered.length} of {tabFilteredUsers.length} users
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
                  { value: "Finance Executive", label: "Finance Executive" },
                  { value: "Finance Manager / CFO", label: "Finance Manager / CFO" },
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
