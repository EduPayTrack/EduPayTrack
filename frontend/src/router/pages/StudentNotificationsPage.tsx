import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { StudentDashboardLayout } from '../../components/layout/StudentDashboardLayout';
import { NotificationsWorkspace } from '../../features/shared/NotificationsWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function StudentNotificationsPage() {
  const { token, authUser, clearSession } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (!token || !authUser) {
    return <Navigate replace to="/login" />;
  }

  if (authUser.role !== 'STUDENT') {
    return <Navigate replace to="/admin" />;
  }

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  const updateStatus = (type: 'error' | 'success', message: string) => {
    if (type === 'error') {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
  };

  return (
    <StudentDashboardLayout 
      authUser={authUser}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
      onStatusUpdate={updateStatus}
    >
      <div className="max-w-screen-2xl mx-auto space-y-12">
        <div className="flex flex-col gap-2">
           <p className="text-[11px] font-black uppercase tracking-widest text-[#004e99] mb-1 leading-none shadow-sm">Educational Updates</p>
           <h1 className="text-4xl font-extrabold text-[#0b1c30] tracking-tighter leading-none mb-2">My notifications center</h1>
        </div>
        <NotificationsWorkspace role={authUser.role} />
      </div>
    </StudentDashboardLayout>
  );
}
