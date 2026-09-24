import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import { limit, clientIp } from "@/lib/rate-limit";

// POST /api/auth/forgot-password { email }
// Always responds { ok: true } — never reveals whether an account exists.
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await limit(`forgot:${ip}`, 5, 60_000)).ok)
    return Response.json({ ok: true }); // silently rate-limited

  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
  if (!email) return Response.json({ ok: true });

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const raw = await createResetToken(user.id);
    // Trusted, configured origin only — never the request Host header, so the
    // emailed reset link can't be poisoned to point at an attacker's domain.
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const url = `${base}/reset-password?token=${raw}`;
    // Best-effort; if email isn't configured this is a no-op (dev). The response
    // is identical either way so nothing leaks.
    await sendPasswordResetEmail(email, url);
  }

  return Response.json({ ok: true });
}
