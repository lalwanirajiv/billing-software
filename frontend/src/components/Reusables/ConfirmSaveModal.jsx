import React from "react";

export default function ConfirmSaveModal({
  isOpen,
  onCancel,
  onConfirm,
  isExistingInvoice,
}) {
  if (!isOpen) return null; // Don’t render unless needed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {isExistingInvoice ? "Update" : "Save"} Invoice
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Do you want to {isExistingInvoice ? "Update" : "Save"} this invoice?
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Yes, {isExistingInvoice ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
