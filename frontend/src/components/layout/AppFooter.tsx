import { NavLink } from 'react-router-dom';

/**
 * Unified Global Footer for the EduPayTrack platform.
 * Features: Brand blue background, Copyright, System Status, and versioning.
 */
export function AppFooter() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-[10px] md:text-xs font-bold transition-all px-1 py-0.5 border-b-2 ${
      isActive 
        ? 'text-white border-white/80' 
        : 'text-white/60 border-transparent hover:text-white hover:border-white/20'
    }`;

  return (
    <footer className="fixed bottom-0 left-0 w-full py-3 px-6 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-2 bg-[#004e99] shadow-[0_-10px_40px_-10px_rgba(0,78,153,0.3)] backdrop-blur-xl z-50 border-t border-white/10">
      {/* LEFT: Copyright & Status */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <div className="text-[10px] md:text-xs font-semibold text-white/90 text-center sm:text-left">
          © 2026 EduPayTrack. All rights reserved.
        </div>
        
        {/* Professional Status Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 select-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] font-bold text-white/50 tracking-wider">System Operational</span>
        </div>
      </div>

      {/* RIGHT: Links & Version */}
      <div className="flex items-center gap-4 md:gap-7 justify-center">
        <NavLink className={getLinkClass} to="/privacy">
          Privacy Policy
        </NavLink>
        <NavLink className={getLinkClass} to="/terms">
          Terms of Service
        </NavLink>
        <NavLink className={getLinkClass} to="/support">
          Support
        </NavLink>
        
        {/* Subtle Build Identifier */}
        <div className="hidden md:flex items-center ml-1 border-l border-white/10 pl-4 py-0.5">
          <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em] hover:text-white/40 transition-colors">v1.2.0-STABLE</span>
        </div>
      </div>
    </footer>
  );
}
