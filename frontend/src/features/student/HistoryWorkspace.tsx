import { useState, useEffect, useMemo } from 'react';
import { getStudentDashboard } from '../../services/student';
import type { DashboardResponse, PaymentStatus } from '../../types/api';

type HistoryWorkspaceProps = {
  token: string;
  onError: (msg: string) => void;
};

export function HistoryWorkspace({ token, onError }: HistoryWorkspaceProps) {
  const [payments, setPayments] = useState<DashboardResponse['payments']>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await getStudentDashboard(token);
      setPayments(data.payments);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, [token]);

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.externalReference?.toLowerCase().includes(query) ||
        p.receiptNumber?.toLowerCase().includes(query) ||
        p.payerName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [payments, statusFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Panel */}
      <div className="bg-[#004e99] rounded-[1.5rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-xl shadow-[#004e99] animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Financial Ledger</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none mb-2 text-white">Payment History Center</h2>
            <p className="text-blue-100/70 text-sm font-medium max-w-md">Verify your past tuition uploads and transaction status.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-6 border border-white/10 flex items-center gap-6 shrink-0">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Total Verified</p>
              <p className="text-2xl font-black">MWK {payments.filter(p => p.status === 'APPROVED').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center border border-white/10">
              <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
          <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" fill="white" r="200"></circle>
          </svg>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Timeline of Submissions</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Audit-grade financial records</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference or receipt..."
                className="pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-[11px] font-bold w-full md:w-48 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
              className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {(statusFilter || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setSearchQuery('');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount (MWK)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Retrieving archived records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">history</span>
                    <p className="text-sm font-bold text-slate-400">{payments.length === 0 ? 'No payment history found yet.' : 'No payments match your filters.'}</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-900">{new Date(p.submittedAt).toLocaleDateString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{new Date(p.submittedAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{p.externalReference || p.receiptNumber || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[13px] font-black text-slate-900">MWK {Number(p.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          p.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                          {p.status}
                        </span>
                        {p.reviewNotes && (
                          <div title={p.reviewNotes} className="text-[8px] text-slate-500 ml-2 italic max-w-xs">
                            ({p.reviewNotes.substring(0, 20)}...)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <a
                          href={p.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all group-hover:shadow-md"
                        >
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Approved Submissions</p>
            <p className="text-2xl font-black text-slate-900">{filteredPayments.filter(p => p.status === 'APPROVED').length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
            <p className="text-2xl font-black text-slate-900">{filteredPayments.filter(p => !['APPROVED', 'REJECTED'].includes(p.status)).length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">error_outline</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Rejections</p>
            <p className="text-2xl font-black text-slate-900">{filteredPayments.filter(p => p.status === 'REJECTED').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
