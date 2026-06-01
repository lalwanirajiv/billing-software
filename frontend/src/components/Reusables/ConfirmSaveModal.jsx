import React from 'react';
import { Save } from 'lucide-react';
import { formatINR } from '../Dashboard/dashboardUtils';

export default function ConfirmSaveModal({
  isOpen,
  onCancel,
  onConfirm,
  isExistingInvoice,
  grandTotal,
  customerName,
  billNo,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-emerald-50 mb-4">
              <Save className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {isExistingInvoice ? 'Update invoice?' : 'Save invoice?'}
            </h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              {isExistingInvoice
                ? 'Changes will update this invoice record.'
                : 'The invoice will be saved and you can preview or print it.'}
            </p>
            {(customerName || billNo) && (
              <div className="mt-4 w-full rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-left space-y-1">
                {customerName && (
                  <p>
                    <span className="text-slate-500">Customer:</span>{' '}
                    <span className="font-semibold text-slate-900">{customerName}</span>
                  </p>
                )}
                {billNo && (
                  <p>
                    <span className="text-slate-500">Bill #:</span>{' '}
                    <span className="font-semibold text-slate-900">{billNo}</span>
                  </p>
                )}
                {grandTotal != null && (
                  <p>
                    <span className="text-slate-500">Total:</span>{' '}
                    <span className="font-bold text-brand-primary">{formatINR(grandTotal)}</span>
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 btn-cta-primary !py-2.5 justify-center"
            >
              {isExistingInvoice ? 'Update' : 'Save invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
