import { useState } from 'react';
import type { FormEvent } from 'react';

import { changePassword } from '../../services/auth';

type PasswordChangeCardProps = {
  token: string;
  title?: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function PasswordChangeCard({
  token,
  title = 'Change your password',
  onError,
  onSuccess,
}: PasswordChangeCardProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    onError('');
    onSuccess('');

    try {
      const result = await changePassword(token, {
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      onSuccess(result.message);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="action-card">
      <div className="card-head">
        <div>
          <p className="section-kicker">Security</p>
          <h3>{title}</h3>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label>
          <span>Current password</span>
          <input
            required
            minLength={8}
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>

        <label>
          <span>New password</span>
          <input
            required
            minLength={8}
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <button className="primary-button" disabled={submitting} type="submit">
          {submitting ? 'Saving...' : 'Update password'}
        </button>
      </form>
    </section>
  );
}
