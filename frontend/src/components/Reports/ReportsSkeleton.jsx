import React from 'react';

function Shimmer({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

export default function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-20 w-full rounded-2xl" />
      <Shimmer className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Shimmer className="h-96 lg:col-span-2 rounded-2xl" />
        <Shimmer className="h-96 rounded-2xl" />
      </div>
      <Shimmer className="h-80 rounded-2xl" />
    </div>
  );
}
