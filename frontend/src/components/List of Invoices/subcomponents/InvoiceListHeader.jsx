import React from "react";
import { Link } from "react-router-dom";
import { SearchIcon, DeleteIcon } from "../../Reusables/Icons";
import { Calendar, FileDown, FileText } from "lucide-react";

export const InvoiceListHeader = ({ 
  dateFilter, 
  setDateFilter, 
  searchTerm, 
  setSearchTerm, 
  statusFilter,
  setStatusFilter,
  onExportClick,
  selectedCount,
  onBulkDelete
}) => {
  const statuses = ["All", "Paid", "Due", "Overdue"];

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        All Invoices
      </h1>
      <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Status Filter */}
        <div className="relative min-w-[120px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-3 pr-8 py-2 border rounded-lg bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border-gray-300 dark:border-gray-600 
                       focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-sm font-medium"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
           text-gray-900 dark:text-gray-100 
           border-gray-300 dark:border-gray-600 
           focus:ring-2 focus:ring-indigo-500 
           appearance-none 
           [&::-webkit-calendar-picker-indicator]:opacity-0 
           [&::-webkit-calendar-picker-indicator]:absolute 
           [&::-webkit-calendar-picker-indicator]:inset-0 
           [&::-webkit-calendar-picker-indicator]:w-full 
           [&::-webkit-calendar-picker-indicator]:h-full 
           [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 
           text-gray-500 dark:text-gray-400 pointer-events-none"
            size={18}
          />
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-gray-100 
                       border-gray-300 dark:border-gray-600 
                       focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {selectedCount > 0 && (
            <button
              onClick={onBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-md animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <DeleteIcon className="w-5 h-5" />
              <span>Delete ({selectedCount})</span>
            </button>
          )}
          <button
            onClick={onExportClick}
            className="btn-cta-secondary"
          >
            <FileDown size={20} />
            <span>Export</span>
          </button>
          <Link
            to="/invoice-form"
            className="btn-cta-primary whitespace-nowrap"
          >
            <FileText size={20} />
            <span>Add New Invoice</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
