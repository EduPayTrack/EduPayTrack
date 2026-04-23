import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, TrendingDown, CheckCircle, DollarSign, Loader2, FileImage, X, AlertCircle, Download, Clock3, ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../state/auth-context';
import { ApiError, apiFetch, downloadApiFile } from '../lib/api';
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
import { downloadStudentStatement } from '../lib/statement-pdf';
import { PaymentDeadlineCalendar } from '../components/payment-deadline-calendar';
import { PaymentReminders, generateRemindersFromDeadlines } from '../components/payment-reminders';
import { useFormAutosave } from '../lib/use-form-autosave';
import { useAppShortcuts } from '../lib/use-keyboard-shortcuts';
import { KeyboardShortcutsHelp } from '../components/keyboard-shortcuts-help';
import { AdvancedFilters, type AdvancedFiltersState } from '../components/advanced-filters';

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
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingClearance, setDownloadingClearance] = useState(false);

  // Keyboard shortcuts
  const { shortcuts, shortcutsHelpOpen, setShortcutsHelpOpen } = useAppShortcuts({
    onUpload: () => navigate('/student/upload-payment'),
    onNavigateHome: () => navigate('/student/dashboard'),
    onNavigateHistory: () => navigate('/student/payment-history'),
    onNavigateSettings: () => navigate('/student/settings'),
  });

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
      <PaymentDeadlineCalendar deadlines={data.deadlines} currentBalance={remaining} />

      {/* Payment Reminders */}
      <PaymentReminders 
        reminders={generateRemindersFromDeadlines(data.deadlines || [])} 
        onRemindersChange={(reminders) => {
          // TODO: Save reminder preferences to backend
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

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        open={shortcutsHelpOpen}
        onOpenChange={setShortcutsHelpOpen}
        shortcuts={shortcuts}
      />
    </div>
  );
}

/* ===== UPLOAD PAYMENT ===== */

interface ReceiptOcrResult {
  amount: number | null;
  reference: string | null;
  rawText?: string;
  provider?: 'GROQ' | 'PYTHON';
  confidence?: number;
  message?: string;
  debug?: {
    textSource: 'GROQ_JSON' | 'PYTHON_RAW';
    textPreview: string;
  };
}

type ReceiptScanIssue = {
  summary: string;
  details?: string[];
};

function getScanIssue(error: unknown): ReceiptScanIssue {
  if (error instanceof ApiError) {
    const backendDetails = error.data?.details;
    const details: string[] = [];

    if (backendDetails?.groq) {
      details.push(`Groq: ${backendDetails.groq}`);
    }
    if (backendDetails?.python) {
      details.push(`Python OCR: ${backendDetails.python}`);
    }
    if (backendDetails?.hint) {
      details.push(`Hint: ${backendDetails.hint}`);
    }

    return {
      summary: error.message || 'Receipt extraction failed.',
      details: details.length > 0 ? details : undefined,
    };
  }

  return {
    summary: error instanceof Error ? error.message : 'Receipt extraction failed.',
  };
}

