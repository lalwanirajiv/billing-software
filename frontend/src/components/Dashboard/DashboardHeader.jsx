import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, BarChart3, RefreshCw } from 'lucide-react';
import { getFinancialYearLabel, getGreeting } from './dashboardUtils';

export default function DashboardHeader({ companyName, fyLabel, onRefresh, refreshing }) {
  const fy = fyLabel || getFinancialYearLabel();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
      <div>
        <p className="text-sm font-medium text-brand-primary mb-1">{fy} · Business overview</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-slate-500 text-sm mt-1">{today}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh dashboard"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          <BarChart3 size={18} />
          Reports
        </Link>
        <Link to="/create-customer" className="btn-cta-secondary !py-2.5 !px-4 !text-sm">
          <Users size={18} />
          <span>Add Customer</span>
        </Link>
        <Link to="/invoice-form" className="btn-cta-primary !py-2.5 !px-4 !text-sm">
          <FileText size={18} />
          <span>New Invoice</span>
        </Link>
      </div>
    </div>
  );
}
