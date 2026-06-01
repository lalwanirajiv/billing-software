import React from 'react';

function Shimmer({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

export default function CustomerAccountSkeleton() {
  return (
    <div className="space-y-6">
      <Shimmer className="h-16 w-full max-w-xl rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Shimmer className="h-72 rounded-2xl lg:col-span-1" />
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-24 rounded-2xl" />
          ))}
          <Shimmer className="h-20 rounded-2xl col-span-2" />
        </div>
      </div>
      <Shimmer className="h-12 w-full rounded-xl" />
      <Shimmer className="h-80 w-full rounded-2xl" />
    </div>
  );
}
