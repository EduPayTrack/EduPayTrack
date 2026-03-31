import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { StudentDashboardLayout } from '../components/layout/StudentDashboardLayout';
import { useAuthState } from '../hooks/use-auth';
import { logout } from '../services/auth';

export function StudentLayoutWrapper() {
  const { token, authUser, clearSession, setAuthUser } = useAuthState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!token || !authUser) {
    return <Navigate replace to="/login" />;
  }

  if (authUser.role !== 'STUDENT') {
    return <Navigate replace to="/admin" />;
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

  const updateStatus = (type: 'error' | 'success', message: string) => {
    if (type === 'error') {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
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
      <div className="fixed inset-0 bg-[#004e99] flex items-center justify-center z-[1000]">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Synchronizing Academic Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <StudentDashboardLayout
      authUser={authUser}
      token={token}
      onLogout={handleLogout}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onStatusClear={() => { setErrorMessage(''); setSuccessMessage(''); }}
      onStatusUpdate={updateStatus}
      onProfilePictureUpdated={handleProfilePictureUpdated}
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
    </StudentDashboardLayout>
  );
}
