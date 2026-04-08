import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  BellRing, 
  Loader2, 
  MoreHorizontal, 
  CheckSquare,
  Square,
  History, 
  Mail, 
  Eye, 
  GraduationCap,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

import { apiFetch } from '../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../../../components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { PaymentStatusBadge } from '../../components/admin/common/payment-helpers';
import { getFullImageUrl } from '../../components/admin/common/payment-helpers';

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  method: string;
  externalReference?: string;
  receiptNumber?: string;
  paymentDate?: string;
  submittedAt?: string;
  proofUrl?: string;
  payerName?: string;
  notes?: string;
}

export function StudentManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sendingAlerts, setSendingAlerts] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [viewingStudentHistory, setViewingStudentHistory] = useState<any>(null);
  const [viewingStudentDetails, setViewingStudentDetails] = useState<any>(null);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (viewingStudentHistory?.id) {
      loadStudentPayments(viewingStudentHistory.id);
    }
  }, [viewingStudentHistory?.id]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<any[]>('/admin/students');
      setStudents(result);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentPayments = async (studentId: string) => {
    setPaymentsLoading(true);
    try {
      const result = await apiFetch<Payment[]>(`/admin/students/${studentId}/payments`);
      setStudentPayments(result || []);
    } catch {
      toast.error('Failed to load payment history');
    } finally {
      setPaymentsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      if (!q) return true;
      return s.firstName?.toLowerCase().includes(q) 
          || s.lastName?.toLowerCase().includes(q) 
          || s.studentCode?.toLowerCase().includes(q) 
          || s.program?.toLowerCase().includes(q);
    });
  }, [students, search]);

  const campaignMetrics = useMemo(() => {
    const unpaid = filtered.filter((student) => Number(student.currentBalance) > 0);
    const partial = unpaid.filter((student) => Number(student.currentBalance) <= 50000);
    const highBalance = unpaid.filter((student) => Number(student.currentBalance) > 50000);

    return {
      unpaid,
      partial,
      highBalance,
      selected: filtered.filter((student) => selectedStudentIds.includes(student.id)),
    };
  }, [filtered, selectedStudentIds]);

  const handleNotifyReminders = async (studentIds?: string[], successLabel = 'Reminders sent') => {
    setSendingAlerts(true);
    try {
      const result = await apiFetch<any>('/notifications/admin-send', {
        method: 'POST',
        body: JSON.stringify(studentIds?.length ? { studentIds } : {}),
      });
      toast.success(result.message || successLabel);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reminders');
    } finally {
      setSendingAlerts(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((current) =>
      current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]
    );
  };

  const toggleSelectAllFiltered = () => {
    if (filtered.length > 0 && selectedStudentIds.length === filtered.length) {
      setSelectedStudentIds([]);
      return;
    }

    setSelectedStudentIds(filtered.map((student) => student.id));
  };

  const handleEmailRemainder = (s: any) => {
    if (s.user?.email) {
      const subject = 'Payment Reminder';
      const body = `Dear ${s.firstName},\n\nThis is a reminder about your outstanding balance of ${formatCurrency(Number(s.currentBalance))}. Please make payment at your earliest convenience.\n\nThank you.`;
      window.location.href = `mailto:${s.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.success('Opening email client...');
    } else {
      toast.error('Student has no email address associated.');
    }
  };

  const getStatusColor = (balance: number) => {
    if (balance === 0) return 'bg-success/10 text-success border-success/20';
    if (balance > 0 && balance <= 50000) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  const getStatusLabel = (balance: number) => {
    if (balance === 0) return 'Fully Paid';
    if (balance > 0 && balance <= 50000) return 'Partial';
    return 'Outstanding';
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Student Management</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9 h-9" value={search} onChange={(e: any) => setSearch(e.target.value)} />
          </div>
          <Button size="sm" variant="outline" className="h-9 gap-1.5" onClick={() => handleNotifyReminders()} disabled={sendingAlerts}>
            {sendingAlerts ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
            Notify Unpaid
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Filtered Unpaid</p>
              <p className="mt-1 text-[24px] font-semibold text-warning">{campaignMetrics.unpaid.length}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              disabled={sendingAlerts || campaignMetrics.unpaid.length === 0}
              onClick={() => handleNotifyReminders(campaignMetrics.unpaid.map((student) => student.id), 'Sent reminders to filtered unpaid students')}
            >
              Send reminder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">High Balance</p>
              <p className="mt-1 text-[24px] font-semibold text-destructive">{campaignMetrics.highBalance.length}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              disabled={sendingAlerts || campaignMetrics.highBalance.length === 0}
              onClick={() => handleNotifyReminders(campaignMetrics.highBalance.map((student) => student.id), 'Sent reminders to high-balance students')}
            >
              Escalate reminder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Partial Balance</p>
              <p className="mt-1 text-[24px] font-semibold text-primary">{campaignMetrics.partial.length}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              disabled={sendingAlerts || campaignMetrics.partial.length === 0}
              onClick={() => handleNotifyReminders(campaignMetrics.partial.map((student) => student.id), 'Sent reminders to partial-balance students')}
            >
              Gentle reminder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Selected Students</p>
              <p className="mt-1 text-[24px] font-semibold">{campaignMetrics.selected.length}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              disabled={sendingAlerts || campaignMetrics.selected.length === 0}
              onClick={() => handleNotifyReminders(campaignMetrics.selected.map((student) => student.id), 'Sent reminders to selected students')}
            >
              Target selected
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 rounded" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSelectAllFiltered}>
                      {filtered.length > 0 && selectedStudentIds.length === filtered.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </Button>
                  </TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStudentSelection(s.id)}>
                        {selectedStudentIds.includes(s.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-[13px] font-mono">{s.studentCode}</TableCell>
                    <TableCell className="text-[13px] font-medium">
                      {s.firstName} {s.lastName}
                    </TableCell>
                    <TableCell className="text-[13px]">{s.program}</TableCell>
                    <TableCell className="text-[13px]">{s.classLevel || s.academicYear || '—'}</TableCell>
                    <TableCell className="text-[13px] font-medium">
                      <span className={Number(s.currentBalance) > 0 ? 'text-warning' : 'text-success'}>
                         {formatCurrency(Number(s.currentBalance))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${getStatusColor(Number(s.currentBalance))}`}>
                        {getStatusLabel(Number(s.currentBalance))}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => setViewingStudentHistory(s)}>
                            <History className="h-4 w-4 mr-2" /> Payment History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setViewingStudentDetails(s)}>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleEmailRemainder(s)} 
                            disabled={!s.user?.email || s.currentBalance <= 0}
                          >
                            <Mail className="h-4 w-4 mr-2" /> Send Reminder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Payment History Dialog */}
      <Dialog open={!!viewingStudentHistory} onOpenChange={(open) => !open && setViewingStudentHistory(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Payment History
            </DialogTitle>
            <DialogDescription>
              {viewingStudentHistory && (
                <>
                  {viewingStudentHistory.firstName} {viewingStudentHistory.lastName} • {viewingStudentHistory.studentCode || 'No ID'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {paymentsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            ) : studentPayments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No payments found for this student.</p>
                </CardContent>
              </Card>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-[13px]">
                        {p.paymentDate
                          ? formatDate(p.paymentDate)
                          : p.submittedAt
                            ? formatDate(p.submittedAt)
                            : 'N/A'}
                      </TableCell>
                      <TableCell className="text-[13px] font-mono">
                        {p.receiptNumber || p.externalReference || '—'}
                      </TableCell>
                      <TableCell className="text-[13px]">
                        {p.method?.replace(/_/g, ' ') || '—'}
                      </TableCell>
                      <TableCell className="text-[13px] font-medium">
                        {formatCurrency(Number(p.amount))}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => setSelectedPayment(p)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewingStudentDetails} onOpenChange={(open) => !open && setViewingStudentDetails(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Student Details
            </DialogTitle>
          </DialogHeader>

          {viewingStudentDetails && (
            <div className="space-y-6 py-2">
              {/* Header Card */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {viewingStudentDetails.firstName?.charAt(0)}{viewingStudentDetails.lastName?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[18px] font-semibold">
                        {viewingStudentDetails.firstName} {viewingStudentDetails.lastName}
                      </h3>
                      <p className="text-[13px] text-muted-foreground">{viewingStudentDetails.studentCode}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={`text-[10px] ${getStatusColor(Number(viewingStudentDetails.currentBalance))}`}>
                          {getStatusLabel(Number(viewingStudentDetails.currentBalance))}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {viewingStudentDetails.program}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Program</span>
                    </div>
                    <p className="text-[14px] font-medium">{viewingStudentDetails.program || '—'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Academic Year</span>
                    </div>
                    <p className="text-[14px] font-medium">{viewingStudentDetails.classLevel || viewingStudentDetails.academicYear || '—'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Email</span>
                    </div>
                    <p className="text-[14px] font-medium">{viewingStudentDetails.user?.email || '—'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Phone</span>
                    </div>
                    <p className="text-[14px] font-medium">{viewingStudentDetails.phoneNumber || viewingStudentDetails.user?.phone || '—'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Address</span>
                    </div>
                    <p className="text-[14px] font-medium">{viewingStudentDetails.address || '—'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-[12px] uppercase tracking-wide">Current Balance</span>
                    </div>
                    <p className={`text-[14px] font-medium ${Number(viewingStudentDetails.currentBalance) > 0 ? 'text-warning' : 'text-success'}`}>
                      {formatCurrency(Number(viewingStudentDetails.currentBalance))}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="text-[14px] font-medium">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <span className="text-muted-foreground">Enrollment Date:</span>
                      <p className="font-medium">{viewingStudentDetails.enrollmentDate ? formatDate(viewingStudentDetails.enrollmentDate) : '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <p className="font-medium">{viewingStudentDetails.dateOfBirth ? formatDate(viewingStudentDetails.dateOfBirth) : '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <p className="font-medium">{viewingStudentDetails.gender || '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nationality:</span>
                      <p className="font-medium">{viewingStudentDetails.nationality || '—'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setViewingStudentDetails(null);
                    setViewingStudentHistory(viewingStudentDetails);
                  }}
                >
                  <History className="h-4 w-4 mr-2" />
                  View Payment History
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEmailRemainder(viewingStudentDetails)}
                  disabled={!viewingStudentDetails.user?.email || viewingStudentDetails.currentBalance <= 0}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-[13px] text-muted-foreground">Amount</span>
                <span className="text-[18px] font-bold">{formatCurrency(Number(selectedPayment.amount))}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium"><PaymentStatusBadge status={selectedPayment.status} /></p>
                </div>
                <div>
                  <span className="text-muted-foreground">Method</span>
                  <p className="font-medium">{selectedPayment.method?.replace(/_/g, ' ') || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reference</span>
                  <p className="font-medium font-mono">{selectedPayment.receiptNumber || selectedPayment.externalReference || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">
                    {selectedPayment.paymentDate
                      ? formatDate(selectedPayment.paymentDate)
                      : selectedPayment.submittedAt
                        ? formatDate(selectedPayment.submittedAt)
                        : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedPayment.notes && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="text-[12px] text-muted-foreground">Notes</span>
                  <p className="text-[13px] mt-1">{selectedPayment.notes}</p>
                </div>
              )}
              {selectedPayment.proofUrl && (
                <div className="p-3 border rounded-lg">
                  <span className="text-[12px] text-muted-foreground">Receipt Image</span>
                  <a 
                    href={getFullImageUrl(selectedPayment.proofUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-2 text-[13px] text-primary hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
