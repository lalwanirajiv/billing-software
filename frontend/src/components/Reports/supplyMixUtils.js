import { formatINR } from './reportsUtils';

export const SUPPLY_TYPES = {
  intra: {
    key: 'intra',
    label: 'Intra-state',
    shortLabel: 'Intra',
    description: 'CGST + SGST · sales within your state',
    accent: 'blue',
  },
  inter: {
    key: 'inter',
    label: 'Inter-state',
    shortLabel: 'Inter',
    description: 'IGST · sales to other states',
    accent: 'violet',
  },
};

const accentStyles = {
  blue: {
    bar: 'bg-blue-500',
    light: 'bg-blue-50 text-blue-800 border-blue-100',
    dot: 'bg-blue-500',
    ring: 'ring-blue-100',
  },
  violet: {
    bar: 'bg-violet-500',
    light: 'bg-violet-50 text-violet-800 border-violet-100',
    dot: 'bg-violet-500',
    ring: 'ring-violet-100',
  },
};

export function getAccentStyle(accent) {
  return accentStyles[accent] || accentStyles.blue;
}

export function buildSupplyMixFromMetrics(taxMetrics = {}) {
  const intraCount = Number(taxMetrics.state_count) || 0;
  const interCount = Number(taxMetrics.interstate_count) || 0;
  const intraAmount = Number(taxMetrics.state_amount) || 0;
  const interAmount = Number(taxMetrics.interstate_amount) || 0;

  const totalInvoices = intraCount + interCount;
  const totalAmount = intraAmount + interAmount;
  const totalFromApi = Number(taxMetrics.total_invoices) || 0;
  const turnoverFromApi = Number(taxMetrics.total_amount) || 0;

  const invoiceTotal = totalInvoices > 0 ? totalInvoices : totalFromApi;
  const amountTotal = totalAmount > 0 ? totalAmount : turnoverFromApi;

  const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);

  return {
    intra: {
      ...SUPPLY_TYPES.intra,
      count: intraCount,
      amount: intraAmount,
      invoiceShare: pct(intraCount, invoiceTotal),
      amountShare: pct(intraAmount, amountTotal),
    },
    inter: {
      ...SUPPLY_TYPES.inter,
      count: interCount,
      amount: interAmount,
      invoiceShare: pct(interCount, invoiceTotal),
      amountShare: pct(interAmount, amountTotal),
    },
    totalInvoices: invoiceTotal,
    totalAmount: amountTotal,
    hasInvoices: invoiceTotal > 0,
    hasAmount: amountTotal > 0,
    isEmpty: invoiceTotal === 0 && amountTotal === 0,
  };
}

export function formatShareLabel(share) {
  if (!Number.isFinite(share)) return '—';
  return `${share}%`;
}

export { formatINR };
