import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PremiumCard } from "@/components/store/PremiumCard";
import { SecurityForm } from "./SecurityForm";

export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/security");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

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

        <div className="anim-fade-up mt-6 mb-10 max-w-md">
          <h1 className="font-display text-3xl leading-tight lux-glow">
            Password &amp; security
          </h1>
          <p className="text-sm text-grey-500 mt-3">
            {user?.passwordHash
              ? "Change your password."
              : "Add a password to your account."}
          </p>
        </div>

        <div className="max-w-md">
          <PremiumCard
            interactive={false}
            className="anim-fade-up anim-delay-1 p-8 sm:p-10"
          >
            <SecurityForm hasPassword={!!user?.passwordHash} />
          </PremiumCard>
        </div>
      </div>
    </main>
  );
}
