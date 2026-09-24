export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-grey-100 ${className}`} />;
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block w-4 h-4 border-2 border-grey-300 border-t-ink rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[4/5] w-full" />
          <Skeleton className="h-4 w-2/3 mt-3" />
          <Skeleton className="h-4 w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
}
