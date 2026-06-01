import React from 'react';
import { AlertTriangle, Upload, X } from 'lucide-react';

export default function CustomerImportConfirmModal({
  isOpen,
  preview,
  onCancel,
  onConfirm,
  isImporting,
}) {
  if (!isOpen || !preview) return null;

  const { wouldImport, wouldSkip, parsed, existingCount } = preview;
  const nothingNew = wouldImport === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6"
        role="dialog"
        aria-labelledby="import-confirm-title"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Upload className="text-brand-primary shrink-0" size={22} />
            <h2 id="import-confirm-title" className="text-lg font-semibold text-slate-900">
              Import customers from CSV
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          {parsed} rows in file · {existingCount} customers already in your directory
        </p>

        <ul className="text-sm space-y-2 mb-4">
          <li className="flex justify-between">
            <span className="text-slate-600">New customers to add</span>
            <span className="font-semibold text-emerald-700">{wouldImport}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-600">Skipped (already exist)</span>
            <span className="font-semibold text-slate-700">{wouldSkip}</span>
          </li>
        </ul>

        {nothingNew && (
          <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-900 text-sm mb-4">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p>
              All customers in this file are already in the system. Import again would not add
              anything.
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isImporting || nothingNew}
            className="btn-cta-primary !py-2.5 !px-4 !text-sm disabled:opacity-50"
          >
            {isImporting ? 'Importing…' : `Import ${wouldImport} customer${wouldImport !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
