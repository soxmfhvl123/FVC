/**
 * Tiny in-memory rate limit (per server instance). Good enough to blunt form spam;
 * swap for a shared store (e.g. Vercel KV) if abuse shows up.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

export function clientKey(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}
