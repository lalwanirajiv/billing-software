import React from "react";
import { Link } from "react-router-dom";
import { EditIcon, DeleteIcon } from "../../Reusables/Icons";

export const InvoiceTable = ({ 
  filteredInvoices, 
  allInvoices, 
  formatDate, 
  onRowClick, 
  onEditClick, 
  onDeleteClick,
  searchTerm,
  dateFilter
}) => {
  if (filteredInvoices.length === 0) {
    return (
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
    );
  }

  return (
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
              onClick={() => onRowClick(invoice.invoice_id)}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
            >
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {allInvoices.findIndex(
                  (i) => i.invoice_id === invoice.invoice_id
                ) + 1}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                {invoice.ship_to}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                {invoice.bill_no}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {formatDate(invoice.date)}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                ₹{Number(invoice.grand_total).toFixed(2)}
              </td>
              <td className="px-6 py-4 font-medium">
                {invoice.invoice_status ? (
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border
  ${
    invoice.invoice_status.toLowerCase() === "paid"
      ? "text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700"
      : invoice.invoice_status.toLowerCase() === "due"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700"
      : invoice.invoice_status.toLowerCase() === "overdue"
      ? "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700"
      : "text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-300 dark:bg-gray-700/30 dark:border-gray-600"
  }`}
                  >
                    {invoice.invoice_status}
                  </span>
                ) : (
                  "N/A"
                )}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span
                    onClick={(e) => onEditClick(e, invoice.invoice_id)}
                    role="button"
                    className="cursor-pointer p-2 rounded-md border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:border-blue-500 transition"
                    title="Edit Invoice"
                  >
                    <EditIcon className="w-4 h-4" />
                  </span>

                  <span
                    onClick={(e) => onDeleteClick(e, invoice)}
                    role="button"
                    className="cursor-pointer p-2 rounded-md border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-500 transition"
                    title="Delete Invoice"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
