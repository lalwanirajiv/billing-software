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
import { getAllInvoices } from "../../lib/api";

const RevenueChart = () => {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const invoices = await getAllInvoices();
        const revenueMap = {};
        invoices.forEach((inv) => {
          const month = new Date(inv.date).toLocaleString("default", {
            month: "short",
          });
          revenueMap[month] =
            (revenueMap[month] || 0) + Number(inv.grand_total);
        });
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const chartData = months.map((month) => ({
          name: month,
          revenue: revenueMap[month] || 0,
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
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RevenueChart;
