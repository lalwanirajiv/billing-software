import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileDown, LayoutDashboard } from 'lucide-react';
import PageHeader from '../Reusables/PageHeader';
import { formatINR } from './invoiceListUtils';

export default function InvoiceListPageHeader({
  totalCount,
  filteredCount,
  filteredAmount,
  statusFilter,
  fyLabel,
  onExportClick,
}) {
  const statusLabel = statusFilter !== 'All' ? ` · ${statusFilter} only` : '';
  const description =
    filteredCount === totalCount
      ? `${totalCount} invoice${totalCount !== 1 ? 's' : ''} · ${formatINR(filteredAmount)} total`
      : `${filteredCount} of ${totalCount} shown · ${formatINR(filteredAmount)} in view`;

  return (
    <PageHeader
      eyebrow={`${fyLabel || 'Financial year'}${statusLabel}`}
      title="Invoices"
      description={description}
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
            onClick={onExportClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            <FileDown size={18} />
            Export
          </button>
          <Link to="/invoice-form" className="btn-cta-primary !py-2.5 !px-4 !text-sm">
            <FileText size={18} />
            New invoice
          </Link>
        </>
      }
    />
  );
}
