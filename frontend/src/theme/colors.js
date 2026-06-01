/**
 * Universal color palette for Billing Software.
 * Single source of truth for hex/rgba values used in JS (charts, inline styles).
 * CSS variables live in colors.css â€” keep both files in sync when adding colors.
 */

/** Raw palette (Tailwind-aligned names where applicable) */
export const palette = {
  black: '#000000',
  white: '#ffffff',

  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  gray: {
    100: '#f3f4f6',
    400: '#9ca3af',
    500: '#6b7280',
    800: '#1f2937',
  },

  indigo: {
    600: '#4f46e5',
    700: '#4338ca',
  },

  blue: {
    500: '#3b82f6',
  },

  emerald: {
    500: '#10b981',
  },

  green: {
    400: '#4ade80',
    500: '#22c55e',
  },

  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
  },

  red: {
    400: '#f87171',
    500: '#ef4444',
  },

  violet: {
    500: '#8b5cf6',
  },

  pink: {
    500: '#ec4899',
  },

  /** Recharts default segment color */
  chartPurple: '#8884d8',
};

/** Semantic tokens â€” use these in application code */
export const colors = {
  primary: palette.indigo[600],
  primaryHover: palette.indigo[700],

  bgMain: palette.slate[50],
  bgCard: palette.white,
  textMain: palette.slate[900],
  textMuted: palette.slate[500],
  borderMain: palette.slate[200],

  textOnPrimary: palette.white,

  dark: {
    bgSecondary: palette.slate[800],
    bgSecondaryHover: palette.slate[700],
    textOnDark: palette.slate[50],
    border: palette.slate[700],
  },

  status: {
    paid: palette.emerald[500],
    due: palette.amber[500],
    overdue: palette.red[500],
  },

  statusChart: {
    paid: palette.green[400],
    due: palette.amber[400],
    overdue: palette.red[400],
  },

  feedback: {
    success: palette.emerald[500],
    warning: palette.amber[500],
    error: palette.red[500],
    info: palette.blue[500],
  },

  print: {
    ink: palette.black,
    paper: palette.white,
    tableHeaderBg: palette.slate[50],
  },
};

/** Multi-series chart palettes */
export const chartPalette = [
  colors.primary,
  palette.emerald[500],
  palette.amber[500],
  palette.violet[500],
  palette.red[500],
  palette.pink[500],
];

export const chartPaletteItems = [
  palette.blue[500],
  palette.emerald[500],
  palette.amber[500],
  palette.red[500],
  palette.violet[500],
];

export const statusColors = {
  Paid: colors.status.paid,
  Due: colors.status.due,
  Overdue: colors.status.overdue,
};

export const invoiceStatusChartColors = [
  colors.statusChart.paid,
  colors.statusChart.overdue,
  colors.statusChart.due,
];

/** Shared Recharts tooltip styling */
export const chartTooltip = {
  backgroundColor: palette.gray[800],
  itemColor: palette.gray[100],
  labelColor: palette.gray[400],
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

/** Drop-in Recharts Tooltip props */
export const rechartsTooltipProps = {
  contentStyle: {
    backgroundColor: chartTooltip.backgroundColor,
    border: 'none',
    borderRadius: '12px',
    boxShadow: chartTooltip.boxShadow,
  },
  itemStyle: {
    color: chartTooltip.itemColor,
    fontSize: '14px',
    fontWeight: '900',
  },
  labelStyle: {
    color: chartTooltip.labelColor,
    marginBottom: '4px',
    fontSize: '12px',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
};

export const chartAxis = {
  tickFill: palette.gray[500],
  strokeMuted: palette.gray[400],
  gridStroke: palette.slate[200],
  tickFillReports: palette.slate[500],
};

export const chartInteraction = {
  primaryCursor: 'rgba(79, 70, 229, 0.05)',
  primaryCursorSubtle: 'rgba(79, 70, 229, 0.03)',
  blueCursor: 'rgba(37, 99, 235, 0.03)',
};

export const rgba = {
  black: {
    5: 'rgba(0, 0, 0, 0.05)',
    6: 'rgba(0, 0, 0, 0.06)',
    10: 'rgba(0, 0, 0, 0.1)',
  },
  primary: {
    10: 'rgba(79, 70, 229, 0.1)',
    30: 'rgba(79, 70, 229, 0.3)',
  },
};

/** Tailwind theme extension (used in tailwind.config.js) */
export const tailwindColors = {
  brand: {
    primary: colors.primary,
    'primary-hover': colors.primaryHover,
    surface: colors.bgMain,
    card: colors.bgCard,
    ink: colors.textMain,
    muted: colors.textMuted,
    border: colors.borderMain,
  },
  status: colors.status,
  chart: {
    1: chartPalette[0],
    2: chartPalette[1],
    3: chartPalette[2],
    4: chartPalette[3],
    5: chartPalette[4],
    6: chartPalette[5],
  },
};

export default colors;
