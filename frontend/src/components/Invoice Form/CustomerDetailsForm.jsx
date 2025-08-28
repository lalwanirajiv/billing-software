import React from 'react';

const CustomerDetailsForm = ({ formData, handleChange }) => (
  <div className="bg-gray-50 p-5 rounded-lg border space-y-4">
    <h2 className="text-xl font-semibold text-gray-800">Billed To</h2>
    <div>
      <label htmlFor="shipTo" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
      <input
        id="shipTo"
        type="text"
        name="shipTo"
        placeholder="e.g., John Doe"
        value={formData.shipTo}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">Customer GSTIN</label>
      <input
        id="gstin"
        type="text"
        name="gstin"
        placeholder="e.g., 22AAAAA0000A1Z5"
        value={formData.gstin}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label htmlFor="codeNumber" className="block text-sm font-medium text-gray-700 mb-1">Code Number</label>
      <input
        id="codeNumber"
        type="text"
        name="codeNumber"
        placeholder="e.g., 12345"
        value={formData.codeNumber}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

export default CustomerDetailsForm;
