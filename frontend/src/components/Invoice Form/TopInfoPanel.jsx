import React from "react";

const TopInfoPanel = ({
  formData,
  handleChange,
  totals,
  handleSuggestionClick,
  isSuggestionsVisible,
  setIsSuggestionsVisible,
  isLoadingCustomers,
  filteredCustomers,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    {/* Customer Details */}
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border dark:border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Customer Details
      </h2>
      <div>
        <label
          htmlFor="customer-search"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Customer Name
        </label>
        <div className="relative">
          <input
            id="customer-search"
            type="text"
            name="shipTo"
            value={formData.shipTo}
            onChange={handleChange}
            onFocus={() => setIsSuggestionsVisible(true)}
            onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 150)}
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            disabled={isLoadingCustomers}
            autoComplete="off"
            placeholder={
              isLoadingCustomers ? "Loading customers..." : "Type to search..."
            }
          />
          {isSuggestionsVisible && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    onMouseDown={() => handleSuggestionClick(customer)}
                    className="p-2 text-gray-800 dark:text-gray-100 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 cursor-pointer"
                  >
                    {customer.name}
                  </li>
                ))
              ) : (
                <li
                  className="p-2 text-gray-500 dark:text-gray-400"
                  key="no-customers-found"
                >
                  No customers found.
                </li>
              )}
              {/* Add New Customer Link */}
              <li
                className="p-2 border-t border-gray-200 dark:border-gray-600"
                key="add-new-customer"
              >
                <a
                  href="/create-customer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold"
                >
                  + Add New Customer
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Address Line 1 */}
      <div>
        <label
          htmlFor="address_line1"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Address Line 1
        </label>
        <input
          id="address_line1"
          type="text"
          name="address_line1"
          placeholder="Auto-populated"
          value={formData.address_line1}
          readOnly
          className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-300"
        />
      </div>

      {/* Address Line 2 */}
      <div>
        <label
          htmlFor="address_line2"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Address Line 2
        </label>
        <input
          id="address_line2"
          type="text"
          name="address_line2"
          placeholder="Auto-populated"
          value={formData.address_line2}
          readOnly
          className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-300"
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
          placeholder="Auto-populated"
          value={formData.gstin || ""}
          readOnly
          className="w-full p-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-300"
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
          value={formData.date || ""}
          onChange={handleChange}
          className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]"
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
          value={formData.terms || "30 Days"}
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
    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border dark:border-gray-700 space-y-2 flex flex-col [color-scheme:light] dark:[color-scheme:dark]">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Total
      </h2>

      <div className="flex-grow space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span className="text-gray-600 dark:text-gray-400">sub_total:</span>
          <span className="text-gray-900 dark:text-gray-200">
            ₹{totals.sub_total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">CGST @2.5%:</span>
          <span className="text-gray-900 dark:text-gray-200">
            ₹{totals.cgst.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">SGST @2.5%:</span>
          <span className="text-gray-900 dark:text-gray-200">
            ₹{totals.sgst.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">IGST @5%:</span>
          <span className="text-gray-900 dark:text-gray-200">
            ₹{totals.igst.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Adjustment:</span>
          <span className="text-gray-900 dark:text-gray-200">
            ₹{totals.adjustment.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white border-t dark:border-gray-600 pt-2 mt-2">
        <span>Total:</span>
        <span>₹{totals.grand_total.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default TopInfoPanel;
