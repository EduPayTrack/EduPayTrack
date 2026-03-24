import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { AuthGate } from '../../components/shared/AuthGate';
import { AppFooter } from '../../components/layout/AppFooter';
import { useAuthState } from '../../hooks/use-auth';
import type { AuthMode } from '../../types/api';

export function AuthPage() {
  const { token, authUser, saveSession } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeAuthMode, setActiveAuthMode] = useState<AuthMode | null>(null);
  const navigate = useNavigate();

  if (token && authUser) {
    return <Navigate replace to={authUser.role === 'STUDENT' ? '/student' : '/admin'} />;
  }

  // If the user hasn't selected a login/register option, show the bespoke landing page
  if (!activeAuthMode) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-body flex flex-col relative overflow-hidden pt-16">
        {/* Abstract Background Blurs for Premium Feel */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-[#d6e3ff]/70 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute middle right-[-5%] w-[35%] h-[50%] bg-[#6ffbbe]/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Navbar (Fixed) */}
        <nav className="fixed top-0 left-0 w-full z-[60] bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 h-16 shadow-sm border-b border-gray-200/50">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#004e99] text-white shadow-lg shadow-[#004e99]/10 transition-transform duration-500 group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-xl">school</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-md shadow-md border border-[#c1c6d4]/20">
                <span className="material-symbols-outlined text-[#004e99] text-[14px]">payments</span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#004e99]">EduPayTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveAuthMode('login')}
              className="px-6 py-2 text-[#004e99] hover:bg-[#004e99]/5 rounded-lg font-semibold transition-all text-sm"
            >
              Login
            </button>
            <button 
              onClick={() => setActiveAuthMode('register')}
              className="px-6 py-2 bg-gradient-to-br from-[#004e99] to-[#0a66c2] text-white rounded-lg font-semibold shadow-md shadow-[#004e99]/20 hover:shadow-[#004e99]/40 hover:-translate-y-0.5 active:scale-95 transition-all text-sm"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Main Landing Content */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-12 pb-24 lg:py-20 lg:pb-32 relative z-10 flex flex-col items-center justify-center">
          
          <div className="max-w-3xl mb-16 lg:mb-24 text-center mx-auto">
            <p className="kicker-large mb-4 uppercase tracking-[0.2em] font-bold text-[#004e99] opacity-80">
              Institutional Audit & Tuition Clearance
            </p>
            <h1 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter text-slate-900">
              Save student <span className="text-[#004e99]">queuing time</span> for studies & classes.
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
              EduPayTrack removes the friction of submitting and matching tuition records. 
              Students upload their receipts, and OCR-powered verification guarantees speed, 
              transparency, and flawless auditing for administrators.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#004e99]/5 border border-[#004e99]/10 text-[10px] font-bold text-[#004e99] uppercase tracking-wider">
                <span className="material-symbols-rounded text-sm">bolt</span>
                Faster Payment Verification
              </div>
              <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                <span className="material-symbols-rounded text-sm">visibility</span>
                Financial Transparency
              </div>
              <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <span className="material-symbols-rounded text-sm">timer_off</span>
                Reduced Manual Record Errors
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl inline-block max-w-lg mb-8 text-left">
              <div className="flex gap-3">
                <span className="material-symbols-rounded text-amber-600 shrink-0">info</span>
                <p className="text-sm font-semibold text-amber-800 leading-snug">
                  Note: This is an auditing system. <span className="font-bold underline">No actual payments</span> are processed here.
                </p>
              </div>
            </div>
          </div>

          {/* Three-Column Role-Based Functional Layout */}
          <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Student Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-xl shadow-[#004e99]/5 flex flex-col hover:-translate-y-1 transition-transform duration-500">
              <span className="inline-block self-start py-1.5 px-3 bg-[#004e99]/10 text-[#004e99] text-[10px] font-bold tracking-widest uppercase rounded-full mb-6">
                Submission Gateway
              </span>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Student Portal</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                Upload payment proof and view your transaction status and fee balance instantly.
              </p>

              <div className="space-y-6 flex-1">
                <FeatureItem 
                  icon="person_add" 
                  title="Registration" 
                  desc="Register using student codes or registration numbers." 
                  accent="text-[#004e99]"
                />
                <FeatureItem 
                  icon="upload_file" 
                  title="Upload Proof" 
                  desc="Submit scanned or photographed payment receipts for institutional review." 
                  accent="text-[#004e99]"
                />
                <FeatureItem 
                  icon="account_balance_wallet" 
                  title="Balance Tracking" 
                  desc="Receive automatic updates to your fee balance after payment approval." 
                  accent="text-[#004e99]"
                />
                <FeatureItem 
                  icon="history" 
                  title="Payment History" 
                  desc="View a complete digital record of all your tuition submissions." 
                  accent="text-[#004e99]"
                />
              </div>
            </div>

            {/* Accounts Staff Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-xl shadow-[#004e99]/5 flex flex-col hover:-translate-y-1 transition-transform duration-500 bg-white/40">
              <span className="inline-block self-start py-1.5 px-3 bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-widest uppercase rounded-full mb-6">
                Verification Console
              </span>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Accounts Staff</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                Review payment submissions and verify financial details with high accuracy.
              </p>

              <div className="space-y-6 flex-1">
                <FeatureItem 
                  icon="fact_check" 
                  title="Review Submissions" 
                  desc="Systematically check incoming data for accuracy and compliance." 
                  accent="text-emerald-600"
                />
                <FeatureItem 
                  icon="document_scanner" 
                  title="OCR Extraction" 
                  desc="Use AI assistance to extract payment details from uploaded receipts." 
                  accent="text-emerald-600"
                />
                <FeatureItem 
                  icon="rule" 
                  title="Detail Verification" 
                  desc="Cross-verify payment details against institutional bank records." 
                  accent="text-emerald-600"
                />
                <FeatureItem 
                  icon="reorder" 
                  title="Review Queue" 
                  desc="Manage an organized workspace of pending payment validations." 
                  accent="text-emerald-600"
                />
              </div>
            </div>

            {/* Administrator Section */}
            <div className="glass-panel p-8 rounded-3xl border border-white/60 shadow-xl shadow-[#004e99]/5 flex flex-col hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden bg-white/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#004e99]/5 blur-[40px] rounded-full pointer-events-none" />
              
              <span className="inline-block self-start py-1.5 px-3 bg-slate-100 text-slate-700 text-[10px] font-bold tracking-widest uppercase rounded-full mb-6">
                Operations & Logic
              </span>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Administrator</h2>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                Manage students, verify payment proofs, configure fees, and generate reports.
              </p>

              <div className="space-y-6 flex-1">
                <FeatureItem 
                  icon="verified" 
                  title="Approve/Reject" 
                  desc="Finalize and authorize or reject student payment submissions." 
                  accent="text-slate-800"
                />
                <FeatureItem 
                  icon="settings_suggest" 
                  title="Configure Fees" 
                  desc="Set fee structures by program, class, term, or semester." 
                  accent="text-slate-800"
                />
                <FeatureItem 
                  icon="bar_chart" 
                  title="Generate Reports" 
                  desc="Create comprehensive payment and balance reports." 
                  accent="text-slate-800"
                />
                <FeatureItem 
                  icon="manage_accounts" 
                  title="Manage Students" 
                  desc="Maintain student records and staff permissions across the system." 
                  accent="text-slate-800"
                />
              </div>
            </div>

          </div>
        </main>

        {/* Global Fixed Footer */}
        <AppFooter />
      </div>
    );
  }

  // When activeAuthMode is true, render the centered glass-card AuthGate layout
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 pb-24 md:p-8 md:pb-24 relative font-body text-[#0b1c30]"
      style={{
        backgroundColor: '#f4f7fa',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(10, 102, 194, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(10, 102, 194, 0.05) 0px, transparent 50%)
        `
      }}
    >
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-[#0A66C2]/5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#0A66C2]/5 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          className="flex items-center gap-2 text-[#0A66C2] font-semibold hover:-translate-x-1 transition-all text-sm glass-card px-4 py-2.5 rounded-xl shadow-sm" 
          onClick={() => setActiveAuthMode(null)}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
      </div>

      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AuthGate
          initialMode={activeAuthMode}
          onAuthenticated={(session) => {
            saveSession(session);
            navigate(session.user.role === 'STUDENT' ? '/student' : '/admin', { replace: true });
          }}
          onError={setErrorMessage}
          onSuccess={setSuccessMessage}
        />
        
        {/* Messages */}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-xl text-center border border-red-100 shadow-sm">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl text-center border border-emerald-100 shadow-sm">
            {successMessage}
          </div>
        )}
      </div>

      {/* Fixed Full-Width App Footer */}
      <AppFooter />
    </div>
  );
}

function FeatureItem({ icon, title, desc, accent }: { icon: string; title: string; desc: string; accent: string }) {
  return (
    <div className="flex gap-4 items-start group cursor-default">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#004e99] transition-colors duration-300">
        <span className={`material-symbols-outlined text-[24px] ${accent} group-hover:text-white transition-colors`}>{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#004e99] transition-colors tracking-tight">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}
