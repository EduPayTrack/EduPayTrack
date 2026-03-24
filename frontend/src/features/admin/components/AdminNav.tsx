import { NavLink } from 'react-router-dom';
import type { UserRole } from '../../../types/api';

type AdminNavProps = {
  role: UserRole;
  onLogout: () => void;
  onChangePassword: () => void;
};

export function AdminNav({ role, onLogout, onChangePassword }: AdminNavProps) {
  const isAdmin = role === 'ADMIN';

  return (
    <aside className="w-56 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 z-40 transition-all shadow-sm">
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 flex-none bg-white">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:scale-105 shrink-0">
            <span className="material-symbols-outlined text-lg">school</span>
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-md shadow-sm border border-slate-200/20">
              <span className="material-symbols-outlined text-primary text-[10px]">payments</span>
            </div>
          </div>
          <div className="flex flex-col leading-none overflow-hidden text-left">
            <span className="text-sm font-black tracking-tighter text-slate-900 truncate uppercase">EduPayTrack</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 whitespace-nowrap">Admin Ops</span>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-3 mt-8 space-y-10 overflow-hidden">
        {/* Operations Section */}
        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70 leading-none">Operations</p>
          <div className="space-y-1">
            <NavLink
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                }`
              }
              to="/admin"
              end
            >
              <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                dashboard
              </span>
              Review Queue
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                }`
              }
              to="/admin/students"
            >
              <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                group
              </span>
              Students
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                }`
              }
              to="/admin/reports"
            >
              <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                analytics
              </span>
              Reports
            </NavLink>
          </div>
        </div>

        {/* System Management Section */}
        {isAdmin && (
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70 leading-none">System</p>
            <div className="space-y-1">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                  }`
                }
                to="/admin/fees"
              >
                <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  account_balance
                </span>
                Fees
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                  }`
                }
                to="/admin/users"
              >
                <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  manage_accounts
                </span>
                Staff
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary/5 text-primary border-r-4 border-primary shadow-sm shadow-primary/5' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5'
                  }`
                }
                to="/admin/audit"
              >
                <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                  history_edu
                </span>
                Audit
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 pt-4 border-t border-slate-100 space-y-1 flex-none bg-white z-[39] pb-[84px] mt-auto">
        <button 
          onClick={onChangePassword}
          className="w-full flex items-center px-4 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all font-black text-[13px] whitespace-nowrap group hover:pl-5"
        >
          <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100">lock_reset</span>
          Security
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2.5 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-black text-[13px] whitespace-nowrap group hover:pl-5 border border-transparent hover:border-red-100 shadow-sm shadow-red-500/5 hover:shadow-red-500/10"
        >
          <span className="material-symbols-outlined mr-3 text-xl opacity-70 group-hover:opacity-100">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
