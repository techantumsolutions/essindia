import { db } from '@/lib/db';
import { pages, pageSections } from '@/lib/db/schema';
import { eq, asc, and } from 'drizzle-orm';
import { withCache } from '@/lib/redis';

export class PageRepository {
  async getPageBySlug(slug: string) {
    try {
      return await withCache(`page:${slug}`, async () => {
        const page = await db.query.pages.findFirst({
          where: and(
            eq(pages.slug, slug),
            eq(pages.isPublished, true)
          ),
        });

        if (!page) return null;

        const sections = await db.query.pageSections.findMany({
          where: and(
            eq(pageSections.pageId, page.id),
            eq(pageSections.isActive, true)
          ),
          orderBy: [asc(pageSections.orderIndex)],
        });

        return {
          ...page,
          sections
        };
      });
    } catch (error) {
      console.error('[PageRepository] Error fetching page:', error);
      // Return null gracefully if table is missing or DB is unreachable
      return null;
    }
  }

  async getAllSlugs() {
    try {
      return await withCache('page_slugs', async () => {
        return db.query.pages.findMany({
          columns: { slug: true },
          where: eq(pages.isPublished, true),
        });
      }, 3600);
    } catch (error) {
      console.error('[PageRepository] Error fetching slugs:', error);
      return [];
    }
  }
}

export const pageRepository = new PageRepository();
