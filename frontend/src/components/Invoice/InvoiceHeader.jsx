import React, { useState, useRef, useEffect } from "react";
import { AppleIcon, Check, ChevronDown } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { updateStatus } from "../../lib/api";
import { logger } from "../../lib/logger";

const StatusDropdown = ({ status, invoiceId, onStatusUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentStatusValue, setCurrentStatusValue] = useState(status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentStatusValue(status);
  }, [status]);

  const statuses = [
    {
      value: "Paid",
      color:
        "text-grey-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50",
    },
    {
      value: "Due",
      color:
        "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/50",
    },
    {
      value: "Overdue",
      color: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50",
    },
  ];

  const currentStatus =
    statuses.find(
      (s) => s.value.toLowerCase() === currentStatusValue?.toLowerCase()
    ) || statuses[1];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = async (newStatus) => {
    if (newStatus === currentStatusValue) {
      return;
    }

    setCurrentStatusValue(newStatus);
    setIsOpen(false);
    setLoading(true);

    try {
      await updateStatus(invoiceId, newStatus);
      onStatusUpdated(`Status updated to "${newStatus}"`, "success", newStatus);
    } catch (err) {
      logger.error("Failed to update invoice status", err);
      onStatusUpdated("Failed to update status", "error");
      setCurrentStatusValue(status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
          currentStatus.color
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        <span>{currentStatus.value}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && !loading && (
        <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          {statuses.map((s) => {
            const isActive = currentStatus.value === s.value;
            return (
              <button
                key={s.value}
                onClick={() => handleStatusSelect(s.value)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md
            bg-white text-gray-800 
            hover:bg-gray-100 
            dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
            ${isActive ? "font-semibold bg-gray-50 dark:bg-gray-700/50" : ""}`}
              >
                <span>{s.value}</span>
                {isActive && (
                  <Check className={`h-4 w-4 ${s.color.split(" ")[0]}`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InvoiceHeader = ({
  handleSave,
  handleEdit,
  isSaving,
  hideSave,
  status,
  invoice_id,
  handleSavePDF,
}) => {
  const { showToast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusUpdated = (message, type, updatedStatus) => {
    showToast(message, type);
    if (updatedStatus) {
      setCurrentStatus(updatedStatus);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Invoice
        </h1>
        {hideSave && (
          <StatusDropdown
            status={currentStatus}
            invoiceId={invoice_id}
            onStatusUpdated={handleStatusUpdated}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        {!hideSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`font-medium text-sm px-4 py-2 rounded-md transition-colors ${
              isSaving
                ? "text-gray-500 bg-gray-200 cursor-not-allowed"
                : "text-white bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Invoice"}
          </button>
        )}
        <button
          onClick={handleEdit}
          className="font-medium text-sm px-4 py-2 rounded-md transition-colors text-white bg-yellow-500 hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={handlePrint}
          className="font-medium text-sm px-4 py-2 rounded-md transition-colors text-white bg-blue-600 hover:bg-blue-700"
        >
          Print
        </button>
        {hideSave && (
          <button
            onClick={handleSavePDF}
            className="font-medium text-sm px-4 py-2 rounded-md transition-colors text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceHeader;
