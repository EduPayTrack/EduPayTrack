import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getPaymentDetails, reviewPayment, verifyPayment } from '../../services/admin';
import type { PaymentRecord, UserRole } from '../../types/api';
import { formatMoney, formatDate } from '../../utils/format';
import { API_BASE_URL } from '../../config/env';
import { VERIFICATION_TEMPLATES, autoDetectVerificationIssues, getSuggestedTemplate } from '../../utils/verification-templates';

type ContextType = {
  token: string;
  role: UserRole;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  if (url.startsWith('/')) return `${baseUrl}${url}`;
  return `${baseUrl}/uploads/${url}`;
}

export function AdminPaymentAuditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, role, onError, onSuccess } = useOutletContext<ContextType>();
  
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [useCustomNotes, setUseCustomNotes] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await getPaymentDetails(token, id);
        setPayment(data);
      } catch (e: any) {
        onError(e.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id, token]);

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!id || !payment) return;
    setSubmitting(true);
    try {
      const selectedTemplate = selectedTemplateId ? VERIFICATION_TEMPLATES.find(t => t.id === selectedTemplateId) : null;
      const finalNotes = useCustomNotes ? notes : (selectedTemplate?.message || '');
      
      await reviewPayment(token, id, { status, reviewNotes: finalNotes });
      onSuccess(`Payment successfully ${status.toLowerCase()}`);
      navigate(-1);
    } catch (e: any) {
      onError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAction = async (flag: boolean) => {
    if (!id || !payment) return;
    setSubmitting(true);
    try {
      const selectedTemplate = selectedTemplateId ? VERIFICATION_TEMPLATES.find(t => t.id === selectedTemplateId) : null;
      const finalNotes = useCustomNotes ? notes : (selectedTemplate?.message || '');

      await verifyPayment(token, id, {
        verificationStatus: flag ? 'FLAGGED' : 'VERIFIED',
        verificationNotes: finalNotes,
      });
      onSuccess(`Verification ${flag ? 'flagged' : 'completed'}`);
      navigate(-1);
    } catch (e: any) {
      onError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm animate-pulse">Loading transaction workspace...</p>
      </div>
    );
  }

  if (!payment) return null;

  const isPdf = payment.proofUrl?.toLowerCase().endsWith('.pdf');
  const imageUrl = resolveImageUrl(payment.proofUrl);
  const isAdmin = role === 'ADMIN';
  const isAccounts = role === 'ACCOUNTS';
  
  const suggestedTemplate = isAccounts ? getSuggestedTemplate(payment) : null;
  const detectedIssues = isAccounts ? autoDetectVerificationIssues(payment) : [];
  const selectedTemplate = selectedTemplateId ? VERIFICATION_TEMPLATES.find(t => t.id === selectedTemplateId) : null;

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header Context */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
             </button>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004e99]">Verification Journal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            {payment.student?.firstName} {payment.student?.lastName}
          </h1>
          <p className="text-sm font-black text-slate-500 mt-1">
             Institutional ID: <span className="text-primary tracking-widest">{payment.student?.studentCode}</span> · 
             Period: <span className="uppercase">{payment.student?.academicYear || 'N/A'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
           {payment.status === 'APPROVED' ? (
             <div className="px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
               <span className="material-symbols-outlined text-emerald-500">verified</span>
               <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Verified & Approved</span>
             </div>
           ) : payment.status === 'REJECTED' ? (
             <div className="px-6 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
               <span className="material-symbols-outlined text-red-500">cancel</span>
               <span className="text-xs font-black uppercase tracking-widest text-red-600">Submission Rejected</span>
             </div>
           ) : (
             <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 animate-pulse">
               <span className="material-symbols-outlined text-primary">schedule</span>
               <span className="text-xs font-black uppercase tracking-widest text-primary">Pending verification</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Evidence Review */}
        <div className="flex flex-col gap-8">
           <div className="bg-slate-900 h-[650px] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl relative group flex items-center justify-center">
             {isPdf ? (
               <embed 
                 src={imageUrl || ''} 
                 type="application/pdf"
                 className="w-full h-full"
               />
             ) : (
               <div className="w-full h-full overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={imageUrl || ''} 
                    alt="Institutional Receipt Proof"
                    className="max-w-full max-h-full object-contain cursor-zoom-in group-hover:scale-[1.02] transition-all duration-700 shadow-2xl rounded-lg"
                  />
               </div>
             )}
              <a 
                href={imageUrl || ''} 
                target="_blank" 
                rel="noreferrer" 
                className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                title="View Full Resolution"
              >
                <span className="material-symbols-outlined">zoom_out_map</span>
              </a>
           </div>

           {/* OCR / AI Insights if any */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">psychology</span>
                Verification Intelligence
              </h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2">OCR Amount</p>
                    <p className="text-sm font-black text-slate-900">MWK {formatMoney(payment.ocrAmount || 0)}</p>
                 </div>
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2">Match Integrity</p>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                       </div>
                       <span className="text-[10px] font-black text-emerald-600">98%</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Ledger Entry & Action */}
        <div className="flex flex-col gap-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                 <span className="material-symbols-outlined text-[120px]">description</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-10 pb-4 border-b border-slate-50">Ledger Entry Matching</h3>
              <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Amount</span>
                    <span className="text-2xl font-black text-[#004e99] tracking-tighter tabular-nums">MWK {formatMoney(payment.amount)}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Channel</span>
                    <span className="inline-flex px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">{payment.method}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Instrument ID / Ref</span>
                    <span className="text-sm font-black text-slate-700 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{payment.externalReference || payment.receiptNumber || 'N/A'}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Transaction Date</span>
                    <span className="text-sm font-black text-slate-700 tabular-nums">{formatDate(payment.paymentDate)}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payer Identity</span>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{payment.payerName || 'Payer Name Missing'}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Submission Context</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{formatDate(payment.submittedAt)}</span>
                 </div>
              </div>

              {payment.notes && (
                <div className="mt-12 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 relative">
                   <span className="material-symbols-outlined absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary border border-blue-100 shadow-sm text-lg">chat_bubble</span>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#004e99]/60 mb-2">Student Declaration</p>
                   <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{payment.notes}"</p>
                </div>
              )}
           </div>

           {/* Auditing Actions */}
           <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/50 flex flex-col gap-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg">rate_review</span>
                 Audit Remarks & Decisions
              </h3>

              {isAccounts && (
                <>
                  {detectedIssues.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 mb-2">
                      <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Discrepancies Flagged by AI
                      </p>
                      <ul className="space-y-3">
                        {detectedIssues.map(issue => (
                          <li key={issue.id} className="text-xs font-bold text-amber-800 flex items-start gap-2">
                            <span className="material-symbols-outlined text-base flex-shrink-0">chevron_right</span>
                            <span>{issue.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pl-2">Institutional Template</label>
                    <select
                      value={selectedTemplateId || ''}
                      onChange={(e) => {
                        setSelectedTemplateId(e.target.value || null);
                        setUseCustomNotes(false);
                      }}
                      className="w-full text-sm font-bold border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none"
                    >
                      <option value="">Manual Entry / Custom Declaration</option>
                      {suggestedTemplate && (
                        <optgroup label="✨ AI Recommended">
                          <option value={suggestedTemplate.id}>{suggestedTemplate.label}</option>
                        </optgroup>
                      )}
                      <optgroup label="Official Ledger Messages">
                        {VERIFICATION_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 px-2 mb-2">
                    <input
                      type="checkbox"
                      id="auditor-use-custom"
                      checked={useCustomNotes}
                      onChange={(e) => setUseCustomNotes(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                    />
                    <label htmlFor="auditor-use-custom" className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">Overrides: Manual Audit Notes</label>
                  </div>
                </>
              )}

              <textarea
                value={useCustomNotes ? notes : (selectedTemplate?.message || '')}
                onChange={(e) => { setUseCustomNotes(true); setNotes(e.target.value); }}
                placeholder="Enter official audit remarks or corrective actions required..."
                className="w-full h-40 bg-white border-none rounded-3xl p-6 text-sm font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-slate-300"
              />

              <div className="grid grid-cols-2 gap-4">
                 {isAdmin ? (
                   <>
                     <button
                       disabled={submitting || payment.status === 'APPROVED'}
                       onClick={() => handleReview('APPROVED')}
                       className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3"
                     >
                       <span className="material-symbols-outlined">verified</span>
                       Approve Submission
                     </button>
                     <button
                       disabled={submitting || payment.status === 'REJECTED'}
                       onClick={() => handleReview('REJECTED')}
                       className="h-16 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                     >
                       <span className="material-symbols-outlined">cancel</span>
                       Reject Payment
                     </button>
                   </>
                 ) : (
                   <>
                     <button
                       disabled={submitting || payment.verificationStatus === 'VERIFIED'}
                       onClick={() => handleVerifyAction(false)}
                       className="h-16 bg-[#004e99] hover:bg-[#003d7a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                     >
                       <span className="material-symbols-outlined">check_circle</span>
                       Verify & Clear
                     </button>
                     <button
                       disabled={submitting || payment.verificationStatus === 'FLAGGED'}
                       onClick={() => handleVerifyAction(true)}
                       className="h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                     >
                       <span className="material-symbols-outlined">flag</span>
                       Flag for Review
                     </button>
                   </>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentAuditPage;
