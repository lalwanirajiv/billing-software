import React, { useEffect, useState } from "react";
import { getTopCustomers } from "../../lib/api";

const TopCustomers = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const res = await getTopCustomers();
        setTopCustomers(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch top customers");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCustomers();
  }, []);

  if (loading)
    return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Customers
      </h3>
      <ul className="space-y-4">
        {topCustomers.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data available.</p>
        ) : (
          topCustomers.map((customer, index) => (
            <li
              key={customer.customer_id || index}
              className="flex justify-between items-center"
            >
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {customer.customer_name}
              </p>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                ₹{Number(customer.total_revenue).toLocaleString()}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopCustomers;