export function UploadPaymentPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<ReceiptOcrResult | null>(null);
  const [scanIssue, setScanIssue] = useState<ReceiptScanIssue | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keyboard shortcuts
  const { shortcuts, shortcutsHelpOpen, setShortcutsHelpOpen } = useAppShortcuts({
    onNavigateHome: () => navigate('/student/dashboard'),
    onNavigateHistory: () => navigate('/student/payment-history'),
    onNavigateSettings: () => navigate('/student/settings'),
  });

  // Form state
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerName, setPayerName] = useState('');
  const [notes, setNotes] = useState('');
  const [autoFilledFields, setAutoFilledFields] = useState({
    amount: false,
    reference: false,
  });

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
    setOcrResult(null);
    setScanIssue(null);
    setAutoFilledFields({ amount: false, reference: false });
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
    setOcrResult(null);
    setScanIssue(null);
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const uploadResult = await apiFetch<any>('/payments/upload', {
        method: 'POST',
        body: formData,
      });

      setProofUrl(uploadResult.proofUrl);
      toast.success('Receipt uploaded successfully');

      if (!uploadResult.fileName) {
        return;
      }

      try {
        setIsScanning(true);
        const scanResult = await apiFetch<ReceiptOcrResult>('/payments/scan', {
          method: 'POST',
          body: JSON.stringify({ fileName: uploadResult.fileName }),
        });

        setOcrResult(scanResult);
        if (scanResult.amount !== null) {
          setAmount(String(scanResult.amount));
          setAutoFilledFields((current) => ({ ...current, amount: true }));
        }
        if (scanResult.reference) {
          setReference(scanResult.reference);
          setAutoFilledFields((current) => ({ ...current, reference: true }));
        }

        if (scanResult.amount !== null || scanResult.reference) {
          toast.success('Amount and reference were auto-filled. You can edit them before submit.');
        } else {
          toast.message('Groq extraction finished, but no amount or reference was detected. Please enter them manually.');
        }
      } catch (scanErr: any) {
        const issue = getScanIssue(scanErr);
        console.error('Receipt extraction failed', scanErr);
        setScanIssue(issue);
        toast.error(issue.summary);
      } finally {
        setIsScanning(false);
      }
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
          ocrText: ocrResult?.rawText || '',
          ocrAmount: ocrResult?.amount ?? undefined,
          ocrReference: ocrResult?.reference || '',
        }),
      });
      toast.success('Payment submitted for review!');
      // Reset form
      setFile(null);
      setPreviewUrl(null);

      setProofUrl(null);
      setOcrResult(null);
      setScanIssue(null);
      setAutoFilledFields({ amount: false, reference: false });
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
            <label htmlFor="receipt-file" className="text-[13px] font-medium mb-2 block">Receipt Image / PDF</label>
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
                  id="receipt-file"
                  name="receipt"
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
                    setOcrResult(null);
                    setScanIssue(null);
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
                        disabled={isUploading || isScanning}
                        onClick={uploadFile}
                      >
                        {isUploading ? (
                          <><Loader2 className="h-3 w-3 animate-spin mr-1" />Uploading...</>
                        ) : isScanning ? (
                          <><Loader2 className="h-3 w-3 animate-spin mr-1" />Scanning...</>
                        ) : (
                          'Upload receipt'
                        )}
                      </Button>
                    )}
                    {ocrResult && (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Groq has reviewed your receipt. Please continue filling the form and change anything that looks incorrect.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {(ocrResult || scanIssue) && (
          <Card className={scanIssue ? 'border-warning/30 bg-warning/5' : 'border-success/30 bg-success/5'}>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium">
                    {scanIssue ? 'Please review before continuing' : 'Receipt details added'}
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {scanIssue
                      ? 'Some details could not be filled automatically. Please check the form and enter anything missing.'
                      : 'We filled what we could from your receipt. Please continue and change anything if needed before submitting.'}
                  </p>
                </div>
                {ocrResult && !scanIssue ? (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Ready for review
                  </Badge>
                ) : null}
              </div>
              {ocrResult && (
                <div className="grid grid-cols-1 gap-3 text-[12px] md:grid-cols-3">
                  <div className="rounded-md border border-border/70 bg-background/80 p-3 text-muted-foreground">
                    <span className="font-medium text-foreground">Amount found</span>
                    <p className="mt-1">{ocrResult.amount !== null ? formatCurrency(ocrResult.amount) : 'Not found'}</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-background/80 p-3 text-muted-foreground">
                    <span className="font-medium text-foreground">Reference found</span>
                    <p className="mt-1">{ocrResult.reference || 'Not found'}</p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-background/80 p-3 text-muted-foreground">
                    <span className="font-medium text-foreground">Extraction confidence</span>
                    <p className="mt-1">{Math.round((ocrResult.confidence || 0) * 100)}%</p>
                  </div>
                </div>
              )}
              {scanIssue && (
                <div className="rounded-md border border-warning/20 bg-background/70 p-3 space-y-1 text-[12px] text-muted-foreground">
                  <p>{scanIssue.summary}</p>
                  {scanIssue.details?.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment details */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <label className="text-[13px] font-medium block">Payment Details</label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="payment-amount" className="text-[12px] text-muted-foreground font-medium">Amount (MWK) *</label>
                {autoFilledFields.amount ? (
                  <Badge variant="outline" className="ml-2 border-success/30 bg-success/10 text-success">
                    Auto-filled
                  </Badge>
                ) : null}
                <Input
                  id="payment-amount"
                  name="amount"
                  type="number"
                  placeholder="450000"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAutoFilledFields((current) => ({ ...current, amount: false }));
                  }}
                  autoComplete="transaction-amount"
                  className={cn(
                    'h-10',
                    autoFilledFields.amount && 'border-success/40 bg-success/5 ring-1 ring-success/20'
                  )}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="payment-method" className="text-[12px] text-muted-foreground font-medium">Payment Method *</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="payment-method" name="paymentMethod" className="h-10" aria-label="Payment Method">
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
                <label htmlFor="payment-reference" className="text-[12px] text-muted-foreground font-medium">Reference Number</label>
                {autoFilledFields.reference ? (
                  <Badge variant="outline" className="ml-2 border-success/30 bg-success/10 text-success">
                    Auto-filled
                  </Badge>
                ) : null}
                <Input
                  id="payment-reference"
                  name="referenceNumber"
                  placeholder="NBM-782331"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                    setAutoFilledFields((current) => ({ ...current, reference: false }));
                  }}
                  autoComplete="off"
                  className={cn(
                    'h-10',
                    autoFilledFields.reference && 'border-success/40 bg-success/5 ring-1 ring-success/20'
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="payment-date" className="text-[12px] text-muted-foreground font-medium">Payment Date *</label>
                <Input
                  id="payment-date"
                  name="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  autoComplete="transaction-date"
                  className="h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="payer-name" className="text-[12px] text-muted-foreground font-medium">Payer Name</label>
              <Input
                id="payer-name"
                name="payerName"
                placeholder="Name on the transaction"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                autoComplete="name"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="payment-notes" className="text-[12px] text-muted-foreground font-medium">Notes</label>
              <Input
                id="payment-notes"
                name="notes"
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                autoComplete="off"
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={isSubmitting || isScanning || !proofUrl}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
          ) : (
            'Submit Payment for Review'
          )}
        </Button>
      </form>

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        open={shortcutsHelpOpen}
        onOpenChange={setShortcutsHelpOpen}
        shortcuts={shortcuts}
      />
    </div>
  );
}

/* ===== PAYMENT HISTORY ===== */

export function PaymentHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [downloadingStatement, setDownloadingStatement] = useState(false);

  // Advanced filters state
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>({
    search: '',
    status: 'ALL',
    dateRange: {},
    amountRange: {},
    sortBy: 'newest',
    sortOrder: 'desc',
  });

  // Keyboard shortcuts
  const { shortcuts, shortcutsHelpOpen, setShortcutsHelpOpen } = useAppShortcuts({
    onUpload: () => navigate('/student/upload-payment'),
    onNavigateHome: () => navigate('/student/dashboard'),
    onNavigateSettings: () => navigate('/student/settings'),
  });

  useEffect(() => {
    apiFetch<any>('/students/me')
      .then((data) => {
        setDashboard(data);
        setPayments(data.payments || []);
      })
      .catch(() => toast.error('Failed to load payment history'))
      .finally(() => setLoading(false));
  }, []);

  // Apply advanced filters
  const filtered = useMemo(() => {
    let result = [...payments];

    // Search filter
    if (advancedFilters.search) {
      const query = advancedFilters.search.toLowerCase();
      result = result.filter(p => {
        const searchable = `${p.method || ''} ${p.externalReference || ''} ${p.receiptNumber || ''} ${p.status || ''}`.toLowerCase();
        return searchable.includes(query);
      });
    }

    // Status filter
    if (advancedFilters.status !== 'ALL') {
      result = result.filter(p => p.status === advancedFilters.status);
    }

    // Date range filter
    if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
      result = result.filter(p => {
        const date = new Date(p.paymentDate || p.submittedAt);
        if (advancedFilters.dateRange.from && date < new Date(advancedFilters.dateRange.from)) return false;
        if (advancedFilters.dateRange.to && date > new Date(advancedFilters.dateRange.to)) return false;
        return true;
      });
    }

    // Amount range filter
    if (advancedFilters.amountRange.min !== undefined || advancedFilters.amountRange.max !== undefined) {
      result = result.filter(p => {
        const amount = Number(p.amount || 0);
        if (advancedFilters.amountRange.min !== undefined && amount < advancedFilters.amountRange.min) return false;
        if (advancedFilters.amountRange.max !== undefined && amount > advancedFilters.amountRange.max) return false;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (advancedFilters.sortBy) {
        case 'newest':
          comparison = new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime();
          break;
        case 'oldest':
          comparison = new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime();
          break;
        case 'amount-high':
          comparison = Number(b.amount || 0) - Number(a.amount || 0);
          break;
        case 'amount-low':
          comparison = Number(a.amount || 0) - Number(b.amount || 0);
          break;
      }
      return advancedFilters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [payments, advancedFilters]);

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
      // Generate PDF client-side using jspdf (same as receipts)
      const approvedCount = payments.filter((p: any) => p.status === 'APPROVED').length;
      const pendingCount = payments.filter((p: any) => p.status === 'PENDING').length;
      const rejectedCount = payments.filter((p: any) => p.status === 'REJECTED').length;
      
      downloadStudentStatement({
        student: {
          id: user?.id || '',
          name: user?.name || '',
          studentCode: dashboard?.student?.studentCode || '',
          program: dashboard?.student?.program || '',
          academicYear: dashboard?.student?.academicYear || '',
          email: user?.email || '',
          phone: dashboard?.student?.phone || '',
        },
        summary: {
          totalPaid: dashboard?.summary?.totalPaid || 0,
          currentBalance: dashboard?.summary?.currentBalance || 0,
          totalFees: dashboard?.summary?.totalFees || (dashboard?.summary?.totalPaid || 0) + (dashboard?.summary?.currentBalance || 0),
          approvedCount: approvedCount,
          pendingCount: pendingCount,
          rejectedCount: rejectedCount,
        },
        payments: payments.map((p: any) => ({
          id: p.id,
          amount: p.amount,
          method: p.method,
          paymentDate: p.paymentDate,
          submittedAt: p.submittedAt,
          status: p.status,
          receiptNumber: p.receiptNumber,
          externalReference: p.externalReference,
          notes: p.notes,
        })),
        generatedAt: new Date().toISOString(),
      });
      
      toast.success('Statement downloaded');
    } catch (err: any) {
      console.error('Error generating statement:', err);
      toast.error(err.message || 'Unable to generate statement');
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
        <Button variant="outline" className="h-9 gap-2" onClick={downloadStatement} disabled={downloadingStatement}>
          {downloadingStatement ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download Statement
        </Button>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        statusOptions={[
          { id: 'all', label: 'All Statuses', value: 'ALL' },
          { id: 'pending', label: 'Pending', value: 'PENDING' },
          { id: 'approved', label: 'Approved', value: 'APPROVED' },
          { id: 'rejected', label: 'Rejected', value: 'REJECTED' },
        ]}
        sortOptions={[
          { id: 'newest', label: 'Newest First', value: 'newest' },
          { id: 'oldest', label: 'Oldest First', value: 'oldest' },
          { id: 'amount-high', label: 'Amount (High)', value: 'amount-high' },
          { id: 'amount-low', label: 'Amount (Low)', value: 'amount-low' },
        ]}
        totalResults={filtered.length}
      />

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
              {payments.length > 0
                ? 'No payments match your filters. Try adjusting your search criteria.'
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
                      <div className="flex items-center gap-3">
                        {/* Receipt Thumbnail Preview */}
                        {payment.proofUrl && (
                          <div className="relative group">
                            <img
                              src={getFullImageUrl(payment.proofUrl)}
                              alt="Receipt thumbnail"
                              className="h-12 w-12 rounded-md object-cover border border-border cursor-pointer hover:border-primary transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(getFullImageUrl(payment.proofUrl), '_blank');
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-md transition-colors" />
                          </div>
                        )}
                        <div className="text-[12px] text-muted-foreground">{isOpen ? 'Hide details' : 'View details'}</div>
                      </div>
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
                            <div className="mt-2 space-y-2">
                              <a
                                href={getFullImageUrl(payment.proofUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-md border border-border hover:border-primary transition-colors"
                              >
                                <img
                                  src={getFullImageUrl(payment.proofUrl)}
                                  alt="Receipt preview"
                                  className="w-full h-32 object-cover"
                                />
                              </a>
                              <a
                                className="text-[12px] text-primary hover:underline inline-flex items-center gap-1"
                                href={getFullImageUrl(payment.proofUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View full receipt →
                              </a>
                            </div>
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

      {/* Keyboard Shortcuts Help Dialog */}
      <KeyboardShortcutsHelp
        open={shortcutsHelpOpen}
        onOpenChange={setShortcutsHelpOpen}
        shortcuts={shortcuts}
      />
    </div>
  );
}
