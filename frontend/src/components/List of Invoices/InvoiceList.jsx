import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { getAllInvoices, deleteInvoice, deleteInvoicesBulk, getDetailedInvoicesByDate } from "../../lib/api";

// Sub-components
import { InvoiceListHeader } from "./subcomponents/InvoiceListHeader";
import { InvoiceTable } from "./subcomponents/InvoiceTable";
import { ExportModal } from "./subcomponents/ExportModal";
import { DeleteInvoiceModal } from "./subcomponents/DeleteInvoiceModal";
import { InvoiceAuditReport } from "./subcomponents/InvoiceAuditReport";
import { BackButton } from "../Reusables/BackButton";

export default function InvoiceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
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
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    if (statusParam) {
      const validStatuses = ["Paid", "Due", "Overdue"];
      // Normalize to Title Case for matching the component state
      const normalizedStatus = statusParam.charAt(0).toUpperCase() + statusParam.slice(1).toLowerCase();
      if (validStatuses.includes(normalizedStatus)) {
        setStatusFilter(normalizedStatus);
      }
    }
  }, [location.search]);

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
      const statusFilterMatch =
        statusFilter === "All" ||
        (invoice.invoice_status &&
          invoice.invoice_status.toLowerCase() === statusFilter.toLowerCase());
      return searchTermMatch && dateFilterMatch && statusFilterMatch;
    });
    setFilteredInvoices(results);
  }, [searchTerm, dateFilter, statusFilter, invoices]);

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
    setIsBulkDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      if (selectedInvoices.length === 0) return;
      try {
        await deleteInvoicesBulk(selectedInvoices);
        setInvoices(invoices.filter((i) => !selectedInvoices.includes(i.invoice_id)));
        showToast(`${selectedInvoices.length} invoices were deleted successfully.`, "success");
        setSelectedInvoices([]);
      } catch {
        showToast("Error: Failed to delete invoices.", "error");
      } finally {
        handleCloseModal();
      }
      return;
    }

    if (!invoiceToDelete) return;
    try {
      await deleteInvoice(invoiceToDelete.invoice_id);
      setInvoices(invoices.filter((i) => i.invoice_id !== invoiceToDelete.invoice_id));
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceToDelete.invoice_id));
      showToast(`Invoice #${invoiceToDelete.bill_no} was deleted successfully.`, "success");
    } catch {
      showToast("Error: Failed to delete invoice.", "error");
    } finally {
      handleCloseModal();
    }
  };

  const handleToggleSelect = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId) 
        : [...prev, invoiceId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.invoice_id));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedInvoices.length > 0) {
      setIsBulkDelete(true);
      setIsDeleteModalOpen(true);
    }
  };

  const handleExportCSV = async (start, end) => {
    try {
      showToast("Preparing CSV export...", "info");
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        showToast("No invoices found for the selected range.", "error");
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
      
      showToast("CSV exported successfully!", "success");
      setIsExportModalOpen(false);
    } catch {
      showToast("Failed to export CSV.", "error");
    }
  };

  const handleExportPDF = async (start, end) => {
    try {
      showToast("Generating PDF preview...", "info");
      const { data } = await getDetailedInvoicesByDate(start, end);
      if (data.length === 0) {
        showToast("No invoices found for the selected range.", "error");
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
    } catch {
      showToast("Failed to generate PDF.", "error");
    }
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading Invoices...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <div className="no-print">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <BackButton />
          <InvoiceListHeader 
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onExportClick={() => setIsExportModalOpen(true)}
            selectedCount={selectedInvoices.length}
            onBulkDelete={handleBulkDeleteClick}
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
            selectedInvoices={selectedInvoices}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        </div>

        <DeleteInvoiceModal 
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          billNo={isBulkDelete ? `${selectedInvoices.length} selected` : invoiceToDelete?.bill_no}
          isBulk={isBulkDelete}
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
