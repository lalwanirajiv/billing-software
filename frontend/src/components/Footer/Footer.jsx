import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, BarChart3, Mail, Phone, LayoutDashboard, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center md:justify-items-start">
          {/* Navigation Column */}
          <div className="w-full max-w-[200px]">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-3 transition-colors">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-3 transition-colors">
                  <FileText size={18} /> Invoices
                </Link>
              </li>
              <li>
                <Link to="/customers" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-3 transition-colors">
                  <Users size={18} /> Customers
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm flex items-center gap-3 transition-colors">
                  <BarChart3 size={18} /> Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions Column */}
          <div className="w-full max-w-[200px]">
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/invoice-form" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                  Generate New Invoice
                </Link>
              </li>
              <li>
                <Link to="/create-customer" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                  Register New Client
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
