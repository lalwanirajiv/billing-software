import React from 'react';

// This component displays the bank details and terms and conditions.
const SellerBankDetails = () => (
  <div className="space-y-4">
    <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md min-h-[60px]">
      <p><span className="font-semibold">AMOUNT IN WORDS:</span></p>
    </div>
    <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md">
      <h4 className="font-bold mb-2 underline">BANK DETAILS</h4>
      <p><span className="font-semibold">BANK NAME:</span> KOTAK MAHINDRA BANK</p>
      <p><span className="font-semibold">BANK A/C NO:</span> 4413075389</p>
      <p><span className="font-semibold">BANK IFSC CODE:</span> KKBK0002580</p>
    </div>
    <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md">
      <h4 className="font-bold mb-2 underline">TERMS & CONDITIONS:</h4>
      <p>1. Goods once sold will not be taken back.</p>
      <p>2. Interest @18% p.a. will be charged if payment is not made within the due date.</p>
    </div>
  </div>
);

export default SellerBankDetails;
