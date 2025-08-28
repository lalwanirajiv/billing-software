import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import all the final, individual components
import InvoiceHeader from './InvoiceHeader';
import ShipToDetails from './ShipToDetails';
import SellerDetails from './SellerDetails';
import InvoiceMeta from './InvoiceMeta';
import InvoiceItemsTable from './InvoiceItemsTable';
import SellerBankDetails from './SellerBankDetails';
import InvoiceTotals from './InvoiceTotals';

export default function Invoice() {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light');

  // --- Theme Management ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // --- Data Loading ---
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData) {
      setInvoiceData(JSON.parse(savedData));
    }
  }, []);

  // --- Event Handlers ---
  const handleEdit = () => {
    navigate("/invoice-form"); 
  };

  const handleSave = async () => {
    if (!invoiceData) return;
    setIsSaving(true);
    setSaveMessage('');
  
    try {
      // --- First save invoice ---
      const invoicePayload = {
        ship_to: invoiceData.shipTo,
        bill_no: Number(invoiceData.billNo),
        date: invoiceData.date,
        terms_of_payment: invoiceData.terms,
        state: invoiceData.state,
        grand_total: invoiceData.roundedTotal,
        created_at: new Date().toISOString(),
      };
  
      console.log("Sending Invoice Payload:", invoicePayload);
  
      const invoiceResponse = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload),
      });
  
      if (!invoiceResponse.ok) {
        const errorText = await invoiceResponse.text();
        throw new Error(`Failed to save invoice. Server: ${errorText}`);
      }
  
      const savedInvoice = await invoiceResponse.json();
      console.log("Saved Invoice Response:", savedInvoice);
  
      // ✅ Support all possible keys
      const invoiceId = savedInvoice.invoiceId || savedInvoice.invoice_id || savedInvoice.id;
      if (!invoiceId) throw new Error("Invoice ID missing in response");
  
      // --- Now save each item one by one ---
      for (const item of invoiceData.items) {
        const itemPayload = {
          invoice_id: invoiceId,
          item_name: item.name,
          quantity: item.qty,
          price: item.rate,
          total: item.amount,
        };
  
        console.log("Sending Item Payload:", itemPayload);
  
        const itemResponse = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemPayload),
        });
  
        if (!itemResponse.ok) {
          const errorText = await itemResponse.text();
          throw new Error(`Failed to save invoice item: ${item.name}. Server: ${errorText}`);
        }
  
        const savedItem = await itemResponse.json();
        console.log("Saved Item:", savedItem);
      }
  
      setSaveMessage('Invoice Saved Successfully!');
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
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

  // --- Render Method ---
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto">
        <InvoiceHeader 
          handleSave={handleSave}
          handleEdit={handleEdit}
          toggleTheme={toggleTheme}
          theme={theme}
          saveMessage={saveMessage}
        />
        
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <header className="text-center mb-4 border-b pb-2 border-gray-300 dark:border-gray-600">
            <p className="text-sm font-semibold">EK TUHI NIRANKAR</p>
            <h1 className="text-xl font-bold uppercase">Tax Invoice</h1>
          </header>

          <main>
            {/* Using the smaller components directly */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ShipToDetails data={invoiceData} />
              <SellerDetails />
            </div>
            
            <InvoiceMeta data={invoiceData} />
            
            <InvoiceItemsTable 
              items={invoiceData.items} 
              totalQty={invoiceData.totalQty} 
              subTotal={invoiceData.subTotal} 
            />

            {/* Using the smaller components directly */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
              <SellerBankDetails />
              <InvoiceTotals data={invoiceData} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
