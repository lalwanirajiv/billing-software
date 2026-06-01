import React from 'react';

function Shimmer({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <Shimmer className="h-8 w-48" />
            <Shimmer className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-11 w-36 rounded-xl" />
            <Shimmer className="h-11 w-36 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Shimmer key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Shimmer className="h-24 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Shimmer className="h-[360px] lg:col-span-2 rounded-2xl" />
          <Shimmer className="h-[360px] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Shimmer className="h-80 rounded-2xl" />
          <Shimmer className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
