import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Upload, TrendingDown, CheckCircle, DollarSign, Loader2, FileImage, X, AlertCircle, Download, Clock3, ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../state/auth-context';
import { apiFetch, downloadApiFile } from '../lib/api';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { getFullImageUrl } from '../components/admin/common/payment-helpers';
import { downloadPaymentReceipt, type ReceiptData } from '../lib/receipt-pdf';
import { PaymentDeadlineCalendar } from '../components/payment-deadline-calendar';
import { PaymentReminders, type PaymentReminder, type ReminderPreferences, generateSampleReminders } from '../components/payment-reminders';
import { useFormAutosave } from '../lib/use-form-autosave';

/* ---- Status badge helper ---- */
function PaymentStatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  const map: Record<string, string> = {
    APPROVED: 'bg-success/10 text-success border-success/20',
    PENDING: 'bg-warning/10 text-warning border-warning/20',
    REJECTED: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${map[s] || ''}`}>
      {s.charAt(0) + s.slice(1).toLowerCase()}
    </Badge>
  );
}

/* ===== STUDENT DASHBOARD ===== */

export function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingClearance, setDownloadingClearance] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiFetch('/students/me')
      .then((res) => setData(res))
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-[1000px] animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive/60" />
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const totalPaid = data.summary.totalPaid;
  const remaining = data.summary.currentBalance;
  const totalFees = totalPaid + remaining;
  const paidPercent = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;
  const isCleared = Number(remaining) <= 0;

  const downloadClearanceLetter = async () => {
    if (!isCleared) {
      toast.error('Clearance letter is only available when your balance is fully cleared.');
      return;
    }

    setDownloadingClearance(true);
    try {
      await downloadApiFile('/students/me/clearance-letter.pdf', 'clearance-letter.pdf');
      toast.success('Clearance letter downloaded');
    } catch (err: any) {
      toast.error(err.message || 'Unable to download clearance letter');
    } finally {
      setDownloadingClearance(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1000px] animate-fade-in relative">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-info/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Student'}</span>
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1 font-medium">
            {data.student?.program || 'Student'} • {data.student?.academicYear || 'Academic Year 2025/2026'}
          </p>
        </div>
        <Link to="/student/upload-payment" className="animate-scale-in animate-delay-100">
          <Button size="default" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
            <Upload className="h-4 w-4" />Upload Payment
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card animate-slide-in-right animate-delay-100">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-[13px] text-muted-foreground uppercase tracking-wider font-semibold">Total Fees</span>
            </div>
            <span className="text-[28px] font-bold tracking-tight">{formatCurrency(totalFees)}</span>
          </CardContent>
        </Card>
        <Card className="glass-card animate-slide-in-right animate-delay-200">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-[13px] text-muted-foreground uppercase tracking-wider font-semibold">Paid</span>
            </div>
            <span className="text-[28px] font-bold tracking-tight text-success">{formatCurrency(totalPaid)}</span>
          </CardContent>
        </Card>
        <Card className="glass-card animate-slide-in-right animate-delay-300">
          <CardContent className="pt-5 pb-5 px-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <span className="text-[13px] text-muted-foreground uppercase tracking-wider font-semibold">Remaining</span>
            </div>
            <span className="text-[28px] font-bold tracking-tight">{formatCurrency(remaining)}</span>
          </CardContent>
        </Card>
      </div>

      <Card className={isCleared ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}>
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 rounded-full p-2 ${isCleared ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
              {isCleared ? <BadgeCheck className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-[16px] font-semibold">{isCleared ? 'Financial clearance available' : 'Clearance pending'}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {isCleared
                  ? 'Your balance is fully cleared. You can download a printable fee clearance letter now.'
                  : `You still have ${formatCurrency(Number(remaining))} outstanding. Settle the balance to unlock your clearance letter.`}
              </p>
            </div>
          </div>
          <Button
            variant={isCleared ? 'default' : 'outline'}
            className="gap-2"
            disabled={!isCleared || downloadingClearance}
            onClick={downloadClearanceLetter}
          >
            {downloadingClearance ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Clearance Letter
          </Button>
        </CardContent>
      </Card>

      {/* Progress bar */}
      <Card>
        <CardContent className="pt-4 pb-4 px-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-muted-foreground">Payment progress</span>
            <span className="text-[13px] font-medium">{paidPercent}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-success/80 rounded-full transition-all duration-700"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-3 px-4 text-center">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide">Installments</p>
            <p className="text-lg font-semibold">{data.summary.installmentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4 text-center">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide">Pending</p>
            <p className="text-lg font-semibold text-warning">{data.summary.pendingVerifications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4 text-center">
            <p className="text-[12px] text-muted-foreground uppercase tracking-wide">Rejected</p>
            <p className="text-lg font-semibold text-destructive">{data.summary.rejectedSubmissions}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Deadline Calendar */}
      <PaymentDeadlineCalendar currentBalance={remaining} />

      {/* Payment Reminders */}
      <PaymentReminders 
        reminders={generateSampleReminders()} 
        onRemindersChange={(reminders) => {
          // TODO: Save to backend when API is ready
          console.log('Reminders updated:', reminders);
        }}
      />

      {/* Recent payments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-medium text-foreground">Recent Payments</h2>
          <Link to="/student/payment-history">
            <Button variant="ghost" size="sm" className="text-[12px] text-primary">
              View all →
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            {data.payments.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-muted-foreground">
                No payments submitted yet. Upload your first payment receipt to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="stagger-children">
                  {data.payments.slice(0, 5).map((p: any) => (
                    <TableRow key={p.id} className="animate-fade-in">
                      <TableCell className="text-[13px]">{formatDate(p.paymentDate || p.submittedAt)}</TableCell>
                      <TableCell className="text-[13px] text-muted-foreground font-mono">{p.receiptNumber || p.externalReference || 'N/A'}</TableCell>
                      <TableCell className="text-[13px] font-medium">{formatCurrency(Number(p.amount))}</TableCell>
                      <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ===== UPLOAD PAYMENT ===== */

export function UploadPaymentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerName, setPayerName] = useState('');
  const [notes, setNotes] = useState('');

  // Memoize form data to prevent infinite loop in useFormAutosave
  const formData = useMemo(() => ({ 
    amount, 
    method, 
    reference, 
    paymentDate, 
    payerName, 
    notes 
  }), [amount, method, reference, paymentDate, payerName, notes]);

  // Memoize onRestore callback
  const handleRestore = useCallback((savedData: any) => {
    setAmount(savedData.amount || '');
    setMethod(savedData.method || '');
    setReference(savedData.reference || '');
    setPaymentDate(savedData.paymentDate || new Date().toISOString().split('T')[0]);
    setPayerName(savedData.payerName || '');
    setNotes(savedData.notes || '');
    toast.success('Draft restored');
  }, []);

  // Auto-save form data
  const { hasDraft, lastSaved, restoreDraft, clearDraft } = useFormAutosave({
    key: 'edu-pay-track-payment-draft',
    data: formData,
    onRestore: handleRestore,
    debounceMs: 1500,
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const result = await apiFetch<any>('/payments/upload', {
        method: 'POST',
        body: formData,
      });

      setProofUrl(result.proofUrl);
      toast.success('Receipt uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      toast.error('Please upload a receipt first');
      return;
    }
    if (!amount || !method || !paymentDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(amount),
          method,
          externalReference: reference,
          paymentDate,
          proofUrl,
          payerName,
          notes,
        }),
      });
      toast.success('Payment submitted for review!');
      // Reset form
      setFile(null);
      setPreviewUrl(null);

      setProofUrl(null);
      setAmount('');
      setMethod('');
      setReference('');
      setPayerName('');
      setNotes('');
      // Clear saved draft after successful submission
      clearDraft();
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[680px] animate-fade-in">
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Upload Payment</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">Submit a receipt for review and approval</p>
      </div>

      {/* Draft Restore Banner */}
      {hasDraft && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-primary" />
                <span className="text-[13px]">
                  You have a saved draft
                  {lastSaved && ` (saved ${lastSaved.toLocaleTimeString()})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restoreDraft()}
                >
                  Restore Draft
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => clearDraft()}
                >
                  Discard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File upload zone */}
        <Card>
          <CardContent className="p-5">
            <label className="text-[13px] font-medium mb-2 block">Receipt Image / PDF</label>
            {!file ? (
              <div
                className={cn(
                  "flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-10 cursor-pointer transition-all duration-200",
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className={cn(
                  "p-3 rounded-full mb-3 transition-all duration-200",
                  isDragging ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
                )}>
                  <Upload className="h-6 w-6" />
                </div>
                <p className={cn(
                  "text-[14px] font-medium transition-colors",
                  isDragging ? "text-primary" : "text-foreground"
                )}>
                  {isDragging ? "Drop receipt here" : "Click or drag receipt here"}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Accepts JPG, PNG, PDF up to 5MB
                </p>
                {isDragging && (
                  <p className="text-[11px] text-primary mt-2 animate-pulse">
                    Release to upload
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setProofUrl(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="flex items-center gap-3">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Receipt preview" className="h-20 w-20 object-cover rounded-md border" />
                  ) : (
                    <div className="h-20 w-20 rounded-md border bg-muted flex items-center justify-center">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{file.name}</p>
                    <p className="text-[12px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    {proofUrl ? (
                      <Badge variant="outline" className="text-[11px] mt-1 bg-success/10 text-success border-success/20">
                        ✓ Uploaded
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        className="mt-2 h-7 text-[12px]"
                        disabled={isUploading}
                        onClick={uploadFile}
                      >
                        {isUploading ? (
                          <><Loader2 className="h-3 w-3 animate-spin mr-1" />Uploading...</>
                        ) : (
                          'Upload receipt'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment details */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <label className="text-[13px] font-medium block">Payment Details</label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground font-medium">Amount (MWK) *</label>
                <Input
                  type="number"
                  placeholder="450000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground font-medium">Payment Method *</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_CREDIT_CARD">Mobile / Card</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground font-medium">Reference Number</label>
                <Input
                  placeholder="NBM-782331"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] text-muted-foreground font-medium">Payment Date *</label>
                <Input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground font-medium">Payer Name</label>
              <Input
                placeholder="Name on the transaction"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] text-muted-foreground font-medium">Notes</label>
              <Input
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={isSubmitting || !proofUrl}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
          ) : (
            'Submit Payment for Review'
          )}
        </Button>
      </form>
    </div>
  );
}

/* ===== PAYMENT HISTORY ===== */

export function PaymentHistoryPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [downloadingStatement, setDownloadingStatement] = useState(false);

  useEffect(() => {
    apiFetch<any>('/students/me')
      .then((data) => {
        setDashboard(data);
        setPayments(data.payments || []);
      })
      .catch(() => toast.error('Failed to load payment history'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = statusFilter === 'ALL'
    ? payments
    : payments.filter(p => p.status === statusFilter);

  const getVerificationState = (payment: any) => {
    if (payment.verificationStatus === 'FLAGGED') {
      return { icon: ShieldAlert, label: 'Flagged', className: 'text-destructive bg-destructive/10 border-destructive/20' };
    }
    if (payment.verificationStatus === 'VERIFIED') {
      return { icon: ShieldCheck, label: 'Verified', className: 'text-success bg-success/10 border-success/20' };
    }
    return { icon: Clock3, label: 'Awaiting verification', className: 'text-warning bg-warning/10 border-warning/20' };
  };

  const downloadStatement = async () => {
    setDownloadingStatement(true);
    try {
      await downloadApiFile('/students/me/statement.pdf', 'statement.pdf');
      toast.success('Statement downloaded');
    } catch (err: any) {
      toast.error(err.message || 'Unable to download statement');
    } finally {
      setDownloadingStatement(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-[1000px]">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1000px] animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Payment History</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {payments.length} payment{payments.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-9 gap-2" onClick={downloadStatement} disabled={downloadingStatement}>
            {downloadingStatement ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Statement
          </Button>
        </div>
      </div>

      {dashboard && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total Paid</p>
              <p className="mt-2 text-[24px] font-semibold text-success">{formatCurrency(Number(dashboard.summary?.totalPaid || 0))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Current Balance</p>
              <p className="mt-2 text-[24px] font-semibold">{formatCurrency(Number(dashboard.summary?.currentBalance || 0))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pending Reviews</p>
              <p className="mt-2 text-[24px] font-semibold text-warning">{dashboard.summary?.pendingVerifications || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4 stagger-children">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-[13px] text-muted-foreground">
              {statusFilter !== 'ALL'
                ? `No ${statusFilter.toLowerCase()} payments found.`
                : 'No payments submitted yet.'}
            </CardContent>
          </Card>
        ) : (
          filtered.map((payment: any, index: number) => {
            const verification = getVerificationState(payment);
            const VerificationIcon = verification.icon;
            const isOpen = selectedPaymentId === payment.id;

            return (
              <Card key={payment.id} className="overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-4 text-left transition-colors hover:bg-muted/30"
                    onClick={() => setSelectedPaymentId(isOpen ? null : payment.id)}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <PaymentStatusBadge status={payment.status} />
                          <Badge variant="outline" className={`text-[10px] ${verification.className}`}>
                            <VerificationIcon className="mr-1 h-3 w-3" />
                            {verification.label}
                          </Badge>
                        </div>
                        <p className="text-[15px] font-medium">
                          {formatCurrency(Number(payment.amount || 0))} via {payment.method?.replace(/_/g, ' ') || 'Unknown'}
                        </p>
                        <div className="flex flex-wrap gap-3 text-[12px] text-muted-foreground">
                          <span>{formatDate(payment.paymentDate || payment.submittedAt)}</span>
                          <span className="font-mono">{payment.receiptNumber || payment.externalReference || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="text-[12px] text-muted-foreground">{isOpen ? 'Hide details' : 'View details'}</div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="space-y-4 border-t border-border bg-muted/20 p-4">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Submission notes</p>
                          <p className="mt-2 text-[13px]">{payment.notes || 'No notes provided.'}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Review outcome</p>
                          <p className="mt-2 text-[13px]">{payment.reviewNotes || payment.verificationNotes || 'No reviewer notes yet.'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-[13px] md:grid-cols-3">
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Submitted</p>
                          <p className="mt-1">{formatDate(payment.submittedAt)}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Verification status</p>
                          <p className="mt-1">{payment.verificationStatus || 'UNVERIFIED'}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-background p-3">
                          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Receipt</p>
                          {payment.proofUrl ? (
                            <a
                              className="mt-1 inline-block text-primary hover:underline"
                              href={getFullImageUrl(payment.proofUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open receipt
                            </a>
                          ) : (
                            <p className="mt-1">No receipt attached</p>
                          )}
                        </div>
                      </div>

                      {/* Download Official Receipt Button */}
                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            const receiptData: ReceiptData = {
                              id: payment.id,
                              amount: payment.amount,
                              status: payment.status,
                              method: payment.method,
                              externalReference: payment.externalReference,
                              receiptNumber: payment.receiptNumber,
                              paymentDate: payment.paymentDate,
                              submittedAt: payment.submittedAt,
                              payerName: payment.payerName,
                              notes: payment.notes,
                              student: dashboard?.student || payment.student,
                              reviewedBy: payment.reviewedBy,
                              reviewedAt: payment.reviewedAt,
                            };
                            downloadPaymentReceipt(receiptData);
                            toast.success('Receipt downloaded');
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download Official Receipt
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
