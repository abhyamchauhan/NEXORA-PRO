"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-xs tracking-label text-grey-500 mb-3">
          Something went wrong
        </p>
        <h1 className="font-display text-3xl mb-3">We hit a snag</h1>
        <p className="text-sm text-grey-500 mb-6">
          Sorry about that. Please try again — if it keeps happening, refresh the
          page or come back shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black"
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
