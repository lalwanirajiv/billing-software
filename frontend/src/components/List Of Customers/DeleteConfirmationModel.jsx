import { AlertTriangleIcon } from "../Reusables/Icons";
export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 m-4 max-w-md w-full transform transition-all">
        <div className="flex flex-col items-center text-center">
          <AlertTriangleIcon />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
            Are you sure?
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Do you really want to delete the customer "{customerName}"? This
            action cannot be undone.
          </p>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
