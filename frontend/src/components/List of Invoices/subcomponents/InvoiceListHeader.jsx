import React from 'react';
import { Search, Calendar, Trash2, X } from 'lucide-react';

export const InvoiceListHeader = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  statusFilter,
  selectedCount,
  onBulkDelete,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-4 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search customer, bill no., or amount…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
          />
        </div>

        <div className="relative shrink-0 w-full sm:w-auto">
          <Calendar
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-44 pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25 focus:border-brand-primary"
            title="Filter by bill date"
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 shrink-0"
          >
            <X size={16} />
            Clear
          </button>
        )}

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onBulkDelete}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shrink-0"
          >
            <Trash2 size={18} />
            Delete ({selectedCount})
          </button>
        )}
      </div>

      {statusFilter !== 'All' && (
        <p className="text-xs text-slate-500">
          Filtering by status: <span className="font-semibold text-slate-700">{statusFilter}</span>
          <span className="text-slate-400"> — use stat cards above to change</span>
        </p>
      )}
    </div>
  );
};
