import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  // Defence in depth — middleware already guards this route.
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <main className="min-h-screen bg-grey-50 px-6 py-16">
      <div className="max-w-container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/" className="font-display text-2xl leading-none">
              NEXORA
            </Link>
            <h1 className="font-display text-sm tracking-label text-grey-500 mt-2">
              My account
            </h1>
          </div>
          <SignOutButton />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
          <div className="bg-white border border-grey-200 p-6">
            <p className="font-display text-xs tracking-label text-grey-500 mb-3">
              Profile
            </p>
            <p className="text-sm">{session.user.name || "—"}</p>
            <p className="text-sm text-grey-500">{session.user.email}</p>
            <p className="text-xs text-grey-400 mt-2 uppercase tracking-label">
              {session.user.role}
            </p>
          </div>

          <Link
            href="/orders"
            className="bg-white border border-grey-200 p-6 hover:border-ink transition-colors"
          >
            <p className="font-display text-xs tracking-label text-grey-500 mb-3">
              Orders
            </p>
            <p className="text-sm">View your order history →</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-white border border-grey-200 p-6 hover:border-ink transition-colors"
          >
            <p className="font-display text-xs tracking-label text-grey-500 mb-3">
              Wishlist
            </p>
            <p className="text-sm">View saved products →</p>
          </Link>

          <Link
            href="/account/security"
            className="bg-white border border-grey-200 p-6 hover:border-ink transition-colors"
          >
            <p className="font-display text-xs tracking-label text-grey-500 mb-3">
              Password &amp; security
            </p>
            <p className="text-sm">Set or change your password →</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
