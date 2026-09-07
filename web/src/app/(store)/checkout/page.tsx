import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// Placeholder — the full shipping form + Razorpay flow is built in Step 5.
// Middleware already requires login to reach /checkout; re-checked here too.
export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  return (
    <div className="max-w-container mx-auto px-6 py-20 text-center">
      <h1 className="font-display text-2xl mb-3">Checkout</h1>
      <p className="text-grey-500 text-sm max-w-md mx-auto">
        The shipping form, order summary and payment (Razorpay test mode) are
        built in Step 5. Your bag is saved.
      </p>
      <Link
        href="/cart"
        className="inline-block mt-6 font-display text-sm tracking-button border border-grey-300 px-6 py-3 rounded-button hover:border-ink"
      >
        ← Back to bag
      </Link>
    </div>
  );
}
