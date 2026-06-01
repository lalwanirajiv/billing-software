import React from "react";

const InvoiceTotals = ({ data }) => {
  // Calculate total based on state type
  const subTotal = Number(data.sub_total ?? 0);
  const cgst = Number(data.cgst ?? 0);
  const sgst = Number(data.sgst ?? 0);
  const igst = Number(data.igst ?? 0);

  const total =
    data.state === "Interstate" ? subTotal + igst : subTotal + cgst + sgst;

  const roundedTotal = Math.round(total);
  const adjustment = roundedTotal - total;

  return (
    <div>
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">AMOUNT</td>
            <td className="p-2 text-right">₹{subTotal.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">CGST @2.5%</td>
            <td className="p-2 text-right">₹{cgst.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">SGST @2.5%</td>
            <td className="p-2 text-right">₹{sgst.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">IGST @5%</td>
            <td className="p-2 text-right">₹{igst.toFixed(2)}</td>
          </tr>
          {data.discount > 0 && (
            <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600 bg-green-50/50 dark:bg-green-900/10">
              <td className="font-semibold p-2 text-green-700 dark:text-green-400">DISCOUNT (-)</td>
              <td className="p-2 text-right text-green-700 dark:text-green-400">- ₹{Number(data.discount).toFixed(2)}</td>
            </tr>
          )}
          <tr className="border-t border-l border-r border-gray-300 dark:border-gray-600">
            <td className="font-semibold p-2">ADJUSTMENT</td>
            <td className="p-2 text-right">₹{adjustment.toFixed(2)}</td>
          </tr>
          <tr className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
            <td className="font-bold text-lg p-2">TOTAL AMOUNT</td>
            <td className="font-bold text-lg p-2 text-right">
              ₹{Number(data.grand_total ?? roundedTotal).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="border border-gray-300 dark:border-gray-600 p-2 rounded-md mt-2 text-center min-h-[50px] flex flex-col justify-end">
        <p className="font-bold underline">AUTHORISED SIGNATORY</p>
      </div>
    </div>
  );
};

export default InvoiceTotals;
