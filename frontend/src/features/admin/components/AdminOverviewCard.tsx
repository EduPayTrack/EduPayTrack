import type { AuthResponse, ReviewQueueResponse } from '../../../types/api';
import { formatMoney } from '../../../utils/format';

type AdminOverviewCardProps = {
  authUser: AuthResponse['user'];
  payments: ReviewQueueResponse;
};

export function AdminOverviewCard({ authUser, payments }: AdminOverviewCardProps) {
  const pendingCount = payments.filter(p => p.status === 'PENDING').length;
  const totalVolume = payments
    .filter(p => p.status === 'APPROVED')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const flaggedCount = payments.filter(p => p.duplicateFlag).length;

  return (
    <section className="bg-slate-900 rounded-[2rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/30">
              Operational Status: Active
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-white leading-tight">
            Welcome, <span className="text-primary">{authUser.student?.firstName || authUser.email.split('@')[0]}</span>.
          </h2>
          <p className="text-slate-400 font-bold text-xs md:text-sm leading-relaxed max-w-md">
            Auditing <span className="text-white">{pendingCount} pending records</span>. AI-OCR accuracy: 94% target.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Queue Processing</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Integrity Check</p>
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-2/5">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all group">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Total Volume</p>
            <p className="text-xl md:text-2xl font-black tabular-nums">{String(formatMoney(totalVolume)).replace('MWK', '')}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all group">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Pending</p>
            <p className="text-xl md:text-2xl font-black tabular-nums">{pendingCount}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 hover:border-white/20 transition-all group">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">Risks</p>
            <p className="text-xl md:text-2xl font-black tabular-nums">{flaggedCount}</p>
          </div>
        </div>
      </div>

      {/* Workflow Progress Bar */}
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Academic Audit Lifecycle</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-primary">82% Verified</p>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[82%]"></div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Queue</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">OCR Review</div>
          <div className="text-[9px] font-bold text-white uppercase tracking-tight">Final Audit</div>
        </div>
      </div>
    </section>
  );
}
