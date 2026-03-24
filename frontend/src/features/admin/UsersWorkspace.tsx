import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

import { PaginationControls } from '../../components/shared/PaginationControls';
import { createSystemUser, getSystemUsers, resetSystemUserPassword } from '../../services/admin';
import type { SystemUser } from '../../types/api';
import { formatDate } from '../../utils/format';

type UsersWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const initialForm = {
  email: '',
  password: '',
  role: 'ACCOUNTS' as 'ADMIN' | 'ACCOUNTS',
};

export function UsersWorkspace({
  token,
  onError,
  onSuccess,
}: UsersWorkspaceProps) {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [resetPasswords, setResetPasswords] = useState<Record<string, string>>({});

  async function loadUsers() {
    setLoading(true);

    try {
      const data = await getSystemUsers(token);
      setUsers(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load system users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) =>
      [
        user.email,
        user.role,
        user.student?.firstName || '',
        user.student?.lastName || '',
        user.student?.studentCode || '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, users]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    onError('');
    onSuccess('');

    try {
      await createSystemUser(token, form);
      setForm(initialForm);
      onSuccess('Staff user created successfully.');
      await loadUsers();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to create staff user');
    } finally {
      setCreating(false);
    }
  }

  async function handleResetPassword(userId: string) {
    const newPassword = resetPasswords[userId];

    if (!newPassword || newPassword.length < 8) {
      onError('Reset password must be at least 8 characters long.');
      return;
    }

    setResettingUserId(userId);
    onError('');
    onSuccess('');

    try {
      const result = await resetSystemUserPassword(token, userId, {
        newPassword,
      });
      setResetPasswords((current) => ({
        ...current,
        [userId]: '',
      }));
      onSuccess(result.message);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setResettingUserId(null);
    }
  }

  return (
    <div className="workspace-grid admin-grid">
      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Create</p>
            <h3>New staff account</h3>
          </div>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label>
            <span>Password</span>
            <input
              required
              minLength={8}
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>

          <label>
            <span>Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as 'ADMIN' | 'ACCOUNTS',
                }))
              }
            >
              <option value="ACCOUNTS">Accounts</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <button className="primary-button" disabled={creating} type="submit">
            {creating ? 'Creating...' : 'Create staff user'}
          </button>
        </form>
      </section>

      <section className="history-card wide-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Directory</p>
            <h3>System users</h3>
          </div>
        </div>

        <label>
          <span>Search by email, role, or student details</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
          />
        </label>

        {loading ? <p className="muted-copy">Loading users...</p> : null}

        <div className="history-list">
          {pagedUsers.length ? (
            pagedUsers.map((user) => (
              <article className="history-item" key={user.id}>
                <div>
                  <div className="history-topline">
                    <strong>{user.email}</strong>
                    <span
                      className={
                        user.role === 'STUDENT' ? 'status-chip pending' : 'status-chip approved'
                      }
                    >
                      {user.role}
                    </span>
                  </div>
                  <p>
                    Created {formatDate(user.createdAt)}
                    {user.student
                      ? ` | Student: ${user.student.firstName} ${user.student.lastName}`
                      : ' | Staff account'}
                  </p>
                  <small>
                    {user.student ? `Student code: ${user.student.studentCode}` : 'Back-office user'}
                  </small>
                </div>
                {!user.student ? (
                  <div className="reset-password-panel">
                    <input
                      minLength={8}
                      placeholder="New password"
                      type="password"
                      value={resetPasswords[user.id] ?? ''}
                      onChange={(event) =>
                        setResetPasswords((current) => ({
                          ...current,
                          [user.id]: event.target.value,
                        }))
                      }
                    />
                    <button
                      className="secondary-button"
                      disabled={resettingUserId === user.id}
                      type="button"
                      onClick={() => {
                        void handleResetPassword(user.id);
                      }}
                    >
                      {resettingUserId === user.id ? 'Resetting...' : 'Reset password'}
                    </button>
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <p className="muted-copy">No users found yet.</p>
          )}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}
