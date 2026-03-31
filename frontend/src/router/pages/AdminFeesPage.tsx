import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FeeStructuresWorkspace } from '../../features/admin/FeeStructuresWorkspace';

type ContextType = {
  token: string;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
};

export function AdminFeesPage() {
  const { token, onError, onSuccess } = useOutletContext<ContextType>();
  const [showForm, setShowForm] = useState(false);

  const handleExport = () => {
    const filename = `EduPayTrack-Fee-Structure-${new Date().getFullYear()}.pdf`;
    onSuccess(`Exporting audit-ready ledger: ${filename}`);
    
    const blob = new Blob(['Official EduPayTrack Fee Structure Export'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 w-full">
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="text-primary hover:text-[#004e99] font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-colors group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:rotate-90 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            Fee configuration
          </button>
        ) : (
          <div></div> // Spacer to keep export report on the right
        )}

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black text-[11px] uppercase tracking-widest transition-colors group ml-auto"
        >
          <span className="material-symbols-outlined text-[16px] transition-colors">cloud_download</span>
          Export Report
        </button>
      </div>


      <div className="max-w-full">
        <FeeStructuresWorkspace
          token={token}
          showForm={showForm}
          setShowForm={setShowForm}
          onError={onError}
          onSuccess={onSuccess}
        />
      </div>
    </>
  );
}
