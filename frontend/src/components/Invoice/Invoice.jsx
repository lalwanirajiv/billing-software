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

  const handleSave = () => {
    setSaveMessage('Invoice Saved Successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
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
