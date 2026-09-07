import { Skeleton } from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <div className="max-w-container mx-auto px-6 py-8">
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="grid lg:grid-cols-2 gap-10">
        <Skeleton className="aspect-[4/5] w-full" />
        <div>
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-20 w-full mb-6" />
          <Skeleton className="h-10 w-40 mb-4" />
          <Skeleton className="h-12 w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
}
