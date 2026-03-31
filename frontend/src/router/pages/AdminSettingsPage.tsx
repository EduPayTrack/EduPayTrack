import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ProfilePictureCard } from '../../components/shared/ProfilePictureCard';
import { PasswordChangeCard } from '../../components/shared/PasswordChangeCard';
import type { AuthResponse } from '../../types/api';
import { API_BASE_URL } from '../../config/env';

type ContextType = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
  onProfilePictureUpdated: (url: string | null) => void;
};

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/uploads/${url}`;
}

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'password', label: 'Security', icon: 'lock' },
] as const;

type TabId = typeof SETTINGS_TABS[number]['id'];

export function AdminSettingsPage() {
  const { token, authUser, onError, onSuccess, onProfilePictureUpdated } = useOutletContext<ContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'password' ? 'password' : 'profile';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    setActiveTab(tabParam === 'password' ? 'password' : 'profile');
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const avatarUrl = resolveImageUrl(authUser?.profilePictureUrl);
  const displayName = authUser?.student 
    ? `${authUser.student.firstName} ${authUser.student.lastName}`
    : authUser?.firstName && authUser?.lastName
    ? `${authUser.firstName} ${authUser.lastName}`
    : authUser?.email?.split('@')[0] ?? 'System User';

  return (
    <div className="min-h-screen w-full animate-in fade-in duration-500">
      {/* Full-width Settings Header Banner */}
      <div className="w-full border-b border-slate-100 pb-6 mb-8">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Account Settings</p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{displayName}</h1>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              {authUser?.email} · {authUser?.role === 'STUDENT' ? `Student (${authUser.student?.studentCode})` : authUser?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Settings Layout */}
      <div className="flex gap-12 w-full">

        {/* Left: Settings Navigation */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-0.5 sticky top-24">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-primary/5 text-primary border border-primary/10'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right: Content Area — fills remaining space */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1">Profile Settings</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update your profile picture and personal info</p>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <ProfilePictureCard
                  token={token}
                  currentPictureUrl={authUser?.profilePictureUrl}
                  onError={onError}
                  onSuccess={onSuccess}
                  onPictureUpdated={onProfilePictureUpdated}
                />
              </div>
            </div>
          )}
          {activeTab === 'password' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1">Security</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Manage your password and account access</p>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <PasswordChangeCard
                  token={token}
                  onError={onError}
                  onSuccess={onSuccess}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
