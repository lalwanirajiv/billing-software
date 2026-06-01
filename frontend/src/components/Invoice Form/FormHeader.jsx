import { RotateCcw } from 'lucide-react';
import { formatINR } from '../Dashboard/dashboardUtils';
import PageHeader from '../Reusables/PageHeader';
import { usePageTitle } from '../../context/PageTitleContext';

const FormHeader = ({ isEditMode, billNo, grandTotal, onClear }) => {
  const { title, eyebrow } = usePageTitle();

  return (
    <PageHeader
      eyebrow={eyebrow}
      title={isEditMode && billNo ? `Edit invoice #${billNo}` : title}
      description={
        isEditMode
          ? 'Update line items, tax, and payment details.'
          : 'Select a customer, add items, and save to preview the bill.'
      }
      className="mb-8 pb-6 border-b border-slate-100"
      actions={
        <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
          {grandTotal > 0 && (
            <div className="text-right px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wide">
                Estimated total
              </p>
              <p className="text-xl font-bold text-slate-900">{formatINR(grandTotal)}</p>
            </div>
          )}
          {!isEditMode && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-700 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={16} />
              Reset form
            </button>
          )}
        </div>
      }
    />
  );
};

export default FormHeader;
