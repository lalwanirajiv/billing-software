import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import axios from "axios";
import { Toast } from "../Reusables/Toast"; // Import existing Toast

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
        "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50",
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusSelect = async (newStatus) => {
    setCurrentStatusValue(newStatus);
    setIsOpen(false);
    setLoading(true);

    try {
      if (newStatus == status) {
        return;
      }
      const res = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.statusText}`);
      }

      onStatusUpdated(`Status updated to "${newStatus}"`, "success"); // show success toast
    } catch (err) {
      console.error("Error updating status:", err);
      onStatusUpdated("Failed to update status", "error"); // show error toast
      setCurrentStatusValue(status); // revert previous value on failure
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
        <div className="absolute mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusSelect(s.value)}
              className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span>{s.value}</span>
              {currentStatus.value === s.value && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </button>
          ))}
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
}) => {
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // success or error
  console.log("This is Invoice ID and Status ", invoice_id, status);

  const handleStatusUpdated = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Invoice
          </h1>
          {hideSave && (
            <StatusDropdown
              status={status}
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
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </>
  );
};

export default InvoiceHeader;
