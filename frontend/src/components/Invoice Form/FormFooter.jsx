import React from 'react';

const FormFooter = ({ totals, notes, handleChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
    <div className="space-y-2">
      <label htmlFor="notes" className="text-xl font-semibold text-gray-800">Notes</label>
      <textarea 
        id="notes"
        name="notes"
        rows="4"
        placeholder="Add any additional notes here..."
        value={notes}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
    <div className="space-y-4">
      <div className="border bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between font-medium"><span className="text-gray-600">Subtotal:</span><span>₹{totals.subTotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">CGST @2.5%:</span><span>₹{totals.cgst.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">SGST @2.5%:</span><span>₹{totals.sgst.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">IGST @5%:</span><span>₹{totals.igst.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Adjustment:</span><span>₹{totals.adjustment.toFixed(2)}</span></div>
        <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2"><span>Total Amount:</span><span>₹{totals.roundedTotal.toFixed(2)}</span></div>
      </div>
    </div>
  </div>
);

export default FormFooter;
