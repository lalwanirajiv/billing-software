import React from 'react';

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = '',
  loading = false,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full ${className}`}
    >
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className={`relative flex-1 px-3 sm:px-4 pb-4 pt-2 min-h-[280px] ${bodyClassName}`}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
            <div className="h-9 w-9 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
