import React from "react";

const InvoiceItemsTable = ({ data }) => {
  const MIN_ROWS = 15;
  const items = data.items || [];
  const emptyRowsCount = Math.max(0, MIN_ROWS - items.length);

  const emptyRows = Array.from({ length: emptyRowsCount }).map((_, index) => {
    const overallIndex = items.length + index;
    return (
      <tr
        key={`empty-${index}`}
        className={
          overallIndex % 2 === 0
            ? "bg-white dark:bg-gray-800"
            : "bg-gray-50 dark:bg-gray-700/50"
        }
      >
        {Array.from({ length: 6 }).map((__, colIndex) => (
          <td
            key={colIndex}
            className="border border-gray-300 dark:border-gray-600 p-1 h-[34px]"
          >
            &nbsp;
          </td>
        ))}
      </tr>
    );
  });

  const totalQty = items.reduce(
    (acc, item) => acc + Number(item.quantity ?? item.qty ?? 0),
    0
  );
  const subTotal = items.reduce(
    (acc, item) => acc + Number(item.total ?? item.amount ?? 0),
    0
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse border border-gray-400 dark:border-gray-600 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
              S.No
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold w-2/5">
              ITEMS
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
              HSN CODE
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
              QTY
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
              RATE
            </th>
            <th className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
              AMOUNT
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const name = item.item_name || item.name || "-";
            const hsn = item.hsn || "-";
            const qty = Number(item.quantity ?? item.qty ?? 0);
            const rate = Number(item.price ?? item.rate ?? 0).toFixed(2);
            const amount = Number(item.total ?? item.amount ?? 0).toFixed(2);

            return (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700/50"
                }
              >
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {name}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {hsn}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {qty}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {rate}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  {amount}
                </td>
              </tr>
            );
          })}
          {emptyRows}
        </tbody>
        <tfoot className="bg-gray-100 dark:bg-gray-700 font-bold">
          <tr>
            <td
              colSpan="3"
              className="border border-gray-300 dark:border-gray-600 p-2 text-right"
            >
              TOTAL
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
              {totalQty} Pcs
            </td>
            <td className="border border-gray-300 dark:border-gray-600 p-2"></td>
            <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
              ₹{subTotal.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
