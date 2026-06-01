import React from 'react';
import { Link } from 'react-router-dom';
import { FileDown, Printer, LayoutDashboard } from 'lucide-react';
import PageHeader from '../../Reusables/PageHeader';
import { formatDateRangeLabel, getReportTypeLabel } from '../reportsUtils';

const ReportHeader = ({ reportType, startDate, endDate, fyLabel, onExport, onPrint, recordCount }) => {
  const rangeLabel = formatDateRangeLabel(startDate, endDate);
  const reportLabel = getReportTypeLabel(reportType);

  return (
    <PageHeader
      eyebrow={`${fyLabel || 'Financial year'} · ${reportLabel} · ${rangeLabel}`}
      title="Reports"
      description={
        recordCount != null
          ? `${recordCount.toLocaleString('en-IN')} records in current view`
          : 'Financial monitoring for your billing data'
      }
      actions={
        <>
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
        </>
      }
    />
  );
};

export default ReportHeader;
