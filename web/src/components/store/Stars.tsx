// Rating stars using the brand rating-green, with a review count.
export function Stars({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "lg";
}) {
  const full = Math.round(rating);
  const cls = size === "lg" ? "text-xl" : "text-base";
  return (
    <div className="flex items-center gap-2">
      <span className={`${cls} tracking-tight text-rating leading-none`} aria-hidden>
        {"★★★★★".slice(0, full)}
        <span className="text-grey-300">{"★★★★★".slice(full)}</span>
      </span>
      <span className="text-sm text-grey-500">
        {rating.toFixed(1)}
        {count ? ` · ${count} review${count !== 1 ? "s" : ""}` : ""}
      </span>
    </div>
  );
}
