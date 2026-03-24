import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { FeeStructuresWorkspace } from '../../features/admin/FeeStructuresWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function AdminFeesPage() {
  const { token, authUser, clearSession } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (!token || !authUser) {
    return <Navigate replace to="/login" />;
  }

  if (authUser.role === 'STUDENT') {
    return <Navigate replace to="/student" />;
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
    <AdminDashboardLayout
      title="Manage fee structures."
      kicker="Finance Configuration"
      role={authUser.role}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusUpdate={updateStatus}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
    >
      <FeeStructuresWorkspace
        token={token}
        onError={setErrorMessage}
        onSuccess={setSuccessMessage}
      />
    </AdminDashboardLayout>
  );
}
