import React, { useState } from 'react';
import { X, Download, Printer, FileStack } from 'lucide-react';
import { getDatePresets } from '../../Reports/reportsUtils';

export const ExportModal = ({ isOpen, onClose, onExportCSV, onExportPDF }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!isOpen) return null;

  const applyPreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
  };

  const runExport = (format, isAll) => {
    const start = isAll ? '' : startDate;
    const end = isAll ? '' : endDate;
    if (!isAll && (!start || !end)) return;
    if (format === 'csv') onExportCSV(start, end);
    else onExportPDF(start, end);
  };

  const presets = getDatePresets().filter((p) => p.id !== 'all');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Export invoices</h2>
            <p className="text-xs text-slate-500 mt-0.5">Save CSV to a folder or print-ready PDF</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3">
              <FileStack size={18} className="text-brand-primary" />
              <h3 className="font-semibold text-slate-900 text-sm">Export everything</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => runExport('csv', true)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:border-brand-primary transition-colors"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                type="button"
                onClick={() => runExport('pdf', true)}
                className="btn-cta-primary !py-2.5 !text-sm w-full"
              >
                <Printer size={16} />
                Print PDF
              </button>
            </div>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-medium text-slate-400 uppercase">or date range</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-brand-primary hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => runExport('csv', false)}
                disabled={!startDate || !endDate}
                className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:opacity-40 hover:border-brand-primary"
              >
                <Download size={16} />
                Range CSV
              </button>
              <button
                type="button"
                onClick={() => runExport('pdf', false)}
                disabled={!startDate || !endDate}
                className="btn-cta-primary !py-2.5 !text-sm disabled:opacity-40"
              >
                <Printer size={16} />
                Range PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
