import React from 'react';

const InvoiceMeta = ({ data }) => (
  <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md text-sm mb-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div><span className="font-semibold">BILL NO:</span> {data.billNo}</div>
      <div><span className="font-semibold">DATE:</span> {data.date}</div>
      <div><span className="font-semibold">TERMS:</span> {data.terms}</div>
      <div><span className="font-semibold">SALE TYPE:</span> {data.state}</div>
    </div>
  </div>
);

export default InvoiceMeta;
