import React from "react";
import { AlertTriangleIcon } from "../../Reusables/Icons";

export const DeleteInvoiceModal = ({ isOpen, onClose, onConfirm, billNo, isBulk }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 m-4 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertTriangleIcon />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
            Confirm Deletion
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isBulk 
              ? `Are you sure you want to delete ${billNo} items? This action cannot be undone.`
              : `Are you sure you want to delete Invoice number: ${billNo}? This action cannot be undone.`
            }
          </p>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
