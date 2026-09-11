import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  // Throttle signups per IP to curb abuse.
  if (!rateLimit(`register:${clientIp(req)}`, 10, 60_000).ok)
    return Response.json(
      { error: "Too many attempts. Please try again in a minute." },
      { status: 429 },
    );

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, password } = (body ?? {}) as Record<string, unknown>;
  const cleanEmail =
    typeof email === "string" ? email.toLowerCase().trim() : "";
  const cleanName = typeof name === "string" ? name.trim() : "";
  const pass = typeof password === "string" ? password : "";

  if (!EMAIL_RE.test(cleanEmail)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (pass.length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });
  if (existing) {
    return Response.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(pass, 12);

  // Registrations are always customers. Admins are provisioned separately
  // (seed / DB), never via public sign-up — the role field is never accepted
  // from the request body.
  await prisma.user.create({
    data: {
      name: cleanName || null,
      email: cleanEmail,
      passwordHash,
      role: "customer",
    },
  });

  return Response.json({ ok: true }, { status: 201 });
}
