import React from 'react';

const InvoiceDetailsForm = ({ formData, handleChange }) => (
  <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
    <div>
      <label htmlFor="billNo" className="block text-sm font-medium text-gray-700 mb-1">Bill No.</label>
      <input
        id="billNo"
        type="text"
        name="billNo"
        placeholder="e.g., INV-001"
        value={formData.billNo}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        id="date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
      <input
        id="terms"
        type="text"
        name="terms"
        placeholder="e.g., Net 30 Days"
        value={formData.terms}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Sale Type</label>
      <select
        id="state"
        name="state"
        value={formData.state}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="State">State</option>
        <option value="Interstate">Interstate</option>
      </select>
    </div>
  </div>
);

export default InvoiceDetailsForm;
