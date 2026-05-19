import { readdir } from 'fs/promises';
import path from 'path';

export type DiscoveredRoute = {
  routePath: string;
  title: string;
  pageType: string;
  isDynamic: boolean;
  filePath: string;
};

const APP_DIR = path.join(process.cwd(), 'src/app');
const SKIP_SEGMENTS = new Set(['admin', 'api', 'login']);

function titleFromRoute(routePath: string): string {
  if (routePath === '/') return 'Home';
  const segment = routePath.split('/').filter(Boolean).pop() || 'Page';
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildRoutePath(segments: string[]): string | null {
  const parts = segments.filter((s) => !s.startsWith('(') && !s.startsWith('[') && s !== 'page.tsx');
  if (segments.some((s) => s.includes('['))) {
    return null;
  }
  if (parts.length === 0) return '/';
  return `/${parts.join('/')}`;
}

async function walk(dir: string, segments: string[], results: DiscoveredRoute[]) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name === 'layout.tsx' || entry.name === 'loading.tsx') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_SEGMENTS.has(entry.name)) continue;
      await walk(fullPath, [...segments, entry.name], results);
      continue;
    }

    if (entry.name !== 'page.tsx') continue;

    const isDynamic = segments.some((s) => s.includes('['));
    const routePath = buildRoutePath(segments);

    if (!routePath && !isDynamic) continue;

    results.push({
      routePath: routePath ?? '/[dynamic]',
      title: titleFromRoute(routePath ?? '/[dynamic]'),
      pageType: isDynamic ? 'dynamic' : 'static',
      isDynamic,
      filePath: fullPath.replace(process.cwd(), ''),
    });
  }
}

export async function scanFilesystemRoutes(): Promise<DiscoveredRoute[]> {
  const results: DiscoveredRoute[] = [];
  await walk(APP_DIR, [], results);

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.routePath)) return false;
    seen.add(r.routePath);
    return !r.isDynamic;
  });
}
