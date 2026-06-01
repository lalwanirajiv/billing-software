import React, { useState } from "react";
import { X, Download, Printer } from "lucide-react";

export const ExportModal = ({ isOpen, onClose, onExportCSV, onExportPDF }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleExport = (format, isAll) => {
    const start = isAll ? "" : startDate;
    const end = isAll ? "" : endDate;

    if (!isAll && (!start || !end)) {
      alert("Please select both From and To dates for range export.");
      return;
    }

    if (format === "csv") {
      onExportCSV(start, end);
    } else {
      onExportPDF(start, end);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Invoices</h2>
            <p className="text-xs text-gray-500 mt-1">Select your export preference and format</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all shadow-sm">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Option 1: Full Export */}
          <div className="p-4 rounded-xl border-2 border-dashed border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900 transition-colors bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Export All Invoices
              </h3>
              <span className="text-[10px] font-black uppercase text-gray-400">Recommended for backups</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleExport("csv", true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-xs"
              >
                <Download size={16} /> Excel (CSV)
              </button>
              <button 
                onClick={() => handleExport("pdf", true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-md text-xs"
              >
                <Printer size={16} /> Print PDF
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700"></div></div>
            <span className="relative px-4 bg-white dark:bg-gray-800 text-[10px] font-black uppercase text-gray-300">OR</span>
          </div>

          {/* Option 2: Date Range */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Export by Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">From Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 transition-all rounded-xl text-sm font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">To Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 transition-all rounded-xl text-sm font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => handleExport("csv", false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-all text-xs"
              >
                <Download size={16} /> Range CSV
              </button>
              <button 
                onClick={() => handleExport("pdf", false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none text-xs"
              >
                <Printer size={16} /> Range PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
