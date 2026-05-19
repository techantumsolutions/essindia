import { db } from '@/lib/db';
import { pages, pageSections, seoMetadata } from '@/lib/db/schema';
import { eq, asc, and } from 'drizzle-orm';
import { withCache } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { getPostgresErrorCode, isConnectionError, isMissingSchemaError } from '@/lib/cms/pg-error';
import { cache } from 'react';

export class PageRepository {
  /**
   * Fetches a page by its slug with caching and React cache()
   * Optimized for Next.js App Router
   */
  getPageBySlug = cache(async (slug: string) => {
    return this.getPageByPath(slug === 'index' ? '/' : `/${slug}`);
  });

  /**
   * Fetches a page by its full hierarchical path
   */
  getPageByPath = cache(async (path: string) => {
    try {
      if (!path || path.startsWith('/.') || path.includes('favicon.ico')) {
        return null;
      }

      // Normalized path: ensure leading slash, no trailing slash (unless root)
      const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');

      return await withCache(`page:${normalizedPath}`, async () => {
        try {
          const page = await db.query.pages.findFirst({
            where: and(
              eq(pages.fullPath, normalizedPath),
              eq(pages.status, 'published')
            ),
            with: {
              seo: true,
              sections: {
                where: eq(pageSections.isActive, true),
                orderBy: [asc(pageSections.orderIndex)],
              }
            }
          });

          return page || null;
        } catch (dbError: unknown) {
          const pgCode = getPostgresErrorCode(dbError);
          if (pgCode === '42P01' || isMissingSchemaError(dbError) || isConnectionError(dbError)) {
            if (!isConnectionError(dbError)) {
              logger.warn(
                '[PageRepository] Database schema out of date. Run: npm run db:apply-page-nav (and db:apply-mega-menu if needed). Homepage will use fallbacks until migrations are applied.'
              );
            }
            return null;
          }
          throw dbError;
        }
      });
    } catch (error) {
      if (isMissingSchemaError(error)) {
        logger.warn(`[PageRepository] Skipping CMS page for path "${path}" (schema mismatch).`);
        return null;
      }
      logger.error(`[PageRepository] Error fetching page path: ${path}`, error);
      return null;
    }
  });

  /**
   * Fetches all published paths for static generation
   */
  async getAllPaths() {
    try {
      return await withCache('page_paths', async () => {
        try {
          return await db.query.pages.findMany({
            columns: { fullPath: true },
            where: eq(pages.status, 'published'),
          });
        } catch (dbError: any) {
          return [];
        }
      }, 3600);
    } catch (error) {
      return [];
    }
  }
}

export const pageRepository = new PageRepository();
