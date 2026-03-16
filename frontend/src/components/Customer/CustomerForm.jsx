import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormHeader from "./FormHeader";
import AddressSection from "./AddressSection";
import CustomerInfoSection from "./CustomerInfoSection";
import { createCustomer, getCustomerById, updateCustomer } from "../../lib/api";

const initialCustomerData = {
  name: "",
  address_line1: "",
  address_line2: "",
  phone: "",
  gstin: "",
};

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        try {
          const data = await getCustomerById(id);
          setCustomerData({
            name: data.name,
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            phone: data.phone_number || "",
            gstin: data.gstin || "",
          });
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
          setSaveStatus("error");
        }
      };
      fetchCustomer();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      if (isEditMode) {
        await updateCustomer(id, customerData);
        setSaveStatus("success");
        setTimeout(() => navigate("/customers"), 1500);
      } else {
        await createCustomer(customerData);
        setSaveStatus("success");
        setCustomerData(initialCustomerData);
      }
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <FormHeader title={isEditMode ? "Edit Customer" : "Create New Customer"} />

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
              <p className="text-green-600 font-medium">
                Customer {isEditMode ? "updated" : "saved"}!
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 font-medium">
                Failed to {isEditMode ? "update" : "save"}.
              </p>
            )}

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving" 
                ? "Saving..." 
                : isEditMode 
                  ? "Update Customer" 
                  : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
