import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AdminPage } from './pages/AdminPage';
import { AdminFeesPage } from './pages/AdminFeesPage';
import { AdminAuditPage } from './pages/AdminAuditPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminNotificationsPage } from './pages/AdminNotificationsPage';
import { AuthPage } from './pages/AuthPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { StudentPage } from './pages/StudentPage';
import { StudentHistoryPage } from './pages/StudentHistoryPage';
import { StudentNotificationsPage } from './pages/StudentNotificationsPage';
import { SupportPage } from './pages/SupportPage';
import { TermsPage } from './pages/TermsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/student/history" element={<StudentHistoryPage />} />
        <Route path="/student/notifications" element={<StudentNotificationsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/fees" element={<AdminFeesPage />} />
        <Route path="/admin/audit" element={<AdminAuditPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
