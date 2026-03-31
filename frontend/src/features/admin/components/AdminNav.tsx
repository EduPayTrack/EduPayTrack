import { NavLink, Link } from 'react-router-dom';
import type { UserRole } from '../../../types/api';

type AdminNavProps = {
  role: UserRole;
  institutionName: string;
  logoUrl?: string | null;
  onLogout: () => void;
  onOpenSettings: () => void;
  onChangePasswordTab: () => void;
  onItemClick?: () => void;
};

export function AdminNav({ role, institutionName, logoUrl, onLogout, onOpenSettings, onChangePasswordTab, onItemClick }: AdminNavProps) {
  const isAdmin = role === 'ADMIN';
  const isAccounts = role === 'ACCOUNTS';

  // Role-based navigation items
  const showStudentsNav = isAdmin;
  const showReportsNav = isAdmin || isAccounts;  // Both can see reports
  const showSystemSection = isAdmin;

  return (
    <aside className="w-full h-full flex flex-col transition-all border-r border-slate-200/60" style={{ background: 'linear-gradient(160deg, #f0f4f9 0%, #e8eef6 100%)' }}>
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200/50 flex-none">
        <Link to={isAdmin ? "/admin/registry" : "/admin"} className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#004e99] text-white shadow-lg shadow-[#004e99]/30 transition-transform duration-500 group-hover:scale-105 shrink-0 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-xl">school</span>
            )}
            {!logoUrl && (
              <div className="absolute -bottom-1 -right-1 bg-[#0b1c30] p-0.5 rounded-md">
                <span className="material-symbols-outlined text-[#004e99] text-[10px]">payments</span>
              </div>
            )}
          </div>
          <div className="flex flex-col leading-none overflow-hidden text-center justify-center">
            <span className="text-sm font-black tracking-tighter text-slate-900 truncate">EduPayTrack</span>
            <span className="text-[11px] font-black text-slate-500 tracking-widest mt-1 whitespace-normal line-clamp-2 leading-snug max-w-[120px]">{institutionName}</span>
          </div>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-3 mt-8 space-y-10 overflow-hidden">
        {/* Operations Section */}
        <div>
          <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 leading-none">
            {isAdmin ? 'Operations' : 'Verification'}
          </p>
          <div className="space-y-0.5">
              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
              to="/admin"
              end
            >
              <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isAccounts ? 'fact_check' : 'dashboard'}
              </span>
              {isAccounts ? 'Verify Payments' : 'Review Queue'}
            </NavLink>

            {showStudentsNav && (
              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/students"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  group
                </span>
                Students
              </NavLink>
            )}

            {showReportsNav && (
              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/reports"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  analytics
                </span>
                Reports
              </NavLink>
            )}
          </div>
        </div>

        {/* System Management Section - ADMIN ONLY */}
        {showSystemSection && (
          <div>
            <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 leading-none">System</p>
            <div className="space-y-0.5">
              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/fees"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
                Fee Structure
              </NavLink>

              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/users"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  manage_accounts
                </span>
                Staff Accounts
              </NavLink>

              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/registry"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  settings
                </span>
                System Settings
              </NavLink>

              <NavLink
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-[13px] font-black tracking-tight transition-all duration-200 group whitespace-nowrap ${isActive
                    ? 'bg-[#004e99] text-white shadow-md shadow-[#004e99]/20'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`
                }
                to="/admin/audit"
              >
                <span className="material-symbols-outlined mr-3 text-xl transition-opacity" style={{ fontVariationSettings: "'FILL' 1" }}>
                  history
                </span>
                Audit Log
              </NavLink>
            </div>
          </div>
        )}

        {/* Personal Section - Shared */}
        <div className="mt-8">
          <p className="px-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 leading-none">Personal</p>
          <button
            onClick={() => {
              onOpenSettings();
              onChangePasswordTab();
            }}
            className="w-full flex items-center px-4 py-2.5 rounded-xl text-slate-500 hover:bg-white/70 hover:text-slate-900 transition-all font-black text-[13px] whitespace-nowrap group"
          >
            <span className="material-symbols-outlined mr-3 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            Profile & Security
          </button>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 pt-4 border-t border-slate-200/50 space-y-0.5 flex-none pb-[84px] mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-black text-[13px] whitespace-nowrap group"
        >
          <span className="material-symbols-outlined mr-3 text-xl">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
