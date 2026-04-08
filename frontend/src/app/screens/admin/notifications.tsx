import { useState, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  Search,
  Filter,
  Trash2,
  Shield,
  User,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../state/auth-context';
import { apiFetch } from '../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';

// Admin-specific notification types
const notificationConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  // Payment related
  payment_submitted: { icon: CreditCard, color: 'text-info', bg: 'bg-info/10', label: 'Payment Submitted' },
  payment_approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Payment Approved' },
  payment_rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Payment Rejected' },
  payment_verified: { icon: Shield, color: 'text-success', bg: 'bg-success/10', label: 'Payment Verified' },
  payment_flagged: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Payment Flagged' },

  // User management
  user_created: { icon: User, color: 'text-success', bg: 'bg-success/10', label: 'User Created' },
  user_suspended: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'User Suspended' },
  user_activated: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'User Activated' },
  user_deactivated: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'User Deactivated' },
  staff_user_created: { icon: Users, color: 'text-primary', bg: 'bg-primary/10', label: 'Staff Created' },

  // System
  system_alert: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'System Alert' },
  system_maintenance: { icon: Settings, color: 'text-primary', bg: 'bg-primary/10', label: 'Maintenance' },
  audit_alert: { icon: FileText, color: 'text-warning', bg: 'bg-warning/10', label: 'Audit Alert' },

  // Default
  default: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Notification' }
};

const getNotificationConfig = (type: string) => {
  return notificationConfig[type] || notificationConfig.default;
};

const groupNotificationsByDate = (notifications: any[]) => {
  const groups: Record<string, any[]> = { today: [], yesterday: [], thisWeek: [], earlier: [] };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach(n => {
    const date = new Date(n.createdAt || n.time);
    if (date >= today) {
      groups.today.push(n);
    } else if (date >= yesterday) {
      groups.yesterday.push(n);
    } else if (date >= weekAgo) {
      groups.thisWeek.push(n);
    } else {
      groups.earlier.push(n);
    }
  });

  return groups;
};

