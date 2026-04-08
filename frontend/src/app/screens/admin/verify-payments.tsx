import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  RotateCw,
  CheckSquare,
  Square,
  FileImage
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../../../components/ui/dialog';
import { formatCurrency } from '../../lib/utils';
import { PaymentStatusBadge, getFullImageUrl } from '../../components/admin/common/payment-helpers';
import { StudentPaymentHistoryDialog } from '../../components/admin/common/student-history-dialog';

export function VerifyPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [viewingStudentHistory, setViewingStudentHistory] = useState<any>(null);
  
  const [actionLoading, setActionLoading] = useState<string | undefined>(undefined);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const isAdminOrAccountant = user?.role === 'admin' || user?.role === 'accounts';
  const receiptUrl = viewingReceipt?.proofUrl ? getFullImageUrl(viewingReceipt.proofUrl) : '';
  const isImageReceipt = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(viewingReceipt?.proofUrl || '');
  const isPdfReceipt = /\.pdf$/i.test(viewingReceipt?.proofUrl || '');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const result = await apiFetch<any[]>('/admin/payments');
      setPayments(result || []);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
      setSelectedIds([]);
    }
  };

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const matchesFilter = filter === 'ALL' || p.status === filter;
      const matchesSearch = !search || 
        p.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        p.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        p.externalReference?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [payments, filter, search]);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id);
    try {
      await apiFetch(`/admin/payments/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success(`Payment ${status.toLowerCase()}`);
      loadPayments();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(undefined);
    }
  };

  const handleBulkAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => 
        apiFetch(`/admin/payments/${id}/review`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
      ));
      toast.success(`Bulk ${status.toLowerCase()} completed`);
      loadPayments();
    } catch (err: any) {
      toast.error(err.message || 'Bulk action failed');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(p => p.id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Verify Payments</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Review and approve student payment submissions</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadPayments} disabled={loading} className="h-9 gap-1.5 font-medium">
          <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search student or reference..." 
            className="pl-9 h-9" 
            value={search} 
            onChange={(e: any) => setSearch(e.target.value)} 
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && isAdminOrAccountant && (
          <div className="flex items-center gap-2 animate-scale-in">
            <Badge variant="outline" className="h-9 px-3">{selectedIds.length} Selected</Badge>
            <Button size="sm" className="h-9 bg-success hover:bg-success/90" onClick={() => handleBulkAction('APPROVED')} disabled={bulkActionLoading}>Approve</Button>
            <Button size="sm" variant="destructive" className="h-9" onClick={() => handleBulkAction('REJECTED')} disabled={bulkActionLoading}>Reject</Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 rounded" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSelectAll}>
                      {selectedIds.length === filtered.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                    </Button>
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSelect(p.id)}>
                        {selectedIds.includes(p.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="cursor-pointer hover:underline text-[13px] font-medium"
                        onClick={() => setViewingStudentHistory(p.student)}
                      >
                        {p.student?.firstName} {p.student?.lastName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{p.student?.studentCode}</div>
                    </TableCell>
                    <TableCell className="text-[13px] font-semibold">{formatCurrency(Number(p.amount))}</TableCell>
                    <TableCell className="text-[13px] font-mono text-muted-foreground">{p.externalReference || '—'}</TableCell>
                    <TableCell>
                      {p.proofUrl ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1.5 text-primary" 
                          onClick={() => setViewingReceipt(p)}
                        >
                          <FileImage className="h-4 w-4" /> View
                        </Button>
                      ) : '—'}
                    </TableCell>
                    <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-right">
                      {p.status === 'PENDING' && isAdminOrAccountant ? (
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="outline" className="h-8 border-success/30 text-success hover:bg-success/10" onClick={() => handleAction(p.id, 'APPROVED')} disabled={!!actionLoading}>Approve</Button>
                          <Button size="sm" variant="outline" className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleAction(p.id, 'REJECTED')} disabled={!!actionLoading}>Reject</Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground uppercase font-medium">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No payments found</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Receipt Viewer */}
      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Proof of payment submitted by the student for verification.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 rounded-lg p-2 min-h-[300px] flex items-center justify-center relative">
            {viewingReceipt?.proofUrl ? (
              isImageReceipt ? (
                <img src={receiptUrl} alt="Receipt" className="max-w-full max-h-[70vh] rounded shadow-lg" />
              ) : isPdfReceipt ? (
                <iframe
                  src={receiptUrl}
                  title="Receipt PDF"
                  className="h-[70vh] w-full rounded bg-white"
                />
              ) : (
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open receipt in a new tab
                </a>
              )
            ) : (
              <p className="text-muted-foreground text-sm">No image available</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
            <div><p className="text-muted-foreground uppercase text-[10px] mb-1">Reference</p><p className="font-mono">{viewingReceipt?.externalReference || 'N/A'}</p></div>
            <div><p className="text-muted-foreground uppercase text-[10px] mb-1">Amount</p><p className="font-bold">{formatCurrency(Number(viewingReceipt?.amount || 0))}</p></div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewingReceipt(null)}>Close</Button>
            {viewingReceipt?.status === 'PENDING' && isAdminOrAccountant && (
               <>
                 <Button className="bg-success hover:bg-success/90" onClick={() => { handleAction(viewingReceipt.id, 'APPROVED'); setViewingReceipt(null); }}>Approve Payment</Button>
                 <Button variant="destructive" onClick={() => { handleAction(viewingReceipt.id, 'REJECTED'); setViewingReceipt(null); }}>Reject Submission</Button>
               </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentPaymentHistoryDialog student={viewingStudentHistory} open={!!viewingStudentHistory} onOpenChange={(open: boolean) => !open && setViewingStudentHistory(null)} />
    </div>
  );
}
