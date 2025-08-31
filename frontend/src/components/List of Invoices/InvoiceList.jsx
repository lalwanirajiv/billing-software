import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

// --- SVG Icon Components ---
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// --- Child Components ---
const Toast = ({ message, onClose }) => {
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

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, billNo }) => {
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
            Are you sure you want to delete Invoice #{billNo}? This action
            cannot be undone.
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

// --- Main InvoiceList Component ---
export default function InvoiceList() {
  const navigate = useNavigate(); // Hook for navigation
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/invoices");
        if (!res.ok) throw new Error("Failed to fetch data.");
        const invoicesData = await res.json();
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const results = invoices.filter((invoice) => {
      const searchTermMatch =
        (invoice.ship_to &&
          invoice.ship_to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.bill_no && invoice.bill_no.toString().includes(searchTerm)) ||
        (invoice.grand_total &&
          invoice.grand_total.toString().includes(searchTerm));
      const dateFilterMatch = dateFilter
        ? invoice.date && invoice.date.startsWith(dateFilter)
        : true;
      return searchTermMatch && dateFilterMatch;
    });
    setFilteredInvoices(results);
  }, [searchTerm, dateFilter, invoices]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleRowClick = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  const handleDeleteClick = (e, invoice) => {
    e.stopPropagation(); // Prevent row click from firing
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/invoices/${invoiceToDelete.invoice_id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete invoice");
      setInvoices(
        invoices.filter((i) => i.invoice_id !== invoiceToDelete.invoice_id)
      );
      setToastMessage(
        `Invoice #${invoiceToDelete.bill_no} was deleted successfully.`
      );
    } catch (err) {
      setToastMessage("Error: Failed to delete invoice.");
    } finally {
      handleCloseModal();
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading Invoices...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Invoices
          </h1>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link
              to="/invoice-form"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
            >
              Add New Invoice
            </Link>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              No Invoices Found
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm || dateFilter
                ? `Your search did not return any results.`
                : "Want to add one? "}
              {!(searchTerm || dateFilter) && (
                <Link
                  to="/invoice-form"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create a new invoice
                </Link>
              )}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Bill No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Bill Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.invoice_id}
                    onClick={() => handleRowClick(invoice.invoice_id)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {invoices.findIndex(
                        (i) => i.invoice_id === invoice.invoice_id
                      ) + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {invoice.ship_to}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {invoice.bill_no}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      ₹{Number(invoice.grand_total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(invoice.invoice_id);
                          }}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, invoice)}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        billNo={invoiceToDelete?.bill_no}
      />
    </div>
  );
}
