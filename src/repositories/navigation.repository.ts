import { db } from '@/lib/db';
import { navigationMenus, navigationItems } from '@/lib/db/schema';
import { eq, asc, isNull } from 'drizzle-orm';
import redisClient, { withCache } from '@/lib/redis';

export class NavigationRepository {
  /**
   * Get full navigation tree by menu location
   */
  async getMenuTreeByLocation(location: string) {
    const cacheKey = `nav_tree:${location}`;

    try {
      return await withCache(cacheKey, async () => {
        const menu = await db.query.navigationMenus.findFirst({
          where: eq(navigationMenus.location, location),
        });

        if (!menu) return [];

        const items = await db.query.navigationItems.findMany({
          where: eq(navigationItems.menuId, menu.id),
          orderBy: [asc(navigationItems.orderIndex)],
        });

        return this.buildTree(items);
      }, 3600);
    } catch (error) {
      console.error('[NavigationRepository] Error fetching menu:', error);
      return [];
    }
  }

  private buildTree(items: any[], parentId: string | null = null): any[] {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: this.buildTree(items, item.id)
      }));
  }

  async clearCache(location: string) {
    await redisClient.del(`nav_tree:${location}`);
  }
}

export const navigationRepository = new NavigationRepository();
