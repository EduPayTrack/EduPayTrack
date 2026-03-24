import { useEffect, useState } from 'react';

import { getOverviewReport } from '../../services/admin';
import type { ReportOverview } from '../../types/api';
import { exportRowsToCsv } from '../../utils/export';
import { formatDate, formatMoney } from '../../utils/format';

type ReportsWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
};

export function ReportsWorkspace({ token, onError }: ReportsWorkspaceProps) {
  const [report, setReport] = useState<ReportOverview | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadReport() {
    setLoading(true);

    try {
      const data = await getOverviewReport(token);
      setReport(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load report overview');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReport();
  }, [token]);

  const methodData = report ? Object.entries(report.paymentMethodBreakdown) : [];
  const monthData = report ? Object.entries(report.monthlyCollections) : [];
  const maxMethodAmount = Math.max(...methodData.map(([, amount]) => amount), 0);
  const maxMonthAmount = Math.max(...monthData.map(([, amount]) => amount), 0);

  function handleExportReport() {
    if (!report) {
      return;
    }

    exportRowsToCsv(
      'report-overview.csv',
      ['Section', 'Label', 'Value'],
      [
        ['Summary', 'Students Count', report.summary.studentsCount],
        ['Summary', 'Pending Payments', report.summary.pendingPayments],
        ['Summary', 'Approved Payments', report.summary.approvedPayments],
        ['Summary', 'Rejected Payments', report.summary.rejectedPayments],
        ['Summary', 'Total Approved Amount', report.summary.totalApprovedAmount],
        ...methodData.map(([method, amount]) => ['Payment Method', method, amount]),
        ...monthData.map(([month, amount]) => ['Monthly Collection', month, amount]),
      ],
    );
  }

  function handleExportRecentPayments() {
    if (!report?.recentPayments.length) {
      return;
    }

    exportRowsToCsv(
      'recent-payments.csv',
      [
        'Student Name',
        'Student Code',
        'Amount',
        'Method',
        'Status',
        'Payment Date',
        'Submitted At',
      ],
      report.recentPayments.map((payment) => [
        `${payment.student?.firstName || ''} ${payment.student?.lastName || ''}`.trim(),
        payment.student?.studentCode || '',
        payment.amount,
        payment.method,
        payment.status,
        payment.paymentDate,
        payment.submittedAt,
      ]),
    );
  }

  return (
    <div className="workspace-grid admin-grid">
      <section className="dashboard-card wide-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Summary</p>
            <h3>Collections overview</h3>
          </div>
          <button className="ghost-button" type="button" onClick={handleExportReport}>
            Export summary CSV
          </button>
        </div>

        {loading ? <p className="muted-copy">Loading report...</p> : null}

        {report ? (
          <div className="metric-grid">
            <article>
              <span>Students</span>
              <strong>{report.summary.studentsCount}</strong>
            </article>
            <article>
              <span>Pending payments</span>
              <strong>{report.summary.pendingPayments}</strong>
            </article>
            <article>
              <span>Approved payments</span>
              <strong>{report.summary.approvedPayments}</strong>
            </article>
            <article>
              <span>Approved amount</span>
              <strong>{formatMoney(report.summary.totalApprovedAmount)}</strong>
            </article>
          </div>
        ) : null}
      </section>

      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">By Method</p>
            <h3>Payment channels</h3>
          </div>
        </div>

        {methodData.length ? (
          <div className="chart-list">
            {methodData.map(([method, amount]) => (
              <article className="chart-row" key={method}>
                <div className="chart-row-head">
                  <strong>{method}</strong>
                  <small>{formatMoney(amount)}</small>
                </div>
                <div className="chart-track">
                  <div
                    className="chart-bar chart-bar-forest"
                    style={{
                      width: `${maxMethodAmount ? (amount / maxMethodAmount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No payment channel data yet.</p>
        )}
      </section>

      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">By Month</p>
            <h3>Monthly collections</h3>
          </div>
        </div>

        {monthData.length ? (
          <div className="chart-list">
            {monthData.map(([month, amount]) => (
              <article className="chart-row" key={month}>
                <div className="chart-row-head">
                  <strong>{month}</strong>
                  <small>{formatMoney(amount)}</small>
                </div>
                <div className="chart-track">
                  <div
                    className="chart-bar chart-bar-clay"
                    style={{
                      width: `${maxMonthAmount ? (amount / maxMonthAmount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-copy">No monthly collection data yet.</p>
        )}
      </section>

      <section className="history-card wide-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Recent</p>
            <h3>Latest approved and pending activity</h3>
          </div>
          <button className="ghost-button" type="button" onClick={handleExportRecentPayments}>
            Export activity CSV
          </button>
        </div>

        <div className="history-list">
          {report?.recentPayments.length ? (
            report.recentPayments.map((payment) => (
              <article className="history-item" key={payment.id}>
                <div>
                  <div className="history-topline">
                    <strong>{formatMoney(payment.amount)}</strong>
                    <span className={`status-chip ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p>
                    {payment.student?.firstName} {payment.student?.lastName} |{' '}
                    {payment.student?.studentCode}
                  </p>
                  <small>
                    {payment.method} | Paid {formatDate(payment.paymentDate)} | Submitted{' '}
                    {formatDate(payment.submittedAt)}
                  </small>
                </div>
              </article>
            ))
          ) : (
            <p className="muted-copy">No recent payment activity yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
