import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { usePersistentState } from '../../hooks/use-persistent-state';

import {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
} from '../../services/admin';
import type { FeeStructure } from '../../types/api';


type FeeStructuresWorkspaceProps = {
  token: string;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const initialForm = {
  title: '',
  academicAmount: '',
  regAmount: '',
  medAmount: '',
  description: '',
  program: '',
  classLevel: '',
  term: '',
  semester: '',
  academicYear: '',
};

export function FeeStructuresWorkspace({
  token,
  showForm,
  setShowForm,
  onError,
  onSuccess,
}: FeeStructuresWorkspaceProps) {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm, clearDraft] = usePersistentState('admin_fee_structure_draft', initialForm);
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState<string | null>(null);
  const [viewingYearHistory, setViewingYearHistory] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  async function loadFeeStructures() {
    setLoading(true);

    try {
      const data = await getFeeStructures(token);
      const filteredData = data.filter(f => f.program?.toLowerCase() !== 'pre-school' && f.program?.toLowerCase() !== 'preschool');
      setFeeStructures(filteredData);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void loadFeeStructures();
  }, [token]);

  const formatWithCommas = (value: string) => {
    if (!value) return '';
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    // Remove everything except numbers and decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = cleanValue.split('.');
    if (parts.length > 2) return;
    setter(cleanValue);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    onError('');
    onSuccess('');

    try {
      const perPeriodTuition = (Number(form.academicAmount) || 0) / (form.program === 'Primary' || form.program === 'Secondary' ? 3 : 2);
      const totalOther = (Number(form.regAmount) || 0) + (Number(form.medAmount) || 0);
      const totalPayable = perPeriodTuition + totalOther;
      
      const payload = {
        title: `${form.program || 'Fee'} ${form.academicYear}: ${form.title || 'Institutional Structure'}`,
        description: `Academic: ${form.academicAmount} | Reg: ${form.regAmount} | Med: ${form.medAmount}`,
        amount: totalPayable,
        program: form.program || undefined,
        classLevel: form.classLevel || undefined,
        term: form.term || undefined,
        semester: form.semester || undefined,
        academicYear: form.academicYear || undefined,
        active,
      };

      if (selectedFeeStructureId) {
        await updateFeeStructure(token, selectedFeeStructureId, payload);
        onSuccess('Fee structure updated successfully.');
      } else {
        await createFeeStructure(token, payload);
        onSuccess('Fee structure created successfully.');
      }

      resetForm();
      clearDraft();
      await loadFeeStructures();
      setShowForm(false);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to save fee structure');
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setSelectedFeeStructureId(null);
    setActive(true);
  }

  function loadIntoForm(fee: FeeStructure) {
    setSelectedFeeStructureId(fee.id);
    setActive(fee.active);

    // Default values
    let academicAmount = String(fee.amount);
    let regAmount = '0';
    let medAmount = '0';
    let description = fee.description || '';

    // Attempt to parse metadata from description if present
    if (fee.description?.includes('Academic:')) {
      const parts = fee.description.split('|');
      academicAmount = parts.find(p => p.includes('Academic:'))?.split(':')[1].trim() || academicAmount;
      const regMatch = parts.find(p => p.includes('Reg:'))?.split(':')[1].trim();
      const medMatch = parts.find(p => p.includes('Med:'))?.split(':')[1].trim();
      
      if (regMatch) regAmount = regMatch;
      if (medMatch) medAmount = medMatch;
    }

    setForm({
      title: fee.title.includes(':') ? fee.title.split(':').slice(1).join(':').trim() : '',
      academicAmount: academicAmount,
      regAmount: regAmount,
      medAmount: medAmount,
      description: description,
      program: fee.program || '',
      classLevel: fee.classLevel || '',
      term: fee.term || '',
      semester: fee.semester || '',
      academicYear: fee.academicYear || '',
    });
    setShowForm(true);
  }

  async function handleDeleteYear(year: string) {
    onError('');
    onSuccess('');
    
    try {
      const yearFees = feeStructures.filter(f => f.academicYear === year);
      await Promise.all(yearFees.map(f => deleteFeeStructure(token, f.id)));
      onSuccess(`All ${year} institutional structures deleted successfully.`);
      // Auto-dismiss or set timeout if needed, normally the app handle toasts via onSuccess
      await loadFeeStructures();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to delete session data');
    }
  }

  async function handleToggleActive(fee: FeeStructure) {
    onError('');
    onSuccess('');

    try {
      await updateFeeStructure(token, fee.id, { active: !fee.active });
      onSuccess(`Fee structure ${!fee.active ? 'activated' : 'deactivated'} successfully.`);
      await loadFeeStructures();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to update fee structure');
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-6 w-full">
        <div className="overflow-hidden">
          <div className="px-2 py-4 flex items-center justify-between mb-2">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Active Configurations</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level & Year</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Details</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tuition (Exclusive)</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg Fee</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Med Fee</th>
                  <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total per Period</th>
                  <th className="px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest italic animate-pulse">
                      Synchronizing financial data...
                    </td>
                  </tr>
                ) : feeStructures.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                      No active structures found.
                    </td>
                  </tr>
                ) : (
                  feeStructures.map((fee) => (
                    <tr key={fee.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-2 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">
                              {fee.program?.toLowerCase().includes('primary') ? 'child_care' : 
                               fee.program?.toLowerCase().includes('secondary') ? 'school' :
                               fee.program?.toLowerCase().includes('college') ? 'account_balance' :
                               fee.program?.toLowerCase().includes('university') ? 'workspace_premium' : 'history_edu'}
                            </span>
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block text-xs uppercase tracking-tight">{fee.program || 'Other'}</span>
                            <span className="text-[10px] text-[#004e99] font-black uppercase tracking-widest italic">{fee.academicYear || 'Current Year'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{fee.term || fee.semester}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{fee.title.includes(':') ? fee.title.split(':').slice(1).join(':').trim() : fee.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-xs font-black text-slate-400 font-mono tracking-tight">
                          MK {fee.description?.includes('Academic:') ? Number(fee.description.split('|').find(p => p.includes('Academic:'))?.split(':')[1].trim() || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-[10px] font-bold text-slate-600 font-mono">
                          MK {fee.description?.includes('Reg:') ? fee.description.split('|').find(p => p.includes('Reg:'))?.split(':')[1].trim() : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-[10px] font-bold text-slate-600 font-mono">
                          MK {fee.description?.includes('Med:') ? fee.description.split('|').find(p => p.includes('Med:'))?.split(':')[1].trim() : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <div className="inline-block bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                          <p className="text-xs font-black text-primary font-mono tracking-tight">
                            MK {fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => loadIntoForm(fee)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
                            title="Edit Configuration"
                          >
                            <span className="material-symbols-outlined text-lg">edit_square</span>
                          </button>
                          <button 
                            onClick={() => handleToggleActive(fee)}
                            className={`p-2 rounded-lg transition-all ${fee.active ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50'}`} 
                            title={fee.active ? 'Deactivate' : 'Activate'}
                          >
                            <span className="material-symbols-outlined text-lg">{fee.active ? 'archive' : 'unarchive'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Institutional Fee History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Institutional Fee History</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Reviewing past 5 Academic Sessions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from(new Set(feeStructures.map(f => f.academicYear))).filter(Boolean).sort().reverse().slice(0, 5).map(year => {
              const yearFees = feeStructures.filter(f => f.academicYear === year);
              const totalAmount = yearFees.reduce((sum, f) => sum + Number(f.amount), 0);
              const avgAmount = totalAmount / yearFees.length;

              return (
                <div key={year} className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">{year}</p>
                      <h4 className="text-lg font-black text-slate-900 mt-1">Fee Archive</h4>
                    </div>
                    <div className="flex gap-2 items-start">
                      <button 
                        onClick={() => handleDeleteYear(year || '')}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center p-0.5"
                        title={`Delete ${year} Data`}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Structures</span>
                      <span className="text-xs font-black text-slate-900">{yearFees.length} Configs</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Installment</span>
                      <div className="flex items-baseline gap-1 text-primary">
                        <span className="text-[8px] font-black">MK</span>
                        <span className="text-sm font-black">{avgAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="w-full mt-6 py-3 px-4 rounded-xl border-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all flex items-center justify-center gap-2 group-hover:bg-primary/5"
                    onClick={() => setViewingYearHistory(year || null)}
                  >
                    <span>Inspect Session Registry</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-white/40 backdrop-blur-xl border-white/20"
            onClick={() => { setShowForm(false); resetForm(); }}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-400 flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">{selectedFeeStructureId ? 'Update Mode' : 'New Configuration'}</p>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedFeeStructureId ? 'Edit Structure' : 'Create New Fee'}</h3>
              </div>
            </div>
            
            <div className="overflow-y-auto p-10 no-scrollbar">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year Tuition (Exclusive)</span>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 group-focus-within:text-primary transition-colors">MK</span>
                      <input
                        type="text"
                        placeholder="0.00"
                        className="w-full bg-white border-none focus:ring-2 ring-primary/20 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-slate-900 shadow-sm"
                        value={formatWithCommas(form.academicAmount)}
                        onChange={(event) => handleNumericInput(event.target.value, (val) => setForm(c => ({ ...c, academicAmount: val })))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Payable (TUITION+OTHER FEES)</span>
                    <div className="text-[14px] font-black text-primary mt-2 flex items-baseline gap-1.5 font-mono tracking-tight bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] opacity-50">MK</span>
                      <span>{(Number(form.academicAmount) + Number(form.regAmount) + Number(form.medAmount)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Fee</span>
                    <div className="relative group/reg">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 group-focus-within/reg:text-primary transition-colors">MK</span>
                      <input
                        type="text"
                        placeholder="0.00"
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-slate-900"
                        value={formatWithCommas(form.regAmount)}
                        onChange={(event) => handleNumericInput(event.target.value, (val) => setForm(c => ({ ...c, regAmount: val })))}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Fee</span>
                    <div className="relative group/med">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 group-focus-within/med:text-primary transition-colors">MK</span>
                      <input
                        type="text"
                        placeholder="0.00"
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl pl-14 pr-6 py-4 text-xs font-bold text-slate-900"
                        value={formatWithCommas(form.medAmount)}
                        onChange={(event) => handleNumericInput(event.target.value, (val) => setForm(c => ({ ...c, medAmount: val })))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</span>
                    <input
                      placeholder="e.g. 2024/25"
                      className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900"
                      value={form.academicYear}
                      onChange={(event) => setForm((current) => ({ ...current, academicYear: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Title (Optional)</span>
                    <input
                      placeholder="e.g. Arts Component"
                      className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900"
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level of Education</span>
                    <select
                      className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 appearance-none"
                      value={form.program}
                      onChange={(event) => setForm((current) => ({ ...current, program: event.target.value }))}
                    >
                      <option value="" disabled hidden>Select Level</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                      <option value="Phd">Phd</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {form.program === 'Secondary' ? 'Form' : 
                       (form.program === 'College' || form.program === 'University') ? 'Program' : 
                       'Class/Level'}
                    </span>
                    <input
                      placeholder={form.program === 'Secondary' ? 'e.g. Form 4' : 
                                  (form.program === 'College' || form.program === 'University') ? 'e.g. BSc Computer Science' : 
                                  'e.g. Year 2'}
                      className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900"
                      value={form.classLevel}
                      onChange={(event) => setForm((current) => ({ ...current, classLevel: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {form.program === 'Primary' ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Term</span>
                      <select 
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 appearance-none"
                        value={form.term}
                        onChange={(event) => setForm((current) => ({ ...current, term: event.target.value }))}
                      >
                        <option value="">Select Term</option>
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    </div>
                  ) : (form.program === 'College' || form.program === 'University') ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Semester</span>
                      <select 
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 appearance-none"
                        value={form.semester}
                        onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))}
                      >
                        <option value="">Select Semester</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Period (Optional)</span>
                      <input
                        placeholder="e.g. Session 1"
                        className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900"
                        value={form.term || form.semester}
                        onChange={(event) => setForm((current) => ({ ...current, term: event.target.value, semester: event.target.value }))}
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-primary">
                      {form.program === 'Primary' || form.program === 'Secondary' ? 'Amount for the Term (Payable)' : 'Amount for the Semester (Payable)'}
                    </span>
                    <div className="text-[18px] font-black text-primary mt-2 flex items-baseline gap-2 font-mono tracking-tighter bg-slate-50 p-6 rounded-[2rem] border border-slate-200/50 shadow-inner">
                      <span className="text-[10px] opacity-40">MK</span>
                      <span>
                        {((Number(form.academicAmount || 0) / (form.program === 'Primary' || form.program === 'Secondary' ? 3 : 2)) + Number(form.regAmount || 0) + Number(form.medAmount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-xl">info</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed pr-4">
                    This configuration will be applied across the selected educational level. Ensure accurate figures for audit consistency.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</span>
                  <textarea
                    rows={2}
                    placeholder="Brief details about this fee..."
                    className="w-full bg-slate-100 border-none focus:ring-2 ring-primary/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-900 resize-none"
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <button 
                    disabled={saving}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-lg">{saving ? 'sync' : 'publish'}</span>
                    {saving ? 'Syncing...' : (selectedFeeStructureId ? 'Save Changes' : 'Publish Structure')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {viewingYearHistory && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setViewingYearHistory(null)} />
          <div className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{viewingYearHistory} Registry</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complete Institutional Fee Structure</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingYearHistory(null)}
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="overflow-x-auto p-10 no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Details</th>
                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tuition (Exclusive)</th>
                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reg Fee</th>
                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Med Fee</th>
                    <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total per Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {feeStructures.filter(f => f.academicYear === viewingYearHistory).map(fee => (
                    <tr key={fee.id} className="hover:bg-blue-50/20 transition-all group/row">
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{fee.program || 'Other'}</span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{fee.term || fee.semester}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{fee.title.includes(':') ? fee.title.split(':').slice(1).join(':').trim() : fee.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-xs font-black text-slate-400 font-mono tracking-tight">
                          MK {fee.description?.includes('Academic:') ? Number(fee.description.split('|').find(p => p.includes('Academic:'))?.split(':')[1].trim() || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-[10px] font-bold text-slate-600 font-mono">
                          MK {fee.description?.includes('Reg:') ? fee.description.split('|').find(p => p.includes('Reg:'))?.split(':')[1].trim() : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="text-[10px] font-bold text-slate-600 font-mono">
                          MK {fee.description?.includes('Med:') ? fee.description.split('|').find(p => p.includes('Med:'))?.split(':')[1].trim() : '0.00'}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <p className="text-xs font-black text-primary font-mono tracking-tight">
                          MK {fee.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
               <button 
                 onClick={() => setViewingYearHistory(null)}
                 className="px-8 py-4 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all font-mono"
               >
                 Close Archive
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
