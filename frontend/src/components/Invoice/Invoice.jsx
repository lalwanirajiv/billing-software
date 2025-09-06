import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerDetails from "./SellerDetails";
import InvoiceMeta from "./InvoiceMeta";
import InvoiceHeader from "./InvoiceHeader";
import SellerBankDetails from "./SellerBankDetails";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import ShipToDetails from "./ShipToDetails";
import { Toast } from "../Reusables/Toast";

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
  const [invoiceData, setInvoiceData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // --- Fetch Invoice ---
  const fetchInvoice = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/invoices/${id}`);
      if (!res.ok) throw new Error("Failed to fetch invoice.");
      const data = await res.json();
      setInvoiceData(data);
    } catch (err) {
      setToast({
        message: `Error fetching invoice: ${err.message}`,
        type: "error",
      });
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

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- Handlers ---
  const handleEdit = () => {
    if (params.id) {
      navigate(`/invoice-form/${params.id}`);
    } else {
      navigate("/invoice-form");
    }
  };
  console.log(invoiceData);
  

  const handleSave = async () => {
    if (!invoiceData) return;
    setIsSaving(true);
    setToast({ message: "", type: "" });
    try {
      // 1. Check duplicate bill number
      const checkResponse = await fetch(
        `http://localhost:5000/api/invoices/check/${invoiceData.billNo}`
      );
      if (checkResponse.ok) {
        const { exists } = await checkResponse.json();
        if (exists)
          throw new Error(
            `Invoice with Bill #${invoiceData.billNo} already exists.`
          );
      } else {
        throw new Error("Could not verify bill number uniqueness.");
      }

      // 2. Get customer ID
      let customerId = null;
      try {
        const customerRes = await fetch(
          `http://localhost:5000/api/customer/search?name=${encodeURIComponent(
            invoiceData.shipTo
          )}`
        );
        if (customerRes.ok) {
          const customer = await customerRes.json();
          if (customer && customer.length) customerId = customer[0].customer_id;
        }
      } catch {}

      const invoicePayload = {
        customer_id: customerId,
        ship_to: invoiceData.shipTo,
        bill_no: Number(invoiceData.billNo),
        date: invoiceData.date,
        terms_of_payment: invoiceData.terms,
        total_quantity: invoiceData.totalQty || 0,
        sub_total: invoiceData.sub_total || 0,
        cgst: invoiceData.cgst || 0,
        sgst: invoiceData.sgst || 0,
        igst: invoiceData.igst || 0,
        state: invoiceData.state,
        grand_total: invoiceData.grand_total || 0,
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
        throw new Error(`Failed to save invoice: ${errorText}`);
      }

      const savedInvoice = await invoiceResponse.json();
      const invoiceId =
        savedInvoice.invoiceId || savedInvoice.invoice_id || savedInvoice.id;
      if (!invoiceId) throw new Error("Invoice ID missing in response.");

      // 4. Save items
      for (const item of invoiceData.items) {
        const itemPayload = {
          invoice_id: invoiceId,
          item_name: item.name || item.item_name,
          hsn: item.hsn,
          quantity: item.qty || item.quantity,
          price: item.rate || item.price,
          total: item.amount || item.total,
        };

        const itemResponse = await fetch("http://localhost:5000/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemPayload),
        });

        if (!itemResponse.ok)
          throw new Error(`Failed to save item: ${item.name}`);
      }

      setToast({ message: "Invoice Saved Successfully!", type: "success" });
      localStorage.removeItem("invoiceData");
    } catch (error) {
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
  const hideSave = !!params.id;

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
          hideSave={hideSave}
          isSaving={isSaving}
          invoice_id={invoiceData.invoice_id}
          status={invoiceData.invoice_status}
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
