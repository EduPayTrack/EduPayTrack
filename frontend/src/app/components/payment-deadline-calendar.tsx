import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  GraduationCap,
  Home,
  FileText
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';

// Payment deadline types
export interface PaymentDeadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  amount: number;
  type: 'tuition' | 'hostel' | 'exam' | 'library' | 'other';
  status: 'upcoming' | 'due' | 'overdue' | 'paid';
  gracePeriodDays?: number;
  lateFeeAmount?: number;
}

// Default academic term configuration
export interface AcademicTerm {
  name: string;
  startDate: string;
  endDate: string;
  paymentDeadlines: PaymentDeadline[];
}

interface PaymentDeadlineCalendarProps {
  deadlines?: PaymentDeadline[];
  currentBalance?: number;
  className?: string;
}

const typeConfig = {
  tuition: { icon: GraduationCap, color: 'text-primary bg-primary/10 border-primary/20', label: 'Tuition' },
  hostel: { icon: Home, color: 'text-info bg-info/10 border-info/20', label: 'Hostel' },
  exam: { icon: FileText, color: 'text-warning bg-warning/10 border-warning/20', label: 'Exam' },
  library: { icon: FileText, color: 'text-secondary bg-secondary/10 border-secondary/20', label: 'Library' },
  other: { icon: AlertCircle, color: 'text-muted-foreground bg-muted border-border', label: 'Other' },
};

const statusConfig = {
  upcoming: { color: 'bg-primary', label: 'Upcoming', icon: Clock },
  due: { color: 'bg-warning', label: 'Due Today', icon: AlertCircle },
  overdue: { color: 'bg-destructive', label: 'Overdue', icon: AlertCircle },
  paid: { color: 'bg-success', label: 'Paid', icon: CheckCircle2 },
};

// Helper to calculate days remaining
function getDaysRemaining(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper to get status from days remaining and payment status
function getDeadlineStatus(daysRemaining: number, isPaid: boolean): PaymentDeadline['status'] {
  if (isPaid) return 'paid';
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining === 0) return 'due';
  return 'upcoming';
}

// Generate sample deadlines if none provided
function generateDefaultDeadlines(): PaymentDeadline[] {
  const today = new Date();
  const year = today.getFullYear();
  
  return [
    {
      id: '1',
      title: 'First Installment - Semester 1',
      description: 'Initial tuition payment for the semester',
      dueDate: new Date(year, 0, 31).toISOString().split('T')[0], // Jan 31
      amount: 225000,
      type: 'tuition',
      status: 'upcoming',
      gracePeriodDays: 7,
      lateFeeAmount: 10000,
    },
    {
      id: '2',
      title: 'Hostel Fee',
      description: 'Accommodation fees for the semester',
      dueDate: new Date(year, 1, 15).toISOString().split('T')[0], // Feb 15
      amount: 80000,
      type: 'hostel',
      status: 'upcoming',
      gracePeriodDays: 5,
    },
    {
      id: '3',
      title: 'Second Installment - Semester 1',
      description: 'Final tuition payment before exams',
      dueDate: new Date(year, 3, 15).toISOString().split('T')[0], // Apr 15
      amount: 225000,
      type: 'tuition',
      status: 'upcoming',
      gracePeriodDays: 7,
      lateFeeAmount: 10000,
    },
    {
      id: '4',
      title: 'Exam Card Clearance',
      description: 'Required for exam registration',
      dueDate: new Date(year, 4, 1).toISOString().split('T')[0], // May 1
      amount: 0,
      type: 'exam',
      status: 'upcoming',
      gracePeriodDays: 0,
    },
  ];
}

