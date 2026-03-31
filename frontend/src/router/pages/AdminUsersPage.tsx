import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UsersWorkspace } from '../../features/admin/UsersWorkspace';
import type { User } from '../../types/api';

type ContextType = {
  token: string;
  authUser: User;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function AdminUsersPage() {
  const { token, authUser, onError, onSuccess } = useOutletContext<ContextType>();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Back-Office Integrity</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Manage system users.</h2>
        </div>
        
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
            Add New Member
          </button>
        )}
      </div>

      <div className="space-y-12">
        <UsersWorkspace
          token={token}
          authUser={authUser}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          onError={onError}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
