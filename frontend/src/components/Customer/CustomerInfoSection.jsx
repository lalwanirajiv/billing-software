import React from "react";

const CustomerInfoSection = ({ customerData, handleChange }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
      Customer Information
    </h2>

    {/* Customer Name (Required) */}
    <div>
      <label
        htmlFor="name"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Customer Name <span className="text-red-500">*</span>
      </label>
      <input
        id="name"
        type="text"
        name="name"
        placeholder="e.g., Acme Corporation"
        value={customerData.name}
        onChange={handleChange}
        required
        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100
                   invalid:border-red-500 invalid:ring-red-500"
      />
    </div>

    {/* Phone */}
    <div>
      <label
        htmlFor="phone"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Phone Number
      </label>
      <input
        id="phone"
        type="tel"
        name="phone"
        placeholder="e.g., 9876543210"
        value={customerData.phone}
        onChange={handleChange}
        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
      />
    </div>

    {/* GSTIN */}
    <div>
      <label
        htmlFor="gstin"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        GSTIN
      </label>
      <input
        id="gstin"
        type="text"
        name="gstin"
        placeholder="e.g., 22AAAAA0000A1Z5"
        value={customerData.gstin}
        onChange={handleChange}
        className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md 
                   focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
      />
    </div>
  </div>
);

export default CustomerInfoSection;
