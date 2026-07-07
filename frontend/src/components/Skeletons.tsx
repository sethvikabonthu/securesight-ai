import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`shimmer bg-slate-800 rounded ${className}`} />
  );
};

export const SkeletonCard: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-xl border border-white/5 bg-cyber-navy/30 flex flex-col gap-4 ${className}`}>
      <SkeletonLine className="h-6 w-1/3" />
      <SkeletonLine className="h-10 w-full" />
      <div className="flex gap-2">
        <SkeletonLine className="h-4 w-1/2" />
        <SkeletonLine className="h-4 w-1/4" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Header Skeleton */}
      <div className="flex gap-4 p-4 border-b border-white/5 bg-slate-900/40">
        {Array.from({ length: cols }).map((_, idx) => (
          <SkeletonLine key={idx} className="h-5 flex-1" />
        ))}
      </div>
      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 border-b border-white/5 items-center">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonLine key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
