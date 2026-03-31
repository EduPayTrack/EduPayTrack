import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { usePersistentState } from '../../hooks/use-persistent-state';

import {
  getSystemUsers as getUsers,
  createSystemUser as createUser,
  resetSystemUserPassword as resetUserPassword,
  getAuditLogs as getLogs,
  deleteAuditLogs as deleteLogs,
  suspendSystemUser,
  activateSystemUser,
  deactivateSystemUser,
  deleteSystemUser,
} from '../../services/admin';
import type { User, AuditLogEntry } from '../../types/api';
import { PaginationControls } from '../../components/shared/PaginationControls';

// [SECTION: WHAT THIS PAGE NEEDS] - These are the settings passed from the main app (like tokens and errors)
type UsersWorkspaceProps = {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  token: string;
  authUser: User;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
};

// [SECTION: BASIC SETTINGS] - Normal numbers like how many users to show on one page
const ITEMS_PER_PAGE = 8;

const REASON_PRESETS = [
  "Violation of Institutional Terms of Service",
  "Policy Non-Compliance",
  "Security Breach / Suspicious Login Activity",
  "Institutional Policy Change",
  "Staff Contract Termination",
  "Account Redundancy / Duplicate Profile",
  "Temporary Administrative Hold",
  "Unauthorized Resource Access",
  "Other (Detailed Below)"
];

const RESTORATION_PRESETS = [
  "Administrative Review Completed - Access Restored",
  "Contract Renewal / Extension",
  "Policy Compliance Re-established",
  "Identity Verified - Security Hold Lifted",
  "Institutional Authorization Re-instated",
  "Correction of Administrative Error",
  "Staff Leave of Absence Ended",
  "Temporary Hold Period Concluded",
  "Other (Detailed Below)"
];

