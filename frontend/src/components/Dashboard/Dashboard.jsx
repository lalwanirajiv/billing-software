import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, Users, Clock, FileText } from "lucide-react";
import StatCard from "./StatCard";
import TopCustomers from "./TopCustomers";
import InvoiceStatusChart from "./InvoiceStatusChart";
import RevenueChart from "./RevenueChart";
import RecentInvoices from "./RecentInvoices";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");
        setStats(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen flex justify-center items-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-slate-900 min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

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

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${Number(stats.totalRevenue).toLocaleString()}`}
            icon={DollarSign}
            change={`${stats.totalRevenueChange}%`}
            changeType={stats.totalRevenueChange >= 0 ? "positive" : "negative"}
          />
          <StatCard
            title="Overdue Amount"
            value={`₹${Number(stats.overdueAmount).toLocaleString()}`}
            icon={Clock}
            change={`${stats.overdueAmountChange}%`}
            changeType={
              stats.overdueAmountChange >= 0 ? "positive" : "negative"
            }
          />
          <StatCard
            title="Invoices Due"
            value={stats.invoicesDue}
            icon={FileText}
            change={null}
            changeType={null}
          />

          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            change={`${stats.totalCustomersChange}`}
            changeType={
              stats.totalCustomersChange >= 0 ? "positive" : "negative"
            }
          />

          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <RecentInvoices data={recentInvoices} />
          </div>
          <div className="lg:col-span-2">
            <InvoiceStatusChart />
          </div>
          <div className="lg:col-span-2">
            <TopCustomers data={topCustomers} />
          </div>
        </div>
      </div>
    </div>
  );
}
