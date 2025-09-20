// InvoiceStatusChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4ade80", "#f87171", "#fbbf24"]; // Paid: green, Overdue: red, Due: amber
const API_URL = import.meta.env.VITE_API_URL;

const InvoiceStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      try {
        const res = await axios.get(
          API_URL+"/api/stats/invoice-status"
        );
        // API already returns [{ name, value }]
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch invoice status:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceStatus();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Invoice Status
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Invoice Status
        </h3>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Invoice Status
        </h3>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Invoice Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvoiceStatusChart;
