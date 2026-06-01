import React from 'react';

function Shimmer({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

export default function InvoiceFormSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-20 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Shimmer className="h-80 rounded-2xl" />
        <Shimmer className="h-80 rounded-2xl" />
        <Shimmer className="h-80 rounded-2xl" />
      </div>
      <Shimmer className="h-64 w-full rounded-2xl" />
    </div>
  );
}
