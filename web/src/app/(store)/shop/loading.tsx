import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-24 mb-8" />
      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <div className="hidden lg:block space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <ProductGridSkeleton count={9} />
      </div>
    </div>
  );
}
