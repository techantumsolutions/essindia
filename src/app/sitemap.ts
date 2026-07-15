import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { pages, seoMetadata } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSiteUrl } from '@/lib/seo/site-url';
import { withCache } from '@/lib/redis';

const BASE_URL = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const rows = await withCache(
      'page_paths_sitemap_v2',
      async () => {
        try {
          return await db
            .select({
              fullPath: pages.fullPath,
              updatedAt: pages.updatedAt,
              noIndex: seoMetadata.noIndex,
            })
            .from(pages)
            .leftJoin(seoMetadata, eq(pages.seoId, seoMetadata.id))
            .where(eq(pages.status, 'published'));
        } catch {
          return [];
        }
      },
      3600
    );

    return rows
      .filter((row) => !row.noIndex)
      .map(({ fullPath, updatedAt }) => ({
        url: `${BASE_URL}${fullPath === '/' ? '' : fullPath}`,
        lastModified: updatedAt || new Date(),
        changeFrequency: (fullPath === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
        priority: fullPath === '/' ? 1 : 0.8,
      }));
  } catch {
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
