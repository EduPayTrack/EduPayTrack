import type { PaymentRecord } from '../../../types/api';
import { formatDate, formatMoney } from '../../../utils/format';

type StudentPaymentHistoryProps = {
  payments: PaymentRecord[];
};

export function StudentPaymentHistory({ payments }: StudentPaymentHistoryProps) {
  return (
    <section className="history-card wide-card">
      <div className="card-head">
        <div>
          <p className="section-kicker">History</p>
          <h3>Recent payment submissions</h3>
        </div>
      </div>

      <div className="history-list">
        {payments.length ? (
          payments.map((payment) => (
            <article className="history-item" key={payment.id}>
              <div>
                <div className="history-topline">
                  <strong>{formatMoney(payment.amount)}</strong>
                  <span className={`status-chip ${payment.status.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </div>
                <p>
                  {payment.method} | Paid {formatDate(payment.paymentDate)} | Submitted{' '}
                  {formatDate(payment.submittedAt)}
                </p>
                <small>
                  Ref: {payment.externalReference || 'N/A'} | Receipt:{' '}
                  {payment.receiptNumber || 'N/A'}
                </small>
              </div>
              {payment.duplicateFlag ? (
                <div className="warning-badge">Duplicate flagged</div>
              ) : null}
            </article>
          ))
        ) : (
          <p className="muted-copy">
            No payments yet. Upload a receipt and submit your first payment.
          </p>
        )}
      </div>
    </section>
  );
}
