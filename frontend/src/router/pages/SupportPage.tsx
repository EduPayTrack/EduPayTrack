import { useNavigate } from 'react-router-dom';
import { AppFooter } from '../../components/layout/AppFooter';

export function SupportPage() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-[#f8f9ff]/90 text-[#0b1c30] font-body flex flex-col items-center p-6 md:p-12 lg:p-20 relative overflow-x-hidden pb-40 cursor-pointer"
      onClick={() => navigate('/login')}
    >
      {/* Decorative Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#004e99]/5 blur-[140px] rounded-full pointer-events-none" />

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
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">Need Support?</h1>
          <p className="text-[#64748b] font-medium mb-12 text-lg italic">We're here to help you navigate your payment verification process.</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#f1f4f9]/50 rounded-2xl p-6 border border-[#c1c6d4]/30 group hover:bg-white transition-colors duration-300">
              <span className="material-symbols-outlined text-4xl text-[#004e99] mb-4 group-hover:scale-110 transition-transform">help_center</span>
              <h3 className="text-xl font-bold mb-2">Technical Assistance</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">Having trouble with OCR or receipt uploads? Please reach out to the IT HelpDesk at **support@edupaytrack.com**.</p>
            </div>
            
            <div className="bg-[#f1f4f9]/50 rounded-2xl p-6 border border-[#c1c6d4]/30 group hover:bg-white transition-colors duration-300">
              <span className="material-symbols-outlined text-4xl text-[#00b37e] mb-4 group-hover:scale-110 transition-transform">account_balance_wallet</span>
              <h3 className="text-xl font-bold mb-2">Accounts Department</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">Questions regarding balances, payment status, or tuition rates? Contact your institution's central finance office.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
                <summary className="p-4 cursor-pointer font-bold text-[#414752] flex justify-between items-center list-none select-none hover:bg-white transition-colors">
                  How long does verification take?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-sm text-[#64748b]">
                  Payments are typically reviewed within **1-2 working days** after submission. You'll see a status update (Verified or Rejected) directly on your Dashboard.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-xl overflow-hidden border border-gray-100">
                <summary className="p-4 cursor-pointer font-bold text-[#414752] flex justify-between items-center list-none select-none hover:bg-white transition-colors">
                  What if my deposit slip is rejected?
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-4 pt-0 text-sm text-[#64748b]">
                  Please review the 'Reviewer Remarks' listed on your history entry. Usually, this means the photo was blurry or the reference number was typed incorrectly. You can re-submit a new record with the correct details.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
