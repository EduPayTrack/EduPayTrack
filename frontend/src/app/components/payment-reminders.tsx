import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Bell, Clock, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatDate, formatCurrency } from '../../lib/utils';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

// Reminder types
export type ReminderTiming = '3_days_before' | '1_day_before' | 'day_of' | '1_day_after' | '3_days_after' | 'weekly' | 'custom';

export interface PaymentReminder {
  id: string;
  title: string;
  description?: string;
  deadlineDate: string;
  amount: number;
  timing: ReminderTiming;
  customDays?: number;
  isEnabled: boolean;
  notificationMethod: 'in_app' | 'email' | 'both';
  lastReminded?: string;
  reminderCount: number;
}

export interface ReminderPreferences {
  enableAutoReminders: boolean;
  defaultTiming: ReminderTiming;
  defaultMethod: 'in_app' | 'email' | 'both';
  maxRemindersPerDeadline: number;
  snoozeDuration: number; // hours
}

const timingLabels: Record<ReminderTiming, string> = {
  '3_days_before': '3 days before due date',
  '1_day_before': '1 day before due date',
  'day_of': 'On the due date',
  '1_day_after': '1 day after (overdue alert)',
  '3_days_after': '3 days after (urgent)',
  'weekly': 'Weekly until paid',
  'custom': 'Custom schedule',
};

const methodLabels = {
  in_app: 'In-app only',
  email: 'Email only',
  both: 'Both email & in-app',
};

