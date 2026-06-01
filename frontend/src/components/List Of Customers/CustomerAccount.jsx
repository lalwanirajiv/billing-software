import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCustomerById, getInvoicesByCustomerId } from "../../lib/api";
import { useFinancialYear } from "../../context/FinancialYearContext";
import FinancialYearSelector from "../Reusables/FinancialYearSelector";
import { ChevronLeft, User, Phone, MapPin, FileText, IndianRupee, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { BackButton } from "../Reusables/BackButton";

export default function CustomerAccount() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startDate, endDate, label: fyLabel } = useFinancialYear();
  
  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalPaid: 0,
    totalDue: 0,
    invoiceCount: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const customerData = await getCustomerById(id);
      const invoicesData = await getInvoicesByCustomerId(id, startDate, endDate);
      
      setCustomer(customerData);
      setInvoices(invoicesData);
      
      // Calculate stats
      const totalBilled = invoicesData.reduce((acc, inv) => acc + Number(inv.grand_total || 0), 0);
      const totalPaid = invoicesData
        .filter(inv => inv.invoice_status?.toLowerCase() === "paid")
        .reduce((acc, inv) => acc + Number(inv.grand_total || 0), 0);
      const totalDue = totalBilled - totalPaid;
      
      setStats({
        totalBilled,
        totalPaid,
        totalDue,
        invoiceCount: invoicesData.length
      });
    } catch (err) {
      console.error("Error fetching customer data:", err);
      showToast("Failed to load customer details", "error");
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "due":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer not found</h2>
        <button onClick={() => navigate("/customers")} className="mt-4 text-blue-600 hover:underline">
          Back to Customer List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="mb-4 lg:hidden">
          <FinancialYearSelector />
        </div>

        <p className="text-sm font-medium text-brand-primary mb-4">{fyLabel} · Customer account</p>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-3">
             <Link
              to={`/edit-customer/${customer.customer_id}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all font-medium flex items-center gap-2"
            >
              Edit Details
            </Link>
          </div>
        </div>

        {/* Customer Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                    {customer.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 uppercase font-semibold">
                    Customer ID: #{customer.customer_id}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 uppercase">
                      {[customer.address_line1, customer.address_line2].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 uppercase">{customer.phone_number || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GSTIN</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 uppercase">{customer.gstin || "Not Available"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Acct. Active Since</span>
               <span className="text-xs font-black text-gray-600 dark:text-gray-300">{formatDate(customer.created_at)}</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4 transition-transform hover:scale-110">
                  <IndianRupee size={20} />
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Paid amount</p>
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">₹{stats.totalPaid.toLocaleString()}</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 transition-transform hover:scale-110">
                  <Clock size={20} />
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Outstanding Due</p>
              </div>
              <h2 className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-2">₹{stats.totalDue.toLocaleString()}</h2>
            </div>

            <div className="bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl shadow-lg border-none flex flex-col justify-between col-span-1 md:col-span-2 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1 opacity-80">Lifetime Business Value</p>
                <h2 className="text-4xl font-black text-white leading-none">₹{stats.totalBilled.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-blue-200 uppercase font-black tracking-widest">Transactions</span>
                      <span className="text-xl text-white font-black">{stats.invoiceCount}</span>
                   </div>
                   <div className="w-[1px] h-8 bg-blue-500 group-hover:bg-blue-400 transition-colors shadow-blue-500 shadow-sm"></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-blue-200 uppercase font-black tracking-widest">Average Value</span>
                      <span className="text-xl text-white font-black">₹{stats.invoiceCount > 0 ? (stats.totalBilled / stats.invoiceCount).toFixed(0) : 0}</span>
                   </div>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
               <FileText size={20} className="text-blue-500" /> Invoice History
            </h2>
            <Link to="/invoice-form" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
               + Create New
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Bill No</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase text-gray-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic">
                      No transactions recorded for this customer yet.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.invoice_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        {inv.bill_no}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(inv.date)}
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                        ₹{Number(inv.grand_total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(inv.invoice_status)}`}>
                          {inv.invoice_status === 'Paid' && <CheckCircle size={10} />}
                          {inv.invoice_status === 'Due' && <Clock size={10} />}
                          {inv.invoice_status === 'Overdue' && <AlertCircle size={10} />}
                          {inv.invoice_status || 'Due'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/invoice/${inv.invoice_id}`}
                          className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
