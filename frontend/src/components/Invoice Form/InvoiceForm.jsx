import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import all the individual components
// Make sure the paths are correct based on your file structure, e.g., './form/FormHeader'
import FormHeader from './FormHeader';
import CustomerDetailsForm from './CustomerDetailsForm';
import InvoiceDetailsForm from './InvoiceDetailsForm';
import ItemsList from './ItemsList';
import FormFooter from './FormFooter';

const initialFormData = {
  shipTo: "",
  gstin: "",
  codeNumber: "",
  billNo: "",
  date: "",
  terms: "",
  state: "State",
  items: [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
  notes: "",
};

export default function InvoiceForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [totals, setTotals] = useState({
    subTotal: 0,
    totalQty: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    adjustment: 0,
    roundedTotal: 0,
  });

  // Load existing data from localStorage on mount
  useEffect(() => {
    const existingData = localStorage.getItem("invoiceData");
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      setFormData({
        ...initialFormData,
        ...parsedData,
        items: parsedData.items && parsedData.items.length ? parsedData.items : [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
      });
    }
  }, []);

  // --- Event Handlers ---
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
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // --- Calculation Logic ---
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

  // --- Form Submission and Clearing ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, ...totals };
    localStorage.setItem("invoiceData", JSON.stringify(dataToSave));
    navigate("/invoice");
  };

  const handleClear = () => {
    localStorage.removeItem("invoiceData");
    setFormData(initialFormData);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <FormHeader handleClear={handleClear} />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CustomerDetailsForm formData={formData} handleChange={handleChange} />
              <InvoiceDetailsForm formData={formData} handleChange={handleChange} />
            </div>

            <ItemsList
              items={formData.items}
              handleItemChange={handleItemChange}
              addItem={addItem}
              removeItem={removeItem}
            />

            <FormFooter
              totals={totals}
              notes={formData.notes}
              handleChange={handleChange}
            />
            
            <div className="text-right pt-4">
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">
                Save & Preview Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
