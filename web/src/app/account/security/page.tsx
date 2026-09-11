import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
    <main className="min-h-screen bg-grey-50 px-6 py-16">
      <div className="max-w-container mx-auto">
        <Link href="/account" className="text-sm text-grey-500 hover:text-ink">
          ← Account
        </Link>
        <h1 className="font-display text-2xl mt-3 mb-1">Password &amp; security</h1>
        <p className="text-sm text-grey-500 mb-8">
          {user?.passwordHash ? "Change your password." : "Add a password to your account."}
        </p>
        <div className="bg-white border border-grey-200 p-6">
          <SecurityForm hasPassword={!!user?.passwordHash} />
        </div>
      </div>
    </main>
  );
}
