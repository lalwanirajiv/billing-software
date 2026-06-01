/** Indian financial year: 1 April – 31 March */

export function getFyStartYearFromDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return getCurrentFyStartYear();
  }
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return month >= 4 ? year : year - 1;
}

export function getCurrentFyStartYear() {
  return getFyStartYearFromDate(new Date());
}

export function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

export function getFyRangeFromStartYear(startYear) {
  const y = Number(startYear);
  const startDate = `${y}-04-01`;
  const endDate = `${y + 1}-03-31`;
  const key = `${y}-${y + 1}`;
  const label = `FY ${y}–${String(y + 1).slice(-2)}`;
  return {
    startYear: y,
    key,
    label,
    startDate,
    endDate,
    isCurrent: y === getCurrentFyStartYear(),
  };
}

export function getFinancialYearLabel(date = new Date()) {
  return getFyRangeFromStartYear(getFyStartYearFromDate(date)).label;
}

export function dateInRange(dateStr, startDate, endDate) {
  if (!dateStr) return false;
  const d = dateStr.slice(0, 10);
  return d >= startDate && d <= endDate;
}

/** Match invoice by date, or bill_no FY prefix when date missing */
export function invoiceInFinancialYear(invoice, startDate, endDate) {
  if (!invoice) return false;
  if (invoice.date) {
    return dateInRange(invoice.date, startDate, endDate);
  }
  const startYear = parseInt(startDate.slice(0, 4), 10);
  const prefix = `${startYear}-${startYear + 1}`;
  const billNo = String(invoice.bill_no || '');
  return billNo.startsWith(`${prefix}_`);
}

export function filterInvoicesByFinancialYear(invoices, startDate, endDate) {
  return (invoices || []).filter((inv) => invoiceInFinancialYear(inv, startDate, endDate));
}

export function buildFyYearList(startYears) {
  const unique = [...new Set(startYears.map(Number).filter((y) => !Number.isNaN(y)))];
  const current = getCurrentFyStartYear();
  if (!unique.includes(current)) unique.push(current);
  unique.sort((a, b) => b - a);
  return unique.map((y) => getFyRangeFromStartYear(y));
}

export function deriveFyStartYearsFromDates(dates) {
  const years = dates
    .filter(Boolean)
    .map((d) => getFyStartYearFromDate(new Date(d)));
  return buildFyYearList(years);
}
