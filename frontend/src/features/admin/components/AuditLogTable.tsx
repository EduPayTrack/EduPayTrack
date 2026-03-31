import { useState } from 'react';
import type { AuditLogEntry } from '../../../types/api';

type AuditLogTableProps = {
    logs: AuditLogEntry[];
    onDeleteSelected?: (timestamps: string[]) => Promise<void>;
};

export function AuditLogTable({ logs, onDeleteSelected }: AuditLogTableProps) {
    const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState(false);

    const toggleLog = (timestamp: string) => {
        const updated = new Set(selectedLogs);
        if (updated.has(timestamp)) {
            updated.delete(timestamp);
        } else {
            updated.add(timestamp);
        }
        setSelectedLogs(updated);
    };

    const toggleAll = () => {
        if (selectedLogs.size === logs.length && logs.length > 0) {
            setSelectedLogs(new Set());
        } else {
            setSelectedLogs(new Set(logs.map(log => log.timestamp)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedLogs.size === 0 || !onDeleteSelected) return;

        if (!confirm(`Delete ${selectedLogs.size} log entries? This action cannot be undone.`)) {
            return;
        }

        setDeleting(true);
        try {
            await onDeleteSelected(Array.from(selectedLogs));
            setSelectedLogs(new Set());
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'VERIFIED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'FAILED':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'SYSTEM_REJECTED':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'VERIFIED':
                return 'check_circle';
            case 'FAILED':
                return 'error';
            case 'SYSTEM_REJECTED':
                return 'warning';
            default:
                return 'info';
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const getActionDisplay = (action: string) => {
        const actionMap: Record<string, { label: string; icon: string; color: string }> = {
            'auth.login_succeeded': { label: 'Login', icon: 'login', color: 'emerald' },
            'auth.login_failed': { label: 'Login Failed', icon: 'lock_clock', color: 'red' },
            'auth.password_changed': { label: 'Password Changed', icon: 'vpn_key', color: 'blue' },
            'user.profile_picture_updated': { label: 'Profile Updated', icon: 'image', color: 'purple' },
            'user.profile_picture_deleted': { label: 'Profile Deleted', icon: 'image', color: 'orange' },
            'payment.verified': { label: 'Payment Verified', icon: 'verified', color: 'emerald' },
            'payment.rejected': { label: 'Payment Rejected', icon: 'close_circle', color: 'red' },
            'user.created': { label: 'User Created', icon: 'person_add', color: 'blue' },
            'user.deleted': { label: 'User Deleted', icon: 'person_remove', color: 'red' },
        };

        return actionMap[action] || { label: action, icon: 'event', color: 'slate' };
    };

    return (
        <div className="space-y-4">
            {selectedLogs.size > 0 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-black text-blue-800">
                        {selectedLogs.size} log entry(ies) selected
                    </span>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-600 text-white font-black rounded hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                    >
                        {deleting ? 'Deleting...' : 'Delete Selected'}
                    </button>
                </div>
            )}

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedLogs.size === logs.length && logs.length > 0}
                                    onChange={toggleAll}
                                    disabled={logs.length === 0}
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </th>
                            <th className="px-4 py-3 text-left font-black text-slate-900">When</th>
                            <th className="px-4 py-3 text-left font-black text-slate-900">Who</th>
                            <th className="px-4 py-3 text-left font-black text-slate-900">What</th>
                            <th className="px-4 py-3 text-left font-black text-slate-900">Status</th>
                            <th className="px-4 py-3 text-left font-black text-slate-900">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    No audit logs found
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => {
                                const actionDisplay = getActionDisplay(log.action);
                                return (
                                    <tr
                                        key={log.timestamp}
                                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedLogs.has(log.timestamp) ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.has(log.timestamp)}
                                                onChange={() => toggleLog(log.timestamp)}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                {formatDate(log.timestamp)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-slate-900">
                                                    {log.actor?.email || log.actor?.userId || 'System'}
                                                </span>
                                                {log.actor?.ipAddress && (
                                                    <span className="text-[10px] text-slate-500">{log.actor.ipAddress}</span>
                                                )}
                                                {log.actor?.role && (
                                                    <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                                                        {log.actor.role}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`material-symbols-outlined text-lg text-${actionDisplay.color}-600`}
                                                >
                                                    {actionDisplay.icon}
                                                </span>
                                                <span className="font-black text-slate-900">{actionDisplay.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-[11px] font-black border ${getStatusColor(
                                                    log.status
                                                )}`}
                                            >
                                                <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ display: 'inline' }}>
                                                    {getStatusIcon(log.status)}
                                                </span>
                                                {log.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[10px]">
                                            {log.reason && (
                                                <div className="space-y-1">
                                                    <div>
                                                        <span className="font-bold text-slate-600">Reason: </span>
                                                        <span className="text-slate-700">{log.reason}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {log.details && (
                                                <details className="cursor-pointer">
                                                    <summary className="font-bold text-slate-600 hover:text-slate-900">
                                                        Details
                                                    </summary>
                                                    <pre className="text-[9px] mt-1 p-1 bg-slate-100 rounded overflow-auto max-h-20">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                </details>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
