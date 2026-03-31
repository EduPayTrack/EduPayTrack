import { useOutletContext } from 'react-router-dom';
import { ReportsWorkspace } from '../../features/admin/ReportsWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (msg: string) => void;
};

export function AdminReportsPage() {
  const { token, authUser, onError } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      <ReportsWorkspace 
        token={token} 
        onError={onError} 
        role={authUser.role} 
      />
    </div>
  );
}
