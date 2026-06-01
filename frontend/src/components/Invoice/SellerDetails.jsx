import React from "react";
import { useCompanySettings } from "../../context/CompanySettingsContext";

const SellerDetails = () => {
  const { settings } = useCompanySettings();

  return (
    <div className="border border-gray-300 dark:border-gray-600 p-2 rounded-md">
      <h3 className="font-bold text-lg mb-1">{settings.company_name}</h3>
      {settings.address_line1 && (
        <p className="text-sm">{settings.address_line1}</p>
      )}
      {settings.address_line2 && (
        <p className="text-sm">{settings.address_line2}</p>
      )}
      {settings.gstin && (
        <p className="text-sm font-semibold mt-1">
          GST NO: <span className="font-normal">{settings.gstin}</span>
        </p>
      )}
      <div className="mt-2 text-sm">
        {settings.phone && (
          <p>
            <span className="font-semibold">Contact:</span> {settings.phone}
          </p>
        )}
        {settings.email && (
          <p>
            <span className="font-semibold">E-Mail:</span>{" "}
            <span className="lowercase">{settings.email}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SellerDetails;
