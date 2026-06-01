import React from 'react';
import { CalendarRange } from 'lucide-react';
import { useFinancialYear } from '../../context/FinancialYearContext';

/**
 * Compact FY switcher — use in page headers or the global app header.
 */
export default function FinancialYearSelector({ className = '', compact = false }) {
  const { availableYears, selectedStartYear, setSelectedFyStartYear, loading, isCurrentFy } =
    useFinancialYear();

  if (loading && availableYears.length <= 1) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400 ${className}`}
      >
        <CalendarRange size={14} />
        Loading FY…
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {!compact && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
          <CalendarRange size={12} />
          Financial year
        </span>
      )}
      <div
        className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80"
        role="tablist"
        aria-label="Financial year"
      >
        {availableYears.map((fy) => {
          const active = fy.startYear === selectedStartYear;
          return (
            <button
              key={fy.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedFyStartYear(fy.startYear)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                active
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-brand-primary'
              }`}
            >
              {fy.label}
              {fy.isCurrent && !compact && (
                <span className={`ml-1 ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                  · current
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!isCurrentFy && !compact && (
        <p className="text-[10px] text-amber-700 font-medium">
          Viewing archived year — new invoices still use the current FY.
        </p>
      )}
    </div>
  );
}
