import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Clock, 
  DollarSign, 
  Users, 
  RotateCw, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Activity, 
  CreditCard, 
  Shield, 
  Target, 
  BarChart3, 
  AlertTriangle,
  AlertCircle,
  Link2,
  NotebookPen,
  TimerReset,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

import { apiFetch } from '../../lib/api';
import { useAuth } from '../../state/auth-context';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table';
import { PaymentStatusBadge } from '../../components/admin/common/payment-helpers';
import { StudentPaymentHistoryDialog } from '../../components/admin/common/student-history-dialog';

/* ---- Helpers ---- */
function StatCard({ icon: Icon, label, value, iconColor = 'text-muted-foreground', valueColor = '' }: {
  icon: any; label: string; value: string | number; iconColor?: string; valueColor?: string;
}) {
  return (
    <Card className="glass-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="pt-4 pb-4 px-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={`h-4 w-4 ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
          <span className="text-[12px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
        </div>
        <span className={`text-[24px] font-bold tracking-tight ${valueColor}`}>{value}</span>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingStudentHistory, setViewingStudentHistory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isAdmin = user?.role === 'admin';

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [s, p, st, a] = await Promise.all([
        apiFetch<any>('/admin/dashboard-stats'),
        apiFetch<any[]>('/admin/payments?status=PENDING'),
        apiFetch<any[]>('/admin/students'),
        isAdmin ? apiFetch<any[]>('/admin/audit-logs?limit=10') : Promise.resolve([]),
      ]);
      setStats(s);
      setPayments(p || []);
      setStudents(st || []);
      setAuditLogs(a || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin]);

  const overdueStudents = useMemo(() => {
    if (!students.length) return [];
    return students.filter((s: any) => {
      const balance = Number(s?.currentBalance || 0);
      return balance > 0;
    }).slice(0, 50);
  }, [students]);

  const handleBulkReminders = useCallback(() => {
    const studentsWithEmail = overdueStudents.filter((s: any) => s?.user?.email);
    if (studentsWithEmail.length === 0) {
      toast.error('No overdue students with email addresses found');
      return;
    }
    
    const emails = studentsWithEmail.map((s: any) => s.user.email).join(',');
    const subject = 'Payment Reminder - Outstanding Balance';
    const body = `Dear Student,%0D%0A%0D%0AThis is a reminder that you have an outstanding balance. Please make payment at your earliest convenience.%0D%0A%0D%0AThank you.`;
    
    window.location.href = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
    toast.success(`Opening email client for ${studentsWithEmail.length} students...`);
  }, [overdueStudents]);

  const collectionStats = useMemo(() => {
    if (!students.length) return { rate: 0, expected: 0, collected: 0 };
    const collected = stats?.totalRevenue || 0;
    const expected = students.reduce((sum, s) => sum + Number(s?.totalFees || 0), 0);
    const rate = expected > 0 ? (collected / expected) * 100 : 0;
    return { rate, expected, collected };
  }, [students, stats]);

  const monthlyComparison = useMemo(() => {
    return { 
      current: stats?.currentMonthRevenue || 0, 
      previous: stats?.previousMonthRevenue || 0, 
      change: stats?.revenueChange || 0 
    };
  }, [stats]);

  const reconciliationStats = useMemo(() => {
    return stats?.reconciliation || {
      matchedPayments: 0,
      unmatchedPayments: 0,
      matchedAmount: 0,
      unmatchedAmount: 0,
      aging: { overThreeDays: 0, overSevenDays: 0 },
      recentReconciliations: [],
      oldestUnmatched: [],
    };
  }, [stats]);

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadDashboardData()}>
            <RotateCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-[1400px]">
        <div className="flex justify-between items-center"><Skeleton className="h-8 w-48" /><Skeleton className="h-9 w-32" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[100px] w-full" />)}
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  const getActivityIcon = (action: string) => {
    if (action.includes('payment')) return <CreditCard className="h-4 w-4 text-primary" />;
    if (action.includes('user')) return <Users className="h-4 w-4 text-info" />;
    if (action.includes('fee')) return <DollarSign className="h-4 w-4 text-warning" />;
    if (action.includes('login') || action.includes('auth')) return <Shield className="h-4 w-4 text-success" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            {user?.role === 'accounts' ? 'Accounts Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Overview of collections and operations
            {lastUpdated && <span className="ml-2 text-[11px]">⏳Updated {lastUpdated.toLocaleTimeString()}</span>}
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2" onClick={loadDashboardData} disabled={loading}>
          <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        <Link to="/admin/students" className="block animate-slide-in-right">
          <Card className="hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
              <span className="text-[13px] font-medium">Students</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/verify-payments" className="block animate-slide-in-right" style={{ animationDelay: '50ms' }}>
          <Card className="hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-success" /></div>
              <span className="text-[13px] font-medium">Payments</span>
            </CardContent>
          </Card>
        </Link>
        <button onClick={handleBulkReminders} className="text-left w-full animate-slide-in-right" style={{ animationDelay: '100ms' }}>
          <Card className="hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center"><Mail className="h-5 w-5 text-warning" /></div>
              <span className="text-[13px] font-medium">Reminders</span>
            </CardContent>
          </Card>
        </button>
        <Link to="/admin/reports" className="block animate-slide-in-right" style={{ animationDelay: '150ms' }}>
          <Card className="hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center"><BarChart3 className="h-5 w-5 text-info" /></div>
              <span className="text-[13px] font-medium">Reports</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} />
        <StatCard icon={Clock} label="Pending Payments" value={stats?.pendingPayments ?? 0} iconColor="text-warning" />
        <StatCard icon={AlertCircle} label="Overdue" value={overdueStudents.length} iconColor="text-destructive" valueColor="text-destructive" />
        <StatCard icon={DollarSign} label="Collection" value={`MK ${collectionStats.rate.toFixed(0)}%`} iconColor="text-success" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Link2}
          label="Matched Queue"
          value={reconciliationStats.matchedPayments}
          iconColor="text-success"
          valueColor="text-success"
        />
        <StatCard
          icon={NotebookPen}
          label="Needs Matching"
          value={reconciliationStats.unmatchedPayments}
          iconColor="text-warning"
          valueColor="text-warning"
        />
        <StatCard
          icon={DollarSign}
          label="Matched Amount"
          value={formatCurrency(reconciliationStats.matchedAmount)}
          iconColor="text-success"
        />
        <StatCard
          icon={TimerReset}
          label="Aged 7+ Days"
          value={reconciliationStats.aging?.overSevenDays ?? 0}
          iconColor="text-destructive"
          valueColor="text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3"><Target className="h-5 w-5 text-primary" /><h2 className="text-[15px] font-semibold">Collection Rate</h2></div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-[32px] font-bold tracking-tight">{collectionStats.rate.toFixed(1)}%</span>
            <span className="text-[13px] text-muted-foreground mb-2">collected</span>
          </div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.min(collectionStats.rate, 100)}%` }} />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3"><BarChart3 className="h-5 w-5 text-primary" /><h2 className="text-[15px] font-semibold">Monthly Revenue</h2></div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-[32px] font-bold tracking-tight">{formatCurrency(monthlyComparison.current)}</span>
            <span className={`text-[13px] mb-2 flex items-center gap-1 ${monthlyComparison.change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {monthlyComparison.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(monthlyComparison.change).toFixed(1)}%
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <NotebookPen className="h-5 w-5 text-warning" />
            <h2 className="text-[15px] font-semibold">Reconciliation Queue Health</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-[12px] text-muted-foreground">
                <span>Matched in pending queue</span>
                <span>{reconciliationStats.matchedPayments}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-success transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      reconciliationStats.matchedPayments + reconciliationStats.unmatchedPayments > 0
                        ? (reconciliationStats.matchedPayments / (reconciliationStats.matchedPayments + reconciliationStats.unmatchedPayments)) * 100
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-warning/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Unmatched Value</p>
                <p className="mt-2 text-[18px] font-semibold text-warning">{formatCurrency(reconciliationStats.unmatchedAmount)}</p>
              </div>
              <div className="rounded-xl border bg-destructive/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Aged 3+ Days</p>
                <p className="mt-2 text-[18px] font-semibold text-destructive">{reconciliationStats.aging?.overThreeDays ?? 0}</p>
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Use this to spot payment proofs that are still waiting for bank statement or mobile money matching.
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="h-5 w-5 text-success" />
            <h2 className="text-[15px] font-semibold">Recent Reconciliations</h2>
          </div>
          <div className="space-y-3">
            {reconciliationStats.recentReconciliations?.length ? (
              reconciliationStats.recentReconciliations.map((item: any) => (
                <div key={item.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      className="text-left"
                      onClick={() => setViewingStudentHistory(item.student)}
                    >
                      <p className="text-[13px] font-medium hover:underline">
                        {item.student?.firstName} {item.student?.lastName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{item.student?.studentCode}</p>
                    </button>
                    <span className="text-[12px] font-semibold text-success">{formatCurrency(Number(item.amount || 0))}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Matched by {item.reconciler?.firstName || item.reconciler?.email || 'Staff'} on {formatDate(item.reconciledAt)}
                  </p>
                  {item.reconciliationNote && (
                    <p className="mt-1 text-[12px] text-muted-foreground">{item.reconciliationNote}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-muted-foreground">No reconciliations recorded yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-[15px] font-medium">Pending Payments</h2>
              <Link to="/admin/verify-payments" className="text-[12px] text-primary hover:underline">View All</Link>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody className="stagger-children">
                {payments.slice(0, 5).map((p: any, index: number) => (
                  <TableRow key={p.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <TableCell className="text-[13px]">{p.student?.firstName} {p.student?.lastName}</TableCell>
                    <TableCell className="text-[13px] font-medium">{formatCurrency(p.amount)}</TableCell>
                    <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No pending payments</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Card>

          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-[15px] font-medium">Oldest Unmatched Payments</h2>
              <Link to="/admin/verify-payments" className="text-[12px] text-primary hover:underline">Open Queue</Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reconciliationStats.oldestUnmatched?.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <button className="text-left hover:underline" onClick={() => setViewingStudentHistory(payment.student)}>
                        <div className="text-[13px] font-medium">{payment.student?.firstName} {payment.student?.lastName}</div>
                        <div className="text-[11px] text-muted-foreground">{payment.student?.studentCode}</div>
                      </button>
                    </TableCell>
                    <TableCell className="text-[13px] font-medium">{formatCurrency(Number(payment.amount || 0))}</TableCell>
                    <TableCell className="text-[13px]">
                      <span className={payment.ageDays >= 7 ? 'text-destructive font-medium' : 'text-warning font-medium'}>
                        {payment.ageDays} day{payment.ageDays === 1 ? '' : 's'}
                      </span>
                    </TableCell>
                    <TableCell className="text-[12px] font-mono text-muted-foreground">
                      {payment.receiptNumber || payment.externalReference || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                {!reconciliationStats.oldestUnmatched?.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No unmatched payments are aging in the queue.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card>
            <div className="p-4 border-b"><h2 className="text-[15px] font-medium">Recent Activity</h2></div>
            <CardContent className="p-4">
              <div className="space-y-4 stagger-children">
                {auditLogs.slice(0, 6).map((log, idx) => (
                  <div key={idx} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${idx * 75}ms` }}>
                    <div className="mt-0.5">{getActivityIcon(log.action)}</div>
                    <div>
                      <p className="text-[13px] font-medium leading-none">{log.action?.replace(/\./g, ' ') || 'System Action'}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{formatDate(log.createdAt || log.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && <p className="text-center py-4 text-muted-foreground text-sm">No activity</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <StudentPaymentHistoryDialog 
        student={viewingStudentHistory} 
        open={!!viewingStudentHistory} 
        onOpenChange={(open: boolean) => !open && setViewingStudentHistory(null)} 
      />
    </div>
  );
}
