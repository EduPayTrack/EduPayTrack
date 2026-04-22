import { useState, useMemo, useCallback } from 'react';
import {
  Bell,
  Search,
  Filter,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../state/auth-context';
import { clearAllNotifications, deleteNotification, markNotificationRead } from '../../lib/notifications-api';
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
import { useNotificationFilters } from '../../lib/notification-filters';
import { NotificationConfirmDialogs } from '../../components/notification-confirm-dialogs';
import { NotificationGroupList } from '../../components/notification-group-list';
import { NotificationPageHeader } from '../../components/notification-page-header';
import { NotificationStatsCards } from '../../components/notification-stats-cards';

// Student-specific notification types
const notificationConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  // Fee related
  fee_assigned: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10', label: 'Fee Assigned' },
  fee_updated: { icon: FileText, color: 'text-info', bg: 'bg-info/10', label: 'Fee Updated' },
  fee_reminder: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Fee Reminder' },

  // Payment related
  payment_submitted: { icon: CreditCard, color: 'text-info', bg: 'bg-info/10', label: 'Payment Sent' },
  payment_approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Payment Approved' },
  payment_rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Payment Rejected' },
  payment_received: { icon: DollarSign, color: 'text-success', bg: 'bg-success/10', label: 'Payment Received' },

  // Balance
  balance_reminder: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Balance Due' },
  balance_cleared: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Balance Cleared' },

  // Academic
  enrollment_confirmed: { icon: GraduationCap, color: 'text-success', bg: 'bg-success/10', label: 'Enrollment Confirmed' },
  semester_started: { icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10', label: 'Semester Started' },

  // System
  system: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', label: 'System' },
  default: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Notification' }
};

const getNotificationConfig = (type: string) => {
  return notificationConfig[type] || notificationConfig.default;
};

export function StudentNotificationsPage() {
  const { notifications, markAllRead, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Filter for student-relevant notifications
  const studentNotifications = useMemo(() => {
    const studentTypes = [
      'fee_assigned', 'fee_updated', 'fee_reminder',
      'payment_submitted', 'payment_approved', 'payment_rejected', 'payment_received',
      'balance_reminder', 'balance_cleared',
      'enrollment_confirmed', 'semester_started', 'system'
    ];
    return notifications.filter(n => studentTypes.includes(n.type) || !n.type);
  }, [notifications]);

  const matchesTypeFilter = useCallback((notification: any, currentTypeFilter: string) => {
    if (currentTypeFilter === 'all') return true;
    if (currentTypeFilter === 'fee') return !!notification.type?.includes('fee');
    if (currentTypeFilter === 'payment') return !!notification.type?.includes('payment');
    if (currentTypeFilter === 'balance') return !!notification.type?.includes('balance');
    return true;
  }, []);

  const {
    unreadCount,
    readCount,
    groupedNotifications,
    hasNotifications,
    hasAnyNotifications,
  } = useNotificationFilters({
    notifications: studentNotifications,
    activeTab,
    typeFilter,
    searchQuery,
    matchesTypeFilter,
  });

  const handleMarkOneRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      await refreshNotifications();
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      await refreshNotifications();
      setDeletingId(null);
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      await refreshNotifications();
      setShowClearAllConfirm(false);
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  // Stats for student notifications
  const stats = useMemo(() => {
    const pendingFees = studentNotifications.filter(n => n.type === 'fee_assigned' && !n.read).length;
    const paymentUpdates = studentNotifications.filter(n => n.type?.includes('payment') && !n.read).length;
    const balanceAlerts = studentNotifications.filter(n => n.type?.includes('balance') && !n.read).length;
    const total = studentNotifications.length;
    return { pendingFees, paymentUpdates, balanceAlerts, total };
  }, [studentNotifications]);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      <NotificationPageHeader
        title="My Notifications"
        titleIcon={<Bell className="h-6 w-6 text-primary" />}
        subtitle={
          <>
            {stats.pendingFees > 0 && (
              <span className="text-primary font-medium">{stats.pendingFees} new fees</span>
            )}
            {stats.balanceAlerts > 0 && (
              <span className="text-destructive font-medium">{stats.balanceAlerts} balance alerts</span>
            )}
            {stats.pendingFees === 0 && stats.balanceAlerts === 0 && unreadCount === 0 && 'All caught up!'}
            {unreadCount > 0 && stats.pendingFees === 0 && stats.balanceAlerts === 0 && (
              <span className="text-primary font-medium">{unreadCount} unread</span>
            )}
            {readCount > 0 && ` • ${readCount} read`}
          </>
        }
        unreadCount={unreadCount}
        hasAnyNotifications={hasAnyNotifications}
        onMarkAllRead={markAllRead}
        onClearAll={() => setShowClearAllConfirm(true)}
      />

      <NotificationStatsCards
        columnsClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
        stats={[
          {
            label: 'Total',
            value: stats.total,
            valueClassName: 'text-primary',
            cardClassName: 'overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background',
            iconContainerClassName: 'bg-primary/15',
            icon: <Bell className="h-5 w-5 text-primary" />,
          },
          {
            label: 'Pending Fees',
            value: stats.pendingFees,
            valueClassName: 'text-warning',
            cardClassName: 'overflow-hidden border-warning/20 bg-gradient-to-br from-warning/5 via-background to-background',
            iconContainerClassName: 'bg-warning/15',
            icon: <FileText className="h-5 w-5 text-warning" />,
          },
          {
            label: 'Payment Updates',
            value: stats.paymentUpdates,
            valueClassName: 'text-destructive',
            cardClassName: 'overflow-hidden border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-background',
            iconContainerClassName: 'bg-destructive/15',
            icon: <CreditCard className="h-5 w-5 text-destructive" />,
          },
        ]}
      />

      {/* Tabs & Filters */}
      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="all" className="gap-2 text-[13px]">
              All
              <Badge variant="secondary" className="text-[10px] h-5">{studentNotifications.length}</Badge>
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
            <SelectTrigger className="w-[160px] h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fee">Fees</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
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
              You&apos;ll be notified about fees, payments, and updates
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
          <NotificationGroupList
            groupedNotifications={groupedNotifications}
            getNotificationConfig={getNotificationConfig}
            onMarkOneRead={handleMarkOneRead}
            onDelete={(id) => setDeletingId(id)}
            getCardClassName={(notification: any) => {
              const isImportant =
                !notification.read &&
                (notification.type === 'payment_rejected' ||
                  notification.type === 'balance_reminder' ||
                  notification.type === 'fee_reminder');
              if (isImportant) return 'border-destructive/30 bg-destructive/[0.02]';
              return !notification.read ? 'border-primary/30 bg-primary/[0.03]' : 'border-border/50';
            }}
            renderTopBadges={(notification: any) => {
              const isImportant =
                !notification.read &&
                (notification.type === 'payment_rejected' ||
                  notification.type === 'balance_reminder' ||
                  notification.type === 'fee_reminder');
              if (isImportant) {
                return (
                  <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-destructive">
                    Action Needed
                  </Badge>
                );
              }
              if (!notification.read) {
                return (
                  <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-primary">
                    New
                  </Badge>
                );
              }
              return null;
            }}
          />
        </div>
      )}

      <NotificationConfirmDialogs
        deletingId={deletingId}
        setDeletingId={setDeletingId}
        showClearAllConfirm={showClearAllConfirm}
        setShowClearAllConfirm={setShowClearAllConfirm}
        onDelete={handleDelete}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
                                                                  