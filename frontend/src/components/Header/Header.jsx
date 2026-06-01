import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, ChevronDown, LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import FinancialYearSelector from '../Reusables/FinancialYearSelector';
import { useCompanySettings } from '../../context/CompanySettingsContext';
import { getPageMeta } from '../../lib/pageMeta';

const navLinkBase =
  'inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors border-0 bg-transparent shadow-none outline-none';

function NavLink({ to, children, active, onClick }) {
  const className = active
    ? `${navLinkBase} text-brand-primary font-semibold`
    : `${navLinkBase} text-slate-600 hover:text-brand-primary`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { settings } = useCompanySettings();
  const { navKey } = getPageMeta(pathname);
  const companyName = settings?.company_name?.trim() || 'Billing Software';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInvoiceMenuOpen, setInvoiceMenuOpen] = useState(false);
  const [isCustomerMenuOpen, setCustomerMenuOpen] = useState(false);

  const invoiceMenuRef = useRef(null);
  const customerMenuRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setInvoiceMenuOpen(false);
    setCustomerMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (invoiceMenuRef.current && !invoiceMenuRef.current.contains(event.target)) {
        setInvoiceMenuOpen(false);
      }
      if (customerMenuRef.current && !customerMenuRef.current.contains(event.target)) {
        setCustomerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mobileLinkClass =
    'block px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-primary border-0 bg-transparent';

  const isInvoicesActive = navKey === 'invoices';
  const isCustomersActive = navKey === 'customers';

  return (
    <header className="bg-white sticky top-0 z-50 no-print shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2.5 min-w-0 group shrink">
            <div className="bg-brand-primary p-2 rounded-xl shrink-0 shadow-sm group-hover:bg-brand-primary-hover transition-colors">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px]">
              {companyName}
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center px-2 max-w-md">
            <FinancialYearSelector compact className="w-full" />
          </div>

          <div className="hidden md:flex items-center gap-1 shrink-0">
            <NavLink to="/" active={navKey === 'dashboard'}>
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>

            <div className="relative" ref={invoiceMenuRef}>
              <NavLink active={isInvoicesActive} onClick={() => setInvoiceMenuOpen((o) => !o)}>
                <FileText size={16} />
                Invoices
                <ChevronDown size={14} className={isInvoiceMenuOpen ? 'rotate-180' : ''} />
              </NavLink>
              {isInvoiceMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to="/invoice-form"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                  >
                    New invoice
                  </Link>
                  <Link
                    to="/invoices"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                  >
                    All invoices
                  </Link>
                </div>
              )}
            </div>

            <div className="relative" ref={customerMenuRef}>
              <NavLink active={isCustomersActive} onClick={() => setCustomerMenuOpen((o) => !o)}>
                <Users size={16} />
                Customers
                <ChevronDown size={14} className={isCustomerMenuOpen ? 'rotate-180' : ''} />
              </NavLink>
              {isCustomerMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to="/create-customer"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                  >
                    Add new customer
                  </Link>
                  <Link
                    to="/customers"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                  >
                    All customers
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/reports" active={navKey === 'reports'}>
              <BarChart3 size={16} />
              Reports
            </NavLink>
            <NavLink to="/settings" active={navKey === 'settings'}>
              <Settings size={16} />
              Settings
            </NavLink>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="py-3">
              <FinancialYearSelector />
            </div>
            <div className="space-y-1">
              <Link to="/" className={mobileLinkClass}>
                Dashboard
              </Link>
              <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Invoices
              </p>
              <Link to="/invoice-form" className={mobileLinkClass}>
                New invoice
              </Link>
              <Link to="/invoices" className={mobileLinkClass}>
                All invoices
              </Link>
              <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Customers
              </p>
              <Link to="/create-customer" className={mobileLinkClass}>
                Add new customer
              </Link>
              <Link to="/customers" className={mobileLinkClass}>
                All customers
              </Link>
              <Link to="/reports" className={mobileLinkClass}>
                Reports
              </Link>
              <Link to="/settings" className={mobileLinkClass}>
                Settings
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
