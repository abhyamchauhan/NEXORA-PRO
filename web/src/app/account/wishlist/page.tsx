import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";

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
    <main className="min-h-screen bg-grey-50 px-6 py-16">
      <div className="max-w-container mx-auto">
        <Link href="/account" className="text-sm text-grey-500 hover:text-ink">
          ← Account
        </Link>
        <h1 className="font-display text-3xl mt-2 mb-8">My wishlist</h1>

        {products.length === 0 ? (
          <div className="max-w-xl bg-white">
            <EmptyState
              icon="♡"
              title="Your wishlist is empty"
              message="Tap the heart on any product to save it here for later."
              ctaLabel="Explore products"
              ctaHref="/shop"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 bg-white p-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
