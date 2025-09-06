import React from "react";

const InvoiceHeader = ({ handleSave, handleEdit, isSaving, hideSave }) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">Invoice Preview</h1>

    <div className="flex items-center gap-4">
      {/* Conditionally render Save button */}
      {!hideSave && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`font-medium ${
            isSaving
              ? "text-gray-400 cursor-not-allowed"
              : "text-green-600 hover:underline"
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      )}

      <button
        onClick={handleEdit}
        className="text-yellow-600 hover:underline font-medium"
      >
        Edit
      </button>
    </div>
  </div>
);

export default InvoiceHeader;
