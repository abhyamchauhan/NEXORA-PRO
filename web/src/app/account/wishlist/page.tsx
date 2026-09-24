import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/ProductCard";

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
    <main className="relative min-h-screen overflow-hidden bg-[#08080a] text-white px-6 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 50% -10%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />

      <div className="relative max-w-container mx-auto">
        <Link
          href="/account"
          className="group inline-flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors"
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.6}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
          />
          Account
        </Link>

        <div className="anim-fade-up mt-8 mb-10 flex items-baseline gap-3">
          <h1 className="font-lux-serif italic text-4xl sm:text-5xl leading-tight lux-glow-dark">
            My wishlist
          </h1>
          {products.length > 0 && (
            <span className="font-display text-xs tracking-label text-white/40">
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {products.length === 0 ? (
          <div className="anim-fade-up anim-delay-1 max-w-md mx-auto text-center py-16">
            <span className="lux-icon-ring h-16 w-16 mx-auto mb-6 flex">
              <Heart size={26} strokeWidth={1.5} />
            </span>
            <h2 className="font-display text-xl text-white mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-white/50 max-w-sm mx-auto">
              Tap the heart on any product to save it here for later.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-2 bg-white text-[#0a0a0a] font-display text-sm tracking-button px-7 py-3 rounded-button transition-all duration-300 hover:shadow-[0_0_28px_-8px_rgba(255,255,255,0.5)]"
            >
              Explore products
              <ArrowRight
                size={18}
                strokeWidth={1.6}
                className="transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              />
            </Link>
          </div>
        ) : (
          <div className="anim-fade-up anim-delay-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
