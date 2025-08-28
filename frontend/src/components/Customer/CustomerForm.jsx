import React, { useState } from 'react';
import FormHeader from './FormHeader';
import AddressSection from './AddressSection';
import CustomerInfoSection from './CustomerInfoSection';

const initialCustomerData = {
  name: "",
  address_line1: "",
  address_line2: "",
  gstin: "",
};

export default function CustomerForm() {
  const [customerData, setCustomerData] = useState(initialCustomerData);
  const [saveStatus, setSaveStatus] = useState(''); // To show success or error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    try {
      // Send a POST request to your /customer endpoint
      const response = await fetch('http://localhost:5000/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        setSaveStatus('success');
        setCustomerData(initialCustomerData); // Clear form on success
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Failed to save customer:', error);
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Increased max-width from 4xl to 5xl to make the form wider */}
      <div className="max-w-5xl w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <FormHeader />
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CustomerInfoSection customerData={customerData} handleChange={handleChange} />
            <AddressSection customerData={customerData} handleChange={handleChange} />
          </div>
          
          <div className="flex justify-end items-center gap-4 pt-4">
            {saveStatus === 'success' && <p className="text-green-600 font-medium">Customer saved successfully!</p>}
            {saveStatus === 'error' && <p className="text-red-600 font-medium">Failed to save. Please try again.</p>}
            
            <button 
              type="submit" 
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
