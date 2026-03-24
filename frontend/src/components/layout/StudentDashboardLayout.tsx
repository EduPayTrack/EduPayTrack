import { useState, type ReactNode, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppFooter } from './AppFooter';
import { PasswordChangeCard } from '../shared/PasswordChangeCard';
import type { AuthResponse } from '../../types/api';

type StudentDashboardLayoutProps = {
  children: ReactNode;
  authUser: AuthResponse['user'];
  token: string;
  onLogout: () => void;
  errorMessage?: string;
  successMessage?: string;
  onStatusClear?: () => void;
  onStatusUpdate?: (type: 'error' | 'success', message: string) => void;
};

export function StudentDashboardLayout({ 
  children, 
  authUser,
  token,
  onLogout,
  errorMessage,
  successMessage,
  onStatusClear,
  onStatusUpdate
}: StudentDashboardLayoutProps) {
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
    { id: 1, text: "Tuition receipt for Term 1 APPROVED", time: "Just now", unread: true, status: 'APPROVED' },
    { id: 2, text: "Payment rejected: Information mismatch", time: "2 hours ago", unread: true, status: 'REJECTED' },
    { id: 3, text: "System maintenance: March 25th", time: "Yesterday", unread: false, status: 'INFO' },
  ];

  return (
    <div className="bg-[#f8f9ff] font-body text-[#0b1c30] antialiased min-h-screen">
      {/* SideNavBar */}
      <aside className="w-56 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 z-40 transition-all shadow-sm">
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 flex-none bg-white">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#004e99] text-white shadow-lg shadow-[#004e99]/10 transition-transform duration-500 group-hover:scale-105 shrink-0">
              <span className="material-symbols-outlined text-lg">school</span>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-md shadow-sm border border-[#c1c6d4]/20">
                <span className="material-symbols-outlined text-[#004e99] text-[10px]">payments</span>
              </div>
            </div>
            <div className="flex flex-col leading-none overflow-hidden text-left">
              <span className="text-sm font-black tracking-tighter text-[#004e99] truncate uppercase">EduPayTrack</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 whitespace-nowrap">Student Portal</span>
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
                      ? 'bg-[#004e99]/5 text-[#004e99] border-r-4 border-[#004e99] shadow-sm shadow-[#004e99]/5' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0b1c30] hover:pl-5'
                  }`
                }
                to="/student"
                end
              >
                <span className="material-symbols-outlined mr-3 text-xl opacity-80 group-hover:opacity-100">cloud_upload</span>
                <span>Upload Receipt</span>
              </NavLink>
              <NavLink 
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#004e99]/5 text-[#004e99] border-r-4 border-[#004e99] shadow-sm shadow-[#004e99]/5' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0b1c30] hover:pl-5'
                  }`
                }
                to="/student/history"
              >
                <span className="material-symbols-outlined mr-3 text-xl opacity-80 group-hover:opacity-100">history</span>
                <span>History</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 pt-4 border-t border-slate-100 space-y-1 flex-none bg-white z-[39] pb-[84px] mt-auto">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center px-4 py-2.5 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all font-black text-[13px] whitespace-nowrap group hover:pl-5"
          >
            <span className="material-symbols-outlined mr-3 text-xl opacity-80 group-hover:opacity-100">lock_reset</span>
            <span>Security</span>
          </button>
          <button 
            type="button"
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2.5 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-black text-[13px] whitespace-nowrap group hover:pl-5 border border-transparent hover:border-red-100 shadow-sm shadow-red-500/5 hover:shadow-red-500/10"
          >
            <span className="material-symbols-outlined mr-3 text-xl opacity-80 group-hover:opacity-100">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="lg:pl-56 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-[#c1c6d4]/20 sticky top-0 z-40 flex items-center justify-between px-8">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border max-md:hidden transition-colors ${isSyncing ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
            {isSyncing ? (
              <span className="material-symbols-outlined text-[12px] text-blue-600 animate-spin" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            )}
            <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${isSyncing ? 'text-blue-700' : 'text-emerald-700'}`}>
              {isSyncing ? 'Syncing...' : 'Auto-Sync Active'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Section */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-[#004e99] text-white shadow-lg shadow-[#004e99]/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[7px] font-black text-white">3</div>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[70] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#004e99]">Educational Updates</h4>
                      <span className="text-[9px] font-bold text-[#004e99] cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.unread ? 'bg-blue-50/30' : ''}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                            n.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            <span className="material-symbols-outlined text-base">
                              {n.status === 'APPROVED' ? 'check_circle' : (n.status === 'REJECTED' ? 'error' : 'notifications')}
                            </span>
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
                        to="/student/notifications" 
                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-[#004e99] transition-colors block"
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
                <p className="text-xs font-black text-[#0b1c30] mb-1 uppercase tracking-tight">{authUser.student?.firstName} {authUser.student?.lastName}</p>
                <p className="text-[9px] text-[#64748b] font-bold uppercase tracking-widest leading-none">ID: {authUser.student?.studentCode || 'STU-001'}</p>
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-10 h-10 rounded-xl bg-slate-100 border border-[#c1c6d4]/20 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:border-[#004e99]/50 hover:shadow-md active:scale-95"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#004e99] transition-colors">account_circle</span>
                )}
                <div className="absolute inset-0 bg-[#004e99]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
        <main className="flex-1 px-8 pt-0 pb-32">
          {/* Messages */}
          <div className="max-w-screen-xl mx-auto mb-6 flex flex-col gap-3">
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

          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>

        <AppFooter />
      </div>

      {/* Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <p className="text-[10px] font-black text-[#004e99] uppercase tracking-widest mb-1">Security Portal</p>
                <h3 className="text-xl font-black text-[#0b1c30]">Change password</h3>
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

      {/* BottomNavBar (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-[3rem] left-0 w-full bg-white/80 backdrop-blur-lg flex justify-around py-3 px-6 z-40 border-t border-[#c1c6d4]/30">
        <button className="flex flex-col items-center text-[#414752] hover:text-[#004e99]">
          <span className="material-symbols-outlined">cloud_upload</span>
          <span className="text-[10px] font-black mt-1">Upload</span>
        </button>
        <button className="flex flex-col items-center text-[#414752] hover:text-[#004e99]">
          <span className="material-symbols-outlined">history</span>
          <span className="text-[10px] font-black mt-1">History</span>
        </button>
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="flex flex-col items-center text-[#414752] hover:text-[#004e99]"
        >
          <span className="material-symbols-outlined">lock_reset</span>
          <span className="text-[10px] font-black mt-1">Security</span>
        </button>
      </nav>
    </div>
  );
}
