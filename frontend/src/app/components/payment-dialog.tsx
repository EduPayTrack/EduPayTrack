import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { formatCurrency, formatDate } from '../../lib/utils';
import { FileImage, ExternalLink, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getFullImageUrl } from './admin/common/payment-helpers';

export interface Payment {
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
  student?: {
    name?: string;
    email?: string;
    studentId?: string;
  };
  reviewedBy?: {
    name?: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
}

interface PaymentDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  showActions?: boolean;
}

export function PaymentDialog({ 
  payment, 
  open, 
  onOpenChange, 
  onApprove, 
  onReject,
  showActions = false 
}: PaymentDialogProps) {
  if (!payment) return null;

  const receiptUrl = getFullImageUrl(payment.proofUrl);

  const statusConfig = {
    PENDING: { icon: AlertCircle, color: 'text-warning bg-warning/10 border-warning/20', label: 'Pending Review' },
    APPROVED: { icon: CheckCircle, color: 'text-success bg-success/10 border-success/20', label: 'Approved' },
    REJECTED: { icon: XCircle, color: 'text-destructive bg-destructive/10 border-destructive/20', label: 'Rejected' },
  };

  const config = statusConfig[payment.status];
  const StatusIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payment Details
            <Badge variant="outline" className={`text-[11px] ${config.color}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Reference: {payment.receiptNumber || payment.externalReference || payment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Amount */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-muted-foreground uppercase tracking-wide">Amount</p>
                  <p className="text-[24px] font-bold">{formatCurrency(Number(payment.amount))}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-muted-foreground uppercase tracking-wide">Method</p>
                  <p className="text-[14px] font-medium">{payment.method?.replace(/_/g, ' ') || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Info (if available) */}
          {payment.student && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-medium">Student Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[12px] text-muted-foreground">Name</p>
                    <p className="text-[13px] font-medium">{payment.student.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Student ID</p>
                    <p className="text-[13px] font-medium">{payment.student.studentId || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[12px] text-muted-foreground">Email</p>
                    <p className="text-[13px] font-medium">{payment.student.email || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-medium">Payment Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[12px] text-muted-foreground">Payment Date</p>
                  <p className="text-[13px] font-medium">{payment.paymentDate ? formatDate(payment.paymentDate) : '—'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Submitted</p>
                  <p className="text-[13px] font-medium">{payment.submittedAt ? formatDate(payment.submittedAt) : '—'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Payer Name</p>
                  <p className="text-[13px] font-medium">{payment.payerName || '—'}</p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Reference</p>
                  <p className="text-[13px] font-medium font-mono">{payment.externalReference || '—'}</p>
                </div>
              </div>
              {payment.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-[12px] text-muted-foreground">Notes</p>
                  <p className="text-[13px]">{payment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Info (if reviewed) */}
          {(payment.reviewedBy || payment.reviewedAt) && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-medium">Review Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[12px] text-muted-foreground">Reviewed By</p>
                    <p className="text-[13px] font-medium">{payment.reviewedBy?.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground">Reviewed At</p>
                    <p className="text-[13px] font-medium">{payment.reviewedAt ? formatDate(payment.reviewedAt) : '—'}</p>
                  </div>
                </div>
                {payment.rejectionReason && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-[12px] text-muted-foreground">Rejection Reason</p>
                    <p className="text-[13px] text-destructive">{payment.rejectionReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Proof / Receipt */}
          {payment.proofUrl && (
            <Card>
              <CardContent className="p-4">
                <p className="text-[12px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Receipt / Proof</p>
                {payment.proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <a 
                    href={receiptUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block border rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img 
                      src={receiptUrl} 
                      alt="Payment receipt" 
                      className="w-full h-48 object-cover"
                    />
                  </a>
                ) : (
                  <a 
                    href={receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <FileImage className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium">View Receipt</p>
                      <p className="text-[12px] text-muted-foreground">Click to open in new tab</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3 gap-2"
                  onClick={() => window.open(receiptUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {showActions && payment.status === 'PENDING' && onApprove && onReject && (
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  const reason = prompt('Enter rejection reason (optional):');
                  onReject(payment.id, reason || '');
                }}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button 
                className="flex-1 gap-2"
                onClick={() => onApprove(payment.id)}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
