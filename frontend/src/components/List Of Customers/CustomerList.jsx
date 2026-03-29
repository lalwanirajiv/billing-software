import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteConfirmationModal } from "./DeleteConfirmationModel";
import { Toast } from "../Reusables/Toast";
import { EditIcon, TrashIcon, SearchIcon } from "../Reusables/Icons";
import { getAllCustomers, deleteCustomer } from "../../lib/api";
import { Calendar, FileDown, FileText, Download, Printer, Users } from "lucide-react";
import { BackButton } from "../Reusables/BackButton";

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });
  
  // Export states
  const [isExporting, setIsExporting] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        setError(err.message);
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const results = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "info" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    const customerId = customerToDelete.customer_id;

    try {
      await deleteCustomer(customerId);

      setCustomers(customers.filter((c) => c.customer_id !== customerId));
      setToast({
        message: `Customer "${customerToDelete.name}" was deleted successfully.`,
        type: "success"
      });
    } catch (err) {
      console.error("Error deleting customer:", err);
      setToast({ message: "Error: Failed to delete customer.", type: "error" });
    } finally {
      handleCloseModal();
    }
  };

  const handleExportCSV = () => {
    try {
      setToast({ message: "Preparing Customer Directory CSV...", type: "info" });
      const headers = ["Customer Name", "Address Line 1", "Address Line 2", "Phone", "GSTIN"];
      const csvRows = [headers.join(",")];

      filteredCustomers.forEach(c => {
        const row = [
          `"${c.name}"`,
          `"${c.address_line1 || ""}"`,
          `"${c.address_line2 || ""}"`,
          c.phone_number || "",
          c.gstin || ""
        ];
        csvRows.push(row.join(","));
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Customer_Directory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToast({ message: "Customer directory exported successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to export CSV.", type: "error" });
    }
  };

  const handleExportPDF = () => {
    setToast({ message: "Generating PDF directory...", type: "info" });
    setExportData(filteredCustomers);
    setIsExportMenuOpen(false);
    setTimeout(() => {
      window.print();
      setExportData([]); // Clear after printing
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 font-semibold text-gray-700 dark:text-gray-300">
        Loading Customers...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="no-print">
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: "", type: "info" })} 
        />

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <BackButton />
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Customers
            </h1>
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex gap-2 relative">
                <button
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="px-4 py-2 border-2 border-slate-200 dark:border-gray-600 text-slate-700 dark:text-gray-200 rounded-lg text-center hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 font-semibold transition-all"
                >
                  <FileDown size={18} /> Export
                </button>
                
                {isExportMenuOpen && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={handleExportCSV}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <Download size={16} className="text-blue-500" /> Excel (CSV)
                    </button>
                    <button 
                      onClick={handleExportPDF}
                      className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                    >
                      <Printer size={16} className="text-blue-500" /> Print PDF
                    </button>
                  </div>
                )}

                <Link
                  to="/create-customer"
                  className="btn-cta-primary whitespace-nowrap"
                >
                  <Users size={20} />
                  <span>Add New Customer</span>
                </Link>
              </div>
            </div>
          </div>

        {/* No customers */}
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
              {searchTerm ? "No Customers Found" : "No Customers Yet"}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm
                ? `Your search for "${searchTerm}" did not return any results.`
                : "Want to add one? "}
              {!searchTerm && (
                <Link
                  to="/create-customer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Create a new customer
                </Link>
              )}
            </p>
          </div>
        ) : (
          // Table wrapper with responsive scroll
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto sm:overflow-x-visible">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    GSTIN
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.customer_id}
                    onClick={() => navigate(`/customer/${customer.customer_id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {customers.findIndex(
                        (c) => c.customer_id === customer.customer_id
                      ) + 1}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
                        {customer.name}
                      </span>
                    </td>

                    {/* Truncated address */}
                    <td className="px-3 py-2 whitespace-nowrap max-w-xs">
                      <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {customer.address_line1
                          ? customer.address_line1.length > 10
                            ? customer.address_line1.slice(0, 10) + "..."
                            : customer.address_line1
                          : ""}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {customer.address_line2
                          ? customer.address_line2.length > 10
                            ? customer.address_line2.slice(0, 10) + "..."
                            : customer.address_line2
                          : ""}
                      </div>
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {customer.phone_number}
                    </td>
                    <td className="px-3 py-2 text-left whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {customer.gstin}
                    </td>

                    {/* Actions: edit/delete */}
                    <td className="px-3 py-2 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-customer/${customer.customer_id}`);
                          }}
                          role="button"
                          className="cursor-pointer p-2 rounded-md border border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:border-indigo-500 transition"
                          title="Edit Customer"
                        >
                          <EditIcon className="w-4 h-4" />
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(customer);
                          }}
                          role="button"
                          className="cursor-pointer p-2 rounded-md border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-400 dark:border-gray-600 dark:text-gray-300 dark:hover:text-red-400 dark:hover:border-red-500 transition"
                          title="Delete Customer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        customerName={customerToDelete ? customerToDelete.name : ""}
      />

      {/* Hidden Print Section for Customer Directory PDF */}
      {exportData.length > 0 && (
        <div className="hidden print:block p-12 bg-white text-black min-h-screen">
          <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-8 mb-10">
            <div className="space-y-2">
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Client Directory</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Official Customer Record Index</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-black text-xs uppercase text-slate-400">Export Date</p>
              <p className="font-black text-xl">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y-2 border-slate-900">
                <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Customer Entity</th>
                <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Primary Contact</th>
                <th className="p-4 text-left font-black uppercase text-[10px] tracking-widest border border-slate-200">Location Details</th>
                <th className="p-4 text-center font-black uppercase text-[10px] tracking-widest border border-slate-200">GSTIN Reference</th>
              </tr>
            </thead>
            <tbody>
              {exportData.map((c, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="p-4 border border-slate-100 font-black text-lg uppercase">{c.name}</td>
                  <td className="p-4 border border-slate-100 text-sm font-bold text-slate-600">{c.phone_number}</td>
                  <td className="p-4 border border-slate-100 text-xs font-bold text-slate-400 leading-relaxed">
                    {c.address_line1}<br/>{c.address_line2}
                  </td>
                  <td className="p-4 border border-slate-100 text-center uppercase text-[10px] font-black">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">{c.gstin || "N/A"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-20 flex justify-between items-end border-t border-slate-100 pt-8 opacity-40">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">Confidential Business Record</p>
              <p className="text-[8px] font-bold text-slate-400 mt-1">Generated via Internal Billing Systems v2.0</p>
            </div>
            <p className="text-xs font-bold text-slate-400">{exportData.length} Registered Entities Listed</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>
    </div>
  );
}
