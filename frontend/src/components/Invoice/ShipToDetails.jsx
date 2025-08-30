import React from 'react';

const ShipToDetails = ({ data }) => (
  <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg flex flex-col space-y-2">
    <h3 className="font-bold text-lg uppercase text-gray-800 dark:text-gray-200">
      {data.shipTo || "Customer Name"}
    </h3>
    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>{data.address_line1 || 'Address Line 1 not available'}</p>
        <p>{data.address_line2 || 'Address Line 2 not available'}</p>
    </div>
    <div className="pt-2 mt-auto">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            GST NO: <span className="font-normal">{data.gstin}</span>
        </p>
    </div>
  </div>
);

export default ShipToDetails;
