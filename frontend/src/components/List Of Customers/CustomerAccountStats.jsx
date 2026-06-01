import React from 'react';
import { IndianRupee, Wallet, Clock, FileText, TrendingUp } from 'lucide-react';
import { formatINR } from './customerAccountUtils';

const StatTile = ({ title, value, subtitle, icon: Icon, accent = 'indigo' }) => {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex gap-3 items-start">
        <div className={`p-2 rounded-xl shrink-0 ${accents[accent]}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CustomerAccountStats({ stats, fyLabel }) {
  const {
    totalBilled,
    totalPaid,
    totalDue,
    invoiceCount,
    avgInvoice,
    collectionRate,
    statusCounts,
  } = stats;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile
          title="Billed this FY"
          value={formatINR(totalBilled)}
          subtitle={fyLabel}
          icon={IndianRupee}
          accent="indigo"
        />
        <StatTile
          title="Collected"
          value={formatINR(totalPaid)}
          subtitle={`${statusCounts.Paid} paid invoice${statusCounts.Paid !== 1 ? 's' : ''}`}
          icon={Wallet}
          accent="emerald"
        />
        <StatTile
          title="Outstanding"
          value={formatINR(totalDue)}
          subtitle={`${statusCounts.Due + statusCounts.Overdue} open`}
          icon={Clock}
          accent="amber"
        />
        <StatTile
          title="Invoices"
          value={invoiceCount}
          subtitle={
            invoiceCount > 0
              ? `Avg ${formatINR(avgInvoice)}`
              : 'No bills yet'
          }
          icon={FileText}
          accent="violet"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Collection rate</p>
              <p className="text-xs text-slate-500">
                Share of billed amount received in {fyLabel}
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{collectionRate}%</p>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand-primary transition-all duration-500"
            style={{ width: `${Math.min(100, collectionRate)}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {['Paid', 'Due', 'Overdue'].map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-xs font-medium text-slate-600 border border-slate-100"
            >
              <span className="font-semibold text-slate-900">{statusCounts[key]}</span>
              {key}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
