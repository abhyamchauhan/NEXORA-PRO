// Best-effort in-memory rate limiter (sliding fixed window). Good enough to
// blunt brute-force on a single instance; for multi-instance production, back
// this with Upstash/Redis. Never throws.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const e = store.get(key);
  if (!e || e.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (e.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((e.resetAt - now) / 1000) };
  }
  e.count += 1;
  return { ok: true, retryAfter: 0 };
}

// --- Distributed rate limiting (Upstash Redis REST) with in-memory fallback ---
// When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, counters are
// shared across instances (correct for serverless/multi-region on Vercel).
// Otherwise it transparently falls back to the in-memory limiter above.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isDistributedRateLimit = () => !!(UPSTASH_URL && UPSTASH_TOKEN);

async function upstash(path: string): Promise<number | null> {
  try {
    const res = await fetch(`${UPSTASH_URL}/${path}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: number };
    return typeof data.result === "number" ? data.result : null;
  } catch {
    return null;
  }
}

// Async limiter: use this in new code paths. Uses Upstash when configured, else
// the in-memory limiter. Never throws.
export async function limit(
  key: string,
  max: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfter: number }> {
  if (isDistributedRateLimit()) {
    const k = encodeURIComponent(`rl:${key}`);
    const count = await upstash(`incr/${k}`);
    if (count !== null) {
      if (count === 1) await upstash(`pexpire/${k}/${windowMs}`);
      if (count > max) return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
      return { ok: true, retryAfter: 0 };
    }
    // Upstash unreachable → fall through to in-memory.
  }
  return rateLimit(key, max, windowMs);
}

// Best-effort client IP from proxy headers.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
