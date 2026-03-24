import type { ReactNode } from 'react';
import { AppFooter } from './AppFooter';

type AppShellProps = {
  title: string;
  kicker: string;
  action?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
  children: ReactNode;
};

export function AppShell({
  title,
  kicker,
  action,
  errorMessage,
  successMessage,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell font-body antialiased min-h-screen pb-24 pt-20">
      <div className="app-backdrop" />

      {/* Global Fixed Header (Hellopanell) */}
      <header className="fixed top-0 left-0 w-full z-[60] bg-white/70 backdrop-blur-xl border-b border-[#c1c6d4]/30 shadow-sm h-16 md:h-20 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#004e99] text-white shadow-lg shadow-[#004e99]/20 transition-transform duration-500 group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-xl md:text-2xl">school</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 md:p-1 rounded-md shadow-md border border-[#c1c6d4]/20">
                <span className="material-symbols-outlined text-[#004e99] text-[14px] md:text-[16px]">payments</span>
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-lg font-black tracking-tighter text-[#004e99]">EduPayTrack</span>
              <span className="text-[9px] md:text-[10px] font-bold text-[#64748b] uppercase tracking-widest">{kicker}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {action}
        </div>
      </header>

      <main className="app-layout max-w-7xl mx-auto w-full px-6">
        <section className="workspace-panel">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">{title}</h1>
          </div>

          {errorMessage ? <div className="message error mb-6">{errorMessage}</div> : null}
          {successMessage ? <div className="message success mb-6">{successMessage}</div> : null}

          {children}
        </section>

        <AppFooter />
      </main>
    </div>
  );
}
