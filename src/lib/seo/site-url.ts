/**
 * Canonical site URL helpers.
 * Prefer NEXT_PUBLIC_SITE_URL; falls back to NEXT_PUBLIC_APP_URL then production default.
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://essindia.com';
  return raw.replace(/\/$/, '');
}

export function getPreferredHost(): string | null {
  const explicit = process.env.PREFERRED_HOST?.trim();
  if (explicit) return explicit.replace(/^https?:\/\//, '').replace(/\/$/, '');
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return null;
  }
}

export function shouldForceHttps(): boolean {
  return process.env.FORCE_HTTPS !== 'false';
}

/** Absolute URL for a path (leading slash). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
