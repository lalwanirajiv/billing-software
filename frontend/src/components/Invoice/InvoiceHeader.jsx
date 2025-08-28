import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

const InvoiceHeader = ({ handleSave, handleEdit, toggleTheme, theme, saveMessage }) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Invoice Preview</h1>
      <div className="flex items-center gap-2">
        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">Save</button>
        <button onClick={handleEdit} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">Edit</button>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
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
