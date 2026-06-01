import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentInvoices } from "../../lib/api";

const RecentInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getRecentInvoices();
        setInvoices(res.data || []); // Use raw array
      } catch (err) {
        setError(err.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
    }
  };

  if (loading)
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Invoices
        </h3>
        {invoices.length > 0 && (
          <Link
            to="/invoices"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All
          </Link>
        )}
      </div>
      <ul className="space-y-4">
        {invoices.map((invoice) => (
          <li
            key={invoice.invoice_id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {invoice.customer_name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bill #{invoice.bill_no} | ₹
                {Number(invoice.grand_total).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                invoice.invoice_status
              )}`}
            >
              {invoice.invoice_status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentInvoices;
