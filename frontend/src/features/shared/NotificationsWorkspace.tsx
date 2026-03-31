import { useState } from 'react';

type Notification = {
  id: number;
  text: string;
  time: string;
  unread: boolean;
  category: 'SYSTEM' | 'REVIEW' | 'PAYMENT' | 'USER';
  details?: string;
};

type NotificationsWorkspaceProps = {
  role: 'ADMIN' | 'STUDENT' | 'ACCOUNTS';
};

export function NotificationsWorkspace({ role }: NotificationsWorkspaceProps) {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const allNotifications: Notification[] = role === 'ADMIN' || role === 'ACCOUNTS' ? [
    { id: 1, text: "5 new receipt submissions pending review", time: "2 mins ago", unread: true, category: 'REVIEW', details: "Receipts from University of Malawi students require immediate verification for Term 1 clearance." },
    { id: 2, text: "System audit completed successfully", time: "1 hour ago", unread: false, category: 'SYSTEM', details: "Full security scan passed. No anomalies detected in tuition record sync." },
    { id: 3, text: "Monthly financial report generated", time: "3 hours ago", unread: false, category: 'SYSTEM', details: "The aggregate collection report for March 2026 is now available in the Reports section." },
    { id: 4, text: "New staff member access requested", time: "Yesterday", unread: false, category: 'USER', details: "A request for the 'Reviewer' role has been submitted by j.smith@edupaytrack.com." },
  ] : [
    { id: 1, text: "Tuition receipt for Term 1 approved", time: "1 hour ago", unread: true, category: 'PAYMENT', details: "Your proof of payment for MWK 450,000 has been verified by the administration. You are now cleared for exams." },
    { id: 2, text: "System maintenance: March 25th", time: "5 hours ago", unread: false, category: 'SYSTEM', details: "EduPayTrack will be offline for 2 hours (02:00 - 04:00 CAT) for core database optimizations." },
    { id: 3, text: "University fee structure updated", time: "Yesterday", unread: false, category: 'SYSTEM', details: "The 2026/2027 fee roadmap has been published. Check the fee structure for changes in laboratory costs." },
    { id: 4, text: "Registration number sync successful", time: "2 days ago", unread: false, category: 'USER', details: "Your student identity has been cross-referenced with the university SRS database." },
  ];

  const filtered = filter === 'UNREAD' ? allNotifications.filter(n => n.unread) : allNotifications;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            All Updates
          </button>
          <button 
            onClick={() => setFilter('UNREAD')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${filter === 'UNREAD' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            Unread
          </button>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Showing {filtered.length} notifications
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">notifications_off</span>
              <p className="text-sm font-bold text-slate-400">Everything caught up!</p>
            </div>
          ) : (
            filtered.map(n => (
              <div 
                key={n.id} 
                className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden ${n.unread ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex gap-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${
                    n.category === 'SYSTEM' ? 'bg-emerald-50 text-emerald-600' :
                    n.category === 'REVIEW' ? 'bg-blue-50 text-blue-600' :
                    n.category === 'PAYMENT' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    <span className="material-symbols-outlined text-2xl">
                      {n.category === 'SYSTEM' ? 'settings_suggest' :
                       n.category === 'REVIEW' ? 'fact_check' :
                       n.category === 'PAYMENT' ? 'payments' :
                       'person_search'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">{n.text}</h3>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{n.details}</p>
                    {n.unread && (
                      <div className="mt-4 flex items-center gap-2">
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Mark as read</button>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:translate-x-2">
                  <span className="material-symbols-outlined text-8xl">bolt</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#004e99] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 block mb-4">System Status</span>
              <h4 className="text-2xl font-black mb-6 leading-tight">All systems operational.</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Database Sync: 100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold opacity-80 uppercase tracking-widest">OCR Core Path: Active</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
              <svg fill="none" height="400" viewBox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" fill="white" r="200"></circle>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Subscription Settings</span>
            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
              You are currently receiving high-priority updates via email and the EduPayTrack platform center.
            </p>
            <button className="w-full py-4 rounded-2xl bg-slate-50 text-[#004e99] font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300">
              Configure Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
