import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { BrandMark } from '../components/BrandMark';
import { AppLayout } from './components/layout';
import {
  AdminDashboardPage,
  AdminNotificationsPage,
  ReconciliationExceptionsPage,
  ReconciliationHistoryPage,
  ReminderCampaignsPage,
  AuditLogsPage,
  AuthLayout,
  FeeStructurePage,
  LandingPage,
  LoginPage,
  MessagesPage,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        {/* Clean centered spinner with logo */}
        <div className="flex flex-col items-center gap-5">
          {/* Logo with rotating border */}
          <div className="relative">
            <BrandMark className="w-14 h-14 rounded-xl bg-primary/10" iconClassName="w-7 h-7 text-primary" />
            {/* Rotating border */}
            <div className="absolute inset-0 rounded-xl border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '1s' }} />
          </div>
          {/* Simple loading text */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">EduPayTrack</p>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        {/* Clean centered spinner with logo */}
        <div className="flex flex-col items-center gap-5">
          {/* Logo with rotating border */}
          <div className="relative">
            <BrandMark className="w-14 h-14 rounded-xl bg-primary/10" iconClassName="w-7 h-7 text-primary" />
            {/* Rotating border */}
            <div className="absolute inset-0 rounded-xl border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '1s' }} />
          </div>
          {/* Simple loading text */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">EduPayTrack</p>
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
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
          path="/admin/reconciliation-history"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><ReconciliationHistoryPage /></RequireRoles>}
        />
        <Route
          path="/admin/reconciliation-exceptions"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><ReconciliationExceptionsPage /></RequireRoles>}
        />
        <Route
          path="/admin/reminder-campaigns"
          element={<RequireRoles allowedRoles={['admin', 'accounts']}><ReminderCampaignsPage /></RequireRoles>}
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
        <Route
          path="/messages"
          element={<RequireRoles allowedRoles={['student', 'admin', 'accounts']}><MessagesPage /></RequireRoles>}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
