import React from 'react';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ItemsList = ({ items, handleItemChange, addItem, removeItem }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>
    {/* Desktop Headers */}
    <div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 text-sm font-semibold text-gray-600 px-3">
      <div className="md:col-span-4">Item</div>
      <div className="md:col-span-2">HSN</div>
      <div className="md:col-span-1 text-right">Qty</div>
      <div className="md:col-span-2 text-right">Rate</div>
      <div className="md:col-span-2 text-right">Amount</div>
      <div className="md:col-span-1"></div>
    </div>
    {/* Item Rows */}
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-3 p-3 border rounded-lg bg-gray-50/50 items-center">
          <div className="col-span-2 md:col-span-4"><label className="text-xs font-medium text-gray-600 md:hidden">Item</label><input type="text" name="name" placeholder="Item Name" value={item.name} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md" /></div>
          <div className="col-span-1 md:col-span-2"><label className="text-xs font-medium text-gray-600 md:hidden">HSN</label><input type="text" name="hsn" placeholder="HSN Code" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md" /></div>
          <div className="col-span-1 md:col-span-1"><label className="text-xs font-medium text-gray-600 md:hidden">Qty</label><input type="number" name="qty" placeholder="0" value={item.qty} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md text-right" /></div>
          <div className="col-span-1 md:col-span-2"><label className="text-xs font-medium text-gray-600 md:hidden">Rate</label><input type="number" name="rate" placeholder="0.00" value={item.rate} onChange={(e) => handleItemChange(index, e)} className="w-full p-2 border-gray-300 rounded-md text-right" /></div>
          <div className="col-span-1 md:col-span-2"><label className="text-xs font-medium text-gray-600 md:hidden">Amount</label><input type="number" value={item.amount.toFixed(2)} readOnly className="w-full p-2 border-gray-300 rounded-md bg-gray-100 text-right" /></div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-end">
            {items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"><TrashIcon /></button>
            )}
          </div>
        </div>
      ))}
    </div>
    <button type="button" onClick={addItem} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">+ Add Item</button>
  </div>
);

export default ItemsList;
