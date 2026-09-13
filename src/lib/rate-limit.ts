/**
 * Best-effort in-memory rate limiter. Keyed by IP + bucket name.
 *
 * NOTE: serverless instances are ephemeral and not shared, so this caps abuse
 * per warm instance only — it is a speed bump, not a guarantee. The honeypot +
 * schema validation are the primary spam defenses. For hard limits, move to a
 * shared store (e.g. Upstash Redis).
 */
type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hit = buckets.get(key);

  if (!hit || now > hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((hit.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Pull a client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
