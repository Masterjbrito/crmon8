"use client";

export function SkeletonCard() {
  return (
    <div className="card-on8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card-on8 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-40" />
        <div className="h-8 bg-gray-200 rounded w-64" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-4 bg-gray-100 rounded w-40" />
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-4 bg-gray-100 rounded w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div>
      <div className="global-stats-wrapper animate-pulse">
        <div className="flex gap-4 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[260px] h-[100px] bg-gray-200 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="dashboard-container">
        <div className="card-on8 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-40 mb-3" />
          <div className="h-[500px] bg-gray-100 rounded-xl" />
        </div>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
