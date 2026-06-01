export function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export { getFinancialYearLabel } from '../../lib/financialYear';

/**
 * Time-of-day greeting in the user's local timezone.
 * @param {Date} [now]
 */
export function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function calcCollectionRate(paid, due, overdue) {
  const total = (paid || 0) + (due || 0) + (overdue || 0);
  if (!total) return 0;
  return Math.round(((paid || 0) / total) * 100);
}

export function calcShare(value, total) {
  if (!total) return 0;
  return Math.round(((value || 0) / total) * 100);
}
