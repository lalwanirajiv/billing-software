import React from "react";
const numberToWords = (num) => {
  if (num === null || num === undefined) return "";
  num = Math.floor(num); // Ensure we are working with an integer
  if (num === 0) return "Zero";

  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const convertNN = (n) => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
  };

  const convertNNN = (n) => {
    if (n > 99) {
      return (
        ones[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 !== 0 ? " and " + convertNN(n % 100) : "")
      );
    }
    return convertNN(n);
  };

  let words = [];

  if (num >= 10000000) {
    words.push(convertNNN(Math.floor(num / 10000000)) + " crore");
    num %= 10000000;
  }
  if (num >= 100000) {
    words.push(convertNNN(Math.floor(num / 100000)) + " lakh");
    num %= 100000;
  }
  if (num >= 1000) {
    words.push(convertNNN(Math.floor(num / 1000)) + " thousand");
    num %= 1000;
  }
  if (num > 0) {
    words.push(convertNNN(num));
  }

  const result = words.join(" ").trim();
  return result.charAt(0).toUpperCase() + result.slice(1) + " rupees only";
};
const SellerBankDetails = ({ data }) => {
  // Use the helper function to get the amount in words
  const amountInWords = numberToWords(data.roundedTotal);

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md min-h-[60px]">
        <h4 className="font-bold mb-2 underline">AMOUNT IN WORDS</h4>
        <p className="text-sm uppercase font-semibold">{amountInWords}</p>
      </div>
      <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md">
        <h4 className="font-bold mb-2 underline">BANK DETAILS</h4>
        <p>
          <span className="font-semibold">BANK NAME:</span> KOTAK MAHINDRA BANK
        </p>
        <p>
          <span className="font-semibold">BANK A/C NO:</span> 4413075389
        </p>
        <p>
          <span className="font-semibold">BANK IFSC CODE:</span> KKBK0002580
        </p>
      </div>
      <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md">
        <h4 className="font-bold mb-2 underline">TERMS & CONDITIONS:</h4>
        <p className="text-xs">1. Goods once sold will not be taken back.</p>
        <p className="text-xs">
          2. Interest @18% p.a. will be charged if payment is not made within
          the due date.
        </p>
      </div>
    </div>
  );
};

export default SellerBankDetails;
