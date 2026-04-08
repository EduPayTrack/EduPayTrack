import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { AppLayout } from './components/layout';
import {
  AdminDashboardPage,
  AdminNotificationsPage,
  AuditLogsPage,
  AuthLayout,
  FeeStructurePage,
  LandingPage,
  LoginPage,
  PaymentHistoryPage,
  RegisterPage,
  ReportsPage,
  SettingsPage,
  StudentDashboardPage,
  StudentManagementPage,
  StudentNotificationsPage,
  UploadPaymentPage,
  UserManagementPage,
  VerifyPaymentsPage,
} from './screens/pages';
import { useAuth } from './state/auth-context';

function RequireAuth({ children }: { children: ReactElement }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }
  return children;
}

function RequireRoles({ allowedRoles, children }: { allowedRoles: Array<'student' | 'admin' | 'accounts'>; children: ReactElement }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate replace to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} />;
  }
  return children;
}

export function AppRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate replace to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate replace to="/student/dashboard" /> : <RegisterPage />} />
      </Route>

      <Route path="/" element={<LandingPage />} />

      <Route
        element={(
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        )}
      >
        <Route
          path="/student/dashboard"
          element={<RequireRoles allowedRoles={['student']}><StudentDashboardPage /></RequireRoles>}
        />
        <Route
          path="/student/upload-payment"
          element={<RequireRoles allowedRoles={['student']}><UploadPaymentPage /></RequireRoles>}
        />
        <Route
          path="/student/payment-history"
          element={<RequireRoles allowedRoles={['student']}><PaymentHistoryPage /></RequireRoles>}
        />
        <Route
          path="/admin/dashboard"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><AdminDashboardPage /></RequireRoles>}
        />
        <Route
          path="/admin/verify-payments"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><VerifyPaymentsPage /></RequireRoles>}
        />
        <Route
          path="/admin/students"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><StudentManagementPage /></RequireRoles>}
        />
        <Route
          path="/admin/fee-structure"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><FeeStructurePage /></RequireRoles>}
        />
        <Route
          path="/admin/reports"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><ReportsPage /></RequireRoles>}
        />
        <Route
          path="/admin/users"
          element={<RequireRoles allowedRoles={['admin']}><UserManagementPage /></RequireRoles>}
        />
        <Route
          path="/admin/audit-logs"
          element={<RequireRoles allowedRoles={['admin']}><AuditLogsPage /></RequireRoles>}
        />
        <Route
          path="/admin/notifications"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><AdminNotificationsPage /></RequireRoles>}
        />
        <Route
          path="/student/notifications"
          element={<RequireRoles allowedRoles={['student']}><StudentNotificationsPage /></RequireRoles>}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
