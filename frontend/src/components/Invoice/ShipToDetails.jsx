import React, { useEffect, useState } from "react";

const ShipToDetails = ({ data }) => {
  const [customer, setCustomer] = useState(null);

  // Fetch customer details when `data.customer_id` changes
  useEffect(() => {
    const getCustomer = async (customer_id) => {
      try {
        const getCustomerResponse = await fetch(
          `http://localhost:5000/api/customer/${customer_id}`
        );

        if (!getCustomerResponse.ok) {
          throw new Error("Failed to fetch customer");
        }

        const customerData = await getCustomerResponse.json();
        console.log("Fetched Customer:", customerData);
        setCustomer(customerData); // ✅ store in state
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    if (data?.customer_id) {
      getCustomer(data.customer_id);
    }
  }, [data?.customer_id]);

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg flex flex-col space-y-2">
      <h3 className="font-bold text-lg uppercase text-gray-800 dark:text-gray-200">
        {data.shipTo || customer?.name || "Customer Name"}
      </h3>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          {data.address_line1 ||
            customer?.address_line1 ||
            "Address Line 1 not available"}
        </p>
        <p>
          {data.address_line2 ||
            customer?.address_line2 ||
            "Address Line 2 not available"}
        </p>
      </div>
      <div className="pt-2 mt-auto">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          GST NO:{" "}
          <span className="font-normal">
            {data.gstin || customer?.gstin || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ShipToDetails;
