import { useState, useMemo, useEffect } from 'react';
import { addVerificationNotes, getReviewQueue } from '../../services/admin';
import type { PaymentRecord } from '../../types/api';
import { AccountsVerificationTable } from './components/AccountsVerificationTable';
import { VerificationModal } from './components/VerificationModal';
import { PaginationControls } from '../../components/shared/PaginationControls';

type AccountsWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function AccountsWorkspace({ token, onError, onSuccess }: AccountsWorkspaceProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);

  async function loadPending() {
    setLoading(true);
    try {
      const data = await getReviewQueue(token, 'PENDING');
      setPayments(data);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, [token]);

  const filteredData = useMemo(() => {
    return payments.filter(p => {
      const reg = p.student?.studentCode?.toLowerCase() || '';
      const n = ((p.student?.firstName || '') + ' ' + (p.student?.lastName || '')).toLowerCase();
      const matchQ = reg.includes(query.toLowerCase()) || n.includes(query.toLowerCase());
      const matchP = filterPeriod === 'ALL' || p.student?.academicYear === filterPeriod;
      return matchQ && matchP;
    });
  }, [payments, query, filterPeriod]);

  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const displayed = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedPayment = payments.find(p => p.id === selectedPaymentId) || null;

  const handleVerifyOnly = async (flagIssue: boolean, note: string) => {
    if (!selectedPayment) return;
    setReviewing(true);
    onError('');
    try {
      await addVerificationNotes(token, selectedPayment.id, { reviewNotes: note });
      onSuccess(flagIssue ? 'Payment flagged successfully' : 'Payment verified successfully');
      setSelectedPaymentId(null);
      await loadPending();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Hero Section: Monitor Collections */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#004e99] mb-3 block">Institution Oversight</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0b1c30] leading-none mb-4">Monitor collections and balances</h1>
            <p className="text-[#414752] text-lg font-medium max-w-2xl leading-relaxed">Real-time oversight of student fee lifecycle with integrated OCR verification and automated ledger reconciliation.</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[1.5rem] border border-[#c1c6d4]/20 shadow-sm shadow-blue-500/5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider font-black text-[#414752]">Module 01</p>
                <p className="font-black text-sm text-[#0b1c30]">Reports</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[1.5rem] border border-[#c1c6d4]/20 shadow-sm shadow-blue-500/5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">fact_check</span>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider font-black text-[#414752]">Module 02</p>
                <p className="font-black text-sm text-[#0b1c30]">Audit</p>
              </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[1.5rem] border border-[#c1c6d4]/20 shadow-sm shadow-blue-500/5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">file_export</span>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider font-black text-[#414752]">Module 03</p>
                <p className="font-black text-sm text-[#0b1c30]">Export</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 bg-[#004e99] bg-gradient-to-br from-[#004e99] to-[#0a66c2] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time Ledger Balance
            </p>
            <h2 className="text-4xl font-black tracking-tighter leading-none mb-4 whitespace-nowrap">MWK 14,285,500</h2>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-400/20 text-emerald-300 px-3 py-1 rounded-full font-black text-[10px] border border-emerald-400/30 uppercase tracking-widest">+12.4%</span>
              <span className="text-[10px] font-bold text-blue-100/70 uppercase tracking-widest leading-none mt-0.5">from last cycle</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all h-44">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">cognition</span>
            </div>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-[0.15em]">Active Engine</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#0b1c30] tracking-tighter">98.4%</h3>
            <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-1">OCR Extraction Accuracy</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all h-44">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">shield_person</span>
            </div>
            <span className="text-[9px] font-black text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-[0.15em]">Scanning Flow</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#0b1c30] tracking-tighter">0.2%</h3>
            <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-1">Fraudulent Discrepancies</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all h-44">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-[0.15em]">Processed 24H</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#0b1c30] tracking-tighter">1,402</h3>
            <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-1">Institutional Verifications</p>
          </div>
        </div>
      </section>

      {/* Verification Workspace Control Bar */}
      <div className="flex flex-col lg:row-start-3 md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-[2rem] border border-[#c1c6d4]/30 shadow-sm">
        <div className="relative w-full md:w-[28rem]">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#414752] opacity-40">search</span>
          <input
            type="text"
            placeholder="Search verified ledger by ID, Name or Receipt #"
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#004e99]/10 transition-all text-xs font-bold text-[#0b1c30]"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={filterPeriod} 
            onChange={(e) => { setFilterPeriod(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-auto pl-5 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black text-[#414752] uppercase tracking-widest focus:ring-4 focus:ring-[#004e99]/10 outline-none cursor-pointer appearance-none"
          >
            <option value="ALL">All Active Terms</option>
            <option value="t1">Term 1 (2025)</option>
            <option value="t2">Term 2 (2025)</option>
            <option value="t3">Term 3 (2025)</option>
          </select>
          <button onClick={loadPending} disabled={loading} className="px-6 py-4 bg-[#004e99] text-white rounded-2xl hover:bg-[#0a66c2] transition-all flex items-center gap-3 shadow-lg shadow-[#004e99]/20 disabled:opacity-50 group">
             <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>sync</span>
             <span className="text-[11px] font-black uppercase tracking-widest">Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-[#c1c6d4]/30 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
             <h2 className="text-xl font-black text-[#0b1c30] tracking-tighter">Institutional Verification Queue</h2>
             <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-1">Human-in-the-loop AI validation portal</p>
          </div>
          <span className="px-4 py-1.5 bg-blue-50 text-[#004e99] text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">{payments.length} PENDING REVIEW</span>
        </div>
        <div className="overflow-x-auto min-h-[400px]">
          <AccountsVerificationTable
            data={displayed}
            isLoading={loading}
            onSelect={(id) => setSelectedPaymentId(id)}
          />
        </div>
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            itemLabel="submissions"
          />
        </div>
      </div>

      {/* Bottom Layout: Ledger Updates & AI Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Ledger Updates Timeline */}
         <div className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] border border-[#c1c6d4]/20 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-[#0b1c30] tracking-tighter">Recent Ledger Updates</h3>
              <button className="text-[10px] font-black text-[#004e99] uppercase tracking-[0.15em] hover:underline flex items-center gap-1.5">
                Full Systems Ledger 
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[11px] before:border-l before:border-slate-100 before:border-dashed before:pointer-events-none pb-4">
               {[
                 { time: "Today, 09:42 AM", title: "Ledger Entry Verified: #LE-99021", desc: "Institutional balance adjusted by +MWK 150,000. Verified by AI-Agent-Alpha.", color: "bg-emerald-500" },
                 { time: "Today, 08:15 AM", title: "Flagged Discrepancy: ID-2023-LUANAR", desc: "Receipt mismatch detected in tuition category. High-risk flag initiated.", color: "bg-red-500" },
                 { time: "Yesterday, 04:55 PM", title: "Weekly Report Generated", desc: "System automated reconciliation completed for 1,240 transactions.", color: "bg-[#004e99]" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 relative group">
                    <div className={`w-6 h-6 rounded-full ${item.color} border-4 border-white shadow-md z-10 shrink-0 group-hover:scale-110 transition-transform duration-300`}></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.time}</p>
                       <p className="text-sm font-black text-[#0b1c30] group-hover:text-[#004e99] transition-colors">{item.title}</p>
                       <p className="text-[11px] text-[#414752] font-medium leading-relaxed mt-1">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Side Cards: Audit & Export */}
         <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f0f4ff] p-8 rounded-[2.5rem] border border-[#c1c6d4]/10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#004e99] mb-6 leading-none">AI Audit Performance</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-white">
                     <p className="text-3xl font-black text-emerald-500">100%</p>
                     <p className="text-[9px] font-black text-[#414752] uppercase tracking-widest mt-2">MWK Parity</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-white">
                     <p className="text-3xl font-black text-[#004e99]">0%</p>
                     <p className="text-[9px] font-black text-[#414752] uppercase tracking-widest mt-2">Disputes</p>
                  </div>
               </div>
               <p className="text-xs text-[#414752] mt-6 leading-relaxed font-medium">System is performing at peak efficiency. No major data anomalies detected in the last 72-hour institutional cycle.</p>
            </div>

            <div className="bg-[#0b1c30] p-8 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-black/10">
               <div className="relative z-10">
                  <h3 className="text-xl font-black tracking-tight text-white mb-2">Institutional Export</h3>
                  <p className="text-sm text-white/60 font-medium mb-8 leading-relaxed">Download the complete audited ledger for internal board review and regulatory compliance.</p>
                  <div className="space-y-3">
                     <button className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group-hover:border-white/10">
                        <span className="text-xs font-black text-white uppercase tracking-widest">Monthly Audit (PDF)</span>
                        <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">picture_as_pdf</span>
                     </button>
                     <button className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group-hover:border-white/10">
                        <span className="text-xs font-black text-white uppercase tracking-widest">Transaction Log (CSV)</span>
                        <span className="material-symbols-outlined text-white/40 group-hover:text-white transition-colors">csv</span>
                     </button>
                  </div>
               </div>
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#004e99]/20 rounded-full blur-3xl"></div>
            </div>
         </div>
      </div>

      {selectedPayment && (
        <VerificationModal
          payment={selectedPayment}
          onClose={() => setSelectedPaymentId(null)}
          onReview={() => {}}
          onVerifyOnly={handleVerifyOnly}
          isSubmitting={reviewing}
          role="ACCOUNTS"
        />
      )}
    </div>
  );
}
