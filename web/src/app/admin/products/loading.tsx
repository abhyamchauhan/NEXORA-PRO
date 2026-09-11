import { Skeleton } from "@/components/Skeleton";

export default function AdminProductsLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40 mb-6" />
      <Skeleton className="h-10 w-full mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
