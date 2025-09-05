import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from "../Icons/Icons";

const Header = ({ toggleTheme, theme }) => {
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
    hover:text-blue-600 dark:hover:text-blue-400 
    font-medium transition-colors 
    cursor-pointer select-none
  `;

  const dropdownLinkClasses =
    "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6a2 2 0 100-4 2 2 0 000 4zm0 12a2 2 0 100-4 2 2 0 000 4z"
                ></path>
              </svg>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                BillingApp
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/dashboard" className={navLinkClasses}>
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
          </div>

          {/* Theme Toggle + Mobile Menu */}
          <div className="flex items-center">
            <div className="hidden md:block">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-4 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Dashboard
            </Link>

            <h3 className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Invoices
            </h3>
            <Link
              to="/invoice-form"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Create Invoice
            </Link>
            <Link
              to="/invoices"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              View All Invoices
            </Link>

            <h3 className="px-3 pt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Customers
            </h3>
            <Link
              to="/create-customer"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Create Customer
            </Link>
            <Link
              to="/customers"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              View All Customers
            </Link>

            <Link
              to="/reports"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Reports
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
