export { formatINR } from '../Dashboard/dashboardUtils';

export const STATUS_OPTIONS = ['All', 'Paid', 'Due', 'Overdue'];

export const STATUS_STYLES = {
  Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
  Due: 'bg-amber-50 text-amber-800 ring-amber-600/15',
  Overdue: 'bg-red-50 text-red-700 ring-red-600/15',
};

export function formatInvoiceDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function normalizeStatusParam(statusParam) {
  if (!statusParam) return null;
  const normalized = statusParam.charAt(0).toUpperCase() + statusParam.slice(1).toLowerCase();
  return STATUS_OPTIONS.includes(normalized) ? normalized : null;
}

export function computeInvoiceStats(invoices) {
  const stats = { Paid: 0, Due: 0, Overdue: 0, totalAmount: 0 };
  invoices.forEach((inv) => {
    const amount = Number(inv.grand_total) || 0;
    stats.totalAmount += amount;
    const status = inv.invoice_status;
    if (status && stats[status] !== undefined) stats[status]++;
  });
  return stats;
}
