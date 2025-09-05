import { CheckCircleIcon, AlertTriangleIcon } from "./Icons";

export const Toast = ({ message, type = "error", onClose }) => {
  if (!message) return null;

  // Determine colors and icon based on type
  const toastStyles = {
    success: {
      border: "border-green-500",
      bg: "bg-white dark:bg-gray-800",
      Icon: CheckCircleIcon,
    },
    error: {
      border: "border-red-500",
      bg: "bg-white dark:bg-gray-800",
      Icon: AlertTriangleIcon,
    },
  };

  const { border, bg, Icon } = toastStyles[type] || toastStyles.success;

  return (
    <div className="fixed top-5 right-5 z-50 transition-transform transform-gpu animate-slide-in-down">
      <div
        className={`rounded-lg shadow-lg p-4 flex items-center space-x-4 border-l-4 ${border} ${bg}`}
      >
        <Icon />
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
