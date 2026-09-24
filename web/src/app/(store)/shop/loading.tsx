import { Skeleton, ProductGridSkeleton } from "@/components/store/Skeleton";

// Premium loading state for the listing page — shimmering skeletons while the
// product query runs, instead of a spinner or blank screen.
export default function ShopLoading() {
  return (
    <div className="max-w-container mx-auto px-6 py-10">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-24 mb-8" />
      <div className="grid lg:grid-cols-[20%_1fr] gap-10">
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="lg:border-l lg:border-grey-200/70 lg:pl-10">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
