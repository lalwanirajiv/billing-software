import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// A simple trash icon component for the remove button
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function InvoiceForm() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    shipTo: "",
    gstin: "",
    codeNumber: "",
    billNo: "",
    date: "",
    terms: "",
    state: "State", // Default to 'State'
    items: [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
  });

  // State for calculated totals
  const [totals, setTotals] = useState({
    subTotal: 0,
    totalQty: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalAmount: 0,
  });

  // This useEffect loads existing data from localStorage when the component mounts
  useEffect(() => {
    const existingData = localStorage.getItem("invoiceData");
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      setFormData({
        shipTo: parsedData.shipTo || "",
        gstin: parsedData.gstin || "",
        codeNumber: parsedData.codeNumber || "",
        billNo: parsedData.billNo || "",
        date: parsedData.date || "",
        terms: parsedData.terms || "",
        state: parsedData.state || "State",
        items: parsedData.items && parsedData.items.length ? parsedData.items : [{ name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
      });
    }
  }, []);

  // Handle regular input changes with labels
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle changes in the items table
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = name === 'name' || name === 'hsn' ? value : parseFloat(value) || 0;
    const qty = newItems[index].qty || 0;
    const rate = newItems[index].rate || 0;
    newItems[index].amount = qty * rate;
    setFormData({ ...formData, items: newItems });
  };

  // Add a new empty item row
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", hsn: "", qty: 0, rate: 0, amount: 0 }],
    });
  };

  // Remove an item row
  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Real-time calculation effect
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
    setTotals({ subTotal, totalQty, cgst, sgst, igst, totalAmount });
  }, [formData.items, formData.state]);

  // Save data and switch view
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData, ...totals };
    localStorage.setItem("invoiceData", JSON.stringify(dataToSave));
    navigate("/invoice");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Create / Edit Invoice</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer and Invoice Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Customer Details</h2>
              <div>
                <label htmlFor="shipTo" className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Ship To)</label>
                <input id="shipTo" type="text" name="shipTo" placeholder="e.g., John Doe" value={formData.shipTo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">Customer GSTIN</label>
                <input id="gstin" type="text" name="gstin" placeholder="e.g., 22AAAAA0000A1Z5" value={formData.gstin} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="codeNumber" className="block text-sm font-medium text-gray-700 mb-1">Code Number</label>
                <input id="codeNumber" type="text" name="codeNumber" placeholder="e.g., 12345" value={formData.codeNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
              <div>
                <label htmlFor="billNo" className="block text-sm font-medium text-gray-700 mb-1">Bill No.</label>
                <input id="billNo" type="text" name="billNo" placeholder="e.g., INV-001" value={formData.billNo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <input id="terms" type="text" name="terms" placeholder="e.g., Net 30 Days" value={formData.terms} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Sale Type</label>
                <select id="state" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option value="State">State</option>
                  <option value="Interstate">Interstate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
            {/* Desktop Headers */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 text-sm font-semibold text-gray-600">
              <div className="md:col-span-4">Item</div>
              <div className="md:col-span-2">HSN</div>
              <div className="md:col-span-1 text-right">Qty</div>
              <div className="md:col-span-2 text-right">Rate</div>
              <div className="md:col-span-2 text-right">Amount</div>
              <div className="md:col-span-1"></div>
            </div>
            {/* Item Rows */}
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 p-3 border rounded-lg bg-gray-50/50">
                  {/* Item Name */}
                  <div className="col-span-1 md:col-span-4">
                    <label className="text-sm font-medium text-gray-700 md:hidden">Item</label>
                    <input type="text" name="name" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md" />
                  </div>
                  {/* HSN */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 md:hidden">HSN</label>
                    <input type="text" name="hsn" placeholder="HSN Code" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md" />
                  </div>
                  {/* Qty */}
                  <div className="col-span-1 md:col-span-1">
                    <label className="text-sm font-medium text-gray-700 md:hidden">Qty</label>
                    <input type="number" name="qty" placeholder="0" value={item.qty} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md text-right" />
                  </div>
                  {/* Rate */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 md:hidden">Rate</label>
                    <input type="number" name="rate" placeholder="0.00" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md text-right" />
                  </div>
                  {/* Amount */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 md:hidden">Amount</label>
                    <input type="number" value={item.amount.toFixed(2)} readOnly className="w-full p-2 border-gray-300 rounded-md bg-gray-100 text-right" />
                  </div>
                  {/* Remove Button */}
                  <div className="col-span-1 flex items-center justify-end">
                    {formData.items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">+ Add Item</button>
          </div>

          {/* Footer with Totals */}
          <div className="flex flex-col items-end">
            <div className="w-full md:w-1/2 lg:w-2/5 border bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between font-medium"><span className="text-gray-600">Subtotal:</span><span>{totals.subTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">CGST @2.5%:</span><span>{totals.cgst.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">SGST @2.5%:</span><span>{totals.sgst.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">IGST @5%:</span><span>{totals.igst.toFixed(2)}</span></div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2"><span>Total Amount:</span><span>{totals.totalAmount.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-right pt-4">
            <button type="submit" className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md">Save & Preview Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
}
