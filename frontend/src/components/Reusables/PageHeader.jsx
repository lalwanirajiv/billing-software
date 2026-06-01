import React from 'react';

/**
 * Consistent page title block — h1 matches nav label; eyebrow carries context (FY, filters, etc.).
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm font-medium text-brand-primary mb-1 truncate">{eyebrow}</p>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-slate-500 text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
