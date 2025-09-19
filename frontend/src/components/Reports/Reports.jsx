import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Printer,
  FileDown,
  TrendingUp,
  FileText,
  IndianRupee,
  Calendar,
} from "lucide-react";

// --- Placeholder Data (Replace with API data later) ---
const salesReportData = [
  {
    date: "2025-08-01",
    invoice: 101,
    customer: "Ashok Kumar",
    amount: 5000,
    tax: 250,
  },
  {
    date: "2025-08-02",
    invoice: 102,
    customer: "Bhavika Saree",
    amount: 2500,
    tax: 125,
  },
  {
    date: "2025-08-05",
    invoice: 103,
    customer: "Rahul Test",
    amount: 10000,
    tax: 500,
  },
  {
    date: "2025-08-08",
    invoice: 104,
    customer: "Asha Readymade",
    amount: 1750,
    tax: 87.5,
  },
  {
    date: "2025-08-12",
    invoice: 105,
    customer: "Anuroop Stores",
    amount: 3200,
    tax: 160,
  },
  {
    date: "2025-08-15",
    invoice: 106,
    customer: "Rahul Sharma",
    amount: 8000,
    tax: 400,
  },
  {
    date: "2025-08-20",
    invoice: 107,
    customer: "Kamlesh Kumar",
    amount: 6500,
    tax: 325,
  },
  {
    date: "2025-08-25",
    invoice: 108,
    customer: "Evergreen Center",
    amount: 4800,
    tax: 240,
  },
];

const chartData = [
  { name: "Week 1", sales: 7500 },
  { name: "Week 2", sales: 4950 },
  { name: "Week 3", sales: 14500 },
  { name: "Week 4", sales: 11300 },
];

// --- Reusable Child Components for the Reports Page ---
const ReportStatCard = ({ title, value, icon }) => {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Reports Component ---
export default function Reports() {
  const [reportType, setReportType] = useState("salesSummary");
  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-08-31");

  // Placeholder functions for actions
  const handleGenerateReport = () => {
    console.log(
      `Generating ${reportType} report from ${startDate} to ${endDate}`
    );
  };

  const handleExport = () => {
    console.log("Exporting report to CSV...");
  };

  const handlePrint = () => {
    console.log("Printing report...");
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 1. Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            >
              <FileDown className="h-4 w-4" />
              Export to CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* 2. Filter Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="reportType" className="sr-only">
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              <option value="salesSummary">Sales Summary</option>
              <option value="customerReport">Top Customers</option>
              <option value="taxReport">Tax Summary</option>
            </select>
          </div>

          {/* Start Date with Calendar */}
          {/* Start Date with Calendar */}
          <div className="w-full sm:w-auto">
            <label htmlFor="startDate" className="sr-only">
              Start Date
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-100 
               border-gray-300 dark:border-gray-600 
               focus:ring-2 focus:ring-blue-500 
               appearance-none 
               [&::-webkit-calendar-picker-indicator]:opacity-0 
               [&::-webkit-calendar-picker-indicator]:absolute 
               [&::-webkit-calendar-picker-indicator]:inset-0 
               [&::-webkit-calendar-picker-indicator]:w-full 
               [&::-webkit-calendar-picker-indicator]:h-full 
               [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
               text-gray-500 dark:text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          {/* End Date with Calendar */}
          <div className="w-full sm:w-auto">
            <label htmlFor="endDate" className="sr-only">
              End Date
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
               text-gray-900 dark:text-gray-100 
               border-gray-300 dark:border-gray-600 
               focus:ring-2 focus:ring-blue-500 
               appearance-none 
               [&::-webkit-calendar-picker-indicator]:opacity-0 
               [&::-webkit-calendar-picker-indicator]:absolute 
               [&::-webkit-calendar-picker-indicator]:inset-0 
               [&::-webkit-calendar-picker-indicator]:w-full 
               [&::-webkit-calendar-picker-indicator]:h-full 
               [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 
               text-gray-500 dark:text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
        </div>

        {/* 3. Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ReportStatCard
            title="Total Sales"
            value="₹41,750"
            icon={TrendingUp}
          />
          <ReportStatCard title="Total Invoices" value="8" icon={FileText} />
          <ReportStatCard
            title="Taxes Collected"
            value="₹2,087.50"
            icon={IndianRupee}
          />
        </div>

        {/* 4. Data Visualization Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Revenue (August 2025)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                cursor={{ fill: "rgba(60, 130, 246, 0.1)" }}
              />
              <Bar dataKey="sales" fill="#3b82f6" name="Sales (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Detailed Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Tax
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {salesReportData.map((row) => (
                <tr
                  key={row.invoice}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {row.invoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {row.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    ₹{row.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    ₹{row.tax.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
