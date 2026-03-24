import type { Dispatch, FormEvent, SetStateAction } from 'react';

import type { PaymentMethod } from '../../../types/api';
import type { PaymentFormState } from '../../../types/forms';

type StudentPaymentFormProps = {
  paymentForm: PaymentFormState;
  setPaymentForm: Dispatch<SetStateAction<PaymentFormState>>;
  submittingPayment: boolean;
  onSubmit: () => void;
};

export function StudentPaymentForm({
  paymentForm,
  setPaymentForm,
  submittingPayment,
  onSubmit,
}: StudentPaymentFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <section className="action-card wide-card">
      <div className="card-head">
        <div>
          <p className="section-kicker">Step 3</p>
          <h3>Submit payment for verification</h3>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="field-grid two-up">
          <label>
            <span>Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={paymentForm.amount}
              onChange={(event) =>
                setPaymentForm((current) => ({ ...current, amount: event.target.value }))
              }
              required
            />
          </label>
          <label>
            <span>Payment method</span>
            <select
              value={paymentForm.method}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  method: event.target.value as PaymentMethod,
                }))
              }
            >
              <option value="BANK">Bank</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CASH">Cash</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        </div>

        <div className="field-grid two-up">
          <label>
            <span>Payment date</span>
            <input
              type="date"
              value={paymentForm.paymentDate}
              onChange={(event) =>
                setPaymentForm((current) => ({ ...current, paymentDate: event.target.value }))
              }
              required
            />
          </label>
          <label>
            <span>Payer name</span>
            <input
              value={paymentForm.payerName}
              onChange={(event) =>
                setPaymentForm((current) => ({ ...current, payerName: event.target.value }))
              }
            />
          </label>
        </div>

        <div className="field-grid two-up">
          <label>
            <span>Transaction reference</span>
            <input
              value={paymentForm.externalReference}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  externalReference: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>Receipt number</span>
            <input
              value={paymentForm.receiptNumber}
              onChange={(event) =>
                setPaymentForm((current) => ({
                  ...current,
                  receiptNumber: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <label>
          <span>Proof URL</span>
          <input
            value={paymentForm.proofUrl}
            onChange={(event) =>
              setPaymentForm((current) => ({ ...current, proofUrl: event.target.value }))
            }
            placeholder="Upload a receipt or paste a proof URL"
            required
          />
        </label>

        <label>
          <span>Notes</span>
          <textarea
            rows={4}
            value={paymentForm.notes}
            onChange={(event) =>
              setPaymentForm((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Optional notes for the accounts office"
          />
        </label>

        <button className="primary-button" disabled={submittingPayment} type="submit">
          {submittingPayment ? 'Submitting...' : 'Submit payment'}
        </button>
      </form>
    </section>
  );
}
