import { useEffect, useMemo, useState } from 'react';

import { PaginationControls } from '../../components/shared/PaginationControls';
import { getAuditLogs } from '../../services/admin';
import type { AuditLogEntry } from '../../types/api';
import { exportRowsToCsv } from '../../utils/export';
import { formatDate } from '../../utils/format';

type AuditLogsWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
};

export function AuditLogsWorkspace({ token, onError }: AuditLogsWorkspaceProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);

      try {
        const data = await getAuditLogs(token, 150);
        setLogs(data);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    }

    void loadLogs();
  }, [token]);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return logs;
    }

    return logs.filter((log) =>
      [
        log.action,
        log.actor?.email || '',
        log.actor?.role || '',
        log.actor?.ipAddress || '',
        log.targetType || '',
        log.targetId || '',
        JSON.stringify(log.details || {}),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [logs, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const pagedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleExportLogs() {
    exportRowsToCsv(
      'audit-logs.csv',
      ['Timestamp', 'Action', 'Actor Email', 'Role', 'IP Address', 'Target', 'Details'],
      filteredLogs.map((log) => [
        log.timestamp,
        log.action,
        log.actor?.email || '',
        log.actor?.role || '',
        log.actor?.ipAddress || '',
        `${log.targetType || ''}:${log.targetId || ''}`,
        JSON.stringify(log.details || {}),
      ]),
    );
  }

  return (
    <div className="workspace-grid admin-grid">
      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Audit</p>
            <h3>Search activity trail</h3>
          </div>
          <button className="ghost-button" type="button" onClick={handleExportLogs}>
            Export CSV
          </button>
        </div>

        <label>
          <span>Search by action, actor, role, IP, target, or details</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search audit logs"
          />
        </label>

        {loading ? <p className="muted-copy">Loading audit logs...</p> : null}
      </section>

      <section className="history-card wide-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Timeline</p>
            <h3>Recent system activity</h3>
          </div>
        </div>

        <div className="history-list">
          {pagedLogs.length ? (
            pagedLogs.map((log, index) => (
              <article className="history-item audit-item" key={`${log.timestamp}-${index}`}>
                <div>
                  <div className="history-topline">
                    <strong>{log.action}</strong>
                    <span className="status-pill">{formatDate(log.timestamp)}</span>
                  </div>
                  <p>
                    Actor: {log.actor?.email || 'Unknown'} | Role: {log.actor?.role || 'N/A'} | IP:{' '}
                    {log.actor?.ipAddress || 'N/A'}
                  </p>
                  <small>
                    Target: {log.targetType || 'N/A'} {log.targetId ? `(${log.targetId})` : ''}
                  </small>
                  <small>Details: {JSON.stringify(log.details || {})}</small>
                </div>
              </article>
            ))
          ) : (
            <p className="muted-copy">No audit entries match the current search.</p>
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
