import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  Clock,
  FileText,
} from "lucide-react";

// --- Placeholder Data (Replace with API data later) ---

const monthlyRevenueData = [
  { name: "Mar", revenue: 2400 },
  { name: "Apr", revenue: 1398 },
  { name: "May", revenue: 9800 },
  { name: "Jun", revenue: 3908 },
  { name: "Jul", revenue: 4800 },
  { name: "Aug", revenue: 3800 },
  { name: "Sep", revenue: 4300 },
];

const invoiceStatusData = [
  { name: "Paid", value: 400 },
  { name: "Overdue", value: 85 },
  { name: "Due", value: 120 },
];

const COLORS = ["#4ade80", "#f87171", "#fbbf24"]; // Green, Red, Amber

const recentInvoicesData = [
  { id: 1, customer: "Ashok Kumar", amount: "5,000", status: "Paid" },
  { id: 2, customer: "Bhavika Saree", amount: "2,500", status: "Due" },
  { id: 3, customer: "Rahul Test", amount: "10,000", status: "Overdue" },
  { id: 4, customer: "Asha Readymade", amount: "1,750", status: "Paid" },
  { id: 5, customer: "Anuroop Stores", amount: "3,200", status: "Due" },
];

const topCustomersData = [
  { id: 1, name: "Rahul Sharma", revenue: "25,000" },
  { id: 2, name: "Kamlesh Kumar", revenue: "18,000" },
  { id: 3, name: "Evergreen Center", revenue: "15,500" },
  { id: 4, name: "Ashapura Store", revenue: "12,000" },
];

// --- Reusable Child Components for the Dashboard ---

// 1. StatCard Component
const StatCard = ({ title, value, icon, change, changeType }) => {
  const Icon = icon;
  const isPositive = changeType === "positive";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {title}
        </span>
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {value}
        </h3>
        <div
          className={`mt-1 flex items-center text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span>{change}</span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
};

// 2. RevenueChart Component
const RevenueChart = () => (
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

// 3. InvoiceStatusChart Component
const InvoiceStatusChart = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Invoice Status
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={invoiceStatusData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
        >
          {invoiceStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// 4. RecentInvoices Component
const RecentInvoices = () => {
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
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Invoices
        </h3>
        <Link
          to="/invoices"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>
      <ul className="space-y-4">
        {recentInvoicesData.map((invoice) => (
          <li key={invoice.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {invoice.customer}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ₹{invoice.amount}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 5. TopCustomers Component
const TopCustomers = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Top Customers
    </h3>
    <ul className="space-y-4">
      {topCustomersData.map((customer) => (
        <li key={customer.id} className="flex justify-between items-center">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {customer.name}
          </p>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            ₹{customer.revenue}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Dashboard Component ---

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link
              to="/invoice-form"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create Invoice
            </Link>
            <Link
              to="/create-customer"
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
            >
              Add Customer
            </Link>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat Cards */}
          <StatCard
            title="Total Revenue"
            value="₹1,50,000"
            icon={DollarSign}
            change="+5.2%"
            changeType="positive"
          />
          <StatCard
            title="Overdue Amount"
            value="₹25,000"
            icon={Clock}
            change="-1.8%"
            changeType="negative"
          />
          <StatCard
            title="Invoices Due"
            value="5"
            icon={FileText}
            change="+3"
            changeType="positive"
          />
          <StatCard
            title="Total Customers"
            value="120"
            icon={Users}
            change="+12"
            changeType="positive"
          />

          {/* Charts and Lists */}
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <RecentInvoices />
          </div>
          <div className="lg:col-span-2">
            <InvoiceStatusChart />
          </div>
          <div className="lg:col-span-2">
            <TopCustomers />
          </div>
        </div>
      </div>
    </div>
  );
}
