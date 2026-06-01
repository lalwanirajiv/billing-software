import React from 'react';
import { Link } from 'react-router-dom';
import { FileDown, Printer, UserPlus, LayoutDashboard, Upload } from 'lucide-react';
import PageHeader from '../Reusables/PageHeader';

export default function CustomerListHeader({
  totalCount,
  filteredCount,
  searchTerm,
  fyLabel,
  onExportCsv,
  onExportPdf,
  onImportCsv,
  isImporting,
  isExportOpen,
  setExportOpen,
}) {
  const description = searchTerm
    ? `Showing ${filteredCount} of ${totalCount} matching “${searchTerm}”`
    : `${totalCount} registered customer${totalCount !== 1 ? 's' : ''}`;

  return (
    <PageHeader
      eyebrow={`${fyLabel ? `${fyLabel} · ` : ''}Customer directory`}
      title="Customers"
      description={description}
      actions={
        <>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <button
            type="button"
            onClick={onImportCsv}
            disabled={isImporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors disabled:opacity-50"
            title="Import new customers only; duplicates are skipped"
          >
            <Upload size={18} />
            {isImporting ? 'Importing…' : 'Import CSV…'}
          </button>

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
        </>
      }
    />
  );
}
