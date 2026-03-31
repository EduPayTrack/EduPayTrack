import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// --- SPEED OPTIMIZATION: LAZY LOADING ---
// We only load the code for a page when the user actually visits it.
// This makes the initial login screen ultra-fast.

const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const AdminFeesPage = lazy(() => import('./pages/AdminFeesPage').then(module => ({ default: module.AdminFeesPage })));
const AdminReportsPage = lazy(() => import('./pages/AdminReportsPage').then(module => ({ default: module.AdminReportsPage })));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage').then(module => ({ default: module.AdminUsersPage })));
const AdminRegistryPage = lazy(() => import('./pages/AdminRegistryPage').then(module => ({ default: module.AdminRegistryPage })));
const AdminStudentsPage = lazy(() => import('./pages/AdminStudentsPage').then(module => ({ default: module.AdminStudentsPage })));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage').then(module => ({ default: module.AdminSettingsPage })));
const AdminAuditPage = lazy(() => import('./pages/AdminAuditPage').then(module => ({ default: module.AdminAuditPage })));
const AdminPaymentAuditPage = lazy(() => import('./pages/AdminPaymentAuditPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(module => ({ default: module.AuthPage })));
const StudentPage = lazy(() => import('./pages/StudentPage').then(module => ({ default: module.StudentPage })));
const StudentHistoryPage = lazy(() => import('./pages/StudentHistoryPage').then(module => ({ default: module.StudentHistoryPage })));
const SessionConflictPage = lazy(() => import('./pages/SessionConflictPage').then(module => ({ default: module.SessionConflictPage })));

import { AdminLayoutWrapper } from './AdminLayoutWrapper';
import { StudentLayoutWrapper } from './StudentLayoutWrapper';

/** 
 * --- LOADING COMPONENT ---
 * Shows a premium loading state while pages are being "fetched"
 */
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
       <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-[5px] border-[#004e99]/10 border-t-[#004e99] rounded-full animate-spin"></div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004e99] animate-pulse">Initializing Portal...</p>
       </div>
    </div>
  );
}

/** 
 * --- THE APP'S MAP (ROUTER) ---
 * This file tells the browser where to go when you click a link or type a URL.
 */

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* [SECTION: FRONT DESK] - This is where you login or recover your password */}
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* The conflict screen shows up if you try to login twice */}
          <Route path="/session-conflict" element={<SessionConflictPage />} />
          
          {/* [SECTION: STUDENT AREA] - Pages for students to see their payments and history */}
          <Route element={<StudentLayoutWrapper />}>
            <Route path="/student" element={<StudentPage />} />
            <Route path="/student/history" element={<StudentHistoryPage />} />
            <Route path="/student/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* [SECTION: ADMIN AREA] - Private pages for school staff and management */}
          <Route element={<AdminLayoutWrapper />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/fees" element={<AdminFeesPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/registry" element={<AdminRegistryPage />} />
              <Route path="/admin/students" element={<AdminStudentsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
              <Route path="/admin/payments/:id/audit" element={<AdminPaymentAuditPage />} />
          </Route>

          {/* [SECTION: GO BACK] - If you get lost, it sends you back to the login screen */}
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