// Sample reminders generator
export function generateSampleReminders(): PaymentReminder[] {
  const today = new Date();
  const year = today.getFullYear();
  
  return [
    {
      id: '1',
      title: 'First Installment - Semester 1',
      description: 'Initial tuition payment deadline approaching',
      deadlineDate: new Date(year, 0, 31).toISOString().split('T')[0],
      amount: 225000,
      timing: '3_days_before',
      isEnabled: true,
      notificationMethod: 'both',
      reminderCount: 0,
    },
    {
      id: '2',
      title: 'Hostel Fee',
      description: 'Accommodation fees due',
      deadlineDate: new Date(year, 1, 15).toISOString().split('T')[0],
      amount: 80000,
      timing: '1_day_before',
      isEnabled: true,
      notificationMethod: 'in_app',
      reminderCount: 1,
      lastReminded: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Calculate next reminder date based on timing
export function getNextReminderDate(deadlineDate: string, timing: ReminderTiming, customDays?: number): Date {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  
  switch (timing) {
    case '3_days_before':
      return new Date(deadline.getTime() - 3 * 24 * 60 * 60 * 1000);
    case '1_day_before':
      return new Date(deadline.getTime() - 1 * 24 * 60 * 60 * 1000);
    case 'day_of':
      return deadline;
    case '1_day_after':
      return new Date(deadline.getTime() + 1 * 24 * 60 * 60 * 1000);
    case '3_days_after':
      return new Date(deadline.getTime() + 3 * 24 * 60 * 60 * 1000);
    case 'weekly':
      // Return next weekly occurrence from now
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'custom':
      return new Date(deadline.getTime() - (customDays || 0) * 24 * 60 * 60 * 1000);
    default:
      return deadline;
  }
}

// Check if reminder should fire
export function shouldTriggerReminder(reminder: PaymentReminder): boolean {
  if (!reminder.isEnabled) return false;
  
  const nextDate = getNextReminderDate(reminder.deadlineDate, reminder.timing, reminder.customDays);
  const now = new Date();
  
  // Check if we're within the reminder window (within 24 hours of the reminder date)
  const timeDiff = nextDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  return hoursDiff >= -24 && hoursDiff <= 24;
}

// Reminder Card Component
interface ReminderCardProps {
  reminder: PaymentReminder;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit?: (reminder: PaymentReminder) => void;
  onDelete?: (id: string) => void;
}

function ReminderCard({ reminder, onToggle, onEdit, onDelete }: ReminderCardProps) {
  const daysUntilDeadline = Math.ceil(
    (new Date(reminder.deadlineDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isOverdue = daysUntilDeadline < 0;
  const isDueSoon = daysUntilDeadline >= 0 && daysUntilDeadline <= 3;
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border transition-all",
      reminder.isEnabled ? "bg-card" : "bg-muted/30 opacity-70",
      isOverdue && "border-destructive/30",
      isDueSoon && "border-warning/30",
    )}>
      <div className={cn(
        "mt-0.5 p-2 rounded-md",
        reminder.isEnabled ? "bg-primary/10" : "bg-muted"
      )}>
        <Bell className={cn(
          "h-4 w-4",
          reminder.isEnabled ? "text-primary" : "text-muted-foreground"
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn(
              "text-[13px] font-medium",
              !reminder.isEnabled && "text-muted-foreground"
            )}>
              {reminder.title}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Due {formatDate(reminder.deadlineDate)}
              {reminder.amount > 0 && ` • ${formatCurrency(reminder.amount)}`}
            </p>
          </div>
          <Switch
            checked={reminder.isEnabled}
            onCheckedChange={(checked: boolean) => onToggle(reminder.id, checked)}
          />
        </div>
        
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">
            <Clock className="h-3 w-3 mr-1" />
            {timingLabels[reminder.timing]}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {methodLabels[reminder.notificationMethod]}
          </Badge>
          {reminder.reminderCount > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {reminder.reminderCount} sent
            </Badge>
          )}
        </div>
      </div>
      
      {onEdit && onDelete && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(reminder)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive"
            onClick={() => onDelete(reminder.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Main Reminder Manager Component
interface PaymentRemindersProps {
  reminders?: PaymentReminder[];
  preferences?: ReminderPreferences;
  onRemindersChange?: (reminders: PaymentReminder[]) => void;
  onPreferencesChange?: (prefs: ReminderPreferences) => void;
  className?: string;
}

export function PaymentReminders({
  reminders: propReminders,
  preferences: propPreferences,
  onRemindersChange,
  onPreferencesChange,
  className,
}: PaymentRemindersProps) {
  const [reminders, setReminders] = useState<PaymentReminder[]>(propReminders || generateSampleReminders());
  const [preferences, setPreferences] = useState<ReminderPreferences>(propPreferences || {
    enableAutoReminders: true,
    defaultTiming: '3_days_before',
    defaultMethod: 'both',
    maxRemindersPerDeadline: 3,
    snoozeDuration: 24,
  });
  const [editingReminder, setEditingReminder] = useState<PaymentReminder | null>(null);

  // Sync with props
  useEffect(() => {
    if (propReminders) setReminders(propReminders);
  }, [propReminders]);

  useEffect(() => {
    if (propPreferences) setPreferences(propPreferences);
  }, [propPreferences]);

  const handleToggle = useCallback((id: string, enabled: boolean) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, isEnabled: enabled } : r
    );
    setReminders(updated);
    onRemindersChange?.(updated);
    toast.success(enabled ? 'Reminder enabled' : 'Reminder disabled');
  }, [reminders, onRemindersChange]);

  const handleDelete = useCallback((id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    onRemindersChange?.(updated);
    toast.success('Reminder deleted');
  }, [reminders, onRemindersChange]);

  const handleSavePreferences = useCallback(() => {
    onPreferencesChange?.(preferences);
    toast.success('Reminder preferences saved');
  }, [preferences, onPreferencesChange]);

  const activeReminders = reminders.filter(r => r.isEnabled);
  const inactiveReminders = reminders.filter(r => !r.isEnabled);
  const dueSoonReminders = activeReminders.filter(r => {
    const days = Math.ceil((new Date(r.deadlineDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days >= 0;
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Active Reminders Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[16px] flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Payment Reminders
            </CardTitle>
            <Badge variant="outline" className="text-[11px]">
              {activeReminders.length} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {dueSoonReminders.length > 0 && (
            <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-[13px] font-medium">
                  {dueSoonReminders.length} payment{dueSoonReminders.length !== 1 ? 's' : ''} due within 7 days
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {activeReminders.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-[13px]">No active reminders</p>
                <p className="text-[11px]">Enable reminders to get notified about payment deadlines</p>
              </div>
            ) : (
              activeReminders.map(reminder => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onToggle={handleToggle}
                  onEdit={setEditingReminder}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {inactiveReminders.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-[11px] text-muted-foreground mb-2">Paused reminders</p>
              <div className="space-y-2">
                {inactiveReminders.map(reminder => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={handleToggle}
                    onEdit={setEditingReminder}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[16px]">Reminder Preferences</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[13px] font-medium">Auto-reminders</p>
              <p className="text-[11px] text-muted-foreground">
                Automatically remind me about upcoming payments
              </p>
            </div>
            <Switch
              checked={preferences.enableAutoReminders}
              onCheckedChange={(checked: boolean) => {
                setPreferences(p => ({ ...p, enableAutoReminders: checked }));
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground">Default reminder time</label>
              <Select
                value={preferences.defaultTiming}
                onValueChange={(value: ReminderTiming) => {
                  setPreferences(p => ({ ...p, defaultTiming: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(timingLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground">Notification method</label>
              <Select
                value={preferences.defaultMethod}
                onValueChange={(value: 'in_app' | 'email' | 'both') => {
                  setPreferences(p => ({ ...p, defaultMethod: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(methodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button size="sm" onClick={handleSavePreferences} className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Edit Dialog would go here - simplified for now */}
      {editingReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-[16px]">Edit Reminder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground">Title</label>
                <Input
                  value={editingReminder.title}
                  onChange={(e) => setEditingReminder({ ...editingReminder, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground">Reminder timing</label>
                <Select
                  value={editingReminder.timing}
                  onValueChange={(value: ReminderTiming) => setEditingReminder({ ...editingReminder, timing: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(timingLabels).map(([v, label]) => (
                      <SelectItem key={v} value={v}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground">Notification method</label>
                <Select
                  value={editingReminder.notificationMethod}
                  onValueChange={(value: 'in_app' | 'email' | 'both') => 
                    setEditingReminder({ ...editingReminder, notificationMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(methodLabels).map(([v, label]) => (
                      <SelectItem key={v} value={v}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingReminder(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const updated = reminders.map(r => 
                      r.id === editingReminder.id ? editingReminder : r
                    );
                    setReminders(updated);
                    onRemindersChange?.(updated);
                    setEditingReminder(null);
                    toast.success('Reminder updated');
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default PaymentReminders;
