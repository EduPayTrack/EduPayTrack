import { useState, useCallback } from 'react';
import { Filter, X, ChevronDown, Calendar, DollarSign, User, Tag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './../../components/ui/popover';
import { cn } from './../../lib/utils';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface NumberRangeFilter {
  min?: number;
  max?: number;
}

export interface AdvancedFiltersState {
  search: string;
  status: string;
  dateRange: DateRangeFilter;
  amountRange: NumberRangeFilter;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  filters: AdvancedFiltersState;
  onFiltersChange: (filters: AdvancedFiltersState) => void;
  statusOptions: FilterOption[];
  sortOptions: FilterOption[];
  totalResults: number;
  className?: string;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  statusOptions,
  sortOptions,
  totalResults,
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.status !== 'ALL',
    filters.dateRange.from || filters.dateRange.to,
    filters.amountRange.min !== undefined || filters.amountRange.max !== undefined,
    filters.search,
  ].filter(Boolean).length;

  const updateFilter = useCallback(<K extends keyof AdvancedFiltersState>(
    key: K,
    value: AdvancedFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      search: '',
      status: 'ALL',
      dateRange: {},
      amountRange: {},
      sortBy: sortOptions[0]?.value || 'newest',
      sortOrder: 'desc',
    });
  }, [onFiltersChange, sortOptions]);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search and Quick Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => updateFilter('search', '')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "gap-2",
                hasActiveFilters && "border-primary text-primary"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[11px]">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[14px]">Advanced Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[12px] text-muted-foreground"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="From"
                    value={filters.dateRange.from || ''}
                    onChange={(e) =>
                      updateFilter('dateRange', {
                        ...filters.dateRange,
                        from: e.target.value || undefined,
                      })
                    }
                    className="h-8 text-[12px]"
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    value={filters.dateRange.to || ''}
                    onChange={(e) =>
                      updateFilter('dateRange', {
                        ...filters.dateRange,
                        to: e.target.value || undefined,
                      })
                    }
                    className="h-8 text-[12px]"
                  />
                </div>
              </div>

              {/* Amount Range */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Amount Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.amountRange.min || ''}
                    onChange={(e) =>
                      updateFilter('amountRange', {
                        ...filters.amountRange,
                        min: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="h-8 text-[12px]"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange.max || ''}
                    onChange={(e) =>
                      updateFilter('amountRange', {
                        ...filters.amountRange,
                        max: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="h-8 text-[12px]"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-[12px] font-medium">Sort Order</label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-8 text-[12px]"
                    onClick={() => updateFilter('sortOrder', 'asc')}
                  >
                    Ascending
                  </Button>
                  <Button
                    variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1 h-8 text-[12px]"
                    onClick={() => updateFilter('sortOrder', 'desc')}
                  >
                    Descending
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          <span className="text-[12px] text-muted-foreground">Active filters:</span>
          
          {filters.status !== 'ALL' && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Tag className="h-3 w-3" />
              {statusOptions.find(o => o.value === filters.status)?.label}
              <button onClick={() => updateFilter('status', 'ALL')}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Calendar className="h-3 w-3" />
              From {filters.dateRange.from}
              <button onClick={() => updateFilter('dateRange', { ...filters.dateRange, from: undefined })}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {filters.dateRange.to && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Calendar className="h-3 w-3" />
              To {filters.dateRange.to}
              <button onClick={() => updateFilter('dateRange', { ...filters.dateRange, to: undefined })}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {filters.amountRange.min !== undefined && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <DollarSign className="h-3 w-3" />
              Min {filters.amountRange.min}
              <button onClick={() => updateFilter('amountRange', { ...filters.amountRange, min: undefined })}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {filters.amountRange.max !== undefined && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <DollarSign className="h-3 w-3" />
              Max {filters.amountRange.max}
              <button onClick={() => updateFilter('amountRange', { ...filters.amountRange, max: undefined })}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          {filters.search && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <User className="h-3 w-3" />
              "{filters.search}"
              <button onClick={() => updateFilter('search', '')}>
                <X className="h-3 w-3 ml-1 hover:text-destructive" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] text-muted-foreground"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>

          <span className="text-[12px] text-muted-foreground ml-auto">
            {totalResults} result{totalResults !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

// Hook for using advanced filters
export function useAdvancedFilters<T extends Record<string, any>>(
  items: T[],
  options: {
    searchFields: (keyof T)[];
    statusField?: keyof T;
    dateField?: keyof T;
    amountField?: keyof T;
  }
) {
  const [filters, setFilters] = useState<AdvancedFiltersState>({
    search: '',
    status: 'ALL',
    dateRange: {},
    amountRange: {},
    sortBy: 'newest',
    sortOrder: 'desc',
  });

  const filteredItems = items.filter((item) => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const searchable = options.searchFields
        .map((field) => String(item[field] || '').toLowerCase())
        .join(' ');
      if (!searchable.includes(query)) return false;
    }

    // Status filter
    if (filters.status !== 'ALL' && options.statusField) {
      const itemStatus = String(item[options.statusField] || '').toUpperCase();
      if (itemStatus !== filters.status.toUpperCase()) return false;
    }

    // Date range filter
    if (options.dateField && (filters.dateRange.from || filters.dateRange.to)) {
      const itemDate = new Date(item[options.dateField] as string);
      if (filters.dateRange.from && itemDate < new Date(filters.dateRange.from)) return false;
      if (filters.dateRange.to && itemDate > new Date(filters.dateRange.to)) return false;
    }

    // Amount range filter
    if (options.amountField && (filters.amountRange.min !== undefined || filters.amountRange.max !== undefined)) {
      const amount = Number(item[options.amountField] || 0);
      if (filters.amountRange.min !== undefined && amount < filters.amountRange.min) return false;
      if (filters.amountRange.max !== undefined && amount > filters.amountRange.max) return false;
    }

    return true;
  });

  return {
    filters,
    setFilters,
    filteredItems,
    totalResults: filteredItems.length,
  };
}

export default AdvancedFilters;
