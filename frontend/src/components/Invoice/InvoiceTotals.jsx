import React from 'react';

// This component displays the final totals table and the signature box.
const InvoiceTotals = ({ data }) => {
  // --- Rounding Logic ---
  // Calculate the final rounded total.
  const roundedTotal = Math.round(data.totalAmount);
  // Determine the adjustment amount needed to reach the rounded total.
  const adjustment = roundedTotal - data.totalAmount;

  return (
    <div>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">AMOUNT</td>
            <td className="p-2 text-right">₹{data.subTotal.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">CGST @2.5%</td>
            <td className="p-2 text-right">₹{data.cgst.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">SGST @2.5%</td>
            <td className="p-2 text-right">₹{data.sgst.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">IGST @5%</td>
            <td className="p-2 text-right">₹{data.igst.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">ADJUSTMENT</td>
            
            <td className="p-2 text-right">₹{adjustment.toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <td className="font-bold text-lg p-2">TOTAL AMOUNT</td>
            
            <td className="font-bold text-lg p-2 text-right">₹{roundedTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md mt-4 text-center min-h-[100px] flex flex-col justify-end">
        <p className="font-bold">SIGN</p>
      </div>
    </div>
  );
};

export default InvoiceTotals;
