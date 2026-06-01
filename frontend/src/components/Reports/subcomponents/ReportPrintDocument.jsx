import React, { useMemo } from 'react';
import { colors } from '../../../theme';
import { printReportTheme as rp } from '../../../theme/printReportTheme';
import { useCompanySettings } from '../../../context/CompanySettingsContext';
import {
  formatINR,
  formatDateRangeLabel,
  getFinancialYearLabel,
  getReportTypeLabel,
} from '../reportsUtils';

const paletteEmerald = colors.feedback.success;

const KPI_VARIANTS = ['primary', 'revenue', 'tax', 'neutral'];

function formatPrintDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SummaryPill({ label, value, variant = 'neutral' }) {
  const v = rp.kpi[variant] || rp.kpi.neutral;
  return (
    <div
      className="report-print-kpi rounded-lg px-3 py-2.5"
      style={{
        backgroundColor: v.bg,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: v.border,
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wide"
        style={{ color: v.label }}
      >
        {label}
      </p>
      <p className="text-sm font-bold mt-0.5 tabular-nums" style={{ color: v.value }}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = status || 'Due';
  const style = rp.status[key] || rp.status.Due;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {key}
    </span>
  );
}

function StatusBreakdownRow({ statusBreakdown }) {
  if (!statusBreakdown?.length) return null;
  return (
    <div className="mb-6 report-print-status-section">
      <p
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: rp.accentDark }}
      >
        Invoice status
      </p>
      <div className="flex flex-wrap gap-2">
        {statusBreakdown.map((s) => {
          const st = rp.status[s.status] || rp.status.Due;
          return (
            <span
              key={s.status}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                backgroundColor: st.bg,
                color: st.text,
                border: `1px solid ${st.border}`,
              }}
            >
              <span className="font-bold uppercase">{s.status}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span className="tabular-nums">{Number(s.count || 0).toLocaleString('en-IN')}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ReportPrintDocument({
  reportType,
  sales = [],
  customers = [],
  taxMetrics = {},
  statusBreakdown = [],
  startDate,
  endDate,
}) {
  const { settings } = useCompanySettings();
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const rangeLabel = formatDateRangeLabel(startDate, endDate);
  const reportLabel = getReportTypeLabel(reportType);

  const sortedSales = useMemo(
    () =>
      [...sales].sort(
        (a, b) => (parseInt(a.invoice, 10) || 0) - (parseInt(b.invoice, 10) || 0)
      ),
    [sales]
  );

  const sortedCustomers = useMemo(
    () =>
      [...customers].sort(
        (a, b) => (Number(b.total_revenue) || 0) - (Number(a.total_revenue) || 0)
      ),
    [customers]
  );

  const tm = taxMetrics;
  const totalGst = (Number(tm.total_cgst) || 0) + (Number(tm.total_sgst) || 0) + (Number(tm.total_igst) || 0);

  const summaryPills =
    reportType === 'taxReport'
      ? [
          { label: 'Gross turnover', value: formatINR(tm.total_amount), variant: 'primary' },
          { label: 'Taxable value', value: formatINR(tm.taxable_value), variant: 'neutral' },
          { label: 'Total GST', value: formatINR(tm.total_tax || totalGst), variant: 'tax' },
          { label: 'Invoices', value: (tm.total_invoices || 0).toLocaleString('en-IN'), variant: 'revenue' },
        ]
      : reportType === 'customerReport'
        ? [
            { label: 'Total revenue', value: formatINR(tm.total_amount), variant: 'primary' },
            { label: 'Customers', value: customers.length.toLocaleString('en-IN'), variant: 'revenue' },
            { label: 'Invoices', value: (tm.total_invoices || 0).toLocaleString('en-IN'), variant: 'neutral' },
            { label: 'GST collected', value: formatINR(tm.total_tax), variant: 'tax' },
          ]
        : [
            { label: 'Total revenue', value: formatINR(tm.total_amount), variant: 'primary' },
            { label: 'GST collected', value: formatINR(tm.total_tax), variant: 'tax' },
            { label: 'Invoices', value: (tm.total_invoices || 0).toLocaleString('en-IN'), variant: 'revenue' },
            { label: 'Taxable base', value: formatINR(tm.taxable_value), variant: 'neutral' },
          ];

  const taxRows = [
    { label: 'Total invoices', value: (tm.total_invoices || 0).toLocaleString('en-IN'), tier: 'normal' },
    { label: 'Net taxable value', value: formatINR(tm.taxable_value), tier: 'normal' },
    { label: 'CGST', value: formatINR(tm.total_cgst), tier: 'tax' },
    { label: 'SGST', value: formatINR(tm.total_sgst), tier: 'tax' },
    { label: 'IGST', value: formatINR(tm.total_igst), tier: 'tax' },
    { label: 'Total GST liability', value: formatINR(tm.total_tax || totalGst), tier: 'highlight' },
    { label: 'Gross turnover', value: formatINR(tm.total_amount), tier: 'total' },
  ];

  const rowCount =
    reportType === 'salesSummary'
      ? sortedSales.length
      : reportType === 'customerReport'
        ? sortedCustomers.length
        : taxRows.length;

  const sectionTitle =
    reportType === 'salesSummary'
      ? 'Invoice ledger'
      : reportType === 'customerReport'
        ? 'Customer revenue summary'
        : 'GST & tax breakdown';

  return (
    <article className="report-print-document bg-white text-slate-900 p-8 sm:p-10 min-h-0">
      {/* Accent band */}
      <div
        className="report-print-accent-bar h-1.5 rounded-full mb-6"
        style={{ background: `linear-gradient(90deg, ${rp.accent} 0%, ${rp.accentDark} 50%, ${paletteEmerald} 100%)` }}
      />

      {/* Letterhead */}
      <header className="report-print-header flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 pb-6 mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight" style={{ color: rp.accentDark }}>
            {settings.company_name}
          </h1>
          {(settings.address_line1 || settings.address_line2) && (
            <p className="text-sm mt-2 leading-relaxed max-w-md" style={{ color: colors.textMuted }}>
              {[settings.address_line1, settings.address_line2].filter(Boolean).join(', ')}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: colors.textMuted }}>
            {settings.gstin && (
              <span>
                <span className="font-semibold" style={{ color: rp.accentDark }}>
                  GSTIN
                </span>{' '}
                {settings.gstin}
              </span>
            )}
            {settings.phone && (
              <span>
                <span className="font-semibold" style={{ color: rp.accentDark }}>
                  Tel
                </span>{' '}
                {settings.phone}
              </span>
            )}
          </div>
        </div>

        <div
          className="report-print-meta shrink-0 rounded-xl px-4 py-3 sm:min-w-[220px]"
          style={{
            backgroundColor: rp.metaPanelBg,
            border: `1px solid ${rp.metaPanelBorder}`,
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: rp.accent }}
          >
            {reportLabel} report
          </p>
          <h2 className="text-lg font-bold mt-0.5" style={{ color: colors.textMain }}>
            Financial statement
          </h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt style={{ color: colors.textMuted }}>Period</dt>
              <dd className="font-semibold text-right" style={{ color: colors.textMain }}>
                {rangeLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt style={{ color: colors.textMuted }}>Financial year</dt>
              <dd className="font-medium text-right" style={{ color: colors.textMain }}>
                {getFinancialYearLabel()}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt style={{ color: colors.textMuted }}>Generated</dt>
              <dd className="font-medium text-right text-xs" style={{ color: colors.textMain }}>
                {generatedAt}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* KPI strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {summaryPills.map((pill, i) => (
          <SummaryPill
            key={pill.label}
            label={pill.label}
            value={pill.value}
            variant={pill.variant || KPI_VARIANTS[i % KPI_VARIANTS.length]}
          />
        ))}
      </section>

      {reportType === 'salesSummary' && <StatusBreakdownRow statusBreakdown={statusBreakdown} />}

      {/* Ledger */}
      <section>
        <h3
          className="text-sm font-bold mb-3 pl-3 border-l-4"
          style={{ color: rp.accentDark, borderColor: rp.accent }}
        >
          {sectionTitle}
        </h3>

        <table className="w-full border-collapse text-sm report-print-table">
          <thead>
            {reportType === 'salesSummary' && (
              <tr className="report-print-thead">
                <th className="report-print-th w-10">#</th>
                <th className="report-print-th">Bill</th>
                <th className="report-print-th">Date</th>
                <th className="report-print-th">Customer</th>
                <th className="report-print-th text-right">Amount</th>
                <th className="report-print-th text-right">Tax</th>
                <th className="report-print-th text-center">Status</th>
              </tr>
            )}
            {reportType === 'customerReport' && (
              <tr className="report-print-thead">
                <th className="report-print-th w-10">#</th>
                <th className="report-print-th">Customer</th>
                <th className="report-print-th text-right">Invoices</th>
                <th className="report-print-th text-right">Revenue</th>
              </tr>
            )}
            {reportType === 'taxReport' && (
              <tr className="report-print-thead">
                <th className="report-print-th">Metric</th>
                <th className="report-print-th text-right">Value (INR)</th>
              </tr>
            )}
          </thead>
          <tbody>
            {reportType === 'salesSummary' &&
              sortedSales.map((r, i) => (
                <tr
                  key={`${r.invoice}-${i}`}
                  className={`report-print-row ${i % 2 === 1 ? 'report-print-row--stripe' : ''}`}
                >
                  <td className="report-print-td report-print-td--muted tabular-nums">{i + 1}</td>
                  <td className="report-print-td font-semibold" style={{ color: rp.accentDark }}>
                    #{r.invoice}
                  </td>
                  <td className="report-print-td">{formatPrintDate(r.date)}</td>
                  <td className="report-print-td">{r.customer}</td>
                  <td className="report-print-td report-print-td--amount text-right tabular-nums">
                    {formatINR(r.amount)}
                  </td>
                  <td className="report-print-td report-print-td--tax text-right tabular-nums">
                    {formatINR(r.tax)}
                  </td>
                  <td className="report-print-td text-center">
                    <StatusBadge status={r.invoice_status} />
                  </td>
                </tr>
              ))}

            {reportType === 'customerReport' &&
              sortedCustomers.map((r, i) => (
                <tr
                  key={`${r.customer}-${i}`}
                  className={`report-print-row ${i % 2 === 1 ? 'report-print-row--stripe' : ''}`}
                >
                  <td className="report-print-td report-print-td--muted tabular-nums">{i + 1}</td>
                  <td className="report-print-td font-medium">{r.customer}</td>
                  <td className="report-print-td text-right tabular-nums">{Number(r.total_invoices || 0).toLocaleString('en-IN')}</td>
                  <td className="report-print-td report-print-td--amount text-right tabular-nums font-semibold">
                    {formatINR(r.total_revenue)}
                  </td>
                </tr>
              ))}

            {reportType === 'taxReport' &&
              taxRows.map((row) => {
                const isHighlight = row.tier === 'highlight';
                const isTotal = row.tier === 'total';
                const isTax = row.tier === 'tax';
                let rowStyle = {};
                let cellClass = 'report-print-td';
                if (isTotal) {
                  rowStyle = { backgroundColor: rp.totalRow.bg, color: rp.totalRow.text };
                  cellClass = 'report-print-td report-print-td--total';
                } else if (isHighlight) {
                  rowStyle = { backgroundColor: rp.taxHighlight.bg, color: rp.taxHighlight.text };
                  cellClass = 'report-print-td report-print-td--highlight';
                } else if (isTax) {
                  rowStyle = { backgroundColor: rp.accentLight };
                }
                return (
                  <tr key={row.label} className="report-print-row" style={rowStyle}>
                    <td className={`${cellClass} ${isTotal || isHighlight ? 'font-semibold' : ''}`}>
                      {row.label}
                    </td>
                    <td className={`${cellClass} text-right tabular-nums font-semibold`}>{row.value}</td>
                  </tr>
                );
              })}
          </tbody>

          {reportType !== 'taxReport' && rowCount > 0 && (
            <tfoot>
              <tr className="report-print-tfoot">
                <td
                  colSpan={reportType === 'salesSummary' ? 4 : 2}
                  className="report-print-td report-print-td--total font-semibold"
                >
                  Totals ({rowCount.toLocaleString('en-IN')}{' '}
                  {reportType === 'salesSummary' ? 'invoices' : 'customers'})
                </td>
                {reportType === 'salesSummary' && (
                  <>
                    <td className="report-print-td report-print-td--total text-right font-bold tabular-nums">
                      {formatINR(tm.total_amount)}
                    </td>
                    <td className="report-print-td report-print-td--total text-right font-bold tabular-nums">
                      {formatINR(tm.total_tax)}
                    </td>
                    <td className="report-print-td report-print-td--total" />
                  </>
                )}
                {reportType === 'customerReport' && (
                  <>
                    <td className="report-print-td report-print-td--total text-right font-bold tabular-nums">
                      {(tm.total_invoices || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="report-print-td report-print-td--total text-right font-bold tabular-nums">
                      {formatINR(tm.total_amount)}
                    </td>
                  </>
                )}
              </tr>
            </tfoot>
          )}
        </table>

        {rowCount === 0 && (
          <p
            className="text-sm py-8 text-center rounded-lg"
            style={{
              color: colors.textMuted,
              border: `1px dashed ${rp.table.border}`,
              backgroundColor: rp.accentLight,
            }}
          >
            No records for the selected period.
          </p>
        )}
      </section>

      <footer
        className="report-print-footer mt-8 pt-4 px-4 -mx-4 sm:-mx-2 rounded-lg flex flex-col sm:flex-row sm:justify-between gap-2 text-[10px]"
        style={{
          backgroundColor: rp.footer.bg,
          color: rp.footer.text,
          borderTop: `1px solid ${rp.footer.border}`,
        }}
      >
        <p>
          <span className="font-semibold" style={{ color: rp.accentDark }}>
            {settings.company_name}
          </span>{' '}
          · {reportLabel} · {rangeLabel}
        </p>
        <p>Computer-generated report · {rowCount.toLocaleString('en-IN')} rows</p>
      </footer>

      <style>{`
        .report-print-document {
          --rp-accent: ${rp.accent};
          --rp-accent-dark: ${rp.accentDark};
          --rp-accent-light: ${rp.accentLight};
          --rp-th-bg: ${rp.table.headerBg};
          --rp-th-text: ${rp.table.headerText};
          --rp-border: ${rp.table.border};
          --rp-stripe: ${rp.table.rowStripe};
          --rp-total-bg: ${rp.totalRow.bg};
          --rp-total-text: ${rp.totalRow.text};
        }
        .report-print-header {
          border-bottom: 2px solid var(--rp-accent-dark);
        }
        .report-print-th {
          padding: 0.625rem 0.75rem;
          text-align: left;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: var(--rp-th-bg);
          color: var(--rp-th-text);
          border: 1px solid var(--rp-accent-dark);
        }
        .report-print-td {
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid var(--rp-border);
          color: ${colors.textMain};
        }
        .report-print-td--muted { color: ${colors.textMuted}; }
        .report-print-td--amount { color: ${rp.accentDark}; font-weight: 600; }
        .report-print-td--tax { color: ${colors.feedback.warning}; }
        .report-print-row--stripe .report-print-td {
          background-color: var(--rp-stripe);
        }
        .report-print-td--total,
        .report-print-tfoot .report-print-td {
          background-color: var(--rp-total-bg) !important;
          color: var(--rp-total-text) !important;
          border-color: var(--rp-accent-dark) !important;
        }
        @media print {
          .report-print-document { padding: 0 !important; }
          .report-print-th,
          .report-print-td--total,
          .report-print-tfoot .report-print-td,
          .report-print-kpi,
          .report-print-accent-bar {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .report-print-row { break-inside: avoid; }
        }
      `}</style>
    </article>
  );
}
