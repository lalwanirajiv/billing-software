import React from "react";

const TopInfoPanel = ({ formData, handleChange, totals }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border dark:border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Customer Details
      </h2>
      <div>
        <label
          htmlFor="shipTo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Customer Name
        </label>
        <input
          id="shipTo"
          type="text"
          name="shipTo"
          placeholder="e.g., John Doe"
          value={formData.shipTo}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="gstin"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Customer GSTIN
        </label>
        <input
          id="gstin"
          type="text"
          name="gstin"
          placeholder="e.g., 22AAAAA0000A1Z5"
          value={formData.gstin}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="codeNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Code Number
        </label>
        <input
          id="codeNumber"
          type="text"
          name="codeNumber"
          placeholder="e.g., 12345"
          value={formData.codeNumber}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>

    {/* Invoice Details */}
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border dark:border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Invoice Details
      </h2>
      <div>
        <label
          htmlFor="billNo"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Bill No.
        </label>
        <input
          id="billNo"
          type="text"
          name="billNo"
          placeholder="e.g., INV-001"
          value={formData.billNo}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="terms"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Payment Terms
        </label>
        <input
          id="terms"
          type="text"
          name="terms"
          placeholder="e.g., Net 30 Days"
          value={formData.terms}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Sale Type
        </label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
        >
          <option value="State">State</option>
          <option value="Interstate">Interstate</option>
        </select>
      </div>
    </div>

    {/* Total Panel */}
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border dark:border-gray-700 space-y-2 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Total
      </h2>
      <div className="flex-grow space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
          <span className="dark:text-gray-200">
            ₹{totals.subTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">CGST @2.5%:</span>
          <span className="dark:text-gray-200">₹{totals.cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">SGST @2.5%:</span>
          <span className="dark:text-gray-200">₹{totals.sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">IGST @5%:</span>
          <span className="dark:text-gray-200">₹{totals.igst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Adjustment:</span>
          <span className="dark:text-gray-200">
            ₹{totals.adjustment.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white border-t dark:border-gray-600 pt-2 mt-2">
        <span>Total:</span>
        <span>₹{totals.roundedTotal.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default TopInfoPanel;
