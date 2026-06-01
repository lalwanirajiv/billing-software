import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmRestoreModal({ isOpen, onCancel, onConfirm, isRestoring }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Restore Database?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This will replace your current billing data with the selected backup.
              A safety copy of your current database will be saved automatically before restore.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isRestoring}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRestoring}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {isRestoring ? "Restoring..." : "Yes, Restore"}
          </button>
        </div>
      </div>
    </div>
  );
}
