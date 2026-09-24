import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Backend re-check for admin-only API actions. Every admin API route must call
 * this — middleware is defence-in-depth, not the only gate. Returns the session
 * when the caller is an admin, otherwise null.
 */
export async function getAdminSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

/** Returns the session for any authenticated user, otherwise null. */
export async function getUserSession(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session;
}

/** Standard 403 payload for admin API routes. */
export function forbidden() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

/** Standard 401 payload for authenticated-only API routes. */
export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
