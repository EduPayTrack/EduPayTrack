import { useState, type ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminNav } from '../../features/admin/components/AdminNav';
import { AppFooter } from './AppFooter';
import { getRegistry } from '../../services/admin';
import { API_BASE_URL } from '../../config/env';
import type { UserRole, SystemRegistry, AuthResponse } from '../../types/api';

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Relative path like /uploads/filename
  if (url.startsWith('/')) {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}${url}`;
  }

  // Just a filename, assume it's in uploads
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${baseUrl}/uploads/${url}`;
}

type AdminDashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  authUser: AuthResponse['user'];
  token: string;
  onLogout: () => void;
  errorMessage?: string;
  successMessage?: string;
  title?: string;
  kicker?: string;
  headerActions?: ReactNode;
  onStatusClear?: () => void;
};

export function AdminDashboardLayout({
  children,
  role,
  authUser,
  token,
  onLogout,
  errorMessage,
  successMessage,
  title,
  kicker,
  headerActions,
  onStatusClear,
}: AdminDashboardLayoutProps) {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [registry, setRegistry] = useState<SystemRegistry | null>(null);

  useEffect(() => {
    async function loadRegistry() {
      try {
        const data = await getRegistry(token);
        setRegistry(data);
        if (data.institutionName) {
          document.title = `EduPayTrack | ${data.institutionName}`;
        }
      } catch (err) {
        console.error('Failed to load branding');
      }
    }
    void loadRegistry();
  }, [token]);

  useEffect(() => {
    setIsSyncing(true);
    const initialTimer = setTimeout(() => setIsSyncing(false), 2000);

    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1500);
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Success toast auto-clear after 3 seconds
  useEffect(() => {
    if (successMessage && onStatusClear) {
      const timer = setTimeout(() => {
        onStatusClear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, onStatusClear]);

  // Profile preview is handled inside ProfilePictureCard; do not duplicate preview state here.

  const notifications = [
    { id: 1, text: "New tuition proof uploaded by John Doe", time: "Just now", unread: true, highPriority: true },
    { id: 2, text: "Pending Review: 5 receipts from University of Mzuzu", time: "10 mins ago", unread: true },
    { id: 3, text: "Weekly financial reconciliation auto-generated", time: "2 hours ago", unread: false },
  ];

  return (
    <div className="bg-slate-50 font-body text-slate-900 antialiased min-h-screen">
      {/* Sidebar Navigation */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'bg-slate-900/40 backdrop-blur-sm opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 w-56 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminNav
          role={role}
          onLogout={onLogout}
          institutionName={registry?.institutionName || 'Unregistered School'}
          logoUrl={registry?.logoUrl}
          onOpenSettings={() => { navigate('/admin/settings?tab=profile'); setIsMobileMenuOpen(false); }}
          onChangePasswordTab={() => { navigate('/admin/settings?tab=password'); setIsMobileMenuOpen(false); }}
          onItemClick={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Container */}
      <div className="lg:pl-56 flex flex-col min-h-screen relative pb-16">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border max-md:hidden transition-colors ${isSyncing ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
              {isSyncing ? (
                <span className="material-symbols-outlined text-[12px] text-blue-600 animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              )}
              <span className={`text-[12px] font-black tracking-widest leading-none ${isSyncing ? 'text-blue-700' : 'text-emerald-700'}`}>
                {isSyncing ? 'Syncing...' : 'Auto-Sync Active'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Section */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-black text-white">3</div>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-[#004e99]">Recent Notifications</h4>
                      <span className="text-[11px] font-black text-primary cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-blue-50/30' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.unread ? (n.highPriority ? 'bg-red-50 text-red-600' : 'bg-primary/20 text-primary') : 'bg-slate-100 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-lg">{n.highPriority ? 'priority_high' : (n.unread ? 'notifications_active' : 'notifications')}</span>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-snug">{n.text}</p>
                            <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center bg-slate-50">
                      <Link
                        to="/admin/notifications"
                        className="text-[11px] font-black text-slate-600 uppercase tracking-widest hover:text-primary transition-colors block"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all updates
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-8 w-[1px] bg-slate-200/50 mx-1"></div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right max-md:hidden leading-none">
                <p className="text-[11px] text-slate-500 font-black tracking-widest leading-none mb-1 uppercase">System Admin</p>
                <p className="text-xs font-black text-slate-900 tracking-tight">{authUser?.firstName && authUser?.lastName ? `${authUser.firstName} ${authUser.lastName}` : 'Administrator'}</p>
              </div>
              <div className="group relative w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden transition-all">
                {authUser?.profilePictureUrl ? (
                  <img src={resolveImageUrl(authUser.profilePictureUrl) || ''} alt="Admin" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="material-symbols-outlined text-2xl text-slate-400 transition-colors">account_circle</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 md:px-8 pb-8 pt-2">
          {/* Header context */}
          {(title || kicker || headerActions) && (
            <div className="max-w-screen-2xl mx-auto mb-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                {kicker && <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-2 leading-none">{kicker}</p>}
                {title && <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>}
              </div>
              {headerActions}
            </div>
          )}

          {/* Notifications / Messages */}
          <div className="max-w-screen-2xl mx-auto mb-6 flex flex-col gap-3">
            {errorMessage && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-black border border-red-100 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <span className="material-symbols-outlined text-lg">error</span>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-xs font-black border border-emerald-100 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {successMessage}
              </div>
            )}
          </div>

          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>

        <AppFooter institutionName={registry?.institutionName} />
      </div >

    </div >
  );
}
