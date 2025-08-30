import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopInfoPanel from "./TopInfoPanel";
import ItemsList from "./ItemsList";
import { FormHeader } from "./FormHeader";

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const initialFormData = {
  shipTo: "", gstin: "", codeNumber: "", billNo: "", date: "",
  terms: "", state: "State", items: [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
};

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [totals, setTotals] = useState({
    subTotal: 0, totalQty: 0, cgst: 0, sgst: 0, igst: 0, adjustment: 0, roundedTotal: 0,
  });

  // --- Theme State and Logic ---
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || 'light');

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

  useEffect(() => {
    const existingData = localStorage.getItem("invoiceData");
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      setFormData({
        ...initialFormData, ...parsedData,
        items: parsedData.items && parsedData.items.length ? parsedData.items : [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === 'name' || name === 'hsn' ? value : parseFloat(value) || 0;
    const qty = newItems[index].qty || 0;
    const rate = newItems[index].rate || 0;
    newItems[index].amount = qty * rate;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({ ...prev, items: [...prev.items, { name: "", hsn: "", qty: 0, rate: 0, amount: 0 }] }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  useEffect(() => {
    const subTotal = formData.items.reduce((acc, item) => acc + (item.amount || 0), 0);
    const totalQty = formData.items.reduce((acc, item) => acc + (item.qty || 0), 0);
    let cgst = 0, sgst = 0, igst = 0;
    if (formData.state.toLowerCase() === "interstate") {
      igst = subTotal * 0.05;
    } else {
      cgst = subTotal * 0.025;
      sgst = subTotal * 0.025;
    }
    const totalAmount = subTotal + cgst + sgst + igst;
    const roundedTotal = Math.round(totalAmount);
    const adjustment = roundedTotal - totalAmount;
    setTotals({ subTotal, totalQty, cgst, sgst, igst, totalAmount, adjustment, roundedTotal });
  }, [formData.items, formData.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, ...totals };
    localStorage.setItem("invoiceData", JSON.stringify(dataToSave));
    navigate("/invoice");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <FormHeader toggleTheme={toggleTheme} theme={theme} />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <TopInfoPanel formData={formData} handleChange={handleChange} totals={totals} />
            <ItemsList items={formData.items} handleItemChange={handleItemChange} addItem={addItem} removeItem={removeItem} />
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">
                Save & Preview Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

