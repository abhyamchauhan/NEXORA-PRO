import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div>
      <Skeleton className="h-[360px] w-full" />
      <div className="max-w-container mx-auto px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-3 mb-14">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
