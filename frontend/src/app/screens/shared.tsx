import { useState, useCallback } from 'react';
import { Bell, CheckCheck, Settings as SettingsIcon, User, Lock, Palette, Loader2, AlertTriangle, XCircle, FileText, Clock, Search, Filter, Trash2, Mail, Smartphone, Eye, HelpCircle, MessageCircle, Globe, LogOut, Laptop, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

import { useAuth } from '../state/auth-context';
import { apiFetch } from '../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useNotificationFilters } from '../lib/notification-filters';
import { NotificationConfirmDialogs } from '../components/notification-confirm-dialogs';

/* ===== NOTIFICATIONS ===== */

const notificationConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  fee_assigned: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10', label: 'Fee Assigned' },
  payment_submitted: { icon: CheckCheck, color: 'text-info', bg: 'bg-info/10', label: 'Payment Submitted' },
  payment_approved: { icon: CheckCheck, color: 'text-success', bg: 'bg-success/10', label: 'Payment Approved' },
  payment_rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Payment Rejected' },
  balance_reminder: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Balance Reminder' },
  system: { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted', label: 'System' },
};

const getNotificationConfig = (type: string) => {
  return notificationConfig[type] || notificationConfig.system;
};

export function NotificationsPage() {
  const { notifications, markAllRead, refreshNotifications } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const matchesTypeFilter = useCallback((notification: any, currentTypeFilter: string) => {
    if (currentTypeFilter === 'all') return true;
    return notification.type === currentTypeFilter;
  }, []);

  const {
    unreadCount,
    readCount,
    groupedNotifications,
    hasNotifications,
    hasAnyNotifications,
  } = useNotificationFilters({
    notifications,
    activeTab,
    typeFilter,
    searchQuery,
    matchesTypeFilter,
  });

  const handleMarkOneRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      await refreshNotifications();
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
      await refreshNotifications();
      setDeletingId(null);
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    try {
      await apiFetch('/notifications', { method: 'DELETE' });
      await refreshNotifications();
      setShowClearAllConfirm(false);
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

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

            return (
              <Card
                key={n.id}
                className={`transition-all hover:shadow-sm group ${
                  !n.read ? 'border-primary/30 bg-primary/[0.03]' : 'border-border/50'
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
                          <div className="flex items-center gap-2">
                            <p className={`text-[13px] ${!n.read ? 'font-semibold' : 'font-medium'}`}>
                              {n.title}
                            </p>
                            {!n.read && (
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
                            onClick={() => setDeletingId(n.id)}
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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[900px] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notifications
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {unreadCount > 0 ? (
              <span className="text-primary font-medium">{unreadCount} unread</span>
            ) : (
              'All caught up!'
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
              onClick={() => setShowClearAllConfirm(true)}
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
            <TabsTrigger value="all" className="gap-2 text-[13px]">
              All
              <Badge variant="secondary" className="text-[10px] h-5">{notifications.length}</Badge>
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
              <SelectItem value="payment_approved">Payment Approved</SelectItem>
              <SelectItem value="payment_rejected">Payment Rejected</SelectItem>
              <SelectItem value="payment_submitted">Payment Submitted</SelectItem>
              <SelectItem value="fee_assigned">Fee Assigned</SelectItem>
              <SelectItem value="balance_reminder">Balance Reminder</SelectItem>
              <SelectItem value="system">System</SelectItem>
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
              When you get notifications, they&apos;ll appear here
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
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
          {renderNotificationGroup('Today', groupedNotifications.today)}
          {renderNotificationGroup('Yesterday', groupedNotifications.yesterday)}
          {renderNotificationGroup('This Week', groupedNotifications.thisWeek)}
          {renderNotificationGroup('Earlier', groupedNotifications.earlier)}
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

/* ===== SETTINGS ===== */

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification preferences state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Accessibility state
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Fill in both current and new password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiFetch('/auth/me', { method: 'DELETE' });
      toast.success('Account deleted successfully');
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
    }
  };

  const saveNotificationPrefs = () => {
    toast.success('Notification preferences saved');
  };

  const saveAccessibilityPrefs = () => {
    toast.success('Accessibility settings saved');
  };

  // Toggle switch component
  const Toggle = ({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-[13px] font-medium">{label}</p>
        {description && <p className="text-[12px] text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-background transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[800px] animate-fade-in">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Manage your account preferences and system settings</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="profile" className="gap-1.5 text-[13px]">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-[13px]">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-[13px]">
            <Lock className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-[13px]">
            <Palette className="h-3.5 w-3.5" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-1.5 text-[13px]">
            <Eye className="h-3.5 w-3.5" /> Accessibility
          </TabsTrigger>
          <TabsTrigger value="help" className="gap-1.5 text-[13px]">
            <HelpCircle className="h-3.5 w-3.5" /> Help
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[14px] font-medium">Profile Information</h3>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-[16px] font-semibold">{user?.name || 'User'}</p>
                  <p className="text-[13px] text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="text-[11px] mt-1 capitalize">{user?.role}</Badge>
                </div>
              </div>

              {user?.role === 'student' && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Student ID</p>
                    <p className="text-[14px] font-medium mt-0.5">{user?.studentId || '—'}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Program</p>
                    <p className="text-[14px] font-medium mt-0.5">{user?.program || '—'}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Academic Year</p>
                    <p className="text-[14px] font-medium mt-0.5">{user?.year || '—'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <h3 className="text-[14px] font-medium flex items-center gap-2 mb-4">
                <LogOut className="h-4 w-4 text-muted-foreground" /> Session
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px]">Active Session</p>
                  <p className="text-[12px] text-muted-foreground">Logged in as {user?.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => { logout(); window.location.href = '/login'; }}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-2">
              <h3 className="text-[14px] font-medium flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email Notifications
              </h3>
              <Toggle
                checked={emailNotifs}
                onChange={setEmailNotifs}
                label="Enable email notifications"
                description="Receive important updates via email"
              />
              <div className="border-t pt-2">
                <Toggle
                  checked={paymentAlerts}
                  onChange={setPaymentAlerts}
                  label="Payment alerts"
                  description={user?.role === 'student' ? "Get notified when your payment status changes" : "Get notified when students submit payments"}
                />
              </div>
              <div className="border-t pt-2">
                <Toggle
                  checked={systemAlerts}
                  onChange={setSystemAlerts}
                  label="System announcements"
                  description="Updates about maintenance and new features"
                />
              </div>
              <Button size="sm" className="mt-4" onClick={saveNotificationPrefs}>Save Preferences</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <h3 className="text-[14px] font-medium flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" /> Push Notifications
              </h3>
              <Toggle
                checked={pushNotifs}
                onChange={setPushNotifs}
                label="Enable push notifications"
                description="Show desktop notifications for urgent updates"
              />
              <Button size="sm" className="mt-4" onClick={saveNotificationPrefs}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[14px] font-medium">Change Password</h3>
              <div className="space-y-3 max-w-sm">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium">Current Password</label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="h-10"
                    disabled={changingPassword}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="h-10"
                    placeholder="Minimum 8 characters"
                    disabled={changingPassword}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="h-10"
                    disabled={changingPassword}
                  />
                </div>
                <Button onClick={handlePasswordChange} disabled={changingPassword} className="h-9">
                  {changingPassword ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1" />Changing...</>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-5 space-y-4 text-destructive">
              <h3 className="text-[14px] font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Danger Zone
              </h3>
              <p className="text-[13px] text-destructive/80">
                {user?.role === 'student'
                  ? "Once you delete your account, there is no going back. Please be certain."
                  : "Contact a system administrator to deactivate admin accounts."}
              </p>
              {user?.role === 'student' && (
                <Button variant="destructive" onClick={() => setShowDeleteAccountConfirm(true)} className="h-9">
                  Delete Account
                </Button>
              )}
            </CardContent>
          </Card>

          <Dialog open={showDeleteAccountConfirm} onOpenChange={setShowDeleteAccountConfirm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  WARNING: This will permanently delete your account and all associated data. Are you absolutely sure?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteAccountConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[14px] font-medium">Theme Preference</h3>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {(['light', 'dark', 'system'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`border rounded-lg p-4 text-center transition-all ${
                      theme === t
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                      {t === 'light' ? <Sun className="h-4 w-4" /> : t === 'dark' ? <Moon className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                    </div>
                    <p className="text-[12px] font-medium capitalize">{t}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <h3 className="text-[14px] font-medium flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-muted-foreground" /> Language & Region
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[11px] text-muted-foreground uppercase">Language</p>
                  <p className="text-[14px] font-medium">English</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-[11px] text-muted-foreground uppercase">Currency</p>
                  <p className="text-[14px] font-medium">MWK (Malawi Kwacha)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-2">
              <h3 className="text-[14px] font-medium flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-muted-foreground" /> Accessibility Options
              </h3>
              <Toggle
                checked={reducedMotion}
                onChange={setReducedMotion}
                label="Reduce motion"
                description="Minimize animations throughout the interface"
              />
              <div className="border-t pt-2">
                <Toggle
                  checked={highContrast}
                  onChange={setHighContrast}
                  label="High contrast"
                  description="Increase contrast for better visibility"
                />
              </div>
              <div className="border-t pt-2">
                <Toggle
                  checked={largeText}
                  onChange={setLargeText}
                  label="Large text"
                  description="Increase text size throughout the app"
                />
              </div>
              <Button size="sm" className="mt-4" onClick={saveAccessibilityPrefs}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-[14px] font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" /> Help & Support
              </h3>

              <div className="space-y-3">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toast.info('Help documentation coming soon'); }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">Documentation</p>
                    <p className="text-[12px] text-muted-foreground">Learn how to use EduPayTrack</p>
                  </div>
                </a>

                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toast.info('Support chat coming soon'); }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">Contact Support</p>
                    <p className="text-[12px] text-muted-foreground">Get help from our team</p>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium">System Status</p>
                    <p className="text-[12px] text-muted-foreground">All systems operational</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-success text-success">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <h3 className="text-[14px] font-medium mb-3">About EduPayTrack</h3>
              <div className="space-y-2 text-[13px] text-muted-foreground">
                <p><span className="font-medium text-foreground">Version:</span> 1.0.0</p>
                <p><span className="font-medium text-foreground">Built for:</span> Malawian Universities</p>
                <p className="text-[12px]">© 2026 EduPayTrack. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
