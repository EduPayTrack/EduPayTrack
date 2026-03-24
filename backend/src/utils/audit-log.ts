import fs from 'fs';
import path from 'path';

const logsDirectory = path.resolve(process.cwd(), 'logs');
const auditLogPath = path.join(logsDirectory, 'audit.log');

export type AuditActor = {
    userId?: string;
    email?: string;
    role?: string;
    ipAddress?: string;
};

export type AuditLogEntry = {
    timestamp: string;
    action: string;
    actor?: AuditActor;
    targetType?: string;
    targetId?: string;
    details?: Record<string, unknown>;
};

const ensureLogDirectory = () => {
    if (!fs.existsSync(logsDirectory)) {
        fs.mkdirSync(logsDirectory, { recursive: true });
    }
};

export const writeAuditLog = (entry: Omit<AuditLogEntry, 'timestamp'>) => {
    ensureLogDirectory();

    const record: AuditLogEntry = {
        timestamp: new Date().toISOString(),
        ...entry,
    };

    fs.appendFileSync(auditLogPath, `${JSON.stringify(record)}\n`, 'utf8');
};

export const readAuditLogs = (limit = 100) => {
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
