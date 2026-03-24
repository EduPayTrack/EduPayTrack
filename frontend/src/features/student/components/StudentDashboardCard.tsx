import type { AuthResponse, DashboardResponse } from '../../../types/api';
import { formatMoney } from '../../../utils/format';

type StudentDashboardCardProps = {
  authUser: AuthResponse['user'];
  dashboard: DashboardResponse | null;
  loading: boolean;
};

export function StudentDashboardCard({
  authUser,
  dashboard,
  loading,
}: StudentDashboardCardProps) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-head">
        <div>
          <p className="section-kicker">Profile</p>
          <h3>
            {dashboard?.student.firstName ?? authUser.student?.firstName ?? 'Student'}{' '}
            {dashboard?.student.lastName ?? authUser.student?.lastName ?? ''}
          </h3>
        </div>
        <div className="status-pill">
          {dashboard?.student.studentCode ?? authUser.student?.studentCode ?? 'Pending'}
        </div>
      </div>

      {loading ? (
        <p className="muted-copy">Refreshing your payment dashboard...</p>
      ) : dashboard ? (
        <>
          <div className="metric-grid">
            <article>
              <span>Balance</span>
              <strong>{formatMoney(dashboard.summary.currentBalance)}</strong>
            </article>
            <article>
              <span>Total paid</span>
              <strong>{formatMoney(dashboard.summary.totalPaid)}</strong>
            </article>
            <article>
              <span>Installments</span>
              <strong>{dashboard.summary.installmentCount}</strong>
            </article>
            <article>
              <span>Pending review</span>
              <strong>{dashboard.summary.pendingVerifications}</strong>
            </article>
          </div>
          <p className="muted-copy">
            Programme: {dashboard.student.program} | Rejected submissions:{' '}
            {dashboard.summary.rejectedSubmissions}
          </p>
        </>
      ) : (
        <p className="muted-copy">Your dashboard will appear here after login.</p>
      )}
    </section>
  );
}
