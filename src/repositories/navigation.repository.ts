import { db } from '@/lib/db';
import { navigationMenus, navigationItems } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import redisClient, { withCache } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { cache } from 'react';

export class NavigationRepository {
  /**
   * Get full navigation tree by menu location
   */
  getMenuTreeByLocation = cache(async (location: string) => {
    const cacheKey = `nav_tree:${location}`;

    try {
      return await withCache(cacheKey, async () => {
        try {
          const menu = await db.query.navigationMenus.findFirst({
            where: eq(navigationMenus.location, location),
          });

          if (!menu) return [];

          const items = await db.query.navigationItems.findMany({
            where: eq(navigationItems.menuId, menu.id),
            orderBy: [asc(navigationItems.orderIndex)],
          });

          return this.buildTree(items);
        } catch (dbError: any) {
          if (dbError.code === '42P01') {
            logger.error('[NavigationRepository] Navigation tables missing.', dbError);
            return [];
          }
          throw dbError;
        }
      }, 3600);
    } catch (error) {
      logger.error(`[NavigationRepository] Error fetching menu: ${location}`, error);
      return [];
    }
  });

  private buildTree(items: any[], parentId: string | null = null): any[] {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: this.buildTree(items, item.id)
      }));
  }

  async clearCache(location: string) {
    try {
      await redisClient.del(`nav_tree:${location}`);
    } catch (error) {
      logger.debug('[NavigationRepository] Failed to clear cache', error);
    }
  }
}

export const navigationRepository = new NavigationRepository();
