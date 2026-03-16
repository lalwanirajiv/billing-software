import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "../Reusables/Toast";
import { getAllInvoices, deleteInvoice, getDetailedInvoicesByDate } from "../../lib/api";

// Sub-components
import { InvoiceListHeader } from "./subcomponents/InvoiceListHeader";
import { InvoiceTable } from "./subcomponents/InvoiceTable";
import { ExportModal } from "./subcomponents/ExportModal";
import { DeleteInvoiceModal } from "./subcomponents/DeleteInvoiceModal";
import { InvoiceAuditReport } from "./subcomponents/InvoiceAuditReport";

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });
  
  // Export states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesData = await getAllInvoices();
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const results = invoices.filter((invoice) => {
      const searchTermMatch =
        (invoice.ship_to &&
          invoice.ship_to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (invoice.bill_no && invoice.bill_no.toString().includes(searchTerm)) ||
        (invoice.grand_total &&
          invoice.grand_total.toString().includes(searchTerm));
      const dateFilterMatch = dateFilter
        ? invoice.date && invoice.date.startsWith(dateFilter)
        : true;
      return searchTermMatch && dateFilterMatch;
    });
    setFilteredInvoices(results);
  }, [searchTerm, dateFilter, invoices]);

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "info" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const handleRowClick = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  const handleDeleteClick = (e, invoice) => {
    e.stopPropagation();
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (e, invoiceId) => {
    e.stopPropagation();
    navigate(`/invoice-form/${invoiceId}`);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    try {
      await deleteInvoice(invoiceToDelete.invoice_id);
      setInvoices(invoices.filter((i) => i.invoice_id !== invoiceToDelete.invoice_id));
      setToast({
        message: `Invoice #${invoiceToDelete.bill_no} was deleted successfully.`,
        type: "success"
      });
    } catch (err) {
      setToast({ message: "Error: Failed to delete invoice.", type: "error" });
    } finally {
      handleCloseModal();
    }
  };

  const handleExportCSV = async (start, end) => {
    try {
      setToast({ message: "Preparing CSV export...", type: "info" });
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        setToast({ message: "No invoices found for the selected range.", type: "error" });
        return;
      }

      // Sort by Bill Number
      data.sort((a, b) => {
        const numA = parseFloat(a.bill_no) || 0;
        const numB = parseFloat(b.bill_no) || 0;
        return numA - numB;
      });

      const headers = ["Bill No", "Date", "Customer", "GSTIN", "Terms", "Subtotal", "CGST", "SGST", "IGST", "Grand Total", "Status"];
      const csvRows = [headers.join(",")];

      data.forEach(inv => {
        const row = [
          inv.bill_no,
          inv.date || "N/A",
          `"${inv.customer_name || inv.ship_to}"`,
          inv.customer_gstin || "N/A",
          `"${inv.terms_of_payment || ""}"`,
          inv.sub_total || 0,
          inv.cgst || 0,
          inv.sgst || 0,
          inv.igst || 0,
          inv.grand_total || 0,
          inv.invoice_status || "Due"
        ];
        csvRows.push(row.join(","));
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Invoices_Export_${start || "All"}_to_${end || "Now"}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToast({ message: "CSV exported successfully!", type: "success" });
      setIsExportModalOpen(false);
    } catch (err) {
      setToast({ message: "Failed to export CSV.", type: "error" });
    }
  };

  const handleExportPDF = async (start, end) => {
    try {
      setToast({ message: "Generating PDF preview...", type: "info" });
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        setToast({ message: "No invoices found for the selected range.", type: "error" });
        return;
      }
      setExportData(data.sort((a, b) => {
        const numA = parseFloat(a.bill_no) || 0;
        const numB = parseFloat(b.bill_no) || 0;
        return numA - numB;
      }));
      setIsExportModalOpen(false);
      // Wait for React to render the hidden print section
      setTimeout(() => {
        window.print();
        setExportData([]); // Clear after printing
      }, 500);
    } catch (err) {
      setToast({ message: "Failed to generate PDF.", type: "error" });
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading Invoices...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="no-print">
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ message: "", type: "info" })} 
        />
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <InvoiceListHeader 
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onExportClick={() => setIsExportModalOpen(true)}
          />

          <InvoiceTable 
            filteredInvoices={filteredInvoices}
            allInvoices={invoices}
            formatDate={formatDate}
            onRowClick={handleRowClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            searchTerm={searchTerm}
            dateFilter={dateFilter}
          />
        </div>

        <DeleteInvoiceModal 
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          billNo={invoiceToDelete?.bill_no}
        />

        <ExportModal 
          isOpen={isExportModalOpen} 
          onClose={() => setIsExportModalOpen(false)} 
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
        />
      </div>

      <InvoiceAuditReport exportData={exportData} formatDate={formatDate} />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { margin: 2cm; }
        }
      `}</style>
    </div>
  );
}
