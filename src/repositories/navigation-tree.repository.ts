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
import { cache } from 'react';
import { safeRedisDel, withCache } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { slugify } from '@/lib/cms/utils';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import { sanitizeMegaMenuPayload } from '@/lib/cms/mega-menu-sanitize';
import { buildMegaMenuHref } from '@/lib/cms/mega-menu-paths';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';

export class NavigationTreeRepository {
  getTreeByLocation = cache(async (location: string): Promise<NavigationTreeItem[]> => {
    const cacheKey = `nav_tree_full:${location}`;
    try {
      return await withCache(cacheKey, () => this.fetchTree(location), 3600);
    } catch (error) {
      logger.error('[NavigationTreeRepository] getTreeByLocation', error);
      return [];
    }
  });

  async clearCache(location: string) {
    await safeRedisDel(
      `nav_tree_full:${location}`,
      `nav_tree:${location}`,
      `mega_menu:location:${location}`
    );
  }

  private async fetchTree(location: string): Promise<NavigationTreeItem[]> {
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, location),
    });
    if (!menu) return [];

    const items = await db.query.navigationItems.findMany({
      where: and(eq(navigationItems.menuId, menu.id), eq(navigationItems.isActive, true)),
      orderBy: [asc(navigationItems.orderIndex)],
    });

    const result: NavigationTreeItem[] = [];

    for (const item of items) {
      if (!item.megaMenuEnabled) {
        const childRows = await db.query.navigationItems.findMany({
          where: and(
            eq(navigationItems.parentId, item.id),
            eq(navigationItems.isActive, true)
          ),
          orderBy: [asc(navigationItems.orderIndex)],
        });

        result.push({
          id: item.id,
          label: item.label,
          slug: item.slug || slugify(item.label),
          url: item.url,
          megaMenuEnabled: false,
          orderIndex: item.orderIndex,
          categories: [],
          children: childRows.map((c) => ({
            id: c.id,
            label: c.label,
            url: c.url,
            orderIndex: c.orderIndex,
          })),
        });
        continue;
      }

      const categories = await db.query.megaMenuCategories.findMany({
        where: and(
          eq(megaMenuCategories.navigationItemId, item.id),
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
      categories.forEach((c) =>
        c.subCategories.forEach((s) => {
          if (s.pageId) pageIds.add(s.pageId);
          s.subSubCategories.forEach((l) => {
            if (l.pageId) pageIds.add(l.pageId);
          });
        })
      );

      const pageMap = await this.loadPublishedPages([...pageIds]);
      const navSlug = item.slug || slugify(item.label);

      const treeCategories = categories
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          orderIndex: cat.orderIndex,
          subCategories: cat.subCategories
            .map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              orderIndex: sub.orderIndex,
              page: sub.pageId ? pageMap.get(sub.pageId) ?? null : null,
              subSubCategories: sub.subSubCategories
                .map((leaf) => ({
                  id: leaf.id,
                  name: leaf.name,
                  slug: leaf.slug,
                  orderIndex: leaf.orderIndex,
                  page: leaf.pageId ? pageMap.get(leaf.pageId) ?? null : null,
                }))
                .filter((leaf) => leaf.name?.trim()),
            }))
            .filter((sub) => sub.name?.trim()),
        }))
        .filter((cat) => cat.subCategories.length > 0);

      result.push({
        id: item.id,
        label: item.label,
        slug: navSlug,
        url: item.url,
        megaMenuEnabled: true,
        orderIndex: item.orderIndex,
        categories: treeCategories,
      });
    }

    return result;
  }

  /** Build mega menu payloads for header from tree (DB-only, sanitized). */
  async getMegaMenusByLocation(location: string): Promise<Record<string, MegaMenuPayload>> {
    const tree = await this.getTreeByLocation(location);
    const out: Record<string, MegaMenuPayload> = {};

    for (const item of tree) {
      if (!item.megaMenuEnabled || item.categories.length === 0) continue;

      const payload: MegaMenuPayload = {
        navigationItemId: item.id,
        navSlug: item.slug,
        label: item.label,
        categories: item.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          subCategories: cat.subCategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            thumbnail: null,
            href: buildMegaMenuHref(
              item.slug,
              cat.slug,
              sub.slug,
              undefined,
              sub.page?.fullPath ?? null
            ),
            subSubCategories: sub.subSubCategories.map((leaf) => ({
              id: leaf.id,
              name: leaf.name,
              slug: leaf.slug,
              href: buildMegaMenuHref(
                item.slug,
                cat.slug,
                sub.slug,
                leaf.slug,
                leaf.page?.fullPath ?? null
              ),
            })),
          })),
        })),
      };

      const sanitized = sanitizeMegaMenuPayload(payload);
      if (sanitized) out[item.id] = sanitized;
    }

    return out;
  }

  private async loadPublishedPages(pageIds: string[]) {
    const map = new Map<string, { id: string; title: string; fullPath: string; status: string }>();
    if (!pageIds.length) return map;

    const rows = await db
      .select({
        id: pages.id,
        title: pages.title,
        fullPath: pages.fullPath,
        status: pages.status,
      })
      .from(pages)
      .where(inArray(pages.id, pageIds));

    rows.forEach((row) => {
      if (row.status === 'published') {
        map.set(row.id, row);
      }
    });
    return map;
  }
}

export const navigationTreeRepository = new NavigationTreeRepository();
