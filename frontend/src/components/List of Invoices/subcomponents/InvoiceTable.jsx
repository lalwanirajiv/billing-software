import React from 'react';
import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon } from '../../Reusables/Icons';
import { FileText, RefreshCw } from 'lucide-react';
import { formatINR, formatInvoiceDate, STATUS_STYLES } from '../invoiceListUtils';

function StatusBadge({ status }) {
  const key = status || 'Due';
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full ring-1 ring-inset ${
        STATUS_STYLES[key] || STATUS_STYLES.Due
      }`}
    >
      {key}
    </span>
  );
}

export const InvoiceTable = ({
  filteredInvoices,
  formatDate = formatInvoiceDate,
  onRowClick,
  onEditClick,
  onDeleteClick,
  searchTerm,
  dateFilter,
  statusFilter,
  selectedInvoices,
  onToggleSelect,
  onToggleSelectAll,
  onRefresh,
}) => {
  const hasFilters = Boolean(searchTerm || dateFilter || statusFilter !== 'All');

  if (filteredInvoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm py-16 px-6 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">No invoices found</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          {hasFilters
            ? 'Try adjusting search, date, or status filters.'
            : 'Create your first invoice to start tracking revenue.'}
        </p>
        {!hasFilters && (
          <Link to="/invoice-form" className="btn-cta-primary inline-flex mt-6 !text-sm">
            <FileText size={18} />
            New invoice
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                  onChange={onToggleSelectAll}
                  checked={
                    filteredInvoices.length > 0 &&
                    selectedInvoices.length === filteredInvoices.length
                  }
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Bill</th>
              <th className="px-4 py-3 hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInvoices.map((invoice, index) => (
              <tr
                key={invoice.invoice_id}
                onClick={() => onRowClick(invoice.invoice_id)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    checked={selectedInvoices.includes(invoice.invoice_id)}
                    onChange={() => onToggleSelect(invoice.invoice_id)}
                    aria-label={`Select bill ${invoice.bill_no}`}
                  />
                </td>
                <td className="px-4 py-3.5 text-slate-400 tabular-nums">{index + 1}</td>
                <td className="px-4 py-3.5 max-w-[180px]">
                  <p className="font-semibold text-slate-900 truncate group-hover:text-brand-primary transition-colors">
                    {invoice.ship_to || '—'}
                  </p>
                  <p className="text-xs text-slate-400 sm:hidden mt-0.5">{formatDate(invoice.date)}</p>
                </td>
                <td className="px-4 py-3.5 font-semibold text-brand-primary">#{invoice.bill_no}</td>
                <td className="px-4 py-3.5 hidden sm:table-cell text-slate-600 whitespace-nowrap">
                  {formatDate(invoice.date)}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                  {formatINR(invoice.grand_total)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={invoice.invoice_status} />
                </td>
                <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => onEditClick(e, invoice.invoice_id)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onDeleteClick(e, invoice)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-primary"
        >
          <RefreshCw size={14} />
          Refresh list
        </button>
        <span className="text-xs text-slate-400">Click a row to view invoice</span>
      </div>
    </div>
  );
};