export function PaymentDeadlineCalendar({ 
  deadlines: propDeadlines, 
  currentBalance = 0,
  className 
}: PaymentDeadlineCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Use provided deadlines or generate defaults
  const deadlines = useMemo(() => {
    const d = propDeadlines || generateDefaultDeadlines();
    // Calculate status for each deadline
    return d.map(deadline => {
      const daysRemaining = getDaysRemaining(deadline.dueDate);
      const isPaid = currentBalance <= 0 && daysRemaining > -30; // Assume paid if no balance
      return {
        ...deadline,
        status: getDeadlineStatus(daysRemaining, isPaid || deadline.status === 'paid'),
      };
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [propDeadlines, currentBalance]);

  // Calendar data
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: { date: string; day: number; isPadding: boolean }[] = [];
    
    // Padding days
    for (let i = 0; i < startPadding; i++) {
      days.push({ date: '', day: 0, isPadding: true });
    }
    
    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      days.push({ date, day, isPadding: false });
    }
    
    return days;
  }, [currentMonth]);

  // Get deadlines for a specific date
  const getDeadlinesForDate = (date: string) => {
    return deadlines.filter(d => d.dueDate === date);
  };

  // Navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Summary stats
  const stats = useMemo(() => {
    const upcoming = deadlines.filter(d => d.status === 'upcoming').length;
    const due = deadlines.filter(d => d.status === 'due').length;
    const overdue = deadlines.filter(d => d.status === 'overdue').length;
    const paid = deadlines.filter(d => d.status === 'paid').length;
    const totalDue = deadlines
      .filter(d => d.status !== 'paid' && d.amount > 0)
      .reduce((sum, d) => sum + d.amount, 0);
    return { upcoming, due, overdue, paid, totalDue };
  }, [deadlines]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase">Upcoming</p>
            <p className="text-xl font-semibold text-primary">{stats.upcoming}</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase">Due Soon</p>
            <p className="text-xl font-semibold text-warning">{stats.due}</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase">Overdue</p>
            <p className="text-xl font-semibold text-destructive">{stats.overdue}</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-3">
            <p className="text-[11px] text-muted-foreground uppercase">Completed</p>
            <p className="text-xl font-semibold text-success">{stats.paid}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Calendar Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-[16px]">Payment Calendar</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-[14px] font-medium min-w-[120px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {weekdayNames.map(day => (
              <div key={day} className="text-center text-[11px] text-muted-foreground py-2 font-medium">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const dayDeadlines = day.isPadding ? [] : getDeadlinesForDate(day.date);
              const hasDeadline = dayDeadlines.length > 0;
              const isSelected = selectedDate === day.date;
              const isToday = day.date === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={index}
                  disabled={day.isPadding}
                  onClick={() => !day.isPadding && setSelectedDate(day.date)}
                  className={cn(
                    "relative min-h-[60px] p-1 rounded-lg border transition-all text-left",
                    day.isPadding && "invisible",
                    !day.isPadding && "hover:border-primary/50 hover:bg-primary/5",
                    isSelected && "border-primary bg-primary/10 ring-1 ring-primary",
                    isToday && !isSelected && "border-primary/50 bg-primary/5",
                    hasDeadline && !isSelected && "border-warning/30 bg-warning/5",
                  )}
                >
                  <span className={cn(
                    "text-[13px] font-medium",
                    isToday && "text-primary font-bold"
                  )}>
                    {day.day}
                  </span>
                  {hasDeadline && (
                    <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 flex-wrap">
                      {dayDeadlines.slice(0, 3).map((d, i) => {
                        return (
                          <div
                            key={i}
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              statusConfig[d.status].color
                            )}
                            title={d.title}
                          />
                        );
                      })}
                      {dayDeadlines.length > 3 && (
                        <span className="text-[8px] text-muted-foreground">+{dayDeadlines.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-[13px] font-medium mb-3">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <div className="space-y-2">
                {getDeadlinesForDate(selectedDate).length === 0 ? (
                  <p className="text-[13px] text-muted-foreground italic">No payment deadlines on this date</p>
                ) : (
                  getDeadlinesForDate(selectedDate).map(deadline => {
                    const TypeIcon = typeConfig[deadline.type].icon;
                    const StatusIcon = statusConfig[deadline.status].icon;
                    const daysRemaining = getDaysRemaining(deadline.dueDate);

                    return (
                      <div
                        key={deadline.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border",
                          typeConfig[deadline.type].color
                        )}
                      >
                        <div className="mt-0.5">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-medium truncate">{deadline.title}</span>
                            <Badge variant="outline" className={cn("text-[10px]", typeConfig[deadline.type].color)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[deadline.status].label}
                            </Badge>
                          </div>
                          {deadline.description && (
                            <p className="text-[12px] opacity-80 mt-1">{deadline.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-[12px]">
                            {deadline.amount > 0 && (
                              <span className="font-semibold">
                                MWK {deadline.amount.toLocaleString()}
                              </span>
                            )}
                            <span className={cn(
                              daysRemaining < 0 && "text-destructive",
                              daysRemaining === 0 && "text-warning font-semibold",
                              daysRemaining > 0 && daysRemaining <= 7 && "text-warning",
                              daysRemaining > 7 && "text-muted-foreground"
                            )}>
                              {daysRemaining < 0 
                                ? `${Math.abs(daysRemaining)} days overdue`
                                : daysRemaining === 0 
                                  ? 'Due today'
                                  : `${daysRemaining} days remaining`
                              }
                            </span>
                          </div>
                          {deadline.gracePeriodDays && deadline.gracePeriodDays > 0 && daysRemaining < 0 && Math.abs(daysRemaining) <= deadline.gracePeriodDays && (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Grace period: {deadline.gracePeriodDays - Math.abs(daysRemaining)} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[16px] flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {deadlines.length === 0 ? (
              <p className="text-[13px] text-muted-foreground text-center py-4">
                No payment deadlines scheduled
              </p>
            ) : (
              deadlines.slice(0, 5).map(deadline => {
                const TypeIcon = typeConfig[deadline.type].icon;
                const daysRemaining = getDaysRemaining(deadline.dueDate);

                return (
                  <div
                    key={deadline.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedDate(deadline.dueDate)}
                  >
                    <div className={cn("p-2 rounded-md", typeConfig[deadline.type].color)}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{deadline.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Due {formatDate(deadline.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      {deadline.amount > 0 && (
                        <p className="text-[13px] font-medium">
                          MWK {deadline.amount.toLocaleString()}
                        </p>
                      )}
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px]",
                          statusConfig[deadline.status].color.replace('bg-', 'text-').replace('bg-', 'bg-')
                        )}
                      >
                        {daysRemaining < 0 
                          ? `${Math.abs(daysRemaining)}d overdue`
                          : daysRemaining === 0 
                            ? 'Today'
                            : `${daysRemaining}d left`
                        }
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {deadlines.length > 5 && (
            <Button variant="ghost" className="w-full mt-3 text-[12px]" onClick={() => setCurrentMonth(new Date(deadlines[0].dueDate))}>
              View all {deadlines.length} deadlines
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentDeadlineCalendar;
