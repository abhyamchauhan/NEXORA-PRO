export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-[#08080a] px-6 py-16 sm:py-20">
      <div className="max-w-container mx-auto">
        <div className="h-4 w-20 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-10 w-64 rounded bg-white/[0.06] animate-pulse mt-8 mb-10" />
        <div className="space-y-4 max-w-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full rounded border border-white/8 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
