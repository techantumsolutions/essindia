const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const hits = new Map<string, number[]>();

export function getRequestIp(req: { headers: Headers }): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function consumeFormRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
