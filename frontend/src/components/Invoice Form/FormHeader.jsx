import { FileText, FilePen, RotateCcw } from 'lucide-react';
import { formatINR } from '../Dashboard/dashboardUtils';

const FormHeader = ({
  isEditMode,
  billNo,
  grandTotal,
  onClear,
}) => {
  const Icon = isEditMode ? FilePen : FileText;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
      <div className="flex items-start gap-4">
        <div className="bg-indigo-50 p-3 rounded-xl shrink-0">
          <Icon className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-primary mb-0.5">
            {isEditMode ? 'Edit invoice' : 'New invoice'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isEditMode ? `Invoice #${billNo || '—'}` : 'Create invoice'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditMode
              ? 'Update line items, tax, and payment details.'
              : 'Select a customer, add items, and save to preview the bill.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
        {grandTotal > 0 && (
          <div className="text-right px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wide">
              Estimated total
            </p>
            <p className="text-xl font-bold text-slate-900">{formatINR(grandTotal)}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <RotateCcw size={16} />
          Reset form
        </button>
      </div>
    </div>
  );
};

export default FormHeader;