export function UsersWorkspace({
  onError,
  onSuccess,
  token,
  authUser,
  showAddForm,
  setShowAddForm,
}: UsersWorkspaceProps) {
  // [SECTION: SAVING USER DATA] - This is where we keep the list of people in the system
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // [SECTION: SAVING LOG DATA] - This keeps track of everything that happened (history)
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [autoClearSetting, setAutoClearSetting] = useState('2-months');
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'STAFF' | 'STUDENT'>('ALL');
  const [showOnboardPwd, setShowOnboardPwd] = useState(false);
  const [form, setForm, clearDraft] = usePersistentState('admin_onboard_staff_draft', { email: '', role: 'ACCOUNTS', password: '' });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  
  // [SECTION: SAVING ACTION DATA] - This keeps track of which user we are currently editing or deleting
  const [actionModal, setActionModal] = useState<{
    user: User;
    type: 'suspend' | 'activate' | 'deactivate' | 'delete';
  } | null>(null);
  const [actionReason, setActionReason] = useState(REASON_PRESETS[0]);
  const [actionLoading, setActionLoading] = useState(false);

  // [SECTION: GETTING DATA FROM SERVER] - These functions ask the server for users and logs
  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function loadLogs() {
    try {
      const data = await getLogs(token);
      setLogs(data);
    } catch (err) {
      console.error('Audit Fail:', err);
    }
  }

  useEffect(() => {
    void loadUsers();
    void loadLogs();
  }, [token]);

  // [SECTION: LOG HISTORY ACTIONS] - Functions to export or delete history logs
  const handleExportLog = (log: AuditLogEntry) => {
    const logId = log.id || 'system-action';
    const filename = `Audit-Log-${logId.slice(0, 8)}.txt`;
    const content = `Official EduPayTrack Audit Report
ID: ${logId}
Act: ${log.action}
Time: ${log.timestamp}
Details: ${log.targetType || 'System Action'}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    const displayId = logId ? logId.slice(0, 8) : 'system';
    onSuccess(`Log entry ${displayId} exported.`);
  };

  const handleDeleteSelectedLogs = async () => {
    if (selectedLogs.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedLogs.length} selected log entries?`)) return;

    try {
      await deleteLogs(token, { ids: selectedLogs });
      setLogs(logs.filter(l => !selectedLogs.includes(l.id)));
      setSelectedLogs([]);
      onSuccess('Selected audit entries removed.');
    } catch (err) {
      onError('Failed to delete selected logs.');
    }
  };

  const toggleSelectLog = (log: AuditLogEntry) => {
    // Prevent selecting current active session
    if (log.action === 'session.start' && log.actor?.userId === authUser.id) {
       onError("Cannot delete your own active session log.");
       return;
    }

    const email = log.actor?.email;
    if (!email) return;

    const userLogs = filteredLogs.filter(l => 
      l.actor?.email === email && 
      !(l.action === 'session.start' && l.actor?.userId === authUser.id)
    ).map(l => l.id);

    const alreadySelected = userLogs.every(id => selectedLogs.includes(id));
    
    if (alreadySelected) {
      setSelectedLogs(prev => prev.filter(id => !userLogs.includes(id)));
    } else {
      setSelectedLogs(prev => Array.from(new Set([...prev, ...userLogs])));
    }
  };

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'STAFF') return log.actor?.role === 'ADMIN' || log.actor?.role === 'ACCOUNTS';
    if (logFilter === 'STUDENT') return log.actor?.role === 'STUDENT';
    return true;
  });

  const filteredUsers = users.filter(user => {
    const isStaff = user.role === 'ADMIN' || user.role === 'ACCOUNTS';
    const matchesSearch = user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase());
    return isStaff && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // [SECTION: ACCOUNT ACTIONS] - Functions to create, suspend, or activate users
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    onError('');
    onSuccess('');

    try {
      await createUser(token, {
        email: form.email,
        password: form.password,
        role: form.role as any,
      });
      onSuccess('Staff member onboarded successfully.');
      setForm({ email: '', password: '', role: 'ACCOUNTS' });
      clearDraft();
      setShowAddForm(false);
      await loadUsers();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to onboard staff');
    } finally {
      setCreating(false);
    }
  }

  async function handleUserAction() {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      if (actionModal.type === 'suspend') {
        await suspendSystemUser(token, actionModal.user.id, { reason: actionReason });
        onSuccess(`User ${actionModal.user.email} has been suspended.`);
      } else if (actionModal.type === 'activate') {
        await activateSystemUser(token, actionModal.user.id, { reason: actionReason });
        onSuccess(`Access restored for ${actionModal.user.email}.`);
      } else if (actionModal.type === 'deactivate') {
        await deactivateSystemUser(token, actionModal.user.id, { reason: actionReason });
        onSuccess(`User ${actionModal.user.email} has been deactivated.`);
      } else if (actionModal.type === 'delete') {
        await deleteSystemUser(token, actionModal.user.id, { reason: actionReason });
        onSuccess(`User ${actionModal.user.email} has been permanently removed.`);
      }
      setActionModal(null);
      setActionReason(REASON_PRESETS[0]);
      await loadUsers();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  const handleResetPassword = async (userId: string) => {
    const newPassword = window.prompt('Enter new password for this user (min 8 characters):');
    if (!newPassword || newPassword.length < 8) {
      if (newPassword) onError('Password must be at least 8 characters.');
      return;
    }

    try {
      const result = await resetUserPassword(token, userId, { newPassword });
      onSuccess(result.message);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to reset password');
    }
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col pt-24 md:pt-4">
      {/* [SECTION UI: USER LIST AREA] - The main table showing all staff members */}
      <div className="flex-1 flex flex-col gap-6 p-4 md:p-6 overflow-hidden">
        <section className="space-y-6">
          <div className="overflow-hidden">
            <div className="px-2 py-4 flex items-center justify-between mb-2">
              <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-500">Staff Directory</h2>
              <div className="flex gap-4 items-center">
                <div className="relative group max-md:hidden">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search directory..."
                    className="bg-slate-50 border-none focus:ring-1 ring-primary/20 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 w-48 transition-all focus:w-64"
                  />
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                  <span className="material-symbols-outlined text-xl">filter_list</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-2 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Staff Name</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Role & Dept.</th>
                    <th className="px-4 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</th>
                    <th className="px-2 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right leading-none">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading && users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic font-medium">Synchronizing system users...</td>
                    </tr>
                  ) : pagedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No personnel found matching your criteria.</td>
                    </tr>
                  ) : (
                    pagedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-2 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' :
                              user.role === 'ACCOUNTS' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                              {user.email.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-black text-slate-900 text-sm tracking-tight">{user.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                              <div className="text-[11px] text-slate-500 font-bold">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-[0.1em] ${user.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {user.role}
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">
                            {user.role === 'ADMIN' ? 'Administration' : user.role === 'ACCOUNTS' ? 'Finance Dept' : 'Unassigned'}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                            user.status === 'SUSPENDED' ? 'bg-orange-50 text-orange-700' :
                            user.status === 'DEACTIVATED' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-2 py-5 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                              >
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>

                              {openMenuId === user.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in duration-200">
                                    {user.status !== 'ACTIVE' ? (
                                      <button
                                        onClick={() => { setActionModal({ user, type: 'activate' }); setOpenMenuId(null); }}
                                        className="w-full flex items-center px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-lg mr-3">restore_page</span>
                                        Restore Access
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => { setActionModal({ user, type: 'suspend' }); setOpenMenuId(null); }}
                                          className="w-full flex items-center px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-50 transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-lg mr-3">pause_circle</span>
                                          Suspend Account
                                        </button>
                                        <button
                                          onClick={() => { setActionModal({ user, type: 'deactivate' }); setOpenMenuId(null); }}
                                          className="w-full flex items-center px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-lg mr-3">block</span>
                                          Deactivate Account
                                        </button>
                                      </>
                                    )}
                                    <div className="my-1 border-t border-slate-100" />
                                    <button
                                      onClick={() => { setActionModal({ user, type: 'delete' }); setOpenMenuId(null); }}
                                      className="w-full flex items-center px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-lg mr-3">delete</span>
                                      Delete Account
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-2 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Showing <span className="text-slate-900">{pagedUsers.length}</span> of <span className="text-slate-900">{filteredUsers.length}</span> staff members
              </p>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </section>

        {/* Activity History Section */}
        <section className="space-y-6">
          <div className="relative overflow-hidden pt-8">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
              <span className="material-symbols-outlined text-[10rem]">history</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-400 capitalize tracking-widest mb-1">System Activity History</h3>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setLogFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${logFilter === 'ALL' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >All</button>
                  <button
                    onClick={() => setLogFilter('STAFF')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${logFilter === 'STAFF' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >Staff Logs</button>
                  <button
                    onClick={() => setLogFilter('STUDENT')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${logFilter === 'STUDENT' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >Student Logs</button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {selectedLogs.length > 0 && (
                  <button
                    onClick={handleDeleteSelectedLogs}
                    className="flex items-center gap-2 px-5 py-3 bg-red-100/50 hover:bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-red-200 animate-in fade-in zoom-in"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete Selected ({selectedLogs.length})
                  </button>
                )}
                
                <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="material-symbols-outlined text-slate-400 text-sm ml-3">update</span>
                  <select
                    value={autoClearSetting}
                    onChange={(e) => setAutoClearSetting(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-slate-900 pr-8 appearance-none cursor-pointer"
                  >
                    <option value="15-days">Auto-Delete: 15 Days</option>
                    <option value="30-days">Auto-Delete: 30 Days</option>
                    <option value="2-months">Auto-Delete: 2 Months</option>
                    <option value="manual">Manual Maintenance Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Select All Utility */}
            {filteredLogs.length > 0 && (
              <div className="flex items-center gap-2 mb-6 ml-2">
                <input 
                  type="checkbox"
                  checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedLogs(filteredLogs.map(l => l.id));
                    else setSelectedLogs([]);
                  }}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-200"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select all filtered entries</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLogs.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 opacity-30 italic">
                  <span className="material-symbols-outlined text-5xl mb-3">inventory_2</span>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">No activity found in this category.</p>
                </div>
              ) : (
                filteredLogs.slice(0, showFullHistory ? filteredLogs.length : 3).map((log, index) => (
                  <div key={log.id || index} className={`relative p-6 rounded-3xl border transition-all group/log overflow-hidden ${
                    selectedLogs.includes(log.id) ? 'border-primary ring-2 ring-primary/10 shadow-lg' : ''
                  } ${
                    log.action === 'session.start' ? 'bg-blue-50/50 border-blue-100 shadow-blue-50' : 
                    log.action === 'session.end' ? 'bg-slate-50/50 border-slate-200 shadow-slate-50 opacity-80' : 
                    'bg-white/40 border-white/60 hover:shadow-lg hover:shadow-slate-200/50'
                  }`}>
                    {/* Checkbox Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                      <input 
                        type="checkbox" 
                        disabled={log.action === 'session.start' && log.actor?.userId === authUser.id}
                        checked={selectedLogs.includes(log.id)}
                        onChange={() => toggleSelectLog(log)}
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-primary focus:ring-primary shadow-sm cursor-pointer transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="absolute top-0 right-0 p-4 translate-x-2 -translate-y-2 opacity-0 group-hover/log:opacity-100 group-hover/log:translate-x-0 group-hover/log:translate-y-0 transition-all">
                      <button
                        onClick={() => handleExportLog(log)}
                        className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg border border-slate-100 hover:scale-110 active:scale-90 transition-all"
                        title="Export Reference"
                      >
                        <span className="material-symbols-outlined text-lg">cloud_download</span>
                      </button>
                    </div>

                    <div className="flex items-start gap-4 mb-4 mt-4 pl-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        log.action === 'session.start' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 
                        log.action === 'session.end' ? 'bg-slate-400 text-white' : 
                        'bg-primary/5 text-primary'
                      }`}>
                        <span className="material-symbols-outlined text-xl">
                          {log.action === 'session.start' ? 'login' : log.action === 'session.end' ? 'logout' : 'history'}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-slate-900 tracking-tight leading-snug mb-0.5 whitespace-nowrap">
                          {log.action === 'session.start' ? 'SESSION OPENED' : 
                           log.action === 'session.end' ? 'SESSION CLOSED' : 
                           log.action.toUpperCase()}
                        </div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {log.action === 'session.start' ? 'ENTRY: ' : 
                           log.action === 'session.end' ? 'EXIT: ' : ''}
                          {new Date(log.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-4 pl-6">
                      User: <span className="text-slate-900 uppercase">{log.actor?.email?.split('@')[0] || 'System'}</span>
                      {log.actor?.role && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[8px] uppercase">{log.actor.role}</span>
                      )}
                      <br />
                      Network ID: <span className="text-primary italic opacity-80">{log.actor?.ipAddress || 'Internal'}</span>
                      {log.action === 'session.end' && !!log.details?.duration && (
                        <>
                          <br />
                          Log Period: <span className="text-amber-600 font-black">{String(log.details.duration)}</span>
                        </>
                      )}
                      {log.action === 'auth.reset_code_generated' && !!log.details?.code && (
                         <>
                          <br />
                          Verification Key: <span className="text-emerald-600 font-black select-all">{String(log.details.code)}</span>
                         </>
                      )}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                        ID: {log.id?.slice(0, 8) || 'SYSTEM'}
                      </span>
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-40">Verified</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!showFullHistory && filteredLogs.length > 3 && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setShowFullHistory(true)}
                  className="flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 group"
                >
                  <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">expand_more</span>
                  View All Recent Records
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Onboarding Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white/40 backdrop-blur-xl border-white/20"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-400 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">New Personnel</p>
                <h3 className="text-lg font-black text-slate-900">Onboard Staff</h3>
              </div>
            </div>

            <div className="overflow-y-auto p-6 no-scrollbar">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</span>
                  <input
                    required
                    type="email"
                    placeholder="e.g. staff.member@edupay.mw"
                    className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 transition-all"
                    value={form.email}
                    onChange={(e) => setForm(c => ({ ...c, email: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role</span>
                    <select
                      className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 appearance-none"
                      value={form.role}
                      onChange={(e) => setForm(c => ({ ...c, role: e.target.value as any }))}
                    >
                      <option value="ACCOUNTS">Accounts Staff</option>
                      <option value="ADMIN">System Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</span>
                    <div className="relative">
                      <input
                        required
                        type={showOnboardPwd ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 pr-12 text-xs font-bold text-slate-900"
                        value={form.password}
                        onChange={(e) => setForm(c => ({ ...c, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOnboardPwd(s => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">{showOnboardPwd ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mt-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    By onboarding this staff member, they will receive access to the institutional ledger and audit trails according to their role permissions.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <button
                    disabled={creating}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-lg">{creating ? 'sync' : 'person_add'}</span>
                    {creating ? 'Syncing...' : 'Complete Onboarding'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* [SECTION UI: ACTION MODALS] - Confirmation gateways for high-impact security operations */}
      {actionModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => { setActionModal(null); setActionReason(''); }}
        >
          <div 
            className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 space-y-6 animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                actionModal.type === 'suspend' ? 'bg-amber-50 text-amber-600' :
                actionModal.type === 'activate' ? 'bg-emerald-50 text-emerald-600' :
                actionModal.type === 'deactivate' ? 'bg-slate-50 text-slate-600' : 'bg-red-50 text-red-600'
              }`}>
                <span className="material-symbols-outlined text-3xl">
                  {actionModal.type === 'suspend' ? 'pause_circle' : 
                   actionModal.type === 'activate' ? 'restore_page' :
                   actionModal.type === 'deactivate' ? 'block' : 'delete_forever'}
                </span>
              </div>
              <div>
                <p className="text-[11.5px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 opacity-70 leading-none">Security Log History</p>
                <h2 className="text-xl font-black text-slate-900">
                  {actionModal.type === 'suspend' ? 'Suspend' : 
                   actionModal.type === 'activate' ? 'Restore' :
                   actionModal.type === 'deactivate' ? 'Deactivate' : 'Delete'} Account
                </h2>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              actionModal.type === 'delete' ? 'bg-red-50 border-red-100' : 
              actionModal.type === 'activate' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
            }`}>
              <p className="text-xs text-slate-600 leading-relaxed font-bold">
                {actionModal.type === 'activate' ? (
                  <>You are about to <strong className="text-emerald-700 underline underline-offset-2">restore full access</strong> to the account of <strong className="text-slate-900">{actionModal.user.email}</strong>. The user will be notified of their restoration.</>
                ) : actionModal.type === 'delete' ? (
                  <span className="text-red-700 tracking-tight">
                    <span className="material-symbols-outlined text-sm align-middle mr-1">warning</span>
                    CRITICAL: You are about to <strong className="uppercase">permanently erase</strong> the account of <strong className="text-slate-900">{actionModal.user.email}</strong>. This record cannot be retrieved once purged.
                  </span>
                ) : (
                  <>You are about to <strong className="text-slate-900">{actionModal.type}</strong> the account of <strong className="text-slate-900">{actionModal.user.email}</strong>. The user will be notified of this action and the reason provided.</>
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Standard Reason</label>
                <div className="relative">
                  <select 
                    onChange={(e) => setActionReason(e.target.value)}
                    className="w-full bg-slate-50 border-none focus:ring-2 ring-primary/20 rounded-2xl px-5 py-4 text-xs font-bold text-slate-900 outline-none cursor-pointer appearance-none"
                    value={actionReason}
                  >
                    <option value="">-- Choose a predefined reason --</option>
                    {(actionModal.type === 'activate' ? RESTORATION_PRESETS : REASON_PRESETS).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">unfold_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Final Explanation</label>
                <textarea 
                  required
                  rows={3}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Provide specific details for the user...`}
                  className="w-full bg-slate-50 border-none focus:ring-2 ring-primary/20 rounded-2xl px-5 py-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                disabled={actionLoading}
                onClick={() => { setActionModal(null); setActionReason(REASON_PRESETS[0]); }}
                className="flex-1 px-3 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={actionLoading || (actionModal.type !== 'activate' && !actionReason)}
                onClick={handleUserAction}
                className={`flex-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2 ${
                  actionModal.type === 'suspend' ? 'bg-amber-500 shadow-amber-200' :
                  actionModal.type === 'activate' ? 'bg-emerald-500 shadow-emerald-200' :
                  actionModal.type === 'deactivate' ? 'bg-slate-900 shadow-slate-200' : 'bg-red-600 shadow-red-200'
                }`}
              >
                {actionLoading ? (
                  <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">
                    {actionModal.type === 'activate' ? 'check_circle' : 'bolt'}
                  </span>
                )}
                {actionLoading ? 'Syncing...' : 
                 actionModal.type === 'activate' ? 'Confirm Restoration' : 
                 `Confirm ${actionModal.type}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
