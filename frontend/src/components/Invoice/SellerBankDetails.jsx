import React from "react";
import { useCompanySettings } from "../../context/CompanySettingsContext";

const numberToWords = (num) => {
  if (num === null || num === undefined) return "";
  num = Math.floor(num);
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
  const { settings } = useCompanySettings();
  const amountInWords = numberToWords(data.grand_total);

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 dark:border-gray-600 p-2 rounded-md min-h-[40px]">
        <h4 className="font-bold mb-1 underline">AMOUNT IN WORDS</h4>
        <p className="text-xs uppercase font-semibold">{amountInWords}</p>
      </div>
      <div className="border border-gray-300 dark:border-gray-600 p-2 rounded-md text-xs">
        <h4 className="font-bold mb-2 underline">BANK DETAILS</h4>
        {settings.bank_name && (
          <p>
            <span className="font-semibold">BANK NAME:</span> {settings.bank_name}
          </p>
        )}
        {settings.bank_account && (
          <p>
            <span className="font-semibold">BANK A/C NO:</span> {settings.bank_account}
          </p>
        )}
        {settings.bank_ifsc && (
          <p>
            <span className="font-semibold">BANK IFSC CODE:</span> {settings.bank_ifsc}
          </p>
        )}
      </div>
      {(settings.terms_line1 || settings.terms_line2) && (
        <div className="border border-gray-300 dark:border-gray-600 p-2 rounded-md">
          <h4 className="font-bold mb-2 underline">TERMS & CONDITIONS:</h4>
          {settings.terms_line1 && (
            <p className="text-xs">1. {settings.terms_line1}</p>
          )}
          {settings.terms_line2 && (
            <p className="text-xs">2. {settings.terms_line2}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerBankDetails;
