import { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  RotateCw,
  Search,
  Download,
  FileText,
  User,
  CreditCard,
  Settings,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

import { apiFetch } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../components/ui/dropdown-menu';
import { formatDate } from '../../../lib/utils';

// Action type icons and colors
const actionConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  'user.created': { icon: User, color: 'text-success', bg: 'bg-success/10', label: 'User Created' },
  'user.updated': { icon: User, color: 'text-primary', bg: 'bg-primary/10', label: 'User Updated' },
  'user.deleted': { icon: User, color: 'text-destructive', bg: 'bg-destructive/10', label: 'User Deleted' },
  'user.suspended': { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'User Suspended' },
  'user.activated': { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'User Activated' },
  'user.deactivated': { icon: LogOut, color: 'text-muted-foreground', bg: 'bg-muted', label: 'User Deactivated' },
  'user.password_reset': { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', label: 'Password Reset' },
  'user.role_changed': { icon: Settings, color: 'text-primary', bg: 'bg-primary/10', label: 'Role Changed' },
  'staff_user.created': { icon: User, color: 'text-success', bg: 'bg-success/10', label: 'Staff Created' },
  'payment.approved': { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Payment Approved' },
  'payment.rejected': { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Payment Rejected' },
  'payment.submitted': { icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10', label: 'Payment Submitted' },
  'payment.verified': { icon: Shield, color: 'text-success', bg: 'bg-success/10', label: 'Payment Verified' },
  'auth.login': { icon: LogIn, color: 'text-primary', bg: 'bg-primary/10', label: 'Login' },
  'auth.logout': { icon: LogOut, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Logout' },
  'auth.failed': { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Auth Failed' },
  'default': { icon: FileText, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Action' }
};

const getActionConfig = (action: string) => {
  return actionConfig[action] || actionConfig.default;
};

export function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [selectedActor, setSelectedActor] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  // Real-time updates via polling
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadLogs();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<any[]>('/admin/audit-logs?limit=500');
      setLogs(result || []);
      setLastUpdated(new Date());
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const isInDateRange = (timestamp: string, range: string) => {
    if (!timestamp || range === 'all') return true;
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case 'today':
        return date.toDateString() === today.toDateString();
      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return date >= monthAgo;
      }
      default:
        return true;
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Category filter
      if (filter !== 'all') {
        const action = log.action?.toLowerCase() || '';
        if (filter === 'payment' && !action.includes('payment')) return false;
        if (filter === 'user' && !action.includes('user')) return false;
        if (filter === 'auth' && !action.includes('auth')) return false;
      }

      // Actor filter
      if (selectedActor && log.actor?.email !== selectedActor) return false;

      // Date filter
      if (!isInDateRange(log.timestamp, dateFilter)) return false;

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          log.action,
          log.actor?.role,
          log.actor?.email,
          log.targetType,
          log.targetId,
          log.reason,
          log.ipAddress,
          log.userAgent
        ].filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [logs, filter, searchQuery, dateFilter, selectedActor]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const userActions = filteredLogs.filter(l => l.action?.includes('user')).length;
    const paymentActions = filteredLogs.filter(l => l.action?.includes('payment')).length;
    const authActions = filteredLogs.filter(l => l.action?.includes('auth')).length;
    const withIP = filteredLogs.filter(l => l.ipAddress).length;
    return { total, userActions, paymentActions, authActions, withIP };
  }, [filteredLogs]);

  // Get unique actors for filter
  const uniqueActors = useMemo(() => {
    const actors = new Map<string, { email: string; role: string }>();
    logs.forEach(log => {
      if (log.actor?.email) {
        actors.set(log.actor.email, { email: log.actor.email, role: log.actor.role });
      }
    });
    return Array.from(actors.values()).sort((a, b) => a.email.localeCompare(b.email));
  }, [logs]);

  const toggleRowExpansion = (idx: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedRows(newSet);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Actor Role', 'Actor Email', 'Target Type', 'Target ID', 'Reason', 'Details'];
    const rows = filteredLogs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.action,
      log.actor?.role || 'N/A',
      log.actor?.email || 'N/A',
      log.targetType || 'N/A',
      log.targetId || 'N/A',
      log.reason || 'N/A',
      JSON.stringify(log.details || {})
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${rows.length} audit logs`);
  };

  const handleClearAllLogs = async () => {
    try {
      await apiFetch('/admin/audit-logs', { method: 'DELETE' });
      toast.success('Audit logs cleared');
      setShowClearConfirm(false);
      loadLogs();
    } catch {
      toast.error('Failed to clear logs');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Audit Logs
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Track system activities, changes, and security events</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto Refresh Toggle */}
          <Button
            size="sm"
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-1.5"
          >
            <RotateCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>

          {/* View Mode Toggle */}
          <Select value={viewMode} onValueChange={(v: 'table' | 'timeline') => setViewMode(v)}>
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>

          <Button size="sm" variant="outline" onClick={loadLogs} disabled={loading}>
            <RotateCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowClearConfirm(true)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Clear All Logs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Last Updated & Retention Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-muted-foreground">
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Retention: 90 days
          </span>
        </div>
        <span>{filteredLogs.length} of {logs.length} logs shown</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total Logs</p>
                <p className="text-[24px] font-bold text-primary mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-success/20 bg-gradient-to-br from-success/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">User Actions</p>
                <p className="text-[24px] font-bold text-success mt-1">{stats.userActions}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/15 flex items-center justify-center">
                <User className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-warning/20 bg-gradient-to-br from-warning/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payment Events</p>
                <p className="text-[24px] font-bold text-warning mt-1">{stats.paymentActions}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/15 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-muted bg-gradient-to-br from-muted/50 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Auth Events</p>
                <p className="text-[24px] font-bold text-muted-foreground mt-1">{stats.authActions}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <LogIn className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-info/20 bg-gradient-to-br from-info/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">With IP Data</p>
                <p className="text-[24px] font-bold text-info mt-1">{stats.withIP}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/15 flex items-center justify-center">
                <Eye className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs by action, actor, target..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="user">User Management</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>

        {uniqueActors.length > 0 && (
          <Select value={selectedActor || 'all'} onValueChange={(v) => setSelectedActor(v === 'all' ? null : v)}>
            <SelectTrigger className="w-[180px] h-9">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by user..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueActors.map((actor) => (
                <SelectItem key={actor.email} value={actor.email}>
                  {actor.email} ({actor.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[15px] font-medium flex items-center justify-between">
            <span>Activity Log</span>
            <span className="text-[12px] text-muted-foreground font-normal">{filteredLogs.length} entries</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 rounded" />)}</div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No audit logs found matching your filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 100).map((log: any, idx: number) => {
                  const config = getActionConfig(log.action);
                  const Icon = config.icon;
                  const isExpanded = expandedRows.has(idx);

                  return (
                    <>
                      <TableRow key={idx} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="text-[12px] text-muted-foreground whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {formatDate(log.timestamp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-7 w-7 rounded-md ${config.bg} flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <div>
                              <Badge variant="outline" className={`text-[10px] ${config.color} border-current`}>
                                {config.label}
                              </Badge>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{log.action}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-[13px] font-medium">{log.actor?.role || 'System'}</p>
                              {log.actor?.email && (
                                <p className="text-[10px] text-muted-foreground">{log.actor.email}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-[13px]">{log.targetType || 'N/A'}</p>
                          {log.targetId && (
                            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{log.targetId.slice(0, 8)}...</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toggleRowExpansion(idx)}
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={5} className="py-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {log.reason && (
                                <div className="col-span-2">
                                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Reason</p>
                                  <p className="text-[13px]">{log.reason}</p>
                                </div>
                              )}
                              
                              {/* Session & IP Info */}
                              {(log.ipAddress || log.userAgent || log.sessionId) && (
                                <div className="col-span-2 grid grid-cols-3 gap-3">
                                  {log.ipAddress && (
                                    <div>
                                      <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">IP Address</p>
                                      <p className="text-[12px] font-mono">{log.ipAddress}</p>
                                    </div>
                                  )}
                                  {log.sessionId && (
                                    <div>
                                      <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Session ID</p>
                                      <p className="text-[12px] font-mono truncate">{log.sessionId.slice(0, 16)}...</p>
                                    </div>
                                  )}
                                  {log.userAgent && (
                                    <div>
                                      <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Device</p>
                                      <p className="text-[12px] truncate" title={log.userAgent}>
                                        {log.userAgent.includes('Mobile') ? 'Mobile' : 
                                         log.userAgent.includes('Tablet') ? 'Tablet' : 'Desktop'}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="col-span-2">
                                <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Details</p>
                                <pre className="bg-background p-2 rounded text-[11px] overflow-auto max-h-[150px]">
                                  {JSON.stringify(log.details || {}, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && (() => {
                const config = getActionConfig(selectedLog.action);
                const Icon = config.icon;
                return (
                  <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                );
              })()}
              Audit Log Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this system event
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Action</p>
                  <p className="text-[14px] font-semibold">{selectedLog.action}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Timestamp</p>
                  <p className="text-[14px]">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Actor</p>
                  <p className="text-[14px] font-medium">{selectedLog.actor?.role || 'System'}</p>
                  {selectedLog.actor?.email && <p className="text-[12px] text-muted-foreground">{selectedLog.actor.email}</p>}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Target</p>
                  <p className="text-[14px] font-medium">{selectedLog.targetType || 'N/A'}</p>
                  {selectedLog.targetId && <p className="text-[12px] text-muted-foreground font-mono">{selectedLog.targetId}</p>}
                </div>
              </div>

              {selectedLog.reason && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[10px] uppercase text-muted-foreground font-medium mb-1">Reason / Notes</p>
                  <p className="text-[14px]">{selectedLog.reason}</p>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
                  <p className="text-[11px] uppercase text-muted-foreground font-medium">Details (JSON)</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[11px]"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedLog.details || {}, null, 2));
                      toast.success('Copied to clipboard');
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="p-3 text-[11px] overflow-auto max-h-[300px] bg-background">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear Audit Logs</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all audit logs? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleClearAllLogs}>Delete All Logs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
