import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, FileSpreadsheet } from 'lucide-react';
import { formatINR } from '../reportsUtils';

const STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  Due: 'bg-amber-50 text-amber-800 ring-amber-600/15',
  Overdue: 'bg-red-50 text-red-700 ring-red-600/15',
};

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

const FinancialLedger = ({
  reportType,
  sales,
  customers,
  taxMetrics,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  loading,
}) => {
  const [search, setSearch] = useState('');

  const rawData = reportType === 'salesSummary' ? sales : reportType === 'customerReport' ? customers : [];

  const filteredData = useMemo(() => {
    if (!search.trim()) return rawData;
    const q = search.trim().toLowerCase();
    if (reportType === 'salesSummary') {
      return rawData.filter(
        (r) =>
          String(r.customer || '').toLowerCase().includes(q) ||
          String(r.invoice || '').includes(q)
      );
    }
    if (reportType === 'customerReport') {
      return rawData.filter((r) => String(r.customer || '').toLowerCase().includes(q));
    }
    return rawData;
  }, [rawData, search, reportType]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const ledgerTitle =
    reportType === 'salesSummary'
      ? 'Invoice ledger'
      : reportType === 'customerReport'
        ? 'Customer summary'
        : 'Tax summary';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-12 no-print">
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{ledgerTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredData.length.toLocaleString('en-IN')} row{filteredData.length !== 1 ? 's' : ''}
            {search ? ' (filtered)' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {reportType !== 'taxReport' && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-2 w-full sm:w-48 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 text-xs font-medium">Rows</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
              {reportType === 'salesSummary' && (
                <>
                  <th className="px-4 sm:px-6 py-3 w-12">#</th>
                  <th className="px-4 sm:px-6 py-3">Customer</th>
                  <th className="px-4 sm:px-6 py-3">Bill</th>
                  <th className="px-4 sm:px-6 py-3">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Amount</th>
                  <th className="px-4 sm:px-6 py-3">Status</th>
                </>
              )}
              {reportType === 'customerReport' && (
                <>
                  <th className="px-4 sm:px-6 py-3 w-12">#</th>
                  <th className="px-4 sm:px-6 py-3">Customer</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Invoices</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Revenue</th>
                </>
              )}
              {reportType === 'taxReport' && (
                <>
                  <th className="px-4 sm:px-6 py-3">Metric</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Value</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                  Loading ledger…
                </td>
              </tr>
            )}

            {!loading && reportType === 'salesSummary' &&
              currentData.map((r, i) => (
                <tr key={`${r.invoice}-${i}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-400 tabular-nums">
                    {(currentPage - 1) * rowsPerPage + i + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900 max-w-[200px] truncate">
                    {r.customer}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <Link
                      to={`/invoice/${r.invoice_id || ''}`}
                      className="text-brand-primary font-semibold hover:underline"
                      onClick={(e) => !r.invoice_id && e.preventDefault()}
                    >
                      #{r.invoice}
                    </Link>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-slate-600">{formatDate(r.date)}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                    {formatINR(r.amount)}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <StatusBadge status={r.invoice_status} />
                  </td>
                </tr>
              ))}

            {!loading && reportType === 'customerReport' &&
              currentData.map((r, i) => (
                <tr key={`${r.customer}-${i}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-400 tabular-nums">
                    {(currentPage - 1) * rowsPerPage + i + 1}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-900">{r.customer}</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right text-slate-600 tabular-nums">
                    {r.total_invoices}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-semibold text-slate-900 tabular-nums">
                    {formatINR(r.total_revenue)}
                  </td>
                </tr>
              ))}

            {!loading && reportType === 'taxReport' && (
              <>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700">Total invoices</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-medium tabular-nums">
                    {taxMetrics.total_invoices || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700">Net taxable value</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-medium tabular-nums">
                    {formatINR(taxMetrics.taxable_value)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700">CGST</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right tabular-nums">{formatINR(taxMetrics.total_cgst)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700">SGST</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right tabular-nums">{formatINR(taxMetrics.total_sgst)}</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="px-4 sm:px-6 py-3.5 text-slate-700">IGST</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right tabular-nums">{formatINR(taxMetrics.total_igst)}</td>
                </tr>
                <tr className="bg-brand-primary text-white">
                  <td className="px-4 sm:px-6 py-4 font-semibold">Total GST liability</td>
                  <td className="px-4 sm:px-6 py-4 text-right text-lg font-bold tabular-nums">
                    {formatINR(taxMetrics.total_tax)}
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-4 sm:px-6 py-3.5 font-medium text-slate-800">Gross turnover</td>
                  <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-slate-900 tabular-nums">
                    {formatINR(taxMetrics.total_amount)}
                  </td>
                </tr>
              </>
            )}

            {!loading && reportType !== 'taxReport' && currentData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No records found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {search ? 'Try a different search term' : 'Adjust your date range and apply filters'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reportType !== 'taxReport' && filteredData.length > 0 && (
        <div className="px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialLedger;
