import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

import { apiFetch } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { formatCurrency, formatDate } from '../../../lib/utils';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function ReportsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      apiFetch<any[]>('/admin/payments?status=ALL'),
      apiFetch<any[]>('/admin/students'),
    ])
      .then(([p, s]) => { setPayments(p); setStudents(s); })
      .catch(() => toast.error('Failed to load report data'))
      .finally(() => setLoading(false));
  }, []);

  const isInDateRange = (dateStr: string, range: string) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
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
      case 'quarter': {
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(quarterAgo.getMonth() - 3);
        return date >= quarterAgo;
      }
      default:
        return true;
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => isInDateRange(p.paymentDate || p.submittedAt, dateRange));
  }, [payments, dateRange]);

  const approvedPayments = useMemo(() => filteredPayments.filter(p => p.status === 'APPROVED'), [filteredPayments]);
  const pendingPayments = useMemo(() => filteredPayments.filter(p => p.status === 'PENDING'), [filteredPayments]);
  const rejectedPayments = useMemo(() => filteredPayments.filter(p => p.status === 'REJECTED'), [filteredPayments]);

  const totalCollected = useMemo(() => approvedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [approvedPayments]);
  const totalPending = useMemo(() => pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), [pendingPayments]);
  const totalOutstanding = useMemo(() => students.reduce((sum, s) => sum + Number(s.currentBalance || 0), 0), [students]);

  // Chart data preparation
  const statusData = useMemo(() => [
    { name: 'Approved', value: approvedPayments.length, amount: totalCollected, color: '#10b981' },
    { name: 'Pending', value: pendingPayments.length, amount: totalPending, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedPayments.length, amount: rejectedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0), color: '#ef4444' },
  ], [approvedPayments, pendingPayments, rejectedPayments, totalCollected, totalPending]);

  const methodData = useMemo(() => {
    const methods: Record<string, number> = {};
    approvedPayments.forEach(p => {
      const method = p.method?.replace(/_/g, ' ') || 'Unknown';
      methods[method] = (methods[method] || 0) + Number(p.amount || 0);
    });
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [approvedPayments]);

  const monthlyTrendData = useMemo(() => {
    const months: Record<string, { approved: number; pending: number; rejected: number }> = {};
    filteredPayments.forEach(p => {
      const date = new Date(p.paymentDate || p.submittedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) months[key] = { approved: 0, pending: 0, rejected: 0 };
      const amount = Number(p.amount || 0);
      if (p.status === 'APPROVED') months[key].approved += amount;
      else if (p.status === 'PENDING') months[key].pending += amount;
      else if (p.status === 'REJECTED') months[key].rejected += amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: month.slice(5),
        approved: data.approved,
        pending: data.pending,
        rejected: data.rejected
      }));
  }, [filteredPayments]);

  const dailyCollectionData = useMemo(() => {
    const days: Record<string, number> = {};
    approvedPayments.forEach(p => {
      const date = new Date(p.paymentDate || p.submittedAt);
      const key = `${date.getMonth() + 1}/${date.getDate()}`;
      days[key] = (days[key] || 0) + Number(p.amount || 0);
    });
    return Object.entries(days)
      .sort((a, b) => {
        const [aMonth, aDay] = a[0].split('/').map(Number);
        const [bMonth, bDay] = b[0].split('/').map(Number);
        return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
      })
      .slice(-14)
      .map(([day, amount]) => ({ day, amount }));
  }, [approvedPayments]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Student', 'Amount', 'Status', 'Method', 'Reference', 'Reviewed By'];
    const rows = filteredPayments.map(p => [
      formatDate(p.paymentDate || p.submittedAt),
      p.student ? `${p.student.firstName} ${p.student.lastName}` : 'N/A',
      p.amount,
      p.status,
      p.method?.replace(/_/g, ' ') || 'N/A',
      p.externalReference || p.receiptNumber || 'N/A',
      p.reviewedBy?.name || 'N/A'
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${rows.length} payments`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-[1400px]">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Financial Reports</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Collections, analytics, and payment insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="h-9 gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" variant="outline" className="h-9 gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" /> Print
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] h-9">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden border-success/20 bg-gradient-to-br from-success/5 via-background to-background">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-3">Total Collected</p>
                <p className="text-[26px] font-bold text-success leading-none">{formatCurrency(totalCollected)}</p>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-success font-medium">
                  <ArrowUpRight className="h-3 w-3" />
                  {approvedPayments.length} payments
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-warning/20 bg-gradient-to-br from-warning/5 via-background to-background">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-3">Pending Review</p>
                <p className="text-[26px] font-bold text-warning leading-none">{formatCurrency(totalPending)}</p>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-warning font-medium">
                  <ArrowDownRight className="h-3 w-3" />
                  {pendingPayments.length} pending
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/15">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-3">Outstanding</p>
                <p className="text-[26px] font-bold text-primary leading-none">{formatCurrency(totalOutstanding)}</p>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-muted-foreground font-medium">
                  <Users className="h-3 w-3" />
                  {students.length} students
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-background">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-3">Rejected</p>
                <p className="text-[26px] font-bold text-destructive leading-none">
                  {formatCurrency(rejectedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0))}
                </p>
                <div className="flex items-center gap-1 mt-3 text-[11px] text-destructive font-medium">
                  <ArrowDownRight className="h-3 w-3" />
                  {rejectedPayments.length} rejected
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15">
                <PieChartIcon className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" /> Trends
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <FileText className="h-4 w-4" /> Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-medium flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                  Payment Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${value} payments (${formatCurrency(props.payload.amount)})`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  Collections by Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={methodData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `K${(v / 1000).toFixed(0)}`} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {methodData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Collections */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Daily Collections Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyCollectionData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Monthly Trends */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Monthly Payment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `K${(v / 1000).toFixed(0)}`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-[15px] font-medium">Payment Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.slice(0, 50).map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="text-[13px]">{formatDate(p.paymentDate || p.submittedAt)}</TableCell>
                      <TableCell className="text-[13px] font-medium">
                        {p.student ? `${p.student.firstName} ${p.student.lastName}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-[13px] font-medium">{formatCurrency(p.amount)}</TableCell>
                      <TableCell>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          p.status === 'APPROVED' ? 'bg-success/10 text-success' :
                          p.status === 'PENDING' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground">
                        {p.method?.replace(/_/g, ' ') || 'N/A'}
                      </TableCell>
                      <TableCell className="text-[13px] text-muted-foreground font-mono">
                        {p.externalReference || p.receiptNumber || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No payments found for the selected period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
