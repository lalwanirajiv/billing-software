import React, { useState } from "react";
import FormHeader from "./FormHeader";
import AddressSection from "./AddressSection";
import CustomerInfoSection from "./CustomerInfoSection";

const initialCustomerData = {
  name: "",
  address_line1: "",
  address_line2: "",
  phone: "",
  gstin: "",
};

export default function CustomerForm() {
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [saveStatus, setSaveStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      const response = await fetch("http://localhost:5000/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setSaveStatus("success");
      setCustomerData(initialCustomerData);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Form Header (no theme toggle needed here anymore) */}
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CustomerInfoSection
              customerData={customerData}
              handleChange={handleChange}
            />
            <AddressSection
              customerData={customerData}
              handleChange={handleChange}
            />
          </div>

          <div className="flex justify-end items-center gap-4 pt-4">
            {saveStatus === "success" && (
              <p className="text-green-600 dark:text-green-400 font-medium">
                Customer saved!
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 dark:text-red-400 font-medium">
                Failed to save.
              </p>
            )}

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 dark:disabled:bg-gray-600"
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
