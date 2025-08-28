import React from 'react';

const FormHeader = ({ handleClear }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Create / Edit Invoice</h1>
    <button
      type="button"
      onClick={handleClear}
      className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200"
    >
      Clear Form
    </button>
  </div>
);

export default FormHeader;
