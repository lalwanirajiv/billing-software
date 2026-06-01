import React, { useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import ReportPrintDocument from './ReportPrintDocument';

export default function ReportPrintPreviewModal({
  isOpen,
  onClose,
  onConfirmPrint,
  reportType,
  sales,
  customers,
  taxMetrics,
  statusBreakdown,
  startDate,
  endDate,
  recordCount,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    onConfirmPrint();
  };

  return (
    <div
      className="report-print-modal fixed inset-0 z-[100] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-print-title"
    >
      {/* Backdrop + toolbar — hidden when printing */}
      <div className="report-print-modal-chrome no-print flex flex-col flex-1 min-h-0">
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col flex-1 min-h-0 mx-auto w-full max-w-5xl px-4 pt-4 pb-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white shadow-sm">
                <FileText size={22} className="text-brand-primary" />
              </div>
              <div>
                <h2 id="report-print-title" className="text-lg font-bold text-white">
                  Print preview
                </h2>
                <p className="text-sm text-slate-300">
                  {recordCount != null
                    ? `${recordCount.toLocaleString('en-IN')} records · review before printing`
                    : 'Review layout before sending to printer'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-cta-primary !py-2.5 !px-5 !text-sm shadow-lg"
              >
                <Printer size={18} />
                Print now
              </button>
            </div>
          </div>

          <div className="report-print-preview-scroll flex-1 min-h-0 overflow-auto rounded-2xl bg-slate-200/90 p-4 sm:p-8 shadow-inner print:hidden">
            <div className="max-w-[210mm] mx-auto shadow-2xl ring-1 ring-slate-300/80 rounded-sm overflow-hidden">
              <ReportPrintDocument
                reportType={reportType}
                sales={sales}
                customers={customers}
                taxMetrics={taxMetrics}
                statusBreakdown={statusBreakdown}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-3">
            Tip: Use landscape for wide sales ledgers · margins are set to 10mm
          </p>
        </div>
      </div>

      {/* Print-only copy — shown on paper when modal is open during print */}
      <div className="hidden print:block report-print-modal-print-root">
        <ReportPrintDocument
          reportType={reportType}
          sales={sales}
          customers={customers}
          taxMetrics={taxMetrics}
          statusBreakdown={statusBreakdown}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <style>{`
        @media print {
          .report-print-modal {
            position: static !important;
            inset: auto !important;
            z-index: auto !important;
          }
          .report-print-modal-chrome,
          .report-print-preview-scroll {
            display: none !important;
          }
          .report-print-modal-print-root {
            display: block !important;
            position: static !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
