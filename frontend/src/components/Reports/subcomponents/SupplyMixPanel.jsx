import React from 'react';
import { MapPin, ArrowLeftRight, FileText, IndianRupee, Info } from 'lucide-react';
import {
  buildSupplyMixFromMetrics,
  formatINR,
  formatShareLabel,
  getAccentStyle,
} from '../supplyMixUtils';

function SupplyTypeCard({ row, highlight = 'amount' }) {
  const style = getAccentStyle(row.accent);
  const primary =
    highlight === 'amount'
      ? { label: 'Turnover', value: formatINR(row.amount), share: row.amountShare }
      : { label: 'Invoices', value: row.count.toLocaleString('en-IN'), share: row.invoiceShare };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${style.light} ${style.ring} ring-1`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-3 h-3 rounded-full shrink-0 ${style.dot}`} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{row.label}</p>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">{row.description}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-slate-900 tabular-nums shrink-0">
          {formatShareLabel(primary.share)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
            <FileText size={11} />
            Invoices
          </p>
          <p className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums">
            {row.count.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500">{formatShareLabel(row.invoiceShare)} of bills</p>
        </div>
        <div className="rounded-xl bg-white/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
            <IndianRupee size={11} />
            Turnover
          </p>
          <p className="text-lg font-bold text-slate-900 mt-0.5 tabular-nums truncate" title={formatINR(row.amount)}>
            {formatINR(row.amount)}
          </p>
          <p className="text-[11px] text-slate-500">{formatShareLabel(row.amountShare)} of value</p>
        </div>
      </div>
    </div>
  );
}

function SplitBar({ intra, inter }) {
  const intraPct = inter.amountShare > 0 || intra.amountShare > 0 ? intra.amountShare : intra.invoiceShare;
  const interPct = inter.amountShare > 0 || intra.amountShare > 0 ? inter.amountShare : inter.invoiceShare;
  const intraWidth = intraPct;
  const interWidth = interPct;

  if (intraWidth === 0 && interWidth === 0) {
    return <div className="h-3 rounded-full bg-slate-100" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
        {intraWidth > 0 && (
          <div
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${intraWidth}%` }}
            title={`Intra-state ${formatShareLabel(intraWidth)}`}
          />
        )}
        {interWidth > 0 && (
          <div
            className="bg-violet-500 transition-all duration-500"
            style={{ width: `${interWidth}%` }}
            title={`Inter-state ${formatShareLabel(interWidth)}`}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] font-medium text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Intra {formatShareLabel(intraWidth)}
        </span>
        <span className="flex items-center gap-1">
          Inter {formatShareLabel(interWidth)}
          <span className="w-2 h-2 rounded-full bg-violet-500" />
        </span>
      </div>
    </div>
  );
}

export default function SupplyMixPanel({ taxMetrics, loading, compact = false }) {
  const mix = buildSupplyMixFromMetrics(taxMetrics);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 animate-pulse">
        <div className="h-6 w-40 bg-slate-200 rounded mb-4" />
        <div className="h-3 w-full bg-slate-100 rounded-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-slate-100 rounded-2xl" />
          <div className="h-36 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <section
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm no-print ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      }`}
      aria-labelledby="supply-mix-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <MapPin size={20} />
          </div>
          <div>
            <h2 id="supply-mix-heading" className="text-base font-semibold text-slate-900">
              Supply mix
            </h2>
            <p className="text-sm text-slate-500 mt-0.5 max-w-xl">
              Split of invoices by supply type — intra-state (CGST + SGST) vs inter-state (IGST).
            </p>
          </div>
        </div>
        {mix.hasInvoices && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-xl px-3 py-2 shrink-0">
            <ArrowLeftRight size={14} className="text-slate-400" />
            <span>
              <strong className="text-slate-900">{mix.totalInvoices}</strong> invoices
            </span>
            <span className="text-slate-300">·</span>
            <span>{formatINR(mix.totalAmount)} turnover</span>
          </div>
        )}
      </div>

      {mix.isEmpty ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
          <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-800">No supply data for this period</p>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Create invoices in the selected date range, or widen the filter (e.g. This FY or All time)
            to see how intra-state and inter-state sales compare.
          </p>
        </div>
      ) : (
        <>
          <div className={compact ? 'mb-4' : 'mb-6'}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Turnover split
            </p>
            <SplitBar intra={mix.intra} inter={mix.inter} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SupplyTypeCard row={mix.intra} />
            <SupplyTypeCard row={mix.inter} />
          </div>

          {!compact && (
            <p className="mt-4 flex items-start gap-2 text-xs text-slate-500 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
              <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
              Bills with IGST are counted as inter-state; bills with only CGST/SGST count as intra-state.
            </p>
          )}
        </>
      )}
    </section>
  );
}
