import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { AdminDashboardLayout } from '../components/layout/AdminDashboardLayout';
import { useAuthState } from '../hooks/use-auth';
import { logout } from '../services/auth';

export function AdminLayoutWrapper() {
  const { token, authUser, clearSession, setAuthUser } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Artificial delay to ensure all state is settled and prevent "scattering"
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!token || !authUser) {
    return <Navigate replace to="/login" />;
  }

  if (authUser.role === 'STUDENT') {
    return <Navigate replace to="/student" />;
  }

  const handleLogout = async () => {
    try {
      await logout(token!);
    } catch (err) {
      console.warn('Sign out event logging failed');
    }
    clearSession();
    navigate('/login', { replace: true });
  };

  const handleProfilePictureUpdated = (newProfilePictureUrl: string | null) => {
    if (authUser) {
      setAuthUser({
        ...authUser,
        profilePictureUrl: newProfilePictureUrl,
      });
    }
  };




  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#004e99] animate-pulse">Initializing Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardLayout
      role={authUser.role}
      authUser={authUser}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
    >
      <div className="animate-in fade-in duration-500">
        <Outlet context={{
          token,
          authUser,
          onError: setErrorMessage,
          onSuccess: setSuccessMessage,
          onProfilePictureUpdated: handleProfilePictureUpdated
        }} />
      </div>
    </AdminDashboardLayout>
  );
}
