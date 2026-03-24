import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { StudentDashboardLayout } from '../../components/layout/StudentDashboardLayout';
import { HistoryWorkspace } from '../../features/student/HistoryWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function StudentHistoryPage() {
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
      <div className="max-w-screen-2xl mx-auto">
        <HistoryWorkspace 
          token={token}
          onError={setErrorMessage}
        />
      </div>
    </StudentDashboardLayout>
  );
}
