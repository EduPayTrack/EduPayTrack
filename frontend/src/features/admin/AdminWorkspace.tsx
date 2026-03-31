import { useEffect, useMemo, useState } from 'react';

import { PaginationControls } from '../../components/shared/PaginationControls';
import { getReviewQueue, reviewPayment } from '../../services/admin';
import type { PaymentStatus, ReviewQueueResponse } from '../../types/api';
import { ReviewFilters } from './components/ReviewFilters';
import { ReviewQueue } from './components/ReviewQueue';
import { useNavigate } from 'react-router-dom';

type AdminWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function AdminWorkspace({
  token,
  onError,
  onSuccess,
}: AdminWorkspaceProps) {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<ReviewQueueResponse>([]);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const pageSize = 5;

  async function loadQueue() {
    setLoading(true);

    try {
      const data = await getReviewQueue(
        token,
        statusFilter === 'ALL' ? undefined : statusFilter,
      );
      setPayments(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load review queue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadQueue();
  }, [token, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const filteredPayments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return payments;
    }

    return payments.filter((payment) =>
      [
        payment.student?.firstName || '',
        payment.student?.lastName || '',
        payment.student?.studentCode || '',
        payment.method,
        payment.externalReference || '',
        payment.receiptNumber || '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [payments, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const pagedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  async function handleReview(
    paymentId: string,
    status: Extract<PaymentStatus, 'APPROVED' | 'REJECTED'>,
    reviewNotes: string,
  ) {
    setActiveReviewId(paymentId);
    setIsSubmittingModal(true);
    onError('');
    onSuccess('');

    try {
      await reviewPayment(token, paymentId, {
        status,
        reviewNotes: reviewNotes || undefined,
      });
      onSuccess(`Payment ${status.toLowerCase()} successfully.`);
      setSelectedPaymentForDetail(null);
      await loadQueue();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Review failed');
    } finally {
      setActiveReviewId(null);
      setIsSubmittingModal(false);
    }
  }

  return (
    <main className="max-w-screen-2xl mx-auto space-y-8 pb-12">
      <ReviewFilters
        loading={loading}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onFilterChange={setStatusFilter}
        onSearchChange={setSearchQuery}
      />

      <ReviewQueue
        activeReviewId={activeReviewId}
        loading={loading}
        payments={pagedPayments}
        onReview={handleReview}
        onViewDetails={(payment) => navigate(`/admin/payments/${payment.id}/audit`)}
      />

      <div className="flex flex-col items-center gap-4 mt-12 bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Institutional Systems · Audit Control v1.4.2</p>
      </div>

      {/* Insights Bento Grid Footer */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-primary">insights</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">+12% operational lift</span>
          </div>
          <h4 className="text-xs font-bold text-slate-400 mb-1">OCR Accuracy Rate</h4>
          <p className="text-2xl font-black text-slate-900">94.2%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-primary w-[94.2%] transition-all duration-1000"></div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-red-600">warning</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Peak Volume Alert</span>
          </div>
          <h4 className="text-xs font-bold text-slate-400 mb-1">Average Review Time</h4>
          <p className="text-2xl font-black text-slate-900">4.2m</p>
          <p className="text-[10px] text-slate-500 font-bold mt-3 leading-tight">Targeting &lt; 3.0m for current academic audit cycle.</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="material-symbols-outlined text-emerald-600">verified_user</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Operational Integrity</span>
          </div>
          <h4 className="text-xs font-bold text-slate-400 mb-1">Queue Integrity Score</h4>
          <p className="text-2xl font-black text-slate-900">99.8</p>
          <div className="flex gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
