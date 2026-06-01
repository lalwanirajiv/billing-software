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
import { getRevenueTimeline } from "../../lib/api";

const RevenueChart = () => {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await getRevenueTimeline();
        const chartData = (res.data || []).map(item => ({
          name: new Date(item.month + "-01").toLocaleString("default", { month: "short" }),
          revenue: item.revenue
        }));

        setMonthlyRevenueData(chartData);
      } catch (err) {
        console.error("Error fetching revenue timeline:", err);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Revenue Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenueData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#f3f4f6", fontSize: "14px", fontWeight: "900" }}
            labelStyle={{ color: "#9ca3af", marginBottom: "4px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
            cursor={{ fill: 'rgba(79, 70, 229, 0.03)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RevenueChart;
