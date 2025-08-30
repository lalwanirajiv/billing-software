import { CheckCircleIcon } from "../Icons/Icons";
export const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 transition-transform transform-gpu animate-slide-in-down">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-4 border-l-4 border-green-500">
        <CheckCircleIcon />
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {message}
        </p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
