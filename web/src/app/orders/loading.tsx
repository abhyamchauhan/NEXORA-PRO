import { Skeleton } from "@/components/Skeleton";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-grey-50 px-6 py-16">
      <div className="max-w-container mx-auto">
        <Skeleton className="h-8 w-48 mb-10" />
        <div className="space-y-4 max-w-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
