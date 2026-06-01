import React from 'react';
import { Link } from 'react-router-dom';
import { FileDown, Printer, LayoutDashboard } from 'lucide-react';
import { formatDateRangeLabel, getReportTypeLabel } from '../reportsUtils';

const ReportHeader = ({ reportType, startDate, endDate, fyLabel, onExport, onPrint, recordCount }) => {
  const rangeLabel = formatDateRangeLabel(startDate, endDate);

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
      <div>
        <p className="text-sm font-medium text-brand-primary mb-1">
          {fyLabel || 'Financial year'} · {getReportTypeLabel(reportType)} · {rangeLabel}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Reports & analytics
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {recordCount != null
            ? `${recordCount.toLocaleString('en-IN')} records in current view`
            : 'Financial monitoring for your billing data'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          <FileDown size={18} />
          Export CSV
        </button>
        <button type="button" onClick={onPrint} className="btn-cta-primary !py-2.5 !px-4 !text-sm">
          <Printer size={18} />
          Print report
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
