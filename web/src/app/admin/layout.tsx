import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // Middleware already gates /admin, but re-check so no admin chrome ever
  // renders for the wrong role.
  if (!session?.user) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-grey-50">
      <AdminNav email={session.user.email ?? ""} />
      <main className="max-w-container mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
