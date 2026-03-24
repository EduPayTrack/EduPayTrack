import { useState } from 'react';
import type { PaymentRecord } from '../../../types/api';
import { formatMoney, formatDate } from '../../../utils/format';

type VerificationModalProps = {
  payment: PaymentRecord;
  onClose: () => void;
  onReview: (status: 'APPROVED' | 'REJECTED', notes: string) => void;
  onVerifyOnly?: (flagIssue: boolean, notes: string) => void;
  isSubmitting: boolean;
  role?: 'ADMIN' | 'ACCOUNTS';
};

export function VerificationModal({
  payment,
  onClose,
  onReview,
  onVerifyOnly,
  isSubmitting,
  role = 'ADMIN'
}: VerificationModalProps) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#c1c6d4]/30 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#0b1c30]">Verify Payment</h2>
            <p className="text-sm text-[#64748b]">Transaction #{payment.id.split('-')[0].toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#f1f4f9] rounded-xl text-[#64748b] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Col: Details & Notes */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#f1f4f9]/50 rounded-xl p-5 border border-[#c1c6d4]/30">
                <h3 className="text-sm font-bold text-[#414752] uppercase tracking-wider mb-4 border-b border-[#c1c6d4]/30 pb-2">Student Info</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Name</span>
                    <span className="font-semibold text-[#0b1c30]">{payment.student?.firstName} {payment.student?.lastName}</span>
                  </div>
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Code</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-xs font-bold border border-[#c1c6d4]/30">{payment.student?.studentCode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f1f4f9]/50 rounded-xl p-5 border border-[#c1c6d4]/30">
                <h3 className="text-sm font-bold text-[#414752] uppercase tracking-wider mb-4 border-b border-[#c1c6d4]/30 pb-2">Payment Details</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Amount Claimed</span>
                    <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-lg text-sm border border-emerald-100 tabular-nums shadow-sm">MK {formatMoney(payment.amount)}</span>
                  </div>
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Date Submitted</span>
                    <span className="tabular-nums font-semibold text-[#414752]">{formatDate(payment.submittedAt)}</span>
                  </div>
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Bank Reference</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-xs font-bold border border-[#c1c6d4]/30">{payment.externalReference || payment.receiptNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[#64748b] text-xs font-bold uppercase tracking-widest mb-1">Period</span>
                    <span className="font-semibold text-[#414752] uppercase">{payment.student?.academicYear}</span>
                  </div>
                </div>
                {payment.notes && (
                  <div className="mt-4 bg-white p-3 rounded-lg text-sm text-[#414752] border border-[#c1c6d4]/30 border-l-4 border-l-[#004e99] shadow-sm italic placeholder:not-italic">
                    <span className="not-italic font-bold text-xs text-[#64748b] uppercase tracking-widest block mb-1">Note from payer:</span>
                    "{payment.notes}"
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[#004e99]">rate_review</span>
                  {role === 'ACCOUNTS' ? 'Verification Notes' : 'Reviewer Remarks'}
                </label>
                <textarea
                  className="w-full text-sm border border-[#c1c6d4]/30 rounded-xl p-4 bg-[#f1f4f9]/30 focus:bg-white focus:ring-2 focus:ring-[#004e99]/20 focus:border-[#004e99]/40 outline-none transition-all placeholder-[#64748b]/50 min-h-[120px] shadow-sm resize-none"
                  placeholder={role === 'ACCOUNTS' ? "Enter internal verification notes or flag issues..." : "Enter remarks (visible to student upon rejection)..."}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

            </div>

            {/* Right Col: Image Proof */}
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#414752] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                Bank Deposit Slip / Proof
              </h3>
              <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-[#c1c6d4]/30 shadow-inner relative group min-h-[300px]">
                {payment.proofUrl ? (
                  <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
                    <img 
                      src={payment.proofUrl} 
                      alt="Payment Proof" 
                      className="w-full h-full object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold drop-shadow-md">Click to view full size</span>
                      <button className="bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md p-2 rounded-xl transition-colors">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                  </a>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-5xl mb-2 opacity-30">image_not_supported</span>
                    <p className="text-sm font-semibold">No proof image provided.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#c1c6d4]/30 bg-slate-50/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#414752] hover:bg-[#f1f4f9] border border-transparent hover:border-[#c1c6d4]/30 transition-colors"
          >
            Cancel
          </button>
          
          {role === 'ACCOUNTS' ? (
            <>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                onClick={() => onVerifyOnly && onVerifyOnly(true, notes)}
                disabled={isSubmitting || !notes.trim()}
              >
                <span className="material-symbols-outlined text-lg">flag</span>
                Flag Issue
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#004e99] hover:bg-[#004e99]/90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                onClick={() => onVerifyOnly && onVerifyOnly(false, notes)}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Mark as Verified
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                onClick={() => onReview('REJECTED', notes)}
                disabled={isSubmitting || !notes.trim()}
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                Reject Payment
              </button>
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                onClick={() => onReview('APPROVED', notes)}
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Approve Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
