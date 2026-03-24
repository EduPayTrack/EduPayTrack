import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../../components/layout/AppFooter';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-[#f8f9ff]/90 text-[#0b1c30] font-body flex flex-col items-center p-6 md:p-12 lg:p-20 relative overflow-x-hidden pb-40 cursor-pointer"
      onClick={() => navigate('/login')}
    >
      {/* Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#004e99]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6ffbbe]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Fixed Brand Identity (Floating) */}
        <div className="fixed top-4 left-6 md:top-5 md:left-10 flex items-center gap-3 z-[100] group cursor-default">
          <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#004e99] text-white shadow-lg shadow-[#004e99]/20 transition-transform duration-500 group-hover:scale-105 shrink-0">
            <span className="material-symbols-outlined text-xl md:text-2xl">school</span>
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 md:p-1 rounded-md shadow-md border border-[#c1c6d4]/20">
              <span className="material-symbols-outlined text-[#004e99] text-[14px] md:text-[16px]">payments</span>
            </div>
          </div>
          <span className="text-base md:text-lg font-black tracking-tighter text-[#004e99]">EduPayTrack</span>
        </div>

        {/* Paper Card */}
        <div 
          className="bg-white rounded-[2rem] p-8 md:p-16 shadow-2xl shadow-[#004e99]/10 border border-[#c1c6d4]/30 cursor-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-8 leading-tight">Terms of Service</h1>
          <p className="text-[#64748b] font-medium mb-12 text-lg">Last updated: March 24, 2026</p>

          <div className="space-y-10 prose prose-slate max-w-none">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#004e99]/10 text-[#004e99] flex items-center justify-center text-sm">01</span>
                Platform Purpose
              </h2>
              <p>
                EduPayTrack provides an administrative interface for verifying bank deposit slips and financial proofs. You agree that this platform is used solely for school fee reconciliation, and that any attempt to bypass auditing measures or upload fraudulent documents is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#004e99]/10 text-[#004e99] flex items-center justify-center text-sm">02</span>
                User Responsibility
              </h2>
              <p>
                As a user, you are responsible for maintaining the confidentiality of your login credentials. You agree that all information provided—including student ID codes and uploaded receipt images—is accurate to the best of your knowledge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#004e99]/10 text-[#004e99] flex items-center justify-center text-sm">03</span>
                Termination of Access
              </h2>
              <p>
                The institution reserves the right to terminate access for users who repeatedly violate submission protocols or use the service for unauthorized administrative activities.
              </p>
            </section>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
