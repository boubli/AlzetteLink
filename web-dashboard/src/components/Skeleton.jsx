/**
 * Skeleton - Animated shimmer loading placeholders
 */

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-5 w-32 rounded" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-6">
        <div className="skeleton w-24 h-24 rounded-full" />
        <div className="space-y-3 flex-1">
          <div className="skeleton h-10 w-28 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-5 w-40 rounded" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
      <div className="skeleton h-64 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonDeviceGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="skeleton w-3 h-3 rounded-full" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
            <div className="skeleton h-5 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="skeleton h-10 w-20 rounded" />
            <div className="skeleton h-10 w-24 rounded" />
          </div>
          <div className="skeleton h-12 w-full rounded mt-4" />
        </div>
      ))}
    </div>
  );
}
