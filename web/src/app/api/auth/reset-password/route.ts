import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyResetToken, consumeResetToken } from "@/lib/password-reset";
import { limit, clientIp } from "@/lib/rate-limit";

// POST /api/auth/reset-password { token, password }
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!(await limit(`reset:${ip}`, 10, 60_000)).ok)
    return Response.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as { token?: string; password?: string };
  const token = typeof body.token === "string" ? body.token : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (password.length < 8)
    return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });

  const userId = await verifyResetToken(token);
  if (!userId)
    return Response.json({ error: "This reset link is invalid or has expired." }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await consumeResetToken(token);

  return Response.json({ ok: true });
}
