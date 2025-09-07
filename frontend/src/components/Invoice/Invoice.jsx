import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerDetails from "./SellerDetails";
import InvoiceMeta from "./InvoiceMeta";
import InvoiceHeader from "./InvoiceHeader";
import SellerBankDetails from "./SellerBankDetails";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import ShipToDetails from "./ShipToDetails";
import { useToast } from "../../context/ToastContext"; // ✅ use global toast

// --- Utility: Format Date ---
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
  const { showToast } = useToast(); // ✅ use global toast
  const [invoiceData, setInvoiceData] = useState(null);

  // --- Fetch Invoice ---
  const fetchInvoice = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`);
      if (!res.ok) throw new Error("Failed to fetch invoice.");
      const data = await res.json();
      setInvoiceData(data);
    } catch (err) {
      showToast(`Error fetching invoice: ${err.message}`, "error"); // ✅ global toast
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id);
    } else {
      const savedData = localStorage.getItem("invoiceData");
      if (savedData) setInvoiceData(JSON.parse(savedData));
    }
  }, [params.id]);

  // --- Handlers ---
  const handleEdit = () => {
    navigate(`/invoice-form/${params.id}`);
  };

  // --- Loading State ---
  if (!invoiceData) {
    return (
      <div className="text-center p-10 font-semibold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
        Loading invoice data or no data found...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-200 uppercase">
      <div className="max-w-4xl mx-auto">
        <InvoiceHeader
          handleEdit={handleEdit}
          invoice_id={invoiceData.invoice_id}
          status={invoiceData.invoice_status}
          hideSave={true} // always hide save button
        />

        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <header className="text-center mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">
            <p className="text-sm font-semibold">EK TUHI NIRANKAR</p>
            <h1 className="text-xl font-bold uppercase">Tax Invoice</h1>
          </header>

          <main>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <SellerBankDetails data={invoiceData} />
              <InvoiceTotals data={invoiceData} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
