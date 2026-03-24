type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemLabel?: string;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemLabel = 'items',
}: PaginationControlsProps) {
  if (totalPages <= 1 && !totalItems) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
      {totalItems !== undefined && (
        <p className="text-xs text-slate-500 font-bold">
          Showing <span className="text-slate-900 font-black">{totalItems === 0 ? 0 : (currentPage - 1) * 15 + 1}-{Math.min(currentPage * 15, totalItems)}</span> of <span className="text-slate-900 font-black">{totalItems}</span> {itemLabel}
        </p>
      )}
      
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200 rounded-xl bg-white shadow-sm"
          disabled={currentPage === 1}
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <div className="px-4 py-2 bg-slate-100 rounded-xl">
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-200 rounded-xl bg-white shadow-sm"
          disabled={currentPage === totalPages}
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
