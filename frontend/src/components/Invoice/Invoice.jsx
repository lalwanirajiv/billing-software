import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerDetails from "./SellerDetails";
import InvoiceMeta from "./InvoiceMeta";
import InvoiceHeader from "./InvoiceHeader";
import SellerBankDetails from "./SellerBankDetails";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import ShipToDetails from "./ShipToDetails";
import { useToast } from "../../context/ToastContext";
import { getInvoiceById } from "../../lib/api";
import html2pdf from "html2pdf.js";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { BackButton } from "../Reusables/BackButton";

// Custom styles for PDF generation to ensure single-page and premium look
const pdfStyles = `
  @media print {
    #print-section {
      padding: 0.5cm !important;
      margin: 0 !important;
      border: none !important;
      box-shadow: none !important;
    }
    .max-w-4xl { max-width: 100% !important; margin: 0 !important; }
  }
`;

const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Invoice() {
  const navigate = useNavigate();
  const params = useParams();
  const { showToast } = useToast();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  const fetchInvoice = useCallback(async (id) => {
    if (!id || id === "undefined") {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getInvoiceById(id);
      setInvoiceData(data);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      showToast(`Error fetching invoice: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id);
      return;
    }
    setLoading(false);
    navigate("/invoices", { replace: true });
  }, [params.id, fetchInvoice, navigate]);

  // --- Handlers ---
  const handleEdit = () => {
    if (params.id) {
      navigate(`/invoice-form/${params.id}`);
    } else if (invoiceData?.invoice_id) {
      navigate(`/invoice-form/${invoiceData.invoice_id}`);
    }
  };

  // ✅ SIMPLIFIED PRINT HANDLER
  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    if (!invoiceData) {
      showToast("No invoice data found to save.", "error");
      return;
    }

    try {
      const name = invoiceData.customer_name || invoiceData.ship_to || "Customer";
      const billNo = invoiceData.bill_no || "NA";
      
      // Calculate Financial Year from invoice date
      let fyPrefix = "";
      if (invoiceData.date) {
        const invDate = new Date(invoiceData.date);
        const invMonth = invDate.getMonth() + 1;
        const invYear = invDate.getFullYear();
        const fyStartYear = invMonth >= 4 ? invYear : invYear - 1;
        const fyEndYear = fyStartYear + 1;
        fyPrefix = `${fyStartYear}-${fyEndYear}`;
      }

      // Check if billNo already contains formatting, otherwise add FY prefix
      const displayBillNo = billNo.includes('_') ? billNo : `${fyPrefix}_${billNo}`;
      const fileName = `${displayBillNo}_${name}.pdf`;

      showToast("Preparing single-page PDF...", "info");

      const element = document.getElementById('print-section');
      if (!element) {
        throw new Error("Required content (#print-section) not found.");
      }

      // 1. Apply PDF-specific styles temporarily
      const styleTag = document.createElement('style');
      styleTag.innerHTML = pdfStyles;
      document.head.appendChild(styleTag);

      const h2p = (typeof html2pdf === 'function') ? html2pdf : (html2pdf.default || html2pdf);

      const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 3, // higher scale for better font rendering
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' } // Strongly avoid page breaks
      };

      try {
        const defaultDirPath = localStorage.getItem("pdf-save-path");
        let filePath = "";

        if (defaultDirPath) {
          // If a default folder is set, auto-construct the path
          // Check if path ends with slash to avoid double slashes
          const separator = defaultDirPath.includes("/") ? "/" : "\\";
          filePath = defaultDirPath.endsWith(separator) 
            ? `${defaultDirPath}${fileName}` 
            : `${defaultDirPath}${separator}${fileName}`;
          
          showToast(`Saving to default folder: ${defaultDirPath}`, "info");
        } else {
          // Fallback to manual save dialog
          filePath = await save({
            filters: [{ name: 'PDF', extensions: ['pdf'] }],
            defaultPath: fileName
          });
        }

        if (filePath) {
          showToast("Generating PDF content...", "info");
          // Generate blob then write via FS
          const pdfBlob = await h2p().set(opt).from(element).output('blob');
          const arrayBuffer = await pdfBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          await writeFile(filePath, uint8Array);
          showToast("PDF saved to your chosen location!", "success");
        } else {
          // User cancelled dialog
          showToast("Save cancelled", "info");
        }
      } catch (tauriErr) {
        console.warn("Tauri native save failed, falling back to browser download:", tauriErr);
        // Fallback to browser download if plugin is missing/failing
        await h2p().set(opt).from(element).save();
        showToast("PDF downloaded to your default folder.", "success");
      } finally {
        // 2. Clean up temporary styles
        document.head.removeChild(styleTag);
      }
    } catch (err) {
      console.error("PDF Final Error:", err);
      showToast(`Failed to save PDF: ${err.message}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
        Loading invoice data...
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="text-center p-10 font-semibold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
        No invoice data found.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-200 uppercase">
      <div className="max-w-4xl mx-auto">
        <div className="no-print">
          <BackButton />
          <InvoiceHeader
            handleEdit={handleEdit}
            invoice_id={invoiceData.invoice_id}
            status={invoiceData.invoice_status}
            hideSave={true}
            handlePrint={handlePrint}
            handleSavePDF={handleSavePDF}
          />
        </div>

        {/* ✅ Added id="print-section" */}
        <div
          id="print-section"
          className="bg-white dark:bg-gray-800 p-4 sm:p-5 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg"
          ref={printRef}
        >
          <header className="text-center mb-3 border-b pb-1.5 border-gray-300 dark:border-gray-600">
            <p className="text-[10px] font-semibold">EK TUHI NIRANKAR</p>
            <h1 className="text-lg font-bold uppercase">Tax Invoice</h1>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <ShipToDetails data={invoiceData} />
              <SellerDetails />
            </div>

            <InvoiceMeta
              data={{
                ...invoiceData,
                date: formatDateToDDMMYYYY(invoiceData.date),
              }}
            />
            <InvoiceItemsTable data={invoiceData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
              <SellerBankDetails data={invoiceData} />
              <InvoiceTotals data={invoiceData} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
