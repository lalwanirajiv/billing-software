import React from 'react';
import { Link } from 'react-router-dom';
import { FileDown, Printer, UserPlus, LayoutDashboard } from 'lucide-react';

export default function CustomerListHeader({
  totalCount,
  filteredCount,
  searchTerm,
  fyLabel,
  onExportCsv,
  onExportPdf,
  isExportOpen,
  setExportOpen,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
      <div>
        <p className="text-sm font-medium text-brand-primary mb-1">
          {fyLabel ? `${fyLabel} · ` : ''}Customer directory
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
        <p className="text-slate-500 text-sm mt-1">
          {searchTerm
            ? `Showing ${filteredCount} of ${totalCount} matching “${searchTerm}”`
            : `${totalCount} registered customer${totalCount !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen(!isExportOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <FileDown size={18} />
            Export
          </button>
          {isExportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} aria-hidden />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setExportOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileDown size={16} className="text-brand-primary" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportPdf();
                    setExportOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Printer size={16} className="text-brand-primary" />
                  Print directory
                </button>
              </div>
            </>
          )}
        </div>

        <Link to="/create-customer" className="btn-cta-primary !py-2.5 !px-4 !text-sm">
          <UserPlus size={18} />
          <span>Add customer</span>
        </Link>
      </div>
    </div>
  );
}
