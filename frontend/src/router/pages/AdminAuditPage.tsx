import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { AdminDashboardLayout } from '../../components/layout/AdminDashboardLayout';
import { AuditLogsWorkspace } from '../../features/admin/AuditLogsWorkspace';
import { useAuthState } from '../../hooks/use-auth';

export function AdminAuditPage() {
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
      title="Audit trail and security events."
      kicker="System Governance"
      role={authUser.role}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusUpdate={updateStatus}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
    >
      <AuditLogsWorkspace token={token} onError={setErrorMessage} />
    </AdminDashboardLayout>
  );
}
