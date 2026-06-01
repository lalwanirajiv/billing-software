import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, CloseIcon } from "../Reusables/Icons";
import { FileText } from "lucide-react";
import FinancialYearSelector from "../Reusables/FinancialYearSelector";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInvoiceMenuOpen, setInvoiceMenuOpen] = useState(false);
  const [isCustomerMenuOpen, setCustomerMenuOpen] = useState(false);

  const invoiceMenuRef = useRef(null);
  const customerMenuRef = useRef(null);

  // Close dropdowns if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        invoiceMenuRef.current &&
        !invoiceMenuRef.current.contains(event.target)
      ) {
        setInvoiceMenuOpen(false);
      }
      if (
        customerMenuRef.current &&
        !customerMenuRef.current.contains(event.target)
      ) {
        setCustomerMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClasses = `
    text-gray-600 dark:text-gray-300 
    hover:text-indigo-600 dark:hover:text-indigo-400 
    font-medium transition-colors 
    cursor-pointer select-none
  `;

  const dropdownLinkClasses =
    "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 no-print">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
                <FileText className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                BillingApp
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center px-4 max-w-xl">
            <FinancialYearSelector compact className="w-full" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6 shrink-0">
            <Link to="/" className={navLinkClasses}>
              Dashboard
            </Link>

            {/* Invoice Dropdown */}
            <div className="relative" ref={invoiceMenuRef}>
              <span
                onClick={() => setInvoiceMenuOpen(!isInvoiceMenuOpen)}
                className={navLinkClasses}
              >
                Invoices ▾
              </span>
              {isInvoiceMenuOpen && (
                <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                  <Link to="/invoice-form" className={dropdownLinkClasses}>
                    Create Invoice
                  </Link>
                  <Link to="/invoices" className={dropdownLinkClasses}>
                    View All Invoices
                  </Link>
                </div>
              )}
            </div>

            {/* Customer Dropdown */}
            <div className="relative" ref={customerMenuRef}>
              <span
                onClick={() => setCustomerMenuOpen(!isCustomerMenuOpen)}
                className={navLinkClasses}
              >
                Customers ▾
              </span>
              {isCustomerMenuOpen && (
                <div className="absolute mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                  <Link to="/create-customer" className={dropdownLinkClasses}>
                    Create Customer
                  </Link>
                  <Link to="/customers" className={dropdownLinkClasses}>
                    View All Customers
                  </Link>
                </div>
              )}
            </div>

            <Link to="/reports" className={navLinkClasses}>
              Reports
            </Link>
            <Link to="/settings" className={navLinkClasses}>
              Settings
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center">
            <span
              role="button"
              tabIndex={0}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
              className="p-2 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm cursor-pointer inline-flex items-center justify-center md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </span>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1">
            <div className="px-3 pb-3">
              <FinancialYearSelector />
            </div>
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Dashboard
            </Link>

            <h3 className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Invoices
            </h3>
            <Link
              to="/invoice-form"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Create Invoice
            </Link>
            <Link
              to="/invoices"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              View All Invoices
            </Link>

            <h3 className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Customers
            </h3>
            <Link
              to="/create-customer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Create Customer
            </Link>
            <Link
              to="/customers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              View All Customers
            </Link>

            <Link
              to="/reports"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Reports
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Settings
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
