import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Step 1 verification page: confirms the app runs AND that Prisma can talk to
// your Neon database. The real storefront homepage is built in Step 4.
async function getDbStatus() {
  try {
    const [products, variants, users] = await Promise.all([
      prisma.product.count(),
      prisma.variant.count(),
      prisma.user.count(),
    ]);
    return { ok: true as const, products, variants, users };
  } catch (err) {
    return {
      ok: false as const,
      message: err instanceof Error ? err.message : "Unknown database error",
    };
  }
}

export default async function Home() {
  const status = await getDbStatus();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-container mx-auto py-24">
        <p className="font-display text-xs tracking-label text-concrete mb-4">
          Step 1 — Project setup &amp; database
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-none mb-6">
          NEXORA
        </h1>
        <p className="font-body text-grey-400 max-w-xl mb-12">
          Premium streetwear storefront. Next.js App Router + Prisma +
          PostgreSQL (Neon). Men · Women · Kids.
        </p>

        <div className="border border-graphite bg-ink/40 p-6 max-w-md">
          <p className="font-display text-xs tracking-label text-concrete mb-4">
            Database connection
          </p>
          {status.ok ? (
            <div className="space-y-2 font-body text-sm">
              <p className="text-rating font-bold">✓ Connected to Neon</p>
              <ul className="text-grey-300 space-y-1">
                <li>Products: {status.products}</li>
                <li>Variants: {status.variants}</li>
                <li>Users: {status.users}</li>
              </ul>
            </div>
          ) : (
            <div className="font-body text-sm">
              <p className="text-sale font-bold mb-2">✗ Not connected</p>
              <p className="text-grey-400 break-words">{status.message}</p>
              <p className="text-grey-500 mt-3 text-xs">
                Set DATABASE_URL in <code>web/.env</code> and run{" "}
                <code>npm run db:push</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
