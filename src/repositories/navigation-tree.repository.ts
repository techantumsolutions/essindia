import { db } from '@/lib/db';
import {
  navigationMenus,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
  pages,
} from '@/lib/db/schema';
import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { cache } from 'react';
import { safeRedisDel, withCache } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { slugify } from '@/lib/cms/utils';
import type { NavigationTreeItem } from '@/lib/cms/navigation-tree-types';
import { sanitizeMegaMenuPayload } from '@/lib/cms/mega-menu-sanitize';
import { buildMegaMenuHref } from '@/lib/cms/mega-menu-paths';
import {
  buildNavigationApiResponse,
  buildNavigationPageRoots,
  mergeNavigationCategories,
  pagesToNavigationTreeCategories,
  type NavPageRecord,
  type NavigationPageNode,
} from '@/lib/cms/page-navigation';
import { ensureNavPagesSyncedToMegaMenu } from '@/lib/cms/sync-page-to-mega-menu';
import { isConnectionError, isMissingSchemaError } from '@/lib/cms/pg-error';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';

export class NavigationTreeRepository {
  getTreeByLocation = cache(async (location: string): Promise<NavigationTreeItem[]> => {
    const cacheKey = `nav_tree_full:${location}`;
    try {
      return await withCache(cacheKey, () => this.fetchTree(location, 'public'), 3600);
    } catch (error) {
      if (isConnectionError(error) || isMissingSchemaError(error)) {
        try {
          await safeRedisDel(cacheKey);
          const retried = await this.fetchTree(location, 'public');
          if (retried.length > 0) return retried;
        } catch (retryError) {
          logger.error('[NavigationTreeRepository] getTreeByLocation retry', retryError);
        }
      }
      if (isMissingSchemaError(error)) {
        logger.warn(
          '[NavigationTreeRepository] Navigation schema missing. Run: npm run db:apply-mega-menu && npm run db:seed-nav'
        );
      } else {
        logger.error('[NavigationTreeRepository] getTreeByLocation', error);
      }
      return [];
    }
  });

  /** Bypass React cache + Redis — use when cached tree is empty after a connection blip. */
  async getTreeByLocationFresh(location: string): Promise<NavigationTreeItem[]> {
    await this.clearCache(location);
    try {
      return await this.fetchTree(location, 'public');
    } catch (error) {
      logger.error('[NavigationTreeRepository] getTreeByLocationFresh', error);
      return [];
    }
  }

  /** Top-level navigation items for page-create menu dropdown (uncached). */
  async getAdminMenuItemsForPageCreate(location: string): Promise<NavigationTreeItem[]> {
    try {
      const menu = await db.query.navigationMenus.findFirst({
        where: eq(navigationMenus.location, location),
      });
      if (!menu) return [];

      const items = await db.query.navigationItems.findMany({
        where: and(eq(navigationItems.menuId, menu.id), isNull(navigationItems.parentId)),
        orderBy: [asc(navigationItems.orderIndex)],
      });

      return items.map((item) => ({
        id: item.id,
        label: item.label,
        slug: item.slug || slugify(item.label),
        url: item.url,
        megaMenuEnabled: item.megaMenuEnabled,
        orderIndex: item.orderIndex,
        categories: [],
      }));
    } catch (error) {
      logger.error('[NavigationTreeRepository] getAdminMenuItemsForPageCreate', error);
      return [];
    }
  }

  /** Uncached full mega menu tree for admin forms (page create, etc.). */
  async getAdminHierarchyByLocation(location: string): Promise<NavigationTreeItem[]> {
    try {
      return await this.fetchTree(location, 'admin');
    } catch (error) {
      logger.error('[NavigationTreeRepository] getAdminHierarchyByLocation', error);
      return [];
    }
  }

