import { Skeleton } from "@/components/Skeleton";

export default function AdminOrdersLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}
