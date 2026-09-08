import Link from "next/link";

// Friendly empty-state block used for empty cart, no search results, no orders.
export function EmptyState({
  icon = "◎",
  title,
  message,
  ctaLabel,
  ctaHref,
}: {
  icon?: string;
  title: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="border border-grey-200 bg-grey-50/50 px-6 py-16 text-center">
      <div className="text-4xl text-grey-300 mb-4" aria-hidden>
        {icon}
      </div>
      <h2 className="font-display text-xl mb-2">{title}</h2>
      {message && (
        <p className="text-sm text-grey-500 max-w-sm mx-auto">{message}</p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-block mt-6 font-display text-sm tracking-button bg-ink text-white px-7 py-3 rounded-button transition-all duration-300 hover:bg-black active:scale-95"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