  /** Linked page trees keyed by navigation item id (admin — all statuses). */
  async getLinkedPagesByNavItemForAdmin(
    location: string
  ): Promise<Record<string, NavigationPageNode[]>> {
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, location),
    });
    if (!menu) return {};

    const items = await db.query.navigationItems.findMany({
      where: and(eq(navigationItems.menuId, menu.id), isNull(navigationItems.parentId)),
      orderBy: [asc(navigationItems.orderIndex)],
    });

    const navItemIds = items.map((item) => item.id);
    const pagesByNavItem = await this.loadPagesGroupedByNavItem(navItemIds);
    const result: Record<string, NavigationPageNode[]> = {};

    for (const item of items) {
      result[item.id] = buildNavigationPageRoots(pagesByNavItem.get(item.id) ?? [], 'admin');
    }

    return result;
  }

  /** Mega menu payload for admin builder — includes draft pages. */
  async getAdminMegaMenuPayload(navigationItemId: string): Promise<MegaMenuPayload | null> {
    await ensureNavPagesSyncedToMegaMenu(navigationItemId);
    const tree = await this.fetchTree('header-main', 'admin');
    const item = tree.find((entry) => entry.id === navigationItemId);
    if (!item?.megaMenuEnabled || item.categories.length === 0) return null;
    return this.buildMegaMenuPayloadFromTreeItem(item, 'admin');
  }

  private buildMegaMenuPayloadFromTreeItem(
    item: NavigationTreeItem,
    mode: 'public' | 'admin'
  ): MegaMenuPayload | null {
    const payload: MegaMenuPayload = {
      navigationItemId: item.id,
      navSlug: item.slug,
      label: item.label,
      categories: item.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        pageId: cat.pageId ?? null,
        href:
          cat.href ??
          buildMegaMenuHref(item.slug, cat.slug, undefined, undefined, cat.page?.fullPath ?? null),
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
          pageId: sub.pageId ?? null,
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
            pageId: leaf.pageId ?? null,
          })),
        })),
      })),
    };

    return mode === 'admin' ? payload : sanitizeMegaMenuPayload(payload);
  }

  /** Fresh mega menu branches for one nav item (admin page-create wizard). */
  async getAdminMegaMenuForNavItem(navigationItemId: string) {
    await ensureNavPagesSyncedToMegaMenu(navigationItemId);

    const navItem = await db.query.navigationItems.findFirst({
      where: eq(navigationItems.id, navigationItemId),
    });
    if (!navItem) return null;

    const tree = await this.fetchTree('header-main', 'admin');
    const item = tree.find((entry) => entry.id === navigationItemId);

    return {
      navigationItemId: navItem.id,
      label: navItem.label,
      slug: navItem.slug || slugify(navItem.label),
      megaMenuEnabled: navItem.megaMenuEnabled,
      categories: (item?.categories ?? []).map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        orderIndex: cat.orderIndex,
        status: 'active',
        subCategories: cat.subCategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          orderIndex: sub.orderIndex,
          status: 'active',
          subSubCategories: sub.subSubCategories.map((leaf) => ({
            id: leaf.id,
            name: leaf.name,
            slug: leaf.slug,
            orderIndex: leaf.orderIndex,
            status: 'active',
          })),
        })),
      })),
    };
  }

  async clearCache(location: string) {
    await safeRedisDel(
      `nav_tree_full:${location}`,
      `nav_tree:${location}`,
      `mega_menu:location:${location}`,
      `navigation_api:${location}`
    );
  }

  /** Build navigation API payload from pages linked to nav items. */
  async getNavigationByLocation(
    location: string,
    mode: 'public' | 'admin' = 'public'
  ) {
    const cacheKey = `navigation_api:${location}:${mode}`;
    try {
      return await withCache(
        cacheKey,
        () => this.buildNavigationApiPayload(location, mode),
        3600
      );
    } catch (error) {
      logger.error('[NavigationTreeRepository] getNavigationByLocation', error);
      return [];
    }
  }

  private async buildNavigationApiPayload(location: string, mode: 'public' | 'admin') {
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, location),
    });
    if (!menu) return [];

    const items = await db.query.navigationItems.findMany({
      where:
        mode === 'admin'
          ? and(eq(navigationItems.menuId, menu.id), isNull(navigationItems.parentId))
          : and(
              eq(navigationItems.menuId, menu.id),
              eq(navigationItems.isActive, true),
              isNull(navigationItems.parentId)
            ),
      orderBy: [asc(navigationItems.orderIndex)],
    });

    const navItemIds = items.map((item) => item.id);
    const pagesByNavItem = await this.loadPagesGroupedByNavItem(navItemIds);

    return buildNavigationApiResponse(
      items.map((item) => ({
        id: item.id,
        title: item.label,
        slug: item.slug || slugify(item.label),
      })),
      pagesByNavItem,
      mode
    );
  }

  private async loadPagesGroupedByNavItem(navItemIds: string[]): Promise<Map<string, NavPageRecord[]>> {
    const grouped = new Map<string, NavPageRecord[]>();
    if (!navItemIds.length) return grouped;

    try {
      const rows = await db
        .select({
          id: pages.id,
          parentId: pages.parentId,
          title: pages.title,
          slug: pages.slug,
          fullPath: pages.fullPath,
          status: pages.status,
          navigationItemId: pages.navigationItemId,
          depthLevel: pages.depthLevel,
          sortOrder: pages.sortOrder,
        })
        .from(pages)
        .where(and(eq(pages.isTemplate, false), inArray(pages.navigationItemId, navItemIds)));

      for (const row of rows) {
        if (!row.navigationItemId) continue;
        if (!grouped.has(row.navigationItemId)) grouped.set(row.navigationItemId, []);
        grouped.get(row.navigationItemId)!.push({
          ...row,
          depthLevel: row.depthLevel ?? 0,
          sortOrder: row.sortOrder ?? 0,
        });
      }
    } catch (error) {
      if (isMissingSchemaError(error)) {
        logger.warn(
          '[NavigationTreeRepository] Page hierarchy columns missing — loading pages without depth/sort. Run: npm run db:apply-page-hierarchy'
        );
        const rows = await db
          .select({
            id: pages.id,
            parentId: pages.parentId,
            title: pages.title,
            slug: pages.slug,
            fullPath: pages.fullPath,
            status: pages.status,
            navigationItemId: pages.navigationItemId,
          })
          .from(pages)
          .where(and(eq(pages.isTemplate, false), inArray(pages.navigationItemId, navItemIds)));

        for (const row of rows) {
          if (!row.navigationItemId) continue;
          if (!grouped.has(row.navigationItemId)) grouped.set(row.navigationItemId, []);
          grouped.get(row.navigationItemId)!.push({
            ...row,
            depthLevel: 0,
            sortOrder: 0,
          });
        }
        return grouped;
      }
      throw error;
    }

    return grouped;
  }

  private async fetchTree(
    location: string,
    mode: 'public' | 'admin' = 'public'
  ): Promise<NavigationTreeItem[]> {
    const menu = await db.query.navigationMenus.findFirst({
      where: eq(navigationMenus.location, location),
    });
    if (!menu) return [];

    const items = await db.query.navigationItems.findMany({
      where:
        mode === 'admin'
          ? and(eq(navigationItems.menuId, menu.id), isNull(navigationItems.parentId))
          : and(eq(navigationItems.menuId, menu.id), eq(navigationItems.isActive, true)),
      orderBy: [asc(navigationItems.orderIndex)],
    });

    const result: NavigationTreeItem[] = [];
    const topLevelItems =
      mode === 'public' ? items.filter((item) => !item.parentId) : items;

    for (const item of topLevelItems) {
      if (item.megaMenuEnabled) {
        await ensureNavPagesSyncedToMegaMenu(item.id);
      }
    }

    const navItemIds = topLevelItems.map((item) => item.id);
    const pagesByNavItem = await this.loadPagesGroupedByNavItem(navItemIds);

    for (const item of topLevelItems) {
      try {
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

      const categoryWhere = and(
        eq(megaMenuCategories.navigationItemId, item.id),
        eq(megaMenuCategories.status, 'active')
      );
      const subWhere = eq(megaMenuSubCategories.status, 'active');
      const subSubWhere = eq(megaMenuSubSubCategories.status, 'active');

      const categories = await db.query.megaMenuCategories.findMany({
        where: categoryWhere,
        orderBy: [asc(megaMenuCategories.orderIndex)],
        with: {
          subCategories: {
            where: subWhere,
            orderBy: [asc(megaMenuSubCategories.orderIndex)],
            with: {
              subSubCategories: {
                where: subSubWhere,
                orderBy: [asc(megaMenuSubSubCategories.orderIndex)],
              },
            },
          },
        },
      });

      const pageIds = new Set<string>();
      categories.forEach((c) => {
        if (c.pageId) pageIds.add(c.pageId);
        c.subCategories.forEach((s) => {
          if (s.pageId) pageIds.add(s.pageId);
          s.subSubCategories.forEach((l) => {
            if (l.pageId) pageIds.add(l.pageId);
          });
        });
      });

      const pageMap =
        mode === 'public'
          ? await this.loadPublishedPages([...pageIds])
          : await this.loadNavPages([...pageIds]);
      const navSlug = item.slug || slugify(item.label);

      const tableCategories = categories
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          orderIndex: cat.orderIndex,
          pageId: cat.pageId,
          page: cat.pageId ? pageMap.get(cat.pageId) ?? null : null,
          subCategories: cat.subCategories
            .map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              orderIndex: sub.orderIndex,
              pageId: sub.pageId,
              page:
                sub.pageId ? pageMap.get(sub.pageId) ?? null : null,
              subSubCategories: sub.subSubCategories
                .map((leaf) => ({
                  id: leaf.id,
                  name: leaf.name,
                  slug: leaf.slug,
                  orderIndex: leaf.orderIndex,
                  pageId: leaf.pageId,
                  page:
                    leaf.pageId ? pageMap.get(leaf.pageId) ?? null : null,
                }))
                .filter((leaf) => leaf.name?.trim()),
            }))
            .filter((sub) => sub.name?.trim()),
        }))
        .filter((cat) => mode === 'admin' || cat.subCategories.length > 0 || cat.pageId);

      const navPages = pagesByNavItem.get(item.id) ?? [];
      const unassignedNavPages = navPages.filter(p => !pageIds.has(p.id));

      const pageCategories = pagesToNavigationTreeCategories(
        unassignedNavPages,
        navSlug,
        mode
      );
      const treeCategories = mergeNavigationCategories(pageCategories, tableCategories);

      result.push({
        id: item.id,
        label: item.label,
        slug: navSlug,
        url: item.url,
        megaMenuEnabled: true,
        orderIndex: item.orderIndex,
        categories: treeCategories.filter(
          (cat) => mode === 'admin' || cat.subCategories.length > 0 || cat.pageId || cat.href
        ),
      });
      } catch (itemError) {
        logger.error(`[NavigationTreeRepository] nav item "${item.label}"`, itemError);
        result.push({
          id: item.id,
          label: item.label,
          slug: item.slug || slugify(item.label),
          url: item.url,
          megaMenuEnabled: false,
          orderIndex: item.orderIndex,
          categories: [],
        });
      }
    }

    return result;
  }

  /** Build mega menu payloads for header from tree (DB-only, sanitized). */
  async getMegaMenusByLocation(location: string): Promise<Record<string, MegaMenuPayload>> {
    const tree = await this.getTreeByLocation(location);
    const out: Record<string, MegaMenuPayload> = {};

    for (const item of tree) {
      if (!item.megaMenuEnabled || item.categories.length === 0) continue;

      const payload = this.buildMegaMenuPayloadFromTreeItem(item, 'public');
      if (payload) out[item.id] = payload;
    }

    return out;
  }

  private async loadNavPages(pageIds: string[]) {
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
      map.set(row.id, row);
    });
    return map;
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
