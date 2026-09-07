import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await auth();
  // Belt-and-braces: middleware already blocks non-admins, but re-check here so
  // the page never renders admin data for the wrong role.
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");

  const [products, orders, customers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "customer" } }),
  ]);

  return (
    <main className="min-h-screen bg-ink text-white px-6 py-10">
      <div className="max-w-container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="font-display text-xs tracking-label text-concrete">
              NEXORA · Admin
            </p>
            <h1 className="font-display text-2xl mt-1">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-grey-400">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl">
          <Stat label="Products" value={products} />
          <Stat label="Orders" value={orders} />
          <Stat label="Customers" value={customers} />
        </div>

        <p className="text-grey-400 text-sm mt-10">
          Product management, image uploads and order handling arrive in{" "}
          <span className="text-white">Step 3</span>.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-xs tracking-button font-display text-concrete hover:text-white"
        >
          ← Back to storefront
        </Link>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-graphite bg-black/30 p-6">
      <p className="font-display text-4xl">{value}</p>
      <p className="font-display text-xs tracking-label text-grey-500 mt-2">
        {label}
      </p>
    </div>
  );
}
