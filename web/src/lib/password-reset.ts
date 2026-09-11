import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TTL_MS = 60 * 60 * 1000; // 1 hour

export const hashToken = (raw: string) =>
  crypto.createHash("sha256").update(raw).digest("hex");

// Create a single-use reset token for a user; returns the RAW token (emailed).
// Any older unused tokens for the user are invalidated first.
export async function createResetToken(userId: string): Promise<string> {
  const raw = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });
  await prisma.passwordResetToken.create({
    data: { userId, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + TTL_MS) },
  });
  return raw;
}

// Validate a raw token → the userId if valid, else null. Does not consume it.
export async function verifyResetToken(raw: string): Promise<string | null> {
  if (!raw) return null;
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(raw) },
  });
  if (!row || row.usedAt || row.expiresAt.getTime() < Date.now()) return null;
  return row.userId;
}

// Consume a token (mark used) once the password has been set.
export async function consumeResetToken(raw: string): Promise<void> {
  await prisma.passwordResetToken.update({
    where: { tokenHash: hashToken(raw) },
    data: { usedAt: new Date() },
  });
}
