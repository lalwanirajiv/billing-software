import { palette } from './colors.js';

/** Print report color tokens — used by ReportPrintDocument */
export const printReportTheme = {
  accent: palette.indigo[600],
  accentDark: palette.indigo[700],
  accentLight: '#eef2ff',
  accentMuted: '#e0e7ff',
  metaPanelBg: '#f8fafc',
  metaPanelBorder: '#e2e8f0',
  kpi: {
    primary: {
      bg: palette.indigo[600],
      border: palette.indigo[700],
      label: '#c7d2fe',
      value: palette.white,
    },
    revenue: {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      label: '#047857',
      value: '#065f46',
    },
    tax: {
      bg: '#fffbeb',
      border: '#fde68a',
      label: '#b45309',
      value: '#92400e',
    },
    neutral: {
      bg: '#f8fafc',
      border: '#e2e8f0',
      label: palette.slate[500],
      value: palette.slate[900],
    },
  },
  table: {
    headerBg: palette.indigo[700],
    headerText: palette.white,
    border: '#e2e8f0',
    rowStripe: '#f8fafc',
  },
  totalRow: { bg: palette.indigo[700], text: palette.white },
  taxHighlight: { bg: '#059669', text: palette.white },
  footer: { bg: '#f1f5f9', text: palette.slate[500], border: '#e2e8f0' },
  status: {
    'Paid': { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    'Due': { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    'Overdue': { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  },
};
