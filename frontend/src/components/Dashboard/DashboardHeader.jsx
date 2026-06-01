import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, BarChart3, RefreshCw } from 'lucide-react';
import PageHeader from '../Reusables/PageHeader';
import { getGreeting } from './dashboardUtils';

export default function DashboardHeader({ fyLabel, onRefresh, refreshing }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <PageHeader
      eyebrow={`${getGreeting()} · ${fyLabel || 'Financial year'}`}
      title="Dashboard"
      description={today}
      className="mb-8"
      actions={
        <>
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
            <span>Add customer</span>
          </Link>
          <Link to="/invoice-form" className="btn-cta-primary !py-2.5 !px-4 !text-sm">
            <FileText size={18} />
            <span>New invoice</span>
          </Link>
        </>
      }
    />
  );
}
