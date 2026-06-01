import React from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { formInputClass, formSectionClass } from '../Reusables/formStyles';

const ItemsList = ({ items, handleItemChange, addItem, removeItem }) => (
  <section className={`${formSectionClass} !space-y-4`}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Package size={18} className="text-brand-primary" />
        <h2 className="text-base font-semibold text-slate-900">Line items</h2>
      </div>
      <span className="text-xs font-medium text-slate-500">
        {items.length} row{items.length !== 1 ? 's' : ''}
      </span>
    </div>

    <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
      <div className="lg:col-span-4">Item</div>
      <div className="lg:col-span-2">HSN</div>
      <div className="lg:col-span-2 text-right">Qty</div>
      <div className="lg:col-span-2 text-right">Rate (₹)</div>
      <div className="lg:col-span-1 text-right">Amount</div>
      <div className="lg:col-span-1" />
    </div>

    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 lg:grid-cols-12 gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 items-end"
        >
          <div className="col-span-2 lg:col-span-4">
            <label className="text-xs text-slate-500 lg:hidden mb-1 block">Item</label>
            <input
              type="text"
              name="name"
              placeholder="Product or service name"
              value={item.name}
              onChange={(e) => handleItemChange(index, e)}
              className={formInputClass(false)}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <label className="text-xs text-slate-500 lg:hidden mb-1 block">HSN</label>
            <input
              type="text"
              name="hsn"
              placeholder="HSN"
              value={item.hsn}
              onChange={(e) => handleItemChange(index, e)}
              className={formInputClass(false)}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <label className="text-xs text-slate-500 lg:hidden mb-1 block">Qty</label>
            <input
              type="number"
              name="qty"
              min="0"
              step="any"
              placeholder="0"
              value={item.qty || ''}
              onChange={(e) => handleItemChange(index, e)}
              className={`${formInputClass(false)} text-right tabular-nums`}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <label className="text-xs text-slate-500 lg:hidden mb-1 block">Rate</label>
            <input
              type="number"
              name="rate"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.rate || ''}
              onChange={(e) => handleItemChange(index, e)}
              className={`${formInputClass(false)} text-right tabular-nums`}
            />
          </div>
          <div className="col-span-1 lg:col-span-1">
            <label className="text-xs text-slate-500 lg:hidden mb-1 block">Amount</label>
            <input
              type="text"
              readOnly
              value={(item.amount ?? 0).toFixed(2)}
              className={`${formInputClass(false, true)} text-right tabular-nums font-semibold`}
            />
          </div>
          <div className="col-span-1 lg:col-span-1 flex justify-end pb-0.5">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                title="Remove line"
                aria-label="Remove line item"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={addItem}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-600 text-sm font-semibold hover:border-brand-primary hover:text-brand-primary hover:bg-indigo-50/50 transition-colors w-full sm:w-auto justify-center"
    >
      <Plus size={18} />
      Add line item
    </button>
  </section>
);

export default ItemsList;
