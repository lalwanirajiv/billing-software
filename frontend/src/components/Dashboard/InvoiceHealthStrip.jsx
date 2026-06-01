import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ITEMS = [
  { key: 'invoicesPaid', label: 'Paid', status: 'Paid', icon: CheckCircle, accent: 'emerald' },
  { key: 'invoicesDue', label: 'Due', status: 'Due', icon: Clock, accent: 'amber' },
  { key: 'invoicesOverdue', label: 'Overdue', status: 'Overdue', icon: AlertCircle, accent: 'red' },
];

const accentStyles = {
  emerald: {
    card: 'hover:border-emerald-200 hover:bg-emerald-50/50',
    icon: 'text-emerald-600 bg-emerald-50',
    value: 'text-emerald-700',
  },
  amber: {
    card: 'hover:border-amber-200 hover:bg-amber-50/50',
    icon: 'text-amber-600 bg-amber-50',
    value: 'text-amber-700',
  },
  red: {
    card: 'hover:border-red-200 hover:bg-red-50/50',
    icon: 'text-red-600 bg-red-50',
    value: 'text-red-700',
  },
};

export default function InvoiceHealthStrip({ stats }) {
  const navigate = useNavigate();
  const total =
    (stats.invoicesPaid || 0) + (stats.invoicesDue || 0) + (stats.invoicesOverdue || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {ITEMS.map(({ key, label, status, icon: Icon, accent }) => {
        const value = stats[key] || 0;
        const styles = accentStyles[accent];
        const pct = total ? Math.round((value / total) * 100) : 0;

        return (
          <button
            key={key}
            type="button"
            onClick={() => navigate(`/invoices?status=${status}`)}
            className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-left transition-all ${styles.card}`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${styles.icon}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className={`text-2xl font-bold ${styles.value}`}>{value}</p>
              <p className="text-xs text-slate-400">{pct}% of all invoices</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
