import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { StudentDashboardLayout } from '../../components/layout/StudentDashboardLayout';
import { StudentWorkspace } from '../../features/student/StudentWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function StudentPage() {
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

  const updateStatus = (type: 'error' | 'success', message: string) => {
    if (type === 'error') {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <StudentDashboardLayout 
      authUser={authUser}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusClear={() => {
        setErrorMessage('');
        setSuccessMessage('');
      }}
      onStatusUpdate={updateStatus}
    >
      <StudentWorkspace
        authUser={authUser}
        token={token}
        onError={setErrorMessage}
        onSuccess={setSuccessMessage}
      />
    </StudentDashboardLayout>
  );
}
