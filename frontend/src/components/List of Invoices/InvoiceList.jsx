import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DeleteIcon,
  AlertTriangleIcon,
  EditIcon,
  SearchIcon,
} from "../Reusables/Icons";
import { Toast } from "../Reusables/Toast";

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
            Are you sure you want to delete Invoice number: {billNo}? This
            action cannot be undone.
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                    Status
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
                    <td className="px-6 py-4 font-medium">
                      {invoice.invoice_status ? (
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold
        ${
          invoice.invoice_status.toLowerCase() === "paid"
            ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50"
            : invoice.invoice_status.toLowerCase() === "due"
            ? "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50"
            : invoice.invoice_status.toLowerCase() === "overdue"
            ? "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50"
            : "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/50"
        }`}
                        >
                          {invoice.invoice_status}
                        </span>
                      ) : (
                        "N/A"
                      )}
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
