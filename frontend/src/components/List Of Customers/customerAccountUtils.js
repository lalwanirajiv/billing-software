export { formatINR } from '../List of Invoices/invoiceListUtils';
export { formatInvoiceDate, STATUS_STYLES } from '../List of Invoices/invoiceListUtils';

export function getCustomerInitials(name) {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function computeCustomerAccountStats(invoices) {
  const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.grand_total) || 0), 0);
  const paidInvoices = invoices.filter(
    (inv) => inv.invoice_status?.toLowerCase() === 'paid'
  );
  const totalPaid = paidInvoices.reduce(
    (acc, inv) => acc + (Number(inv.grand_total) || 0),
    0
  );
  const totalDue = Math.max(0, totalBilled - totalPaid);
  const collectionRate =
    totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;

  const statusCounts = { Paid: 0, Due: 0, Overdue: 0 };
  invoices.forEach((inv) => {
    const key = inv.invoice_status || 'Due';
    if (statusCounts[key] !== undefined) statusCounts[key]++;
    else statusCounts.Due++;
  });

  const invoiceCount = invoices.length;
  const avgInvoice = invoiceCount > 0 ? totalBilled / invoiceCount : 0;

  return {
    totalBilled,
    totalPaid,
    totalDue,
    collectionRate,
    statusCounts,
    invoiceCount,
    avgInvoice,
    paidCount: statusCounts.Paid,
  };
}

export function filterCustomerInvoices(invoices, { search = '', status = 'All' }) {
  const q = search.trim().toLowerCase();
  return invoices.filter((inv) => {
    const searchMatch =
      !q ||
      String(inv.bill_no ?? '').toLowerCase().includes(q) ||
      String(inv.grand_total ?? '').includes(q);
    const statusMatch =
      status === 'All' ||
      (inv.invoice_status || 'Due').toLowerCase() === status.toLowerCase();
    return searchMatch && statusMatch;
  });
}
