import { useState, useEffect } from 'react';
import { getRegistry, updateRegistry } from '../../services/admin';
import { usePersistentState } from '../../hooks/use-persistent-state';


type RegistryWorkspaceProps = {
  token: string;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function RegistryWorkspace({ token, onError, onSuccess }: RegistryWorkspaceProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm, clearDraft] = usePersistentState('admin_registry_draft', {
    institutionName: '',
    institutionType: 'College',
    address: '',
    contactEmail: '',
    logoUrl: '' as string | null,
  });

  async function loadData() {
    try {
      const data = await getRegistry(token);
      setForm({
        institutionName: data.institutionName || '',
        institutionType: data.institutionType || 'College',
        address: data.address || '',
        contactEmail: data.contactEmail || '',
        logoUrl: data.logoUrl || null,
      });
    } catch (err) {
      onError('Failed to load institutional registry');
    } finally {
      setLoading(false);
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, logoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    void loadData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onError('');
    onSuccess('');

    try {
      await updateRegistry(token, form as any);
      onSuccess('Institutional identity updated successfully');
      clearDraft();
      await loadData();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update identity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
      {/* Left Column: Core Identity and Preview */}
      <div className="lg:col-span-1 space-y-8">
        <section className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_32px_64px_rgba(0,0,0,0.06)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10"></div>
          
          <div className="relative mb-8 text-center sm:text-left flex flex-col items-center sm:items-start">
             <div 
               onClick={() => document.getElementById('logo-upload')?.click()}
               className="group cursor-pointer relative inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl mb-6 transform transition-transform hover:scale-110 duration-500 overflow-hidden group"
             >
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Institution Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-white text-2xl">add_a_photo</span>
                </div>
             </div>
             <input 
               id="logo-upload"
               type="file" 
               className="hidden" 
               accept="image/*"
               onChange={handleLogoChange}
             />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary mb-2">Live Preview</p>
              <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tighter">{form.institutionName || 'Not Registered'}</h3>
              <span className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-black rounded-full uppercase tracking-widest">{form.institutionType}</span>
          </div>

          <div className="space-y-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 italic font-black text-primary text-xs">E</div>
              <div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Platform Prefix</p>
                <p className="text-xs font-black text-slate-900 leading-none">EduPayTrack Verified</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Edit Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] border border-white shadow-2xl space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-2">Institution Name</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">corporate_fare</span>
                    <input 
                       type="text"
                       required
                       value={form.institutionName}
                       onChange={e => setForm({...form, institutionName: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 placeholder:italic"
                       placeholder="e.g. Domasi College of Education"
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-2">Educational Type</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">category</span>
                    <select 
                       value={form.institutionType}
                       onChange={e => setForm({...form, institutionType: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                    >
                       <option value="Primary School">Primary School</option>
                       <option value="Secondary School">Secondary School</option>
                       <option value="College">College</option>
                       <option value="University">University</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                 </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-2">Official Physical Address</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">location_on</span>
                    <input 
                       type="text"
                       value={form.address}
                       onChange={e => setForm({...form, address: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 placeholder:italic"
                       placeholder="Enter institutional location..."
                    />
                 </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                  <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.1em] ml-2">Financial/Contact Email</label>
                  <div className="relative group">
                     <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">alternate_email</span>
                    <input 
                       type="email"
                       value={form.contactEmail}
                       onChange={e => setForm({...form, contactEmail: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-slate-900 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 placeholder:italic"
                       placeholder="finance@school.edu"
                    />
                 </div>
                  <p className="text-[11px] text-slate-500 italic px-2">Used for institutional correspondence and receipt headers.</p>
              </div>
           </div>

           <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-6">
              <div className="max-w-xs">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] leading-relaxed">Changes to institutional identity are logged and broadcasted to all terminals across the network.</p>
              </div>
              <button 
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">verified</span>
                )}
                {saving ? 'Syncing...' : 'Register Institutional Identity'}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
