export const formLabelClass =
  'block text-sm font-medium text-slate-700 mb-1.5';

export const formHintClass = 'text-xs text-slate-400 mt-1';

export function formInputClass(hasError = false, readOnly = false) {
  if (readOnly) {
    return 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-default';
  }
  return `w-full px-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
      : 'border-slate-200 focus:ring-brand-primary/25 focus:border-brand-primary'
  }`;
}

export const formSectionClass =
  'bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4 h-full';
