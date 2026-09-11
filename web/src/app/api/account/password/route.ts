import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// POST /api/account/password { currentPassword?, newPassword }
// Sets or changes the signed-in user's password. Google-only accounts (no
// existing hash) may set one without a current password — this is how they add
// email/password login. Accounts that already have a password must confirm it.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Not signed in." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  if (newPassword.length < 8)
    return Response.json({ error: "New password must be at least 8 characters." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return Response.json({ error: "Account not found." }, { status: 404 });

  // If a password already exists, require the current one.
  if (user.passwordHash) {
    const current = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const ok = current ? await bcrypt.compare(current, user.passwordHash) : false;
    if (!ok)
      return Response.json({ error: "Your current password is incorrect." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return Response.json({ ok: true, hadPassword: !!user.passwordHash });
}

// GET — whether the account currently has a password (drives the UI copy).
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not signed in." }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });
  return Response.json({ hasPassword: !!user?.passwordHash });
}
