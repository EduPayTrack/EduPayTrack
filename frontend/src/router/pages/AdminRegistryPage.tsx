import { useOutletContext, useNavigate } from 'react-router-dom';
import { RegistryWorkspace } from '../../features/admin/RegistryWorkspace';

type ContextType = {
  token: string;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function AdminRegistryPage() {
  const { token, onError, onSuccess } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  return (
    <>
      <div 
        className="fixed inset-0 z-0 bg-transparent"
        onClick={() => navigate('/admin')}
      />
      <div className="relative z-10 space-y-6 pointer-events-none">
        <div className="mb-4 pointer-events-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Institutional Branding</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Registry & Identity</h2>
        </div>
        <div className="pointer-events-auto">
          <RegistryWorkspace token={token} onError={onError} onSuccess={onSuccess} />
        </div>
      </div>
    </>
  );
}

