import { useOutletContext } from 'react-router-dom';
import { AuditLogsWorkspace } from '../../features/admin/AuditLogsWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (msg: string) => void;
};

export function AdminAuditPage() {
  const { token, authUser, onError } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">System Governance</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Audit trail and security events.</h2>
      </div>
      <AuditLogsWorkspace token={token} role={authUser.role} onError={onError} />
    </div>
  );
}
