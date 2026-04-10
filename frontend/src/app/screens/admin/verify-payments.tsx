import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  RotateCw,
  CheckSquare,
  Square,
  FileImage,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock3,
  ArrowDownUp,
  Link2,
  NotebookPen,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  History,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../../state/auth-context';
import {
  assistApproveStatementRow,
  getStatementImport,
  importStatement,
  listPaymentsForReview,
  listStatementImports as listStatementImportsApi,
  reconcilePaymentAdmin,
  resolveStatementRow,
  reviewPayment,
  updateStatementMapping,
  verifyPaymentAdmin,
} from '../../lib/admin-payments-api';
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
  TableCell,
} from '../../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import { formatCurrency } from '../../lib/utils';
import { PaymentStatusBadge, getFullImageUrl } from '../../components/admin/common/payment-helpers';
import { StudentPaymentHistoryDialog } from '../../components/admin/common/student-history-dialog';

export function VerifyPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [reconciliationFilter, setReconciliationFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [viewingStudentHistory, setViewingStudentHistory] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | undefined>(undefined);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [statementImport, setStatementImport] = useState<any>(null);
  const [statementImportLoading, setStatementImportLoading] = useState(false);
  const [statementImports, setStatementImports] = useState<any[]>([]);
  const [statementMapping, setStatementMapping] = useState<any>({
    reference: '',
    payerName: '',
    description: '',
    amount: '',
    transactionDate: '',
  });
  const [mappingLoading, setMappingLoading] = useState(false);
  const [noteDialog, setNoteDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    note: string;
    required: boolean;
    onConfirm: ((note: string) => Promise<void>) | null;
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Save',
    note: '',
    required: false,
    onConfirm: null,
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: (() => Promise<void>) | null;
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    onConfirm: null,
  });
  const [dialogLoading, setDialogLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAdminOrAccountant = user?.role === 'admin' || user?.role === 'accounts';
  const isAccounts = user?.role === 'accounts';
  const receiptUrl = viewingReceipt?.proofUrl ? getFullImageUrl(viewingReceipt.proofUrl) : '';
  const isImageReceipt = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(viewingReceipt?.proofUrl || '');
  const isPdfReceipt = /\.pdf$/i.test(viewingReceipt?.proofUrl || '');

  useEffect(() => {
    loadPayments();
    loadStatementImports();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const result = await listPaymentsForReview();
      setPayments(result || []);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
      setSelectedIds([]);
    }
  };

  const loadStatementImports = async () => {
    try {
      const result = await listStatementImportsApi();
      setStatementImports(result || []);
    } catch {
      toast.error('Failed to load statement imports');
    }
  };

  const queueMetrics = useMemo(() => {
    const pending = payments.filter((payment) => payment.status === 'PENDING');
    const highRisk = pending.filter(
      (payment) =>
        payment.duplicateFlag || payment.verificationStatus === 'FLAGGED' || Number(payment.amount || 0) >= 100000
    );
    const matched = pending.filter((payment) => payment.reconciliationStatus === 'MATCHED');

    return {
      pending: pending.length,
      highRisk: highRisk.length,
      unverified: pending.filter((payment) => payment.verificationStatus === 'UNVERIFIED').length,
      flagged: pending.filter((payment) => payment.verificationStatus === 'FLAGGED').length,
      matched: matched.length,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    return payments
      .map((payment) => ({
        ...payment,
        riskScore:
          (payment.duplicateFlag ? 3 : 0) +
          (payment.verificationStatus === 'FLAGGED' ? 3 : 0) +
          (Number(payment.amount || 0) >= 100000 ? 2 : 0) +
          (payment.status === 'PENDING' ? 1 : 0),
      }))
      .filter((payment) => {
        const matchesFilter = filter === 'ALL' || payment.status === filter;
        const matchesVerification =
          verificationFilter === 'ALL' || (payment.verificationStatus || 'UNVERIFIED') === verificationFilter;
        const matchesRisk =
          riskFilter === 'ALL' ||
          (riskFilter === 'HIGH' && payment.riskScore >= 4) ||
          (riskFilter === 'MEDIUM' && payment.riskScore >= 2 && payment.riskScore < 4) ||
          (riskFilter === 'LOW' && payment.riskScore < 2);
        const matchesReconciliation =
          reconciliationFilter === 'ALL' ||
          (reconciliationFilter === 'MATCHED' && payment.reconciliationStatus === 'MATCHED') ||
          (reconciliationFilter === 'UNMATCHED' && payment.reconciliationStatus !== 'MATCHED');
        const matchesSearch =
          !search ||
          payment.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          payment.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          payment.externalReference?.toLowerCase().includes(search.toLowerCase()) ||
          payment.receiptNumber?.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesVerification && matchesRisk && matchesReconciliation && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'HIGHEST') return Number(b.amount || 0) - Number(a.amount || 0);
        if (sortBy === 'RISK') return b.riskScore - a.riskScore || Number(new Date(b.submittedAt)) - Number(new Date(a.submittedAt));
        if (sortBy === 'OLDEST') return Number(new Date(a.submittedAt)) - Number(new Date(b.submittedAt));
        return Number(new Date(b.submittedAt)) - Number(new Date(a.submittedAt));
      });
  }, [payments, filter, verificationFilter, riskFilter, reconciliationFilter, search, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map((payment) => payment.id));
  };

  const getRiskConfig = (payment: any) => {
    if (!payment) {
      return { label: 'Normal', className: 'bg-success/10 text-success border-success/20' };
    }

    if (payment.duplicateFlag || payment.verificationStatus === 'FLAGGED') {
      return { label: 'High Risk', className: 'bg-destructive/10 text-destructive border-destructive/20' };
    }

    if (Number(payment.amount || 0) >= 100000) {
      return { label: 'Needs Review', className: 'bg-warning/10 text-warning border-warning/20' };
    }

    return { label: 'Normal', className: 'bg-success/10 text-success border-success/20' };
  };

  const getVerificationBadge = (status?: string) => {
    const value = status || 'UNVERIFIED';
    const tone: Record<string, string> = {
      VERIFIED: 'bg-success/10 text-success border-success/20',
      FLAGGED: 'bg-destructive/10 text-destructive border-destructive/20',
      UNVERIFIED: 'bg-warning/10 text-warning border-warning/20',
    };

    return (
      <Badge variant="outline" className={`text-[10px] ${tone[value] || tone.UNVERIFIED}`}>
        {value.charAt(0) + value.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const handleReconciliation = async (payment: any, status: 'MATCHED' | 'UNMATCHED') => {
    setNoteDialog({
      open: true,
      title: status === 'MATCHED' ? 'Mark as Matched' : 'Keep Unmatched',
      description:
        status === 'MATCHED'
          ? 'Add a reconciliation note (bank statement, mobile money export, teller batch, etc.)'
          : 'Add a note for why this should remain unmatched.',
      confirmLabel: status === 'MATCHED' ? 'Mark Matched' : 'Keep Unmatched',
      note:
        status === 'MATCHED'
          ? payment.reconciliationNote || 'Matched against the statement export.'
          : payment.reconciliationNote || 'Still waiting for the statement match.',
      required: false,
      onConfirm: async (note: string) => {
        setActionLoading(payment.id);
        try {
          await reconcilePaymentAdmin(payment.id, {
            reconciliationStatus: status,
            reconciliationNote: note.trim(),
          });
          toast.success(status === 'MATCHED' ? 'Payment marked as matched' : 'Payment kept in unmatched queue');
          await loadPayments();
        } catch (err: any) {
          toast.error(err.message || 'Reconciliation update failed');
        } finally {
          setActionLoading(undefined);
        }
      },
    });
  };

  const saveReconciliation = async (paymentId: string, status: 'MATCHED' | 'UNMATCHED', note: string) => {
    setActionLoading(paymentId);
    try {
      await reconcilePaymentAdmin(paymentId, {
        reconciliationStatus: status,
        reconciliationNote: note,
      });
      await loadPayments();
    } finally {
      setActionLoading(undefined);
    }
  };

  const clearReconciliation = async (paymentId: string) => {
    setActionLoading(paymentId);
    try {
      await reconcilePaymentAdmin(paymentId, {
        reconciliationStatus: 'UNMATCHED',
        reconciliationNote: '',
      });
      toast.success('Reconciliation status cleared');
      await loadPayments();
    } catch (err: any) {
      toast.error(err.message || 'Could not clear reconciliation status');
    } finally {
      setActionLoading(undefined);
    }
  };

  const handleImportStatement = async (file?: File) => {
    if (!file) return;

    setStatementImportLoading(true);
    try {
      const preview = await importStatement(file);
      setStatementImport(preview);
      setStatementMapping(preview.columnMapping || {});
      await loadStatementImports();
      toast.success('Statement imported and matched');
    } catch (err: any) {
      toast.error(err.message || 'Statement import failed');
    } finally {
      setStatementImportLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openStatementImport = async (importId: string) => {
    setStatementImportLoading(true);
    try {
      const result = await getStatementImport(importId);
      setStatementImport(result);
      setStatementMapping(result.columnMapping || {});
    } catch (err: any) {
      toast.error(err.message || 'Could not open statement import');
    } finally {
      setStatementImportLoading(false);
    }
  };

  const applyStatementMapping = async () => {
    if (!statementImport?.id) return;

    setMappingLoading(true);
    try {
      const remapped = await updateStatementMapping(statementImport.id, statementMapping);
      setStatementImport(remapped);
      setStatementMapping(remapped.columnMapping || {});
      await loadStatementImports();
      toast.success('Column mapping applied');
    } catch (err: any) {
      toast.error(err.message || 'Could not apply mapping');
    } finally {
      setMappingLoading(false);
    }
  };

  const reconcileFromStatement = async (row: any, suggestion: any) => {
    const note = [
      'Matched from imported statement',
      statementImport?.fileName ? `file: ${statementImport.fileName}` : null,
      row?.rowNumber ? `row: ${row.rowNumber}` : null,
      row?.reference ? `reference: ${row.reference}` : null,
      row?.payerName ? `name: ${row.payerName}` : null,
      row?.transactionDate ? `date: ${row.transactionDate}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      await saveReconciliation(suggestion.id, 'MATCHED', note);
      const updatedImport = await resolveStatementRow(statementImport.id, row.id, suggestion.id);
      setStatementImport(updatedImport);
      await loadStatementImports();
      toast.success(`Matched ${suggestion.student?.firstName} ${suggestion.student?.lastName}`);
    } catch (err: any) {
      toast.error(err.message || 'Could not reconcile suggested payment');
    }
  };

  const assistApproveFromStatement = async (row: any, suggestion: any) => {
    setConfirmDialog({
      open: true,
      title: 'Assist Approve Payment',
      description: `Approve ${suggestion.student?.firstName} ${suggestion.student?.lastName}'s payment in one step? This will reconcile, verify, and approve the payment based on the strong statement match.`,
      confirmLabel: 'Approve Payment',
      onConfirm: async () => {
        setActionLoading(suggestion.id);
        try {
          const updatedImport = await assistApproveStatementRow(statementImport.id, row.id, suggestion.id);
          setStatementImport(updatedImport);
          await loadPayments();
          await loadStatementImports();
          toast.success(`Payment approved for ${suggestion.student?.firstName} ${suggestion.student?.lastName}`);
        } catch (err: any) {
          toast.error(err.message || 'Could not auto-approve the payment');
        } finally {
          setActionLoading(undefined);
        }
      },
    });
  };

  const handleVerification = async (payment: any, verificationStatus: 'VERIFIED' | 'FLAGGED') => {
    setNoteDialog({
      open: true,
      title: verificationStatus === 'FLAGGED' ? 'Flag Payment' : 'Verify Payment',
      description:
        verificationStatus === 'FLAGGED'
          ? 'Enter a reason for flagging this payment.'
          : 'Add verification notes (optional).',
      confirmLabel: verificationStatus === 'FLAGGED' ? 'Flag Payment' : 'Verify Payment',
      note: verificationStatus === 'FLAGGED' ? '' : 'Verified against the receipt details.',
      required: verificationStatus === 'FLAGGED',
      onConfirm: async (note: string) => {
        if (verificationStatus === 'FLAGGED' && !note.trim()) {
          toast.error('A flag note is required.');
          return;
        }
        setActionLoading(payment.id);
        try {
          await verifyPaymentAdmin(payment.id, {
            verificationStatus,
            verificationNotes: note.trim() || 'Verified against the receipt details.',
          });
          toast.success(verificationStatus === 'VERIFIED' ? 'Payment verified' : 'Payment flagged');
          loadPayments();
        } catch (err: any) {
          toast.error(err.message || 'Verification failed');
        } finally {
          setActionLoading(undefined);
        }
      },
    });
  };

  const handleAction = async (payment: any, status: 'APPROVED' | 'REJECTED') => {
    if (user?.role === 'admin' && status === 'APPROVED' && payment.verificationStatus === 'UNVERIFIED') {
      toast.error('Accounts must verify this payment before an admin can approve it.');
      return;
    }

    if (status === 'REJECTED') {
      setNoteDialog({
        open: true,
        title: 'Reject Payment',
        description: 'Enter a short reason for rejecting this submission.',
        confirmLabel: 'Reject Payment',
        note: payment.reviewNotes || 'Receipt details do not match the submission.',
        required: true,
        onConfirm: async (reviewNotes: string) => {
          if (!reviewNotes.trim()) {
            toast.error('Please add a short rejection reason.');
            return;
          }
          setActionLoading(payment.id);
          try {
            await reviewPayment(payment.id, {
              status,
              reviewNotes: reviewNotes.trim(),
            });
            toast.success(`Payment ${status.toLowerCase()}`);
            loadPayments();
          } catch (err: any) {
            toast.error(err.message || 'Action failed');
          } finally {
            setActionLoading(undefined);
          }
        },
      });
      return;
    }

    setActionLoading(payment.id);
    try {
      await reviewPayment(payment.id, { status });
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
      const eligible = filtered.filter((payment) => selectedIds.includes(payment.id)).filter((payment) => {
        if (user?.role === 'admin' && status === 'APPROVED') {
          return payment.verificationStatus !== 'UNVERIFIED';
        }
        return true;
      });

      await Promise.all(
        eligible.map((payment) =>
          reviewPayment(payment.id, { status })
        )
      );

      toast.success(`Bulk ${status.toLowerCase()} completed`);
      loadPayments();
    } catch (err: any) {
      toast.error(err.message || 'Bulk action failed');
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] animate-fade-in space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-foreground">Verify Payments</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Triage by risk, verify suspicious receipts faster, and keep approvals moving.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadPayments} disabled={loading} className="h-9 gap-1.5 font-medium">
          <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { label: 'Pending Queue', value: queueMetrics.pending, icon: Clock3, tone: 'text-warning' },
          { label: 'High Risk', value: queueMetrics.highRisk, icon: AlertTriangle, tone: 'text-destructive' },
          { label: 'Needs Verification', value: queueMetrics.unverified, icon: ShieldAlert, tone: 'text-primary' },
          { label: 'Flagged', value: queueMetrics.flagged, icon: ShieldCheck, tone: 'text-destructive' },
          { label: 'Statement Matched', value: queueMetrics.matched, icon: Link2, tone: 'text-success' },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className={`mt-1 text-[24px] font-semibold ${item.tone}`}>{item.value}</p>
              </div>
              <item.icon className={`h-5 w-5 ${item.tone}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdminOrAccountant && (
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-foreground">Statement Import</h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Upload a bank or mobile money CSV, remap columns if needed, and reopen recent imports.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(event) => handleImportStatement(event.target.files?.[0] || undefined)}
                />
                <Button
                  variant="outline"
                  className="h-9 w-full gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={statementImportLoading}
                >
                  {statementImportLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Import CSV Statement
                </Button>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-[13px] font-medium">Recent Imports</h3>
                  </div>
                  <div className="space-y-2">
                    {statementImports.length > 0 ? (
                      statementImports.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/40 ${
                            statementImport?.id === item.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => openStatementImport(item.id)}
                        >
                          <p className="text-[12px] font-medium">{item.fileName}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {item.summary?.strongMatches || 0} strong, {item.summary?.possibleMatches || 0} possible
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {new Date(item.uploadedAt).toLocaleString()}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-[12px] text-muted-foreground">No statement imports yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {statementImport ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="h-9 px-3 text-[11px]">
                      <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
                      {statementImport.fileName}
                    </Badge>
                    <Badge variant="outline" className="h-9 px-3 text-[11px]">
                      {statementImport.totalRows || statementImport.summary?.totalRows || 0} rows
                    </Badge>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-[13px] font-medium">Column Mapping</h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-5">
                      {[
                        { key: 'reference', label: 'Reference' },
                        { key: 'payerName', label: 'Payer Name' },
                        { key: 'amount', label: 'Amount' },
                        { key: 'transactionDate', label: 'Date' },
                        { key: 'description', label: 'Description' },
                      ].map((field) => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[11px] font-medium text-muted-foreground">{field.label}</label>
                          <Select
                            value={statementMapping?.[field.key] || ''}
                            onValueChange={(value) => setStatementMapping((current: any) => ({ ...current, [field.key]: value }))}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {(statementImport.headers || []).map((header: string) => (
                                <SelectItem key={`${field.key}-${header}`} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" className="h-9 gap-2" onClick={applyStatementMapping} disabled={mappingLoading}>
                        {mappingLoading ? <RotateCw className="h-4 w-4 animate-spin" /> : <SlidersHorizontal className="h-4 w-4" />}
                        Apply Mapping
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rows</p>
                      <p className="mt-1 text-[20px] font-semibold">{statementImport.summary?.totalRows ?? 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Strong Matches</p>
                      <p className="mt-1 text-[20px] font-semibold text-success">{statementImport.summary?.strongMatches ?? 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Possible Matches</p>
                      <p className="mt-1 text-[20px] font-semibold text-warning">{statementImport.summary?.possibleMatches ?? 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">No Matches</p>
                      <p className="mt-1 text-[20px] font-semibold text-muted-foreground">{statementImport.summary?.noMatches ?? 0}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-xl border">
                  <div className="border-b p-3">
                    <h3 className="text-[13px] font-medium">Top Statement Rows</h3>
                  </div>
                  <div className="divide-y">
                    {statementImport.rows?.slice(0, 6).map((row: any) => (
                      <div key={row.id} className="space-y-3 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  row.matchState === 'STRONG_MATCH'
                                    ? 'bg-success/10 text-success border-success/20'
                                    : row.matchState === 'POSSIBLE_MATCH'
                                      ? 'bg-warning/10 text-warning border-warning/20'
                                      : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {row.matchState === 'STRONG_MATCH'
                                  ? 'Strong Match'
                                  : row.matchState === 'POSSIBLE_MATCH'
                                    ? 'Possible Match'
                                    : 'No Match'}
                              </Badge>
                              {row.resolvedPaymentId && (
                                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Reconciled
                                </Badge>
                              )}
                              {row.autoApprovedPaymentId && (
                                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Assisted Approval
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-[13px] font-medium">
                              {row.payerName || 'Unknown payer'} {row.reference ? `• ${row.reference}` : ''}
                            </p>
                            <p className="mt-1 text-[12px] text-muted-foreground">
                              {formatCurrency(Number(row.amount || 0))}
                              {row.transactionDate ? ` • ${new Date(row.transactionDate).toLocaleDateString()}` : ''}
                              {row.description ? ` • ${row.description}` : ''}
                            </p>
                          </div>
                        </div>

                        {row.suggestions?.length > 0 ? (
                          <div className="space-y-2">
                            {row.suggestions.map((suggestion: any) => (
                              <div key={suggestion.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
                                <div>
                                  <p className="text-[13px] font-medium">
                                    {suggestion.student?.firstName} {suggestion.student?.lastName}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {suggestion.student?.studentCode} • {suggestion.reference} • score {suggestion.score}
                                  </p>
                                  <p className="mt-1 text-[11px] text-muted-foreground">{suggestion.reasons?.join(', ')}</p>
                                  {suggestion.canAutoApprove && (
                                    <p className="mt-1 text-[11px] font-medium text-primary">Eligible for assisted approval</p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {suggestion.canAutoApprove && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                                      disabled={!!row.resolvedPaymentId || actionLoading === suggestion.id}
                                      onClick={() => assistApproveFromStatement(row, suggestion)}
                                    >
                                      {actionLoading === suggestion.id ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                      Assist Approve
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    className="h-8 gap-1.5"
                                    disabled={!!row.resolvedPaymentId || actionLoading === suggestion.id}
                                    onClick={() => reconcileFromStatement(row, suggestion)}
                                  >
                                    {actionLoading === suggestion.id ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                                    Match Payment
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[12px] text-muted-foreground">No likely pending payment matches were found for this row.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed text-center">
                  <div className="space-y-2 px-6">
                    <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground/60" />
                    <p className="text-[13px] font-medium">Import a statement to start matching transactions</p>
                    <p className="text-[12px] text-muted-foreground">
                      After upload, you can reopen past imports and remap CSV columns if the bank export headers are unusual.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student or reference..."
            className="h-9 pl-9"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Verification" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Verification</SelectItem>
            <SelectItem value="UNVERIFIED">Unverified</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="FLAGGED">Flagged</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Risk</SelectItem>
            <SelectItem value="HIGH">High Risk</SelectItem>
            <SelectItem value="MEDIUM">Needs Review</SelectItem>
            <SelectItem value="LOW">Normal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={reconciliationFilter} onValueChange={setReconciliationFilter}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Reconciliation" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Reconciliation</SelectItem>
            <SelectItem value="MATCHED">Statement Matched</SelectItem>
            <SelectItem value="UNMATCHED">Needs Matching</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-9 w-[150px]">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Newest</SelectItem>
            <SelectItem value="OLDEST">Oldest</SelectItem>
            <SelectItem value="HIGHEST">Highest Amount</SelectItem>
            <SelectItem value="RISK">Highest Risk</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && isAdminOrAccountant && (
          <div className="animate-scale-in flex items-center gap-2">
            <Badge variant="outline" className="h-9 px-3">{selectedIds.length} Selected</Badge>
            <Button size="sm" className="h-9 bg-success hover:bg-success/90" onClick={() => handleBulkAction('APPROVED')} disabled={bulkActionLoading}>
              Approve
            </Button>
            <Button size="sm" variant="destructive" className="h-9" onClick={() => handleBulkAction('REJECTED')} disabled={bulkActionLoading}>
              Reject
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-6">{[1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-12 rounded" />)}</div>
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
                  <TableHead>Risk</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Reconciliation</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((payment) => {
                  const risk = getRiskConfig(payment);
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSelect(payment.id)}>
                          {selectedIds.includes(payment.id) ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="cursor-pointer text-[13px] font-medium hover:underline" onClick={() => setViewingStudentHistory(payment.student)}>
                          {payment.student?.firstName} {payment.student?.lastName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{payment.student?.studentCode}</div>
                      </TableCell>
                      <TableCell className="text-[13px] font-semibold">{formatCurrency(Number(payment.amount))}</TableCell>
                      <TableCell className="text-[13px] font-mono text-muted-foreground">{payment.externalReference || payment.receiptNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${risk.className}`}>
                          {risk.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-y-1">
                        {getVerificationBadge(payment.verificationStatus)}
                        {payment.duplicateFlag && <div className="text-[10px] text-destructive">Duplicate reference detected</div>}
                      </TableCell>
                      <TableCell className="space-y-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            payment.reconciliationStatus === 'MATCHED'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {payment.reconciliationStatus === 'MATCHED' ? 'Matched' : 'Needs Match'}
                        </Badge>
                        {payment.reconciliationNote && (
                          <div className="line-clamp-2 max-w-[190px] text-[10px] text-muted-foreground">
                            {payment.reconciliationNote}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.proofUrl ? (
                          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary" onClick={() => setViewingReceipt(payment)}>
                            <FileImage className="h-4 w-4" /> View
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell><PaymentStatusBadge status={payment.status} /></TableCell>
                      <TableCell className="text-right">
                        {payment.status === 'PENDING' && isAdminOrAccountant ? (
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {isAccounts && (
                              <>
                                <Button size="sm" variant="outline" className="h-8" onClick={() => handleVerification(payment, 'VERIFIED')} disabled={!!actionLoading}>
                                  Verify
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 border-warning/30 text-warning hover:bg-warning/10" onClick={() => handleVerification(payment, 'FLAGGED')} disabled={!!actionLoading}>
                                  Flag
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-primary/30 text-primary hover:bg-primary/10"
                                  onClick={() => handleReconciliation(payment, payment.reconciliationStatus === 'MATCHED' ? 'UNMATCHED' : 'MATCHED')}
                                >
                                  {payment.reconciliationStatus === 'MATCHED' ? 'Unmatch' : 'Match'}
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" className="h-8 border-success/30 text-success hover:bg-success/10" onClick={() => handleAction(payment, 'APPROVED')} disabled={!!actionLoading}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleAction(payment, 'REJECTED')} disabled={!!actionLoading}>
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium uppercase text-muted-foreground">Processed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">No payments found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={noteDialog.open}
        onOpenChange={(open) => setNoteDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{noteDialog.title}</DialogTitle>
            <DialogDescription>{noteDialog.description}</DialogDescription>
          </DialogHeader>
          <textarea
            value={noteDialog.note}
            onChange={(e) => setNoteDialog((prev) => ({ ...prev, note: e.target.value }))}
            className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Enter note..."
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNoteDialog((prev) => ({ ...prev, open: false, onConfirm: null }))}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (noteDialog.required && !noteDialog.note.trim()) {
                  toast.error('This note is required.');
                  return;
                }
                if (!noteDialog.onConfirm) return;
                setDialogLoading(true);
                try {
                  await noteDialog.onConfirm(noteDialog.note);
                  setNoteDialog((prev) => ({ ...prev, open: false, onConfirm: null }));
                } finally {
                  setDialogLoading(false);
                }
              }}
              disabled={dialogLoading}
            >
              {dialogLoading ? 'Saving...' : noteDialog.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false, onConfirm: null }))}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!confirmDialog.onConfirm) return;
                setDialogLoading(true);
                try {
                  await confirmDialog.onConfirm();
                  setConfirmDialog((prev) => ({ ...prev, open: false, onConfirm: null }));
                } finally {
                  setDialogLoading(false);
                }
              }}
              disabled={dialogLoading}
            >
              {dialogLoading ? 'Working...' : confirmDialog.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingReceipt} onOpenChange={() => setViewingReceipt(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>Proof of payment submitted by the student for verification.</DialogDescription>
          </DialogHeader>
          <div className="relative flex min-h-[300px] items-center justify-center rounded-lg bg-muted/30 p-2">
            {viewingReceipt?.proofUrl ? (
              isImageReceipt ? (
                <img src={receiptUrl} alt="Receipt" className="max-h-[60vh] w-auto max-w-full rounded shadow-lg" />
              ) : isPdfReceipt ? (
                <iframe src={receiptUrl} title="Receipt PDF" className="h-[60vh] w-full rounded bg-white" />
              ) : (
                <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  Open receipt in a new tab
                </a>
              )
            ) : (
              <p className="text-sm text-muted-foreground">No image available</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Reference</p>
              <p className="font-mono">{viewingReceipt?.externalReference || viewingReceipt?.receiptNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Amount</p>
              <p className="font-bold">{formatCurrency(Number(viewingReceipt?.amount || 0))}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Verification</p>
              {getVerificationBadge(viewingReceipt?.verificationStatus)}
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Risk</p>
              <Badge variant="outline" className={`text-[10px] ${getRiskConfig(viewingReceipt).className}`}>
                {getRiskConfig(viewingReceipt).label}
              </Badge>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase text-muted-foreground">Reconciliation</p>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  viewingReceipt?.reconciliationStatus === 'MATCHED'
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {viewingReceipt?.reconciliationStatus === 'MATCHED' ? 'Statement Matched' : 'Needs Matching'}
              </Badge>
            </div>
          </div>
          {viewingReceipt?.reconciliationNote && (
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
              <p className="text-[10px] uppercase text-muted-foreground">Reconciliation Note</p>
              <p className="mt-1">{viewingReceipt.reconciliationNote}</p>
            </div>
          )}
          {(viewingReceipt?.verificationNotes || viewingReceipt?.reviewNotes) && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              {viewingReceipt?.verificationNotes && (
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Verification Notes</p>
                  <p>{viewingReceipt.verificationNotes}</p>
                </div>
              )}
              {viewingReceipt?.reviewNotes && (
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Review Notes</p>
                  <p>{viewingReceipt.reviewNotes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewingReceipt(null)}>Close</Button>
            {isAccounts && viewingReceipt && (
              <>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    handleReconciliation(viewingReceipt, viewingReceipt.reconciliationStatus === 'MATCHED' ? 'UNMATCHED' : 'MATCHED');
                    setViewingReceipt(null);
                  }}
                >
                  <NotebookPen className="h-4 w-4" />
                  {viewingReceipt.reconciliationStatus === 'MATCHED' ? 'Keep Unmatched' : 'Mark Matched'}
                </Button>
                {viewingReceipt.reconciliationStatus && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      clearReconciliation(viewingReceipt.id);
                      setViewingReceipt(null);
                    }}
                  >
                    Clear Match
                  </Button>
                )}
              </>
            )}
            {viewingReceipt?.status === 'PENDING' && isAdminOrAccountant && (
              <>
                {isAccounts && (
                  <>
                    <Button variant="outline" onClick={() => { handleVerification(viewingReceipt, 'VERIFIED'); setViewingReceipt(null); }}>Verify</Button>
                    <Button variant="outline" className="border-warning/30 text-warning hover:bg-warning/10" onClick={() => { handleVerification(viewingReceipt, 'FLAGGED'); setViewingReceipt(null); }}>Flag</Button>
                  </>
                )}
                <Button className="bg-success hover:bg-success/90" onClick={() => { handleAction(viewingReceipt, 'APPROVED'); setViewingReceipt(null); }}>Approve Payment</Button>
                <Button variant="destructive" onClick={() => { handleAction(viewingReceipt, 'REJECTED'); setViewingReceipt(null); }}>Reject Submission</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentPaymentHistoryDialog student={viewingStudentHistory} open={!!viewingStudentHistory} onOpenChange={(open: boolean) => !open && setViewingStudentHistory(null)} />
    </div>
  );
}
