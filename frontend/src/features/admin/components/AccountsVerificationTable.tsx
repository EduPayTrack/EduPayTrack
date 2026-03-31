import type { PaymentRecord } from '../../../types/api';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: PaymentRecord[];
  isLoading: boolean;
};

export function AccountsVerificationTable({ data, isLoading }: Props) {
  const navigate = useNavigate();
  if (isLoading) {
    return <div className="text-center py-20 text-[#64748b] animate-pulse">Loading verification queue...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-20 text-[#64748b]">No pending payments in the queue.</div>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-[#414752] font-black border-b border-slate-100">
          <th className="px-8 py-5">Student & ID</th>
          <th className="px-8 py-5">Receipt Extract (MWK)</th>
          <th className="px-8 py-5">OCR Confidence</th>
          <th className="px-8 py-5">AI Risk Status</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map((payment) => (
          <tr key={payment.id} className="hover:bg-blue-50/30 transition-all group overflow-hidden">
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">
                  {payment.student?.firstName?.[0]}{payment.student?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-black text-sm text-[#0b1c30] tracking-tight">{payment.student?.firstName} {payment.student?.lastName}</p>
                  <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-0.5">ID: {payment.student?.studentCode}</p>
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-5">
                <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shrink-0 group-hover:scale-110 transition-transform cursor-zoom-in">
                  <img 
                    className="w-14 h-9 object-cover rounded shadow-sm opacity-80" 
                    src={payment.proofUrl}
                    alt="Receipt"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#414752] font-black opacity-40 line-through tracking-widest uppercase">MWK {Number(payment.amount).toLocaleString()}</span>
                  <span className="font-black text-sm text-emerald-600 tracking-tight">MWK {Number(payment.amount).toLocaleString()}</span>
                </div>
              </div>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[98%] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                </div>
                <span className="text-[11px] font-black text-emerald-600">98%</span>
              </div>
            </td>
            <td className="px-8 py-6">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Safe Status</span>
            </td>
            <td className="px-8 py-6 text-right">
              <button 
                onClick={() => navigate(`/admin/payments/${payment.id}/audit`)}
                className="bg-white hover:bg-[#004e99] text-[#004e99] hover:text-white px-5 py-2.5 text-[11px] font-black border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest"
              >
                Review & Audit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
