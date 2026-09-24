import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";
import { PremiumCard } from "@/components/store/PremiumCard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  // Defence in depth — middleware already guards this route.
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const name = session.user.name || "—";
  const email = session.user.email || "";
  const role = (session.user.role || "customer").toString();
  const isAdmin = role.toLowerCase() === "admin";

  return (
    <main className="min-h-screen bg-grey-50 px-6 py-16 sm:py-20">
      <div className="max-w-container mx-auto">
        {/* Header */}
        <div className="anim-fade-up flex items-start justify-between gap-6 mb-12 sm:mb-14">
          <div>
            <Link
              href="/"
              className="font-display text-2xl leading-none lux-glow inline-block"
            >
              NEXORA
            </Link>
            <h1 className="font-display text-sm tracking-label text-grey-500 mt-3">
              My account
            </h1>
          </div>
          <SignOutButton />
        </div>

        {/* Editorial asymmetric grid — Account & Security is the anchor card */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.45fr_1fr] max-w-4xl">
          {/* Account & Security — larger, spans both rows on md+ */}
          <PremiumCard
            href="/account/security"
            className="anim-fade-up anim-delay-1 md:row-span-2 p-8 sm:p-10 flex flex-col"
          >
            <p className="font-display text-xs tracking-label text-grey-500">
              Account &amp; security
            </p>

            <div className="mt-8">
              <p className="font-display text-2xl sm:text-3xl leading-tight text-ink lux-glow">
                {name}
              </p>
              <p className="text-sm text-grey-500 mt-2 break-all">{email}</p>
              <p className="text-[11px] text-grey-400 mt-4 uppercase tracking-label">
                {isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            {/* Hairline divider */}
            <div className="h-px bg-grey-200 my-8" />

            <div className="mt-auto flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-xs tracking-label text-ink">
                  Security
                </p>
                <p className="text-sm text-grey-500 mt-2 max-w-xs">
                  Manage your password and account security.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="font-display text-lg text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </div>
          </PremiumCard>

          {/* Orders */}
          <PremiumCard
            href="/orders"
            className="anim-fade-up anim-delay-2 p-8 flex flex-col justify-between min-h-[9.5rem]"
          >
            <p className="font-display text-xs tracking-label text-grey-500">
              Orders
            </p>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-sm text-grey-600">View your order history</p>
              <span
                aria-hidden="true"
                className="font-display text-lg text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </div>
          </PremiumCard>

          {/* Wishlist */}
          <PremiumCard
            href="/account/wishlist"
            className="anim-fade-up anim-delay-3 p-8 flex flex-col justify-between min-h-[9.5rem]"
          >
            <p className="font-display text-xs tracking-label text-grey-500">
              Wishlist
            </p>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-sm text-grey-600">View saved products</p>
              <span
                aria-hidden="true"
                className="font-display text-lg text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              >
                &rarr;
              </span>
            </div>
          </PremiumCard>
        </div>
      </div>
    </main>
  );
}
