import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const variants = {
  primary: {
    icon: 'bg-indigo-50 text-indigo-600',
    ring: 'hover:ring-indigo-100',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-600',
    ring: 'hover:ring-emerald-100',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-600',
    ring: 'hover:ring-amber-100',
  },
  danger: {
    icon: 'bg-red-50 text-red-600',
    ring: 'hover:ring-red-100',
  },
  neutral: {
    icon: 'bg-slate-100 text-slate-600',
    ring: 'hover:ring-slate-100',
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeType,
  changeLabel = 'vs last month',
  onClick,
  variant = 'primary',
}) => {
  const isPositive = changeType === 'positive';
  const styles = variants[variant] || variants.primary;
  const interactive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={`bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[140px] ring-2 ring-transparent transition-all ${styles.ring} ${
        interactive ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <span className="text-sm font-medium text-slate-500 leading-snug">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${styles.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}

        {change != null && changeType != null && (
          <div
            className={`mt-2 flex items-center text-sm font-medium ${
              isPositive ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            ) : (
              <ArrowDownRight className="h-4 w-4 shrink-0" />
            )}
            <span>{change}%</span>
            <span className="text-slate-400 font-normal ml-1">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
