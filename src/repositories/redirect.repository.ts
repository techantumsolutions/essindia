import { db } from '@/lib/db';
import { urlRedirects } from '@/lib/db/schema';
import { eq, asc, and } from 'drizzle-orm';
import { withCache, safeRedisDel } from '@/lib/redis';

const CACHE_KEY = 'url_redirects:enabled_map';

function normalizePath(path: string): string {
  if (!path) return '/';
  let p = path.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

export class RedirectRepository {
  async findAll() {
    return db.query.urlRedirects.findMany({
      orderBy: [asc(urlRedirects.fromPath)],
    });
  }

  async getEnabledMap(): Promise<Record<string, { toPath: string; statusCode: number }>> {
    try {
      return await withCache(CACHE_KEY, async () => {
        const rows = await db.query.urlRedirects.findMany({
          where: eq(urlRedirects.isEnabled, true),
        });
        const map: Record<string, { toPath: string; statusCode: number }> = {};
        for (const row of rows) {
          map[normalizePath(row.fromPath)] = {
            toPath: row.toPath,
            statusCode: row.statusCode === 302 ? 302 : 301,
          };
        }
        return map;
      }, 60);
    } catch {
      return {};
    }
  }

  async findByFromPath(fromPath: string) {
    return db.query.urlRedirects.findFirst({
      where: and(
        eq(urlRedirects.fromPath, normalizePath(fromPath)),
        eq(urlRedirects.isEnabled, true)
      ),
    });
  }

  async create(data: {
    fromPath: string;
    toPath: string;
    statusCode?: number;
    isEnabled?: boolean;
    notes?: string | null;
  }) {
    const [row] = await db
      .insert(urlRedirects)
      .values({
        fromPath: normalizePath(data.fromPath),
        toPath: data.toPath.trim(),
        statusCode: data.statusCode === 302 ? 302 : 301,
        isEnabled: data.isEnabled !== false,
        notes: data.notes || null,
      })
      .returning();
    await safeRedisDel(CACHE_KEY);
    return row;
  }

  async update(
    id: string,
    data: Partial<{
      fromPath: string;
      toPath: string;
      statusCode: number;
      isEnabled: boolean;
      notes: string | null;
    }>
  ) {
    const payload: Record<string, unknown> = { updatedAt: new Date() };
    if (data.fromPath !== undefined) payload.fromPath = normalizePath(data.fromPath);
    if (data.toPath !== undefined) payload.toPath = data.toPath.trim();
    if (data.statusCode !== undefined) payload.statusCode = data.statusCode === 302 ? 302 : 301;
    if (data.isEnabled !== undefined) payload.isEnabled = data.isEnabled;
    if (data.notes !== undefined) payload.notes = data.notes;

    const [row] = await db
      .update(urlRedirects)
      .set(payload)
      .where(eq(urlRedirects.id, id))
      .returning();
    await safeRedisDel(CACHE_KEY);
    return row;
  }

  async delete(id: string) {
    await db.delete(urlRedirects).where(eq(urlRedirects.id, id));
    await safeRedisDel(CACHE_KEY);
  }
}

export const redirectRepository = new RedirectRepository();
