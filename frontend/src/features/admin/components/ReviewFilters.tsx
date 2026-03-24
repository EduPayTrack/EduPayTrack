import type { PaymentStatus } from '../../../types/api';

type ReviewFiltersProps = {
  statusFilter: PaymentStatus | 'ALL';
  searchQuery: string;
  loading: boolean;
  onFilterChange: (status: PaymentStatus | 'ALL') => void;
  onSearchChange: (value: string) => void;
};

export function ReviewFilters({
  statusFilter,
  searchQuery,
  loading,
  onFilterChange,
  onSearchChange,
}: ReviewFiltersProps) {
  return (
    <section className="flex flex-col lg:flex-row gap-6 justify-between items-end lg:items-center mb-8">
      <div className="w-full lg:max-w-2xl space-y-4">
        {/* Search Bar */}
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all" 
            placeholder="Search by student ID, name, or receipt number..." 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              disabled={loading}
              onClick={() => onFilterChange(status)}
              className={`px-5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                statusFilter === status 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
