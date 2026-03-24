import { useEffect, useMemo, useState } from 'react';

import { PaginationControls } from '../../components/shared/PaginationControls';
import { getStudents } from '../../services/admin';
import type { AdminStudentRecord } from '../../types/api';
import { exportRowsToCsv } from '../../utils/export';
import { formatDate, formatMoney } from '../../utils/format';

type StudentsWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function StudentsWorkspace({
  token,
  onError,
}: StudentsWorkspaceProps) {
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const pageSize = 8;

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await getStudents(token);
      setStudents(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudents();
  }, [token]);

  const filteredStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    
    return students.filter((student) => {
      const matchQuery = !normalizedQuery || [
        student.firstName,
        student.lastName,
        student.studentCode,
        student.program,
        student.user?.email || '',
      ].join(' ').toLowerCase().includes(normalizedQuery);

      const matchLevel = levelFilter === 'ALL' || student.classLevel?.toLowerCase() === levelFilter.toLowerCase();
      
      const balance = Number(student.currentBalance);
      let studentStatus = 'UP' // Unpaid default
      if (balance <= 0) studentStatus = 'V'; // Verified
      if (student.payments?.some(p => p.status === 'PENDING')) studentStatus = 'P'; // Processing
      
      const matchStatus = statusFilter === 'ALL' || 
        (statusFilter === 'Verified' && studentStatus === 'V') ||
        (statusFilter === 'Processing' && studentStatus === 'P') ||
        (statusFilter === 'Unpaid' && studentStatus === 'UP');

      return matchQuery && matchLevel && matchStatus;
    });
  }, [students, query, levelFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, levelFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pagedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === selectedStudentId) || null
  , [students, selectedStudentId]);

  const stats = useMemo(() => {
    const total = students.length;
    const now = new Date();
    const last24h = students.filter(s => s.createdAt && (now.getTime() - new Date(s.createdAt).getTime() < 86400000)).length;
    const verified = students.filter(s => Number(s.currentBalance) <= 0).length;
    const compliance = total > 0 ? Math.round((verified / total) * 100) : 0;

    return { total, last24h, compliance };
  }, [students]);

  function handleExportStudents() {
    exportRowsToCsv(
      'students-ledger.csv',
      ['Name', 'ID/Code', 'Level', 'Program', 'Balance', 'Status', 'Phone', 'Email'],
      filteredStudents.map(s => [
        `${s.firstName} ${s.lastName}`,
        s.studentCode,
        s.classLevel || 'N/A',
        s.program,
        formatMoney(s.currentBalance),
        Number(s.currentBalance) <= 0 ? 'Verified' : 'Pending',
        s.phone || 'N/A',
        s.user?.email || 'N/A'
      ])
    );
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm animate-pulse">Synchronizing institutional ledger...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <style>{`
        @media print {
          /* Hide everything first */
          body { 
            visibility: hidden !important; 
            background: white !important;
          }
          /* Specifically show the modal and its content */
          #ledger-modal-root { 
            visibility: visible !important; 
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
          }
          #ledger-modal-root * { 
            visibility: visible !important; 
          }
          /* Remove background colors and shadows for standard printers */
          #ledger-modal-root, #ledger-modal-root div, #ledger-modal-root section { 
            background-color: white !important; 
            border-color: #cbd5e1 !important;
            color: black !important;
            box-shadow: none !important;
          }
          .print-header { display: block !important; border-bottom: 2px solid black !important; padding-bottom: 24px !important; margin-bottom: 32px !important; }
          .print-footer { display: block !important; margin-top: 64px !important; border-top: 1px dashed #cbd5e1 !important; padding-top: 32px !important; }
        }
      `}</style>

      {/* Quick Stats Bento Grid */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-[#414752] font-black text-[10px] uppercase tracking-widest">Total Students</span>
            <h2 className="text-4xl font-black tracking-tighter mt-2 text-[#0b1c30]">{stats.total.toLocaleString()}</h2>
          </div>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            System-wide capacity
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-[#414752] font-black text-[10px] uppercase tracking-widest">Recent Registrations</span>
            <h2 className="text-4xl font-black tracking-tighter mt-2 text-[#0b1c30]">{stats.last24h}</h2>
          </div>
          <div className="mt-6 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Last 24 hours
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-[#c1c6d4]/20 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <span className="text-[#414752] font-black text-[10px] uppercase tracking-widest">Outstanding Compliance</span>
            <h2 className="text-4xl font-black tracking-tighter mt-2 text-[#0b1c30]">{stats.compliance}%</h2>
          </div>
          <div className="mt-6 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${stats.compliance}%` }}></div>
          </div>
        </div>
      </section>

      {/* Filters & Search Section */}
      <section className="mb-8 p-6 bg-white rounded-[2rem] border border-[#c1c6d4]/30 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:max-w-xl">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#414752] opacity-40">search</span>
            <input 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 text-sm font-bold text-[#0b1c30]" 
              placeholder="Search by ID, Name, Registration Number or Program..." 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-5 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black text-[#414752] uppercase tracking-widest focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer appearance-none min-w-[160px]"
            >
              <option value="ALL">Education Level</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="college">College</option>
              <option value="university">University</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-5 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-[11px] font-black text-[#414752] uppercase tracking-widest focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer appearance-none min-w-[160px]"
            >
              <option value="ALL">Fee Status</option>
              <option value="Verified">Verified</option>
              <option value="Processing">Processing</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <button 
              onClick={loadStudents}
              className="bg-blue-50 text-primary hover:bg-blue-100 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
            >
              <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>sync</span>
              Sync Records
            </button>
            <button 
              onClick={handleExportStudents}
              className="bg-primary hover:bg-[#0a66c2] text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-lg shadow-primary/20 flex items-center gap-3 active:scale-95 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Data Table */}
      <section className="bg-white rounded-[2.5rem] border border-[#c1c6d4]/30 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-[#414752] font-black border-b border-slate-100">
                <th className="px-8 py-6">Student Name</th>
                <th className="px-8 py-6">Registration Number (FR1)</th>
                <th className="px-8 py-6">Level</th>
                <th className="px-8 py-6">Current Program/Class</th>
                <th className="px-8 py-6">Fee Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-900">
              {pagedStudents.map((student) => {
                const balance = Number(student.currentBalance);
                const isVerified = balance <= 0;
                const isProcessing = student.payments?.some(p => p.status === 'PENDING');
                
                return (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#0a66c2] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm text-[#0b1c30] tracking-tight">{student.firstName} {student.lastName}</p>
                          <p className="text-[10px] text-[#414752] font-black uppercase tracking-widest mt-0.5">Joined {formatDate(student.createdAt || '')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-mono text-xs font-bold text-primary">{student.studentCode}</td>
                    <td className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[#414752]">{student.classLevel || 'N/A'}</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-600">{student.program}</td>
                    <td className="px-8 py-6">
                      {isVerified ? (
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-widest">Verified</span>
                      ) : isProcessing ? (
                        <span className="px-4 py-1.5 bg-blue-50 text-primary text-[9px] font-black rounded-full border border-blue-100 uppercase tracking-widest">Processing</span>
                      ) : (
                        <span className="px-4 py-1.5 bg-red-50 text-red-600 text-[9px] font-black rounded-full border border-red-100 uppercase tracking-widest">Unpaid</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => { setSelectedStudentId(student.id); setShowLedger(true); }}
                         className="bg-primary text-white hover:bg-[#0a66c2] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95"
                       >
                         View Ledger
                       </button>
                    </td>
                  </tr>
                );
              })}
              {pagedStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                    No student records found matching the current institutional criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredStudents.length}
            itemLabel="students"
          />
        </div>
      </section>

      {/* Student Ledger Modal */}
      {showLedger && selectedStudent && (
        <div id="ledger-modal-root" className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto print:static print:p-0 print:block">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md print:hidden" onClick={() => setShowLedger(false)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full">
            {/* Official Print Header - Visible only in Print */}
            <div className="hidden print-header p-8 text-center">
              <div className="flex justify-between items-end mb-8">
                <div className="text-left">
                  <h1 className="text-3xl font-black tracking-tighter text-[#0b1c30]">EDUPAYTRACK</h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Institutional Management System</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-slate-900">OFFICIAL STUDENT LEDGER</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Receipt Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="h-0.5 bg-slate-900 w-full mb-8" />
            </div>

            {/* Modal Header/Profile */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-none print:border-none print:bg-white print:p-0 print:mb-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 print:hidden">
                  {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0b1c30] tracking-tight">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="hidden print:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Consolidated Institutional Record</p>
                </div>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white">
              {/* Profile Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration ID</p>
                  <p className="text-sm font-black text-primary font-mono">{selectedStudent.studentCode}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Program</p>
                  <p className="text-sm font-black text-slate-700 truncate">{selectedStudent.program}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Year</p>
                  <p className="text-sm font-black text-slate-700">{selectedStudent.academicYear || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                  <p className="text-sm font-black text-emerald-600">{formatMoney(selectedStudent.currentBalance)}</p>
                </div>
              </div>

              {/* Ledger Activity History */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-widest">Transaction History Ledger</h4>
                  <span className="text-[10px] font-black text-slate-400 opacity-60 uppercase tracking-widest leading-none bg-slate-100 px-3 py-1 rounded-full">{selectedStudent.payments?.length || 0} Records</span>
                </div>
                
                <div className="border border-slate-100 rounded-[1.5rem] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[9px] uppercase tracking-widest text-slate-500 font-black border-b border-slate-100">
                        <th className="px-6 py-4">Status & Logic</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Amount (MWK)</th>
                        <th className="px-6 py-4">Payment Date</th>
                        <th className="px-6 py-4">Sync ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-900">
                      {selectedStudent.payments?.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-all text-xs">
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border ${
                              p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              p.status === 'PENDING' ? 'bg-blue-50 text-primary border-blue-100' :
                              'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-600 uppercase tracking-tighter">{p.method}</td>
                          <td className="px-6 py-4 font-black text-slate-900">{formatMoney(p.amount)}</td>
                          <td className="px-6 py-4 text-slate-500">{formatDate(p.paymentDate)}</td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{p.externalReference || p.id.slice(0, 8)}</td>
                        </tr>
                      ))}
                      {(!selectedStudent.payments || selectedStudent.payments.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold italic text-sm">No transaction records detected for this account.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Signature Section - Visible only in Print */}
              <div className="hidden print-footer">
                <div className="grid grid-cols-2 gap-20">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Signature</p>
                    <div className="h-px bg-slate-300 w-full" />
                    <p className="text-[9px] text-slate-400">Institutional Bursar / Auditor Stamp</p>
                  </div>
                  <div className="text-right space-y-4">
                    <p className="text-sm font-black text-[#0b1c30]">Balance Due: {formatMoney(selectedStudent.currentBalance)}</p>
                    <p className="text-[9px] text-slate-400 max-w-[240px] ml-auto uppercase tracking-widest leading-relaxed">
                      This is a computer-generated institutional receipt valid for internal audits and external verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 flex-none print:hidden">
               <button 
                 onClick={() => {
                   const oldTitle = document.title;
                   const fileName = `${selectedStudent.firstName}_${selectedStudent.lastName}_${selectedStudent.studentCode}_LEDGER`.toUpperCase().replace(/\s+/g, '_');
                   
                   document.title = fileName;
                   
                   // 300ms delay gives the browser UI thread time to commit the title change 
                   // before the synchronous print dialog blocks the execution.
                   setTimeout(() => {
                     window.print();
                     
                     // Longer delay before restoring to ensure the PDF driver 
                     // catches the title during the save process.
                     setTimeout(() => { 
                       document.title = oldTitle; 
                     }, 2000);
                   }, 300);
                 }}
                 className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
               >
                 <span className="material-symbols-outlined text-sm">print</span>
                 Print
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
