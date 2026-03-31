import { useOutletContext } from 'react-router-dom';
import { NotificationsWorkspace } from '../../features/shared/NotificationsWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  authUser: AuthResponse['user'];
};

export function AdminNotificationsPage() {
  const { authUser } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Stay informed.</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Global Updates & System Alerts</h2>
      </div>
      <NotificationsWorkspace role={authUser.role} />
    </div>
  );
}
