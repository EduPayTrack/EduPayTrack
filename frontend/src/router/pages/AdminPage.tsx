import { useOutletContext } from 'react-router-dom';

import { AccountsWorkspace } from '../../features/admin/AccountsWorkspace';
import { AdminWorkspace } from '../../features/admin/AdminWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function AdminPage() {
  const { token, authUser, onError, onSuccess } = useOutletContext<ContextType>();

  return (
    <div className="space-y-12">
      {authUser.role === 'ACCOUNTS' ? (
        <AccountsWorkspace
          token={token}
          onError={onError}
          onSuccess={onSuccess}
        />
      ) : (
        <AdminWorkspace
          token={token}
          onError={onError}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
