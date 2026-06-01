import React from 'react';
import { Users, BadgeCheck, Search } from 'lucide-react';

const StatTile = ({ title, value, icon: Icon, accent = 'indigo' }) => {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    slate: 'bg-slate-100 text-slate-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex gap-3 items-start">
      <div className={`p-2 rounded-xl shrink-0 ${accents[accent]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default function CustomerListStats({
  totalCount,
  filteredCount,
  withGstinCount,
  activeInFy,
  invoicesInFy,
  isFiltering,
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatTile title="Total customers" value={totalCount} icon={Users} accent="indigo" />
      <StatTile title="Active this FY" value={activeInFy ?? 0} icon={Users} accent="violet" />
      <StatTile title="FY invoices" value={invoicesInFy ?? 0} icon={BadgeCheck} accent="emerald" />
      <StatTile
        title={isFiltering ? 'Matching search' : 'With GSTIN'}
        value={isFiltering ? filteredCount : withGstinCount}
        icon={Search}
        accent="slate"
      />
    </div>
  );
}
