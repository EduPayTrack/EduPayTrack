import { useOutletContext } from 'react-router-dom';
import { StudentsWorkspace } from '../../features/admin/StudentsWorkspace';

type ContextType = {
  token: string;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function AdminStudentsPage() {
  const { token, onError, onSuccess } = useOutletContext<ContextType>();

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Student Management</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Browse student balances and activity.</h2>
      </div>
      <StudentsWorkspace
        token={token}
        onError={onError}
        onSuccess={onSuccess}
      />
    </div>
  );
}
