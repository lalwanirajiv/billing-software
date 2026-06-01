import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { formatINR, calcCollectionRate, calcShare } from './dashboardUtils';
import { colors } from '../../theme';

const SEGMENTS = [
  { key: 'paid', label: 'Collected', status: 'Paid', icon: CheckCircle, color: colors.status.paid },
  { key: 'due', label: 'Due', status: 'Due', icon: Clock, color: colors.status.due },
  { key: 'overdue', label: 'Overdue', status: 'Overdue', icon: AlertCircle, color: colors.status.overdue },
];

export default function CollectionsOverview({ stats }) {
  const navigate = useNavigate();
  const paid = stats.paidAmount || 0;
  const due = stats.dueAmount || 0;
  const overdue = stats.overdueAmount || 0;
  const total = paid + due + overdue;
  const collectionRate = calcCollectionRate(paid, due, overdue);
  const outstanding = due + overdue;

  const amounts = { paid, due, overdue };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Collections overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Invoice value split by payment status
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <TrendingUp size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wide font-semibold text-emerald-700">
              Collection rate
            </p>
            <p className="text-lg font-bold text-emerald-800 leading-tight">{collectionRate}%</p>
          </div>
        </div>
      </div>

      <div className="h-3 rounded-full overflow-hidden flex bg-slate-100 mb-6">
        {SEGMENTS.map(({ key, color }) => {
          const share = calcShare(amounts[key], total);
          if (!share) return null;
          return (
            <div
              key={key}
              className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${share}%`, backgroundColor: color }}
              title={`${share}%`}
            />
          );
        })}
        {!total && <div className="h-full w-full bg-slate-200" />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SEGMENTS.map(({ key, label, status, icon: Icon, color }) => (
          <button
            key={key}
            type="button"
            onClick={() => navigate(`/invoices?status=${status}`)}
            className="text-left p-4 rounded-xl border border-slate-100 hover:border-brand-primary/40 hover:bg-slate-50/80 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold text-slate-400 group-hover:text-brand-primary">
                View →
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{formatINR(amounts[key])}</p>
            <p className="text-xs text-slate-400 mt-1">{calcShare(amounts[key], total)}% of total</p>
          </button>
        ))}
      </div>

      {outstanding > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-4">
          <span className="font-semibold">{formatINR(outstanding)}</span> outstanding across due and overdue invoices — follow up to improve cash flow.
        </p>
      )}
    </div>
  );
}
