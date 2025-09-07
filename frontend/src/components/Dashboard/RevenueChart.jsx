import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

const RevenueChart = () => {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/invoices"); // replace with your API URL
        const invoices = res.data;
        const revenueMap = {};
        invoices.forEach((inv) => {
          const month = new Date(inv.date).toLocaleString("default", {
            month: "short",
          });
          revenueMap[month] = (revenueMap[month] || 0) + inv.grand_total;
        });

        const chartData = Object.keys(revenueMap).map((month) => ({
          name: month,
          revenue: revenueMap[month],
        }));

        setMonthlyRevenueData(chartData);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RevenueChart;
