import React from "react";
import { TrashIcon } from "../Reusables/Icons";

const ItemsList = ({ items, handleItemChange, addItem, removeItem }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
      Items
    </h2>
    <div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400 px-3">
      <div className="md:col-span-4">Item</div>
      <div className="md:col-span-2">HSN</div>
      <div className="md:col-span-1 text-right">Qty</div>
      <div className="md:col-span-2 text-right">Rate</div>
      <div className="md:col-span-2 text-right">Amount</div>
      <div className="md:col-span-1"></div>
    </div>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-3 p-3 border dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 items-center"
        >
          <div className="col-span-2 md:col-span-4">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 md:hidden">
              Item
            </label>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, e)}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 md:hidden">
              HSN
            </label>
            <input
              type="text"
              name="hsn"
              placeholder="HSN Code"
              value={item.hsn}
              onChange={(e) => handleItemChange(index, e)}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="col-span-1 md:col-span-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 md:hidden">
              Qty
            </label>
            <input
              type="number"
              name="qty"
              placeholder="0"
              value={item.qty}
              onChange={(e) => handleItemChange(index, e)}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-right text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 md:hidden">
              Rate
            </label>
            <input
              type="number"
              name="rate"
              placeholder="0.00"
              value={item.rate}
              onChange={(e) => handleItemChange(index, e)}
              className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-right text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 md:hidden">
              Amount
            </label>
            <input
              type="number"
              value={item.amount.toFixed(2)}
              readOnly
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md text-right text-gray-900 dark:text-gray-300"
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-end">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={addItem}
      className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
    >
      + Add Item
    </button>
  </div>
);

export default ItemsList;
