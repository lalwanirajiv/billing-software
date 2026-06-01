export { formatINR, getFinancialYearLabel } from '../Dashboard/dashboardUtils';

export const REPORT_TYPES = [
  { id: 'salesSummary', label: 'Sales', description: 'Revenue & invoice ledger' },
  { id: 'customerReport', label: 'Customers', description: 'Rankings by revenue' },
  { id: 'taxReport', label: 'GST & Tax', description: 'Compliance breakdown' },
];

export function formatDateRangeLabel(startDate, endDate) {
  if (!startDate && !endDate) return 'All time';
  if (startDate && endDate) {
    const fmt = (d) =>
      new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  }
  if (startDate) return `From ${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  return `Until ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function getDatePresets() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const thisMonthStart = new Date(year, month, 1);
  const thisMonthEnd = new Date(year, month + 1, 0);

  const lastMonthStart = new Date(year, month - 1, 1);
  const lastMonthEnd = new Date(year, month, 0);

  const fyStartYear = month >= 3 ? year : year - 1;
  const fyStart = new Date(fyStartYear, 3, 1);
  const fyEnd = new Date(fyStartYear + 1, 2, 31);

  return [
    { id: 'thisMonth', label: 'This month', start: toISODate(thisMonthStart), end: toISODate(thisMonthEnd) },
    { id: 'lastMonth', label: 'Last month', start: toISODate(lastMonthStart), end: toISODate(lastMonthEnd) },
    { id: 'thisFY', label: 'This FY', start: toISODate(fyStart), end: toISODate(fyEnd) },
    { id: 'all', label: 'All time', start: '', end: '' },
  ];
}

export function getReportTypeLabel(reportType) {
  return REPORT_TYPES.find((t) => t.id === reportType)?.label ?? 'Report';
}
