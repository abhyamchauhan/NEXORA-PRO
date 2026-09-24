// Shimmering skeleton block. Pure presentational — used by route loading.tsx
// files to show a premium loading state instead of a spinner.
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} aria-hidden />;
}

// A product-card-shaped placeholder (4:5 image + two text lines).
export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-4 w-3/4 mt-3" />
      <Skeleton className="h-4 w-1/3 mt-2" />
    </div>
  );
}

// A grid of product-card skeletons.
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
