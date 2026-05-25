import { db } from '@/lib/db';
import {
  navigationMenus,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
  pages,
} from '@/lib/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { sanitizeMegaMenuPayload } from '@/lib/cms/mega-menu-sanitize';
import { cache } from 'react';
import { safeRedisDel, withCache } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { slugify } from '@/lib/cms/utils';
import { buildMegaMenuHref } from '@/lib/cms/mega-menu-paths';
import type { MegaMenuPayload, MegaMenusByNavId } from '@/lib/cms/mega-menu-types';

type PageRow = { id: string; fullPath: string | null; slug: string; status: string };

export class MegaMenuRepository {
  getMegaMenuByNavigationItemId = cache(async (navigationItemId: string): Promise<MegaMenuPayload | null> => {
    const cacheKey = `mega_menu:nav:${navigationItemId}`;
    try {
      return await withCache(cacheKey, () => this.fetchMegaMenu(navigationItemId), 3600);
    } catch (error) {
      logger.error('[MegaMenuRepository] getMegaMenuByNavigationItemId', error);
      return null;
    }
  });

  getMegaMenusByLocation = cache(async (location: string): Promise<MegaMenusByNavId> => {
    const cacheKey = `mega_menu:location:${location}`;
    try {
      return await withCache(cacheKey, () => this.fetchMegaMenusForLocation(location), 3600);
    } catch (error) {
      logger.error('[MegaMenuRepository] getMegaMenusByLocation', error);
      return {};
    }
  });

  private async fetchMegaMenusForLocation(location: string): Promise<MegaMenusByNavId> {
    try {
      const menu = await db.query.navigationMenus.findFirst({
        where: eq(navigationMenus.location, location),
      });
      if (!menu) return {};

      const items = await db.query.navigationItems.findMany({
        where: and(
          eq(navigationItems.menuId, menu.id),
          eq(navigationItems.megaMenuEnabled, true),
          eq(navigationItems.isActive, true)
        ),
      });

      const result: MegaMenusByNavId = {};
      await Promise.all(
        items.map(async (item) => {
          const payload = await this.fetchMegaMenu(item.id);
          if (payload && payload.categories.length > 0) {
            result[item.id] = payload;
          }
        })
      );
      return result;
    } catch (dbError: unknown) {
      const code = (dbError as { code?: string })?.code;
      if (code === '42P01' || code === '42703') {
        logger.error('[MegaMenuRepository] Mega menu tables/columns missing.', dbError);
        return {};
      }
      throw dbError;
    }
  }

  private async fetchMegaMenu(navigationItemId: string): Promise<MegaMenuPayload | null> {
    try {
      const navItem = await db.query.navigationItems.findFirst({
        where: eq(navigationItems.id, navigationItemId),
      });
      if (!navItem || !navItem.megaMenuEnabled || !navItem.isActive) return null;

      const navSlug = navItem.slug || slugify(navItem.label);

      const categories = await db.query.megaMenuCategories.findMany({
        where: and(
          eq(megaMenuCategories.navigationItemId, navigationItemId),
          eq(megaMenuCategories.status, 'active')
        ),
        orderBy: [asc(megaMenuCategories.orderIndex)],
        with: {
          subCategories: {
            where: eq(megaMenuSubCategories.status, 'active'),
            orderBy: [asc(megaMenuSubCategories.orderIndex)],
            with: {
              subSubCategories: {
                where: eq(megaMenuSubSubCategories.status, 'active'),
                orderBy: [asc(megaMenuSubSubCategories.orderIndex)],
              },
            },
          },
        },
      });

      const pageIds = new Set<string>();
      categories.forEach((cat) => {
        if (cat.pageId) pageIds.add(cat.pageId);
        cat.subCategories.forEach((sub) => {
          if (sub.pageId) pageIds.add(sub.pageId);
          sub.subSubCategories.forEach((leaf) => {
            if (leaf.pageId) pageIds.add(leaf.pageId);
          });
        });
      });

      const pageMap = await this.loadPagesMap([...pageIds]);

      const payload = {
        navigationItemId,
        navSlug,
        label: navItem.label,
        categories: categories
          .filter((cat) => {
            if (cat.pageId) {
              const page = pageMap.get(cat.pageId);
              if (page && page.status !== 'published') return false;
            }
            return true;
          })
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            pageId: cat.pageId,
            href: buildMegaMenuHref(
              navSlug,
              cat.slug,
              undefined,
              undefined,
              cat.pageId ? pageMap.get(cat.pageId)?.fullPath ?? null : null
            ),
            subCategories: cat.subCategories
            .filter((sub) => {
              if (sub.pageId) {
                const page = pageMap.get(sub.pageId);
                if (page && page.status !== 'published') return false;
              }
              return true;
            })
            .map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              thumbnail: sub.thumbnail,
              href: buildMegaMenuHref(
                navSlug,
                cat.slug,
                sub.slug,
                undefined,
                sub.pageId ? pageMap.get(sub.pageId)?.fullPath ?? null : null
              ),
              subSubCategories: sub.subSubCategories
                .filter((leaf) => {
                  if (leaf.pageId) {
                    const page = pageMap.get(leaf.pageId);
                    if (page && page.status !== 'published') return false;
                  }
                  return true;
                })
                .map((leaf) => ({
                  id: leaf.id,
                  name: leaf.name,
                  slug: leaf.slug,
                  href: buildMegaMenuHref(
                    navSlug,
                    cat.slug,
                    sub.slug,
                    leaf.slug,
                    leaf.pageId ? pageMap.get(leaf.pageId)?.fullPath ?? null : null
                  ),
                })),
            })),
        })),
      };

      return sanitizeMegaMenuPayload(payload);
    } catch (dbError: unknown) {
      const code = (dbError as { code?: string })?.code;
      if (code === '42P01' || code === '42703') {
        logger.error('[MegaMenuRepository] Mega menu schema not ready.', dbError);
        return null;
      }
      throw dbError;
    }
  }

  private async loadPagesMap(pageIds: string[]): Promise<Map<string, PageRow>> {
    const map = new Map<string, PageRow>();
    if (pageIds.length === 0) return map;

    const rows = await db
      .select({ id: pages.id, fullPath: pages.fullPath, slug: pages.slug, status: pages.status })
      .from(pages)
      .where(inArray(pages.id, pageIds));

    rows.forEach((row) => map.set(row.id, row));
    return map;
  }

  async clearCacheForNavItem(navigationItemId: string, location?: string) {
    const keys = [`mega_menu:nav:${navigationItemId}`];
    if (location) keys.push(`mega_menu:location:${location}`);
    await safeRedisDel(...keys);
  }
}

export const megaMenuRepository = new MegaMenuRepository();
