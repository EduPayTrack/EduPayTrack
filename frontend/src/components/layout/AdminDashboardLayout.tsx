import { useState, type ReactNode, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdminNav } from '../../features/admin/components/AdminNav';
import { PasswordChangeCard } from '../../components/shared/PasswordChangeCard';
import { AppFooter } from './AppFooter';
import type { UserRole } from '../../types/api';

type AdminDashboardLayoutProps = {
  children: ReactNode;
  role: UserRole;
  token: string;
  onLogout: () => void;
  errorMessage?: string;
  successMessage?: string;
  title?: string;
  kicker?: string;
  onStatusClear?: () => void;
  onStatusUpdate?: (type: 'error' | 'success', message: string) => void;
};

export function AdminDashboardLayout({ 
  children, 
  role, 
  token,
  onLogout,
  errorMessage,
  successMessage,
  title,
  kicker,
  onStatusClear,
  onStatusUpdate
}: AdminDashboardLayoutProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string);
        onStatusUpdate?.('success', 'Profile picture updated successfully');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeProfilePic = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfilePic(null);
    onStatusUpdate?.('success', 'Profile picture removed');
  };

  const notifications = [
    { id: 1, text: "New tuition proof uploaded by John Doe", time: "Just now", unread: true, highPriority: true },
    { id: 2, text: "Pending Review: 5 receipts from University of Mzuzu", time: "10 mins ago", unread: true },
    { id: 3, text: "Weekly financial reconciliation auto-generated", time: "2 hours ago", unread: false },
  ];

  return (
    <div className="bg-slate-50 font-body text-slate-900 antialiased min-h-screen">
      {/* Sidebar Navigation */}
      <AdminNav 
        role={role} 
        onLogout={onLogout} 
        onChangePassword={() => setShowPasswordModal(true)}
      />

      {/* Main Container */}
      <div className="lg:pl-56 flex flex-col min-h-screen relative pb-16">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="relative group max-md:hidden">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input 
                type="text" 
                placeholder="Search ops database..." 
                className="bg-slate-100 border-none focus:ring-0 rounded-2xl pl-12 pr-6 py-2.5 text-xs font-bold w-52 text-slate-900 transition-all focus:bg-white focus:shadow-md"
              />
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border max-md:hidden transition-colors ${isSyncing ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
              {isSyncing ? (
                <span className="material-symbols-outlined text-[12px] text-blue-600 animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              )}
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${isSyncing ? 'text-blue-700' : 'text-emerald-700'}`}>
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
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#004e99]">Recent Notifications</h4>
                      <span className="text-[9px] font-bold text-primary cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-blue-50/30' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.unread ? (n.highPriority ? 'bg-red-50 text-red-600' : 'bg-primary/20 text-primary') : 'bg-slate-100 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-lg">{n.highPriority ? 'priority_high' : (n.unread ? 'notifications_active' : 'notifications')}</span>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-snug">{n.text}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center bg-slate-50">
                      <Link 
                        to="/admin/notifications" 
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors block"
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
                <p className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight">System Admin</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md active:scale-95"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">account_circle</span>
                )}
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-lg">add_a_photo</span>
                </div>
                {profilePic && (
                  <button 
                    onClick={removeProfilePic}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md scale-0 group-hover:scale-100 transition-transform border-2 border-white"
                  >
                    <span className="material-symbols-outlined text-[10px] font-black">close</span>
                  </button>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleProfilePicChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">
          {/* Header context */}
          {(title || kicker) && (
            <div className="max-w-screen-2xl mx-auto mb-10">
              {kicker && <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{kicker}</p>}
              {title && <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>}
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

        <AppFooter />
      </div>

      {/* Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Security Settings</p>
                <h3 className="text-xl font-black text-slate-900">Change password</h3>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <PasswordChangeCard 
                token={token} 
                onError={(msg) => onStatusUpdate?.('error', msg)}
                onSuccess={(msg) => {
                  onStatusUpdate?.('success', msg);
                  setShowPasswordModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
