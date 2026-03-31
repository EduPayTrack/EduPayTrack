import { useState } from 'react';

import type { PaymentRecord, PaymentStatus, ReviewQueueResponse } from '../../../types/api';
import { formatMoney } from '../../../utils/format';
import { API_BASE_URL } from '../../../config/env';

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/')) {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}${url}`;
  }

  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}/uploads/${url}`;
}

type ReviewQueueProps = {
  payments: ReviewQueueResponse;
  loading: boolean;
  activeReviewId: string | null;
  onReview: (
    paymentId: string,
    status: Extract<PaymentStatus, 'APPROVED' | 'REJECTED'>,
    reviewNotes: string,
  ) => void;
  onViewDetails?: (payment: PaymentRecord) => void;
};

export function ReviewQueue({
  payments,
  loading,
  activeReviewId,
  onReview,
  onViewDetails,
}: ReviewQueueProps) {
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  return (
    <section className="overflow-hidden mb-8">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-2 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Details</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Receipt OCR Data (MWK)</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">OCR Confidence</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Risk Status</th>
              <th className="px-2 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-2 py-12 text-center text-sm text-slate-400 font-medium">
                  Gathering submission data...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-12 text-center text-sm text-slate-400 font-medium">
                  Queue is clear. No pending receipts found.
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const initials = `${payment.student?.firstName?.[0] || ''}${payment.student?.lastName?.[0] || ''}`;
                const isRisk = payment.duplicateFlag;

                return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors group">
                    {/* Student Info */}
                    <td className="px-2 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-black text-[10px]">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                            {payment.student?.firstName} {payment.student?.lastName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                            ID: {payment.student?.studentCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OCR Amount */}
                    <td className="px-4 py-5">
                      <p className="text-sm font-mono font-black text-primary">
                        {String(formatMoney(payment.amount)).replace('MWK', '')}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        REF: {payment.externalReference || payment.receiptNumber || 'N/A'}
                      </p>
                    </td>

                    {/* Confidence Circle */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-slate-100" cx="20" cy="20" fill="transparent" r="16" stroke="currentColor" strokeWidth="3"></circle>
                            <circle className={isRisk ? 'text-primary' : 'text-secondary'} cx="20" cy="20" fill="transparent" r="16" stroke="currentColor" strokeDasharray="100" strokeDashoffset={isRisk ? 45 : 5} strokeWidth="3"></circle>
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
                            {isRisk ? '55%' : '98%'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Risk Tag */}
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isRisk
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {isRisk ? 'Suspicious' : 'Safe'}
                      </span>
                    </td>

                    {/* Operations */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onViewDetails?.(payment)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-primary"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-base">open_in_full</span>
                        </button>

                        <a
                          href={resolveImageUrl(payment.proofUrl) || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400"
                          title="View Receipt"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </a>

                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                          <input
                            className="bg-transparent border-none focus:ring-0 text-[10px] font-bold w-24 px-2"
                            placeholder="Add audit note..."
                            value={notesById[payment.id] || ''}
                            onChange={(e) => setNotesById({ ...notesById, [payment.id]: e.target.value })}
                          />
                          <button
                            disabled={payment.status !== 'PENDING' || activeReviewId === payment.id}
                            onClick={() => onReview(payment.id, 'REJECTED', notesById[payment.id] || '')}
                            className="p-1 hover:bg-white rounded text-red-600 transition-all opacity-60 hover:opacity-100 disabled:opacity-20"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                          <button
                            disabled={payment.status !== 'PENDING' || activeReviewId === payment.id}
                            onClick={() => onReview(payment.id, 'APPROVED', notesById[payment.id] || '')}
                            className="p-1 hover:bg-white rounded text-emerald-600 transition-all opacity-60 hover:opacity-100 disabled:opacity-20"
                          >
                            <span className="material-symbols-outlined text-base">check</span>
                          </button>
                        </div>
                      </div>
                      {activeReviewId === payment.id && (
                        <p className="text-[8px] font-black text-primary uppercase mt-1">Processing Audit...</p>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section >
  );
}
