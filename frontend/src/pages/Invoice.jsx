import React, { useState, useEffect } from "react";
// Removed useNavigate as it's not compatible with this environment.
// We will use standard browser navigation instead.

export default function Invoice() {
  // const navigate = useNavigate(); // This line was causing the error.
  const [invoiceData, setInvoiceData] = useState(null);
  const [saveMessage, setSaveMessage] = useState(""); // State for the save message

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData) {
      setInvoiceData(JSON.parse(savedData));
    }
  }, []);

  // --- Handle Edit Button ---
  // This function navigates the user back to the form page.
  const handleEdit = () => {
    // The form will automatically pre-fill with data from localStorage.
    // Using window.location.href for navigation to avoid the router context error.
    window.location.href = "/invoice-form";
  };

  // --- Handle Save Button ---
  // This function shows a confirmation message.
  const handleSave = async () => {
    if (!invoiceData) return;
  
    // --- Validation ---
    if (!invoiceData.shipTo || invoiceData.shipTo.trim() === "") {
      setSaveMessage("Ship To cannot be empty!");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }
  
    try {
      // Map frontend keys to backend expected keys
      const payload = {
        ship_to: invoiceData.shipTo,
        bill_no: invoiceData.billNo,
        date: invoiceData.date,
        terms_of_payment: invoiceData.terms,
        state: invoiceData.state,
        grand_total: invoiceData.totalAmount,
        items: invoiceData.items.map((item) => ({
          item_name: item.name,
          quantity: item.qty,
          price: item.rate,
          total: item.amount,
        })),
      };
  
      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSaveMessage("Invoice Saved Successfully!");
        console.log("Saved Invoice ID:", result.invoiceId);
        // Optionally clear localStorage after saving
        // localStorage.removeItem("invoiceData");
      } else {
        setSaveMessage("Failed to save invoice: " + result.error);
      }
  
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Error saving invoice: " + err.message);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };
  

  if (!invoiceData) {
    return (
      <div className="text-center p-10 font-semibold">
        Loading invoice data or no data found...
      </div>
    );
  }

  // Destructure all data, including pre-calculated totals, from localStorage
  const {
    shipTo,
    gstin,
    codeNumber,
    billNo,
    date,
    terms,
    state,
    items,
    subTotal,
    totalQty,
    cgst,
    sgst,
    igst,
    totalAmount,
  } = invoiceData;

  // Logic for empty rows to maintain layout consistency
  const MIN_ROWS = 15;
  const emptyRowsCount = Math.max(0, MIN_ROWS - items.length);
  const emptyRows = Array.from({ length: emptyRowsCount }).map((_, index) => {
    const overallIndex = items.length + index;
    return (
      <tr
        key={`empty-${index}`}
        className={overallIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
      >
        <td className="border border-gray-300 p-1 h-[34px]">&nbsp;</td>
        <td className="border border-gray-300 p-1">&nbsp;</td>
        <td className="border border-gray-300 p-1">&nbsp;</td>
        <td className="border border-gray-300 p-1">&nbsp;</td>
        <td className="border border-gray-300 p-1">&nbsp;</td>
        <td className="border border-gray-300 p-1">&nbsp;</td>
      </tr>
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoice Preview</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit
          </button>
        </div>
      </div>
      {saveMessage && (
        <div className="mb-4 p-3 text-center bg-green-100 text-green-800 rounded-md transition-opacity duration-300">
          {saveMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 border border-gray-300 rounded-lg shadow-lg">
        {/* --- Save Confirmation Message --- */}

        <header className="text-center mb-4 border-b pb-2 border-gray-300">
          <p className="text-sm font-semibold">EK TUHI NIRANKAR</p>
          <h1 className="text-xl font-bold uppercase">Tax Invoice</h1>
        </header>

        <main>
          {/* Top section with company and bill details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Left side: Customer Details */}
            <div className="border border-gray-300 p-3 rounded-md">
              <h3 className="font-bold text-lg mb-1 uppercase">
                {shipTo || "Customer Name"}
              </h3>
              <div className="flex justify-between mt-2 text-sm">
                <p>
                  <span className="font-semibold">GSTIN NO:</span> {gstin}
                </p>
                <p>
                  <span className="font-semibold">CODE NUMBER:</span>{" "}
                  {codeNumber}
                </p>
              </div>
            </div>

            {/* Right side: Seller (Your) Details */}
            <div className="border border-gray-300 p-3 rounded-md">
              <h3 className="font-bold text-lg mb-1">KAMAL READYMADE STORES</h3>
              <p className="text-sm">Shop No 7, 1st Floor Deluxe Chamber</p>
              <p className="text-sm">Mirghawad Ahmedabad - 380001</p>
              <p className="text-sm font-semibold mt-1">
                GST NO: 24AAFPL5557N1ZA
              </p>
              <div className="mt-2 text-sm">
                <p>
                  <span className="font-semibold">Contact:</span> 079 22174580,
                  9374159220, 9426029197
                </p>
                <p>
                  <span className="font-semibold">E-Mail:</span>{" "}
                  sureshklalwani1@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Meta Section */}
          <div className="border border-gray-300 p-3 rounded-md text-sm mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <span className="font-semibold">BILL NO:</span> {billNo}
              </div>
              <div>
                <span className="font-semibold">DATE:</span> {date}
              </div>
              <div>
                <span className="font-semibold">TERMS:</span> {terms}
              </div>
              <div>
                <span className="font-semibold">SALE TYPE:</span> {state}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 p-2 font-semibold">
                    S.No
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold text-left w-2/5">
                    ITEMS
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    HSN CODE
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    QTY
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    RATE
                  </th>
                  <th className="border border-gray-300 p-2 font-semibold">
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 p-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-1">{item.name}</td>
                    <td className="border border-gray-300 p-1 text-center">
                      {item.hsn}
                    </td>
                    <td className="border border-gray-300 p-1 text-right">
                      {item.qty}
                    </td>
                    <td className="border border-gray-300 p-1 text-right">
                      {Number(item.rate).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-1 text-right">
                      {Number(item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {emptyRows}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td
                    colSpan="3"
                    className="border border-gray-300 p-2 text-right"
                  >
                    TOTAL
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {totalQty}
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-right">
                    {subTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            {/* Left side: Bank Details & Terms */}
            <div className="space-y-4">
              <div className="border border-gray-300 p-3 rounded-md min-h-[60px]">
                <p>
                  <span className="font-semibold">AMOUNT IN WORDS:</span>
                </p>
              </div>
              <div className="border border-gray-300 p-3 rounded-md">
                <h4 className="font-bold mb-2 underline">BANK DETAILS</h4>
                <p>
                  <span className="font-semibold">BANK NAME:</span> KOTAK
                  MAHINDRA BANK
                </p>
                <p>
                  <span className="font-semibold">BANK A/C NO:</span> 4413075389
                </p>
                <p>
                  <span className="font-semibold">BANK IFSC CODE:</span>{" "}
                  KKBK0002580
                </p>
              </div>
              <div className="border border-gray-300 p-3 rounded-md">
                <h4 className="font-bold mb-2 underline">
                  TERMS & CONDITIONS:
                </h4>
                <p>1. Goods once sold will not be taken back.</p>
                <p>
                  2. Interest @18% p.a. will be charged if payment is not made
                  within the due date.
                </p>
              </div>
            </div>

            {/* Right side: Totals and Signature */}
            <div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-t border-l border-r border-gray-300">
                    <td className="font-semibold p-2">AMOUNT</td>
                    <td className="p-2 text-right">{subTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-l border-r border-gray-300">
                    <td className="font-semibold p-2">CGST @2.5%</td>
                    <td className="p-2 text-right">{cgst.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-l border-r border-gray-300">
                    <td className="font-semibold p-2">SGST @2.5%</td>
                    <td className="p-2 text-right">{sgst.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-l border-r border-gray-300">
                    <td className="font-semibold p-2">IGST @5%</td>
                    <td className="p-2 text-right">{igst.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-l border-r border-gray-300">
                    <td className="font-semibold p-2">ADJUSTMENT</td>
                    <td className="p-2 text-right">0.00</td>
                  </tr>
                  <tr className="bg-gray-100 border border-gray-300">
                    <td className="font-bold text-lg p-2">TOTAL AMOUNT</td>
                    <td className="font-bold text-lg p-2 text-right">
                      {totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="border border-gray-300 p-3 rounded-md mt-4 text-center min-h-[100px] flex flex-col justify-end">
                <p className="font-bold">SIGN</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
