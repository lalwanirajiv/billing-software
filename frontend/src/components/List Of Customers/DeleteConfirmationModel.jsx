import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  isBulk,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Delete customer{isBulk ? 's' : ''}?</h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            {isBulk
              ? `This will permanently remove ${customerName} customers. This cannot be undone.`
              : `“${customerName}” will be permanently removed. This cannot be undone.`}
          </p>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
