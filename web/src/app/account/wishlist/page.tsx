import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { PremiumCard } from "@/components/store/PremiumCard";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { include: { variants: true } } },
  });
  const products = items.map((i) => i.product);

  return (
    <main className="min-h-screen bg-grey-50 px-6 py-16 sm:py-20">
      <div className="max-w-container mx-auto">
        <Link
          href="/account"
          className="group inline-flex items-center gap-1.5 text-sm text-grey-500 hover:text-ink transition-colors"
        >
          <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1">
            &larr;
          </span>
          Account
        </Link>

        <div className="anim-fade-up mt-6 mb-10 flex items-baseline gap-3">
          <h1 className="font-display text-3xl leading-tight lux-glow">
            My wishlist
          </h1>
          {products.length > 0 && (
            <span className="font-display text-xs tracking-label text-grey-400">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {products.length === 0 ? (
          <div className="max-w-xl anim-fade-up anim-delay-1">
            <PremiumCard interactive={false} className="p-2">
              <EmptyState
                icon="♡"
                title="Your wishlist is empty"
                message="Tap the heart on any product to save it here for later."
                ctaLabel="Explore products"
                ctaHref="/shop"
              />
            </PremiumCard>
          </div>
        ) : (
          <div className="anim-fade-up anim-delay-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 bg-white border border-grey-200 p-4 sm:p-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
