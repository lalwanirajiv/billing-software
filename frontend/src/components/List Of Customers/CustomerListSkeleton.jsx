import React from 'react';

function Shimmer({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

export default function CustomerListSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-20 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Shimmer key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Shimmer className="h-12 w-full rounded-xl" />
      <Shimmer className="h-96 w-full rounded-2xl" />
    </div>
  );
}
