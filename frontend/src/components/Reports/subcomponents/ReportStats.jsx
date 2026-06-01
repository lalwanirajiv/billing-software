import React from 'react';
import { TrendingUp, IndianRupee, FileText, Users, MapPin, Receipt } from 'lucide-react';
import { formatINR } from '../reportsUtils';

const StatTile = ({ title, value, subtitle, icon: Icon, accent = 'indigo' }) => {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-4 items-start">
      <div className={`p-2.5 rounded-xl shrink-0 ${accents[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 truncate">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const ReportStats = ({ taxMetrics, customers, reportType, sales }) => {
  const uniqueCustomers =
    customers.length ||
    (reportType === 'salesSummary' ? new Set(sales.map((s) => s.customer)).size : 0);

  const avgPerCustomer =
    customers.length > 0
      ? (taxMetrics.total_amount || 0) / customers.length
      : uniqueCustomers > 0
        ? (taxMetrics.total_amount || 0) / uniqueCustomers
        : 0;

  if (reportType === 'taxReport') {
    const tm = taxMetrics;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 no-print">
        <StatTile
          title="Gross turnover"
          value={formatINR(tm.total_amount)}
          subtitle="Including tax"
          icon={TrendingUp}
          accent="indigo"
        />
        <StatTile
          title="Taxable value"
          value={formatINR(tm.taxable_value)}
          subtitle="Net taxable base"
          icon={Receipt}
          accent="slate"
        />
        <StatTile
          title="Total GST"
          value={formatINR(tm.total_tax)}
          subtitle={`CGST ${formatINR(tm.total_cgst)} · SGST ${formatINR(tm.total_sgst)} · IGST ${formatINR(tm.total_igst)}`}
          icon={IndianRupee}
          accent="emerald"
        />
        <StatTile
          title="Supply mix"
          value={`${tm.state_count || 0} intra · ${tm.interstate_count || 0} inter`}
          subtitle="Invoice count by supply type"
          icon={MapPin}
          accent="violet"
        />
      </div>
    );
  }

  if (reportType === 'customerReport') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 no-print">
        <StatTile
          title="Total revenue"
          value={formatINR(taxMetrics.total_amount)}
          icon={TrendingUp}
          accent="indigo"
        />
        <StatTile
          title="Customers"
          value={customers.length}
          subtitle="In selected period"
          icon={Users}
          accent="violet"
        />
        <StatTile
          title="Avg per customer"
          value={formatINR(avgPerCustomer)}
          icon={IndianRupee}
          accent="emerald"
        />
        <StatTile
          title="Invoice volume"
          value={(taxMetrics.total_invoices || 0).toLocaleString('en-IN')}
          subtitle="Bills in period"
          icon={FileText}
          accent="amber"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 no-print">
      <StatTile
        title="Total revenue"
        value={formatINR(taxMetrics.total_amount)}
        icon={TrendingUp}
        accent="indigo"
      />
      <StatTile
        title="GST collected"
        value={formatINR(taxMetrics.total_tax)}
        subtitle={`Taxable ${formatINR(taxMetrics.taxable_value)}`}
        icon={IndianRupee}
        accent="emerald"
      />
      <StatTile
        title="Invoices"
        value={(taxMetrics.total_invoices || 0).toLocaleString('en-IN')}
        icon={FileText}
        accent="amber"
      />
      <StatTile
        title="Unique customers"
        value={uniqueCustomers.toLocaleString('en-IN')}
        icon={Users}
        accent="violet"
      />
    </div>
  );
};

export default ReportStats;
