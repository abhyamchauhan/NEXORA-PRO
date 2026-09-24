import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
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

        <div className="anim-fade-up mt-8 mb-10 max-w-md text-center mx-auto">
          <span className="lux-icon-ring h-16 w-16 mx-auto mb-6 flex">
            <ShieldCheck size={26} strokeWidth={1.5} />
          </span>
          <h1 className="font-lux-serif italic text-4xl sm:text-5xl leading-tight lux-glow-dark">
            {user?.passwordHash ? "Account security" : "Set your password"}
          </h1>
          <p className="text-sm text-white/50 mt-4">
            {user?.passwordHash
              ? "Change your password and keep your account secure."
              : "Add a password to sign in with email as well as Google."}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <PremiumCard
            interactive={false}
            className="is-dark anim-fade-up anim-delay-1 p-8 sm:p-10"
          >
            <SecurityForm hasPassword={!!user?.passwordHash} />
          </PremiumCard>
        </div>
      </div>
    </main>
  );
}
