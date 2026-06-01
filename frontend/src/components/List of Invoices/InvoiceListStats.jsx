import React from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, CheckSquare } from 'lucide-react';
import { formatINR } from './invoiceListUtils';

const StatTile = ({ title, value, subtitle, icon: Icon, accent = 'indigo', onClick, active }) => {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    violet: 'bg-violet-50 text-violet-600',
    slate: 'bg-slate-100 text-slate-600',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`bg-white p-4 rounded-2xl border text-left transition-all w-full ${
        active ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-slate-200/80 shadow-sm'
      } ${onClick ? 'hover:border-brand-primary/40 hover:shadow-md' : ''}`}
    >
      <div className="flex gap-3 items-start">
        <div className={`p-2 rounded-xl shrink-0 ${accents[accent]}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5 truncate">{value}</p>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </Component>
  );
};

export default function InvoiceListStats({
  totalCount,
  totalAmount,
  statusCounts,
  selectedCount,
  statusFilter,
  onStatusFilter,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      <StatTile
        title="All invoices"
        value={totalCount}
        subtitle={formatINR(totalAmount)}
        icon={FileText}
        accent="indigo"
        onClick={() => onStatusFilter('All')}
        active={statusFilter === 'All'}
      />
      <StatTile
        title="Paid"
        value={statusCounts.Paid}
        icon={CheckCircle}
        accent="emerald"
        onClick={() => onStatusFilter('Paid')}
        active={statusFilter === 'Paid'}
      />
      <StatTile
        title="Due"
        value={statusCounts.Due}
        icon={Clock}
        accent="amber"
        onClick={() => onStatusFilter('Due')}
        active={statusFilter === 'Due'}
      />
      <StatTile
        title="Overdue"
        value={statusCounts.Overdue}
        icon={AlertCircle}
        accent="red"
        onClick={() => onStatusFilter('Overdue')}
        active={statusFilter === 'Overdue'}
      />
      <StatTile
        title="Selected"
        value={selectedCount}
        icon={CheckSquare}
        accent={selectedCount > 0 ? 'violet' : 'slate'}
      />
    </div>
  );
}
