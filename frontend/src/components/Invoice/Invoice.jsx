import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SellerDetails from "./SellerDetails";
import InvoiceMeta from "./InvoiceMeta";
import InvoiceHeader from "./InvoiceHeader";
import SellerBankDetails from "./SellerBankDetails";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import ShipToDetails from "./ShipToDetails";
import { Toast } from "../List Of Customers/Toast";

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

  const [invoiceData, setInvoiceData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // --- Load Data from localStorage (invoice draft) ---
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData) setInvoiceData(JSON.parse(savedData));
  }, []);

  // --- Auto-hide Toast ---
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Handlers ---
  const handleEdit = () => navigate("/invoice-form");

  const handleSave = async () => {
    if (!invoiceData) return;
    setIsSaving(true);
    setToast({ message: "", type: "" });

    try {
      // 1. Check for duplicate bill number
      const checkResponse = await fetch(
        `http://localhost:5000/api/invoices/check/${invoiceData.billNo}`
      );
      if (checkResponse.ok) {
        const { exists } = await checkResponse.json();
        if (exists) {
          throw new Error(
            `Invoice with Bill Number #${invoiceData.billNo} already exists.`
          );
        }
      } else {
        throw new Error("Could not verify bill number uniqueness.");
      }

      // 2. Prepare & Save Invoice
      const invoicePayload = {
        customer_id: invoiceData.customerId,
        ship_to: invoiceData.shipTo,
        bill_no: Number(invoiceData.billNo),
        date: invoiceData.date,
        terms_of_payment: invoiceData.terms,
        state: invoiceData.state,
        grand_total: invoiceData.roundedTotal,
        created_at: new Date().toISOString(),
      };

      const invoiceResponse = await fetch(
        "http://localhost:5000/api/invoices",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invoicePayload),
        }
      );

      if (!invoiceResponse.ok) {
        const errorText = await invoiceResponse.text();
        throw new Error(`Failed to save invoice. Server: ${errorText}`);
      }

      const savedInvoice = await invoiceResponse.json();
      const invoiceId =
        savedInvoice.invoiceId || savedInvoice.invoice_id || savedInvoice.id;

      if (!invoiceId) throw new Error("Invoice ID missing in response");

      // 3. Save Items
      for (const item of invoiceData.items) {
        const itemPayload = {
          invoice_id: invoiceId,
          item_name: item.name,
          quantity: item.qty,
          price: item.rate,
          total: item.amount,
        };

        const itemResponse = await fetch("http://localhost:5000/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemPayload),
        });

        if (!itemResponse.ok) {
          throw new Error(`Failed to save invoice item: ${item.name}.`);
        }
      }

      setToast({ message: "Invoice Saved Successfully!", type: "success" });
    } catch (error) {
      console.error("Save failed:", error);
      setToast({ message: `Error: ${error.message}`, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading State ---
  if (!invoiceData) {
    return (
      <div className="text-center p-10 font-semibold bg-gray-100 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
        Loading invoice data or no data found...
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-200 uppercase">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="max-w-4xl mx-auto">
        <InvoiceHeader
          handleSave={handleSave}
          handleEdit={handleEdit}
          isSaving={isSaving}
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

            <InvoiceItemsTable
              items={invoiceData.items}
              totalQty={invoiceData.totalQty}
              subTotal={invoiceData.subTotal}
            />

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
