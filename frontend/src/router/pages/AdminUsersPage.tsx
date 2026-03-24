import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { UsersWorkspace } from '../../features/admin/UsersWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function AdminUsersPage() {
  const { token, authUser, clearSession } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  if (!token || !authUser) {
    return <Navigate replace to="/login" />;
  }

  if (authUser.role !== 'ADMIN') {
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
    <AdminDashboardLayout
      title="Manage back-office users."
      kicker="Identity & Access"
      role={authUser.role}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusUpdate={updateStatus}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
    >
      <div className="space-y-12">
        <UsersWorkspace
          token={token}
          onError={setErrorMessage}
          onSuccess={setSuccessMessage}
        />
      </div>
    </AdminDashboardLayout>
  );
}