export function AdminNotificationsPage() {
  const { notifications, markAllRead, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter for admin-relevant notifications
  const adminNotifications = useMemo(() => {
    const adminTypes = [
      'payment_submitted', 'payment_approved', 'payment_rejected', 'payment_verified', 'payment_flagged',
      'user_created', 'user_suspended', 'user_activated', 'user_deactivated', 'staff_user_created',
      'system_alert', 'system_maintenance', 'audit_alert'
    ];
    return notifications.filter(n => adminTypes.includes(n.type) || !n.type);
  }, [notifications]);

  const unreadCount = adminNotifications.filter(n => !n.read).length;
  const readCount = adminNotifications.filter(n => n.read).length;

  // Filter notifications based on tab, type, and search
  const filteredNotifications = useMemo(() => {
    return adminNotifications.filter(n => {
      // Tab filter
      if (activeTab === 'unread' && n.read) return false;
      if (activeTab === 'read' && !n.read) return false;

      // Type filter
      if (typeFilter !== 'all') {
        if (typeFilter === 'payment' && !n.type?.includes('payment')) return false;
        if (typeFilter === 'user' && !n.type?.includes('user')) return false;
        if (typeFilter === 'system' && !n.type?.includes('system') && !n.type?.includes('audit')) return false;
        if (typeFilter === 'action_required' && n.read) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = `${n.title} ${n.description}`.toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      return true;
    });
  }, [adminNotifications, activeTab, typeFilter, searchQuery]);

  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  const handleMarkOneRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      await refreshNotifications();
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
      await refreshNotifications();
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all notifications? This cannot be undone.')) return;
    try {
      await apiFetch('/notifications', { method: 'DELETE' });
      await refreshNotifications();
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  // Stats for admin notifications
  const stats = useMemo(() => {
    const pendingPayments = adminNotifications.filter(n => n.type === 'payment_submitted' && !n.read).length;
    const userAlerts = adminNotifications.filter(n => n.type?.includes('user') && !n.read).length;
    const systemAlerts = adminNotifications.filter(n => (n.type?.includes('system') || n.type?.includes('audit')) && !n.read).length;
    return { pendingPayments, userAlerts, systemAlerts, total: adminNotifications.length };
  }, [adminNotifications]);

  const renderNotificationGroup = (title: string, notifications: any[]) => {
    if (notifications.length === 0) return null;

    return (
      <div key={title} className="space-y-2">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground px-1 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
          {title} ({notifications.length})
        </h3>
        <div className="space-y-2">
          {notifications.map((n) => {
            const config = getNotificationConfig(n.type);
            const Icon = config.icon;
            const needsAction = !n.read && (n.type === 'payment_submitted' || n.type === 'user_suspended' || n.type === 'system_alert');

            return (
              <Card
                key={n.id}
                className={`transition-all hover:shadow-sm group ${
                  needsAction
                    ? 'border-warning/40 bg-warning/[0.03]'
                    : !n.read
                    ? 'border-primary/30 bg-primary/[0.03]'
                    : 'border-border/50'
                }`}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-[13px] ${!n.read ? 'font-semibold' : 'font-medium'}`}>
                              {n.title}
                            </p>
                            {needsAction && (
                              <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-warning text-warning-foreground">
                                Action Required
                              </Badge>
                            )}
                            {!n.read && !needsAction && (
                              <Badge variant="default" className="text-[10px] h-5 px-1.5 bg-primary">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
                            {n.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {n.time}
                            </span>
                            <Badge variant="outline" className={`text-[10px] h-5 ${config.color} border-current`}>
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkOneRead(n.id)}
                              title="Mark as read"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(n.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const hasNotifications = filteredNotifications.length > 0;
  const hasAnyNotifications = adminNotifications.length > 0;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Admin Notifications
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {stats.pendingPayments > 0 && (
              <span className="text-warning font-medium">{stats.pendingPayments} pending payments</span>
            )}
            {stats.pendingPayments === 0 && unreadCount === 0 && 'All caught up!'}
            {unreadCount > 0 && stats.pendingPayments === 0 && (
              <span className="text-primary font-medium">{unreadCount} unread</span>
            )}
            {readCount > 0 && ` • ${readCount} read`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 h-9" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" /> Mark all read
            </Button>
          )}
          {hasAnyNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-9 text-destructive hover:text-destructive"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
                <p className="text-[24px] font-bold text-primary mt-1">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-warning/20 bg-gradient-to-br from-warning/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pending Payments</p>
                <p className="text-[24px] font-bold text-warning mt-1">{stats.pendingPayments}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/15 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-info/20 bg-gradient-to-br from-info/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">User Alerts</p>
                <p className="text-[24px] font-bold text-info mt-1">{stats.userAlerts}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/15 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-background">
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System Alerts</p>
                <p className="text-[24px] font-bold text-destructive mt-1">{stats.systemAlerts}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/15 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="all" className="gap-2 text-[13px]">
              All
              <Badge variant="secondary" className="text-[10px] h-5">{adminNotifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2 text-[13px]">
              Unread
              {unreadCount > 0 && (
                <Badge variant="default" className="text-[10px] h-5 bg-primary">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read" className="gap-2 text-[13px]">
              Read
              {readCount > 0 && (
                <Badge variant="secondary" className="text-[10px] h-5">{readCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="user">User Management</SelectItem>
              <SelectItem value="system">System & Audit</SelectItem>
              <SelectItem value="action_required">Action Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      {!hasAnyNotifications ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-[15px] font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-[13px] text-muted-foreground/70 mt-1">
              Admin notifications will appear here
            </p>
          </CardContent>
        </Card>
      ) : !hasNotifications ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-[15px] font-medium text-muted-foreground">No matching notifications</p>
            <p className="text-[13px] text-muted-foreground/70 mt-1">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setActiveTab('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {renderNotificationGroup('Today', groupedNotifications.today)}
          {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
          {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
          {renderNotificationGroup('Earlier', groupedNotifications.earlier)}
        </div>
      )}
    </div>
  );
}
