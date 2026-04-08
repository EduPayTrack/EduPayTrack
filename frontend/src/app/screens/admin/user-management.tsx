import { useState, useEffect, useMemo } from 'react';
import { 
  UserPlus, 
  KeyRound, 
  Pencil, 
  Trash2, 
  Search, 
  Power, 
  PowerOff,
  Download,
  Clock,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

import { apiFetch } from '../../lib/api';
import { useAuth } from '../../state/auth-context';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../../../components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../../../components/ui/dialog';
import { formatDate } from '../../lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ACCOUNTS' | 'STUDENT';
  status: 'ACTIVE' | 'DEACTIVATED' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  ACCOUNTS: 'Accountant',
  STUDENT: 'Student',
};

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  ACTIVE: { color: 'bg-success/10 text-success border-success/20', label: 'Active', icon: CheckCircle },
  DEACTIVATED: { color: 'bg-muted text-muted-foreground border-border', label: 'Deactivated', icon: PowerOff },
  SUSPENDED: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Suspended', icon: UserX },
};

export function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Create/Edit modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'ACCOUNTS' | 'STUDENT'>('STUDENT');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<any[]>('/admin/users');
      setUsers(result || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || 
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Staff users for export (non-students)
  const staffUsers = useMemo(() => {
    return users.filter(u => u.role === 'ADMIN' || u.role === 'ACCOUNTS');
  }, [users]);

  const handleCreate = async () => {
    if (!name || !email || !password) {
      toast.error('Please fill required fields');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, role, password }),
      });
      toast.success('User created');
      setShowCreateModal(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingUser || !email) {
      toast.error('Please fill required fields');
      return;
    }
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ email, role }),
      });
      toast.success('User updated');
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (id === user?.id) {
      toast.error('You cannot deactivate yourself');
      return;
    }
    try {
      await apiFetch(`/admin/users/${id}/deactivate`, { method: 'POST' });
      toast.success('User deactivated');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Deactivate failed');
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await apiFetch(`/admin/users/${id}/reactivate`, { method: 'POST' });
      toast.success('User reactivated');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Reactivate failed');
    }
  };

  const handleSuspend = async (id: string) => {
    if (id === user?.id) {
      toast.error('You cannot suspend yourself');
      return;
    }
    if (!window.confirm('Are you sure you want to suspend this user? They will be temporarily locked out.')) return;
    try {
      await apiFetch(`/admin/users/${id}/suspend`, { method: 'POST' });
      toast.success('User suspended');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Suspend failed');
    }
  };

  const handleUnsuspend = async (id: string) => {
    try {
      await apiFetch(`/admin/users/${id}/activate`, { method: 'POST' });
      toast.success('User unsuspended');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Unsuspend failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (id === user?.id) {
       toast.error('You cannot delete yourself');
       return;
    }
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
      toast.success('User deleted');
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPass = prompt('Enter new password:');
    if (!newPass) return;
    if (newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await apiFetch(`/admin/users/${id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ password: newPass }),
      });
      toast.success('Password reset successfully');
    } catch (err: any) {
      toast.error(err.message || 'Reset failed');
    }
  };

  const handleExportStaff = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login', 'Created At'];
    const rows = staffUsers.map(u => [
      u.name,
      u.email,
      roleLabels[u.role] || u.role,
      u.status,
      u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never',
      u.createdAt ? formatDate(u.createdAt) : '—',
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${staffUsers.length} staff users`);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEmail(u.email);
    setRole(u.role);
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('ACCOUNTS');
    setPassword('');
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.ACTIVE;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`text-[10px] h-5 gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getActivityText = (lastLogin?: string) => {
    if (!lastLogin) return 'Never logged in';
    return `Last login: ${formatDate(lastLogin)}`;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1200px] animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">User Management</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage system access and roles</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleExportStaff}>
              <Download className="h-4 w-4" /> Export Staff
            </Button>
            <Button size="sm" className="h-9 gap-1.5" onClick={openCreateModal}>
              <UserPlus className="h-4 w-4" /> Add User
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 h-9" 
            value={search} 
            onChange={(e: any) => setSearch(e.target.value)} 
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="ADMIN">Administrator</SelectItem>
            <SelectItem value="ACCOUNTS">Accountant</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 rounded" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium text-[13px]">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-medium">
                          {roleLabels[u.role] || u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(u.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {getActivityText(u.lastLoginAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => openEditModal(u)}>
                                <Pencil className="h-4 w-4 mr-2" /> Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(u.id)}>
                                <KeyRound className="h-4 w-4 mr-2" /> Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {u.status === 'ACTIVE' && (
                                <DropdownMenuItem 
                                  onClick={() => handleDeactivate(u.id)}
                                  className="text-muted-foreground"
                                >
                                  <PowerOff className="h-4 w-4 mr-2" /> Deactivate
                                </DropdownMenuItem>
                              )}
                              {u.status === 'DEACTIVATED' && (
                                <DropdownMenuItem 
                                  onClick={() => handleReactivate(u.id)}
                                  className="text-success"
                                >
                                  <Power className="h-4 w-4 mr-2" /> Reactivate
                                </DropdownMenuItem>
                              )}
                              {u.status !== 'SUSPENDED' ? (
                                <DropdownMenuItem 
                                  onClick={() => handleSuspend(u.id)}
                                  className="text-warning"
                                >
                                  <UserX className="h-4 w-4 mr-2" /> Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleUnsuspend(u.id)}
                                  className="text-success"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" /> Unsuspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(u.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
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
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff User</DialogTitle>
            <DialogDescription>
              Create a new staff account (Admin or Accountant only).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Full Name *</label>
              <Input 
                value={name} 
                onChange={(e: any) => setName(e.target.value)} 
                placeholder="John Doe" 
                className="h-10" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Email Address *</label>
              <Input 
                value={email} 
                onChange={(e: any) => setEmail(e.target.value)} 
                type="email" 
                placeholder="john@example.com" 
                className="h-10" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Role *</label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="ACCOUNTS">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Password *</label>
              <Input 
                value={password} 
                onChange={(e: any) => setPassword(e.target.value)} 
                type="password" 
                placeholder="Minimum 8 characters" 
                className="h-10" 
              />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-[12px] text-muted-foreground">
                <strong>Note:</strong> Students can create their own accounts from the login page. This form is for staff only.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? 'Creating...' : 'Create Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Change user email or role. Name can only be changed by the user themselves.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Email Address *</label>
              <Input 
                value={email} 
                onChange={(e: any) => setEmail(e.target.value)} 
                type="email" 
                placeholder="john@example.com" 
                className="h-10" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Role *</label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="ACCOUNTS">Accountant</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-[12px] text-muted-foreground">
                <strong>Note:</strong> Changing the role will immediately update the user's permissions. 
                The user may need to log out and back in for all changes to take effect.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
