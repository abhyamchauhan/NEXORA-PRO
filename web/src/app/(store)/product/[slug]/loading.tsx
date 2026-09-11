import { Skeleton } from "@/components/store/Skeleton";

// Premium loading state for the product detail page.
export default function ProductLoading() {
  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <Skeleton className="h-4 w-56 mb-8" />
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="flex gap-2 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-20" />
            ))}
          </div>
        </div>
        {/* Details */}
        <div className="lg:py-2 space-y-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-pill" />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-14 h-12" />
            ))}
          </div>
          <Skeleton className="h-14 w-full sm:w-64" />
        </div>
      </div>
    </div>
  );
}
