import { useOutletContext } from 'react-router-dom';
import { StudentWorkspace } from '../../features/student/StudentWorkspace';
import type { AuthResponse } from '../../types/api';

type ContextType = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function StudentPage() {
  const { token, authUser, onError, onSuccess } = useOutletContext<ContextType>();

  return (
    <StudentWorkspace
      authUser={authUser}
      token={token}
      onError={onError}
      onSuccess={onSuccess}
    />
  );
}
