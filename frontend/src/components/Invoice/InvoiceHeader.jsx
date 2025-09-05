import React from "react";
import { SunIcon, MoonIcon } from "../Icons/Icons";

const InvoiceHeader = ({
  handleSave,
  handleEdit,
  toggleTheme,
  theme,
  saveMessage,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Invoice Preview</h1>

      <div className="flex items-center gap-4">
        {/* Save & Edit styled as links */}
        <button
          onClick={handleSave}
          className="text-green-600 hover:underline font-medium"
        >
          Save
        </button>
        <button
          onClick={handleEdit}
          className="text-yellow-600 hover:underline font-medium"
        >
          Edit
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-200 
                     hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </div>

    {saveMessage && (
      <div className="mb-4 p-3 text-center bg-green-100 text-green-800 rounded-md transition-opacity duration-300">
        {saveMessage}
      </div>
    )}
  </>
);

export default InvoiceHeader;
