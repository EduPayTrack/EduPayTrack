import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const logsDirectory = path.resolve(process.cwd(), 'logs');
const auditLogPath = path.join(logsDirectory, 'audit.log');

export type AuditStatus = 'VERIFIED' | 'FAILED' | 'SYSTEM_REJECTED' | 'SUCCESS';

export type AuditActor = {
    userId?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
};

export type AuditLogEntry = {
    id: string; // Unique identifier for manual deletion
    timestamp: string;
    action: string;
    actor?: AuditActor;
    targetType?: string;
    targetId?: string;
    status?: AuditStatus;
    reason?: string; // For failures/rejections
    details?: Record<string, unknown>;
};

const ensureLogDirectory = () => {
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory, { recursive: true });
    }
};

export const writeAuditLog = (entry: Omit<Partial<AuditLogEntry>, 'timestamp' | 'id'>) => {
    ensureLogDirectory();

    const record: AuditLogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        action: entry.action || 'unknown',
        actor: entry.actor,
        targetType: entry.targetType,
        targetId: entry.targetId,
        status: entry.status || 'SUCCESS',
        reason: entry.reason,
        details: entry.details,
    };

    fs.appendFileSync(auditLogPath, `${JSON.stringify(record)}\n`, 'utf8');
};

export const readAuditLogs = (limit = 100): AuditLogEntry[] => {
    ensureLogDirectory();

    if (!fs.existsSync(auditLogPath)) {
        return [];
    }

    const contents = fs.readFileSync(auditLogPath, 'utf8');

    return contents
        .split('\n')
        .filter(Boolean)
        .slice(-limit)
        .reverse()
        .map((line) => JSON.parse(line) as AuditLogEntry);
};

/**
 * Delete audit logs by timestamp range or specific entries
 * Useful for manual deletion with proper authorization checks
 */
export const deleteAuditLogs = (filter: {
    before?: string; // ISO timestamp - delete logs before this date
    after?: string;  // ISO timestamp - delete logs after this date
    action?: string; // Delete logs with this action
    userId?: string; // Delete logs by this user
    ids?: string[];  // Specifically delete these IDs
    manual?: boolean; // Mark as manually deleted
}): { deleted: number; message: string } => {
    ensureLogDirectory();

    if (!fs.existsSync(auditLogPath)) {
        return { deleted: 0, message: 'No audit logs found' };
    }

    const contents = fs.readFileSync(auditLogPath, 'utf8');
    const logs: AuditLogEntry[] = contents
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line) as AuditLogEntry);

    const originalCount = logs.length;
    const filtered = logs.filter((log) => {
        // If IDs are provided, only KEEP logs NOT in that list
        if (filter.ids && filter.ids.length > 0) {
            if (filter.ids.includes(log.id)) return false;
        }

        if (filter.before && new Date(log.timestamp) < new Date(filter.before)) return false;
        if (filter.after && new Date(log.timestamp) > new Date(filter.after)) return false;
        if (filter.action && log.action === filter.action) return false;
        if (filter.userId && log.actor?.userId === filter.userId) return false;
        
        // If manual is true and NO other filters match, but we want to "clear all"
        if (filter.manual && !filter.before && !filter.after && !filter.ids && !filter.action && !filter.userId) {
            return false; // delete everything
        }

        return true; // keep
    });

    const deletedCount = originalCount - filtered.length;

    // Write back filtered logs
    const newContent = filtered
        .map((log) => JSON.stringify(log))
        .join('\n') + (filtered.length > 0 ? '\n' : '');

    fs.writeFileSync(auditLogPath, newContent, 'utf8');

    return {
        deleted: deletedCount,
        message: `Deleted ${deletedCount} audit log entries. Retention: ${filtered.length} entries.`,
    };
};
