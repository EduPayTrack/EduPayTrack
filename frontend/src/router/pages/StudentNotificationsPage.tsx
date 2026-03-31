import { useOutletContext } from 'react-router-dom';
import { NotificationsWorkspace } from '../../features/shared/NotificationsWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  authUser: AuthResponse['user'];
};

export function StudentNotificationsPage() {
  const { authUser } = useOutletContext<ContextType>();

  return (
    <div className="max-w-screen-2xl mx-auto space-y-12">
      <div className="flex flex-col gap-2">
         <p className="text-[11px] font-black uppercase tracking-widest text-[#004e99] mb-1 leading-none shadow-sm">Educational Updates</p>
         <h1 className="text-4xl font-extrabold text-[#0b1c30] tracking-tighter leading-none mb-2">My notifications center</h1>
      </div>
      <NotificationsWorkspace role={authUser.role} />
    </div>
  );
}
