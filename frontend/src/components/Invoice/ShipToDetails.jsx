import React from 'react';

// This component is responsible for displaying the customer's shipping information.
const ShipToDetails = ({ data }) => (
  <div className="border border-gray-300 dark:border-gray-600 p-3 rounded-md">
    <h3 className="font-bold text-lg mb-1 uppercase">{data.shipTo || "Customer Name"}</h3>
    <div className="flex justify-between mt-2 text-sm">
      <p><span className="font-semibold">GSTIN NO:</span> {data.gstin}</p>
      <p><span className="font-semibold">CODE NUMBER:</span> {data.codeNumber}</p>
    </div>
  </div>
);

export default ShipToDetails;
