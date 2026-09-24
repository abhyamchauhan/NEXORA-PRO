import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-6xl">404</p>
        <p className="text-grey-500 text-sm mt-2 mb-6">
          This page or product doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="font-display text-sm tracking-button bg-ink text-white px-6 py-3 rounded-button hover:bg-black"
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}
