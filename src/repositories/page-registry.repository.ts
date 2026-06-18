import { db } from '@/lib/db';
import {
  pageRegistry,
  pages,
  pageSections,
  categories,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
} from '@/lib/db/schema';
import { and, asc, count, eq, inArray, isNull } from 'drizzle-orm';
import { scanFilesystemRoutes } from '@/lib/cms/page-registry-scanner';
import type { PageRegistryRow } from '@/lib/cms/types';

type PageRow = typeof pages.$inferSelect;

export class PageRegistryRepository {
  async registerCmsPage(page: PageRow) {
    try {
      await db
        .insert(pageRegistry)
        .values({
          routePath: page.fullPath,
          source: 'cms',
          pageId: page.id,
          title: page.title,
          pageType: page.pageType || 'standard',
          isDynamic: false,
          lastScannedAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: pageRegistry.routePath,
          set: {
            pageId: page.id,
            source: 'cms',
            title: page.title,
            pageType: page.pageType,
            updatedAt: new Date(),
            lastScannedAt: new Date(),
          },
        });
    } catch {
      // page_registry may not exist yet
    }
  }

  async syncFromFilesystem(): Promise<{ discovered: number; linked: number }> {
    const discovered = await scanFilesystemRoutes();
    let linked = 0;

    for (const route of discovered) {
      const cmsPage = await db.query.pages.findFirst({
        where: eq(pages.fullPath, route.routePath),
        columns: { id: true, title: true, pageType: true },
      });

      if (cmsPage) linked += 1;

      await db
        .insert(pageRegistry)
        .values({
          routePath: route.routePath,
          source: cmsPage ? 'cms' : 'filesystem',
          pageId: cmsPage?.id ?? null,
          title: cmsPage?.title ?? route.title,
          pageType: cmsPage?.pageType ?? route.pageType,
          isDynamic: route.isDynamic,
          lastScannedAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: pageRegistry.routePath,
          set: {
            pageId: cmsPage?.id ?? null,
            title: cmsPage?.title ?? route.title,
            pageType: cmsPage?.pageType ?? route.pageType,
            source: cmsPage ? 'cms' : 'filesystem',
            isDynamic: route.isDynamic,
            lastScannedAt: new Date(),
            updatedAt: new Date(),
          },
        });
    }

    await this.pruneOrphanedRegistry();

    return { discovered: discovered.length, linked };
  }

  /** Removes registry rows left behind when CMS pages are deleted (pageId nulled by FK). */
  async pruneOrphanedRegistry(): Promise<number> {
    try {
      const staticPaths = new Set((await scanFilesystemRoutes()).map((r) => r.routePath));
      const orphans = await db.query.pageRegistry.findMany({
        where: isNull(pageRegistry.pageId),
      });

      let removed = 0;
      for (const row of orphans) {
        const isStaleCms = row.source === 'cms';
        const isUnknownRoute = !staticPaths.has(row.routePath);
        if (isStaleCms || isUnknownRoute) {
          await db.delete(pageRegistry).where(eq(pageRegistry.id, row.id));
          removed += 1;
        }
      }
      return removed;
    } catch {
      return 0;
    }
  }

  async removeByRoute(routePath: string) {
    try {
      await db.delete(pageRegistry).where(eq(pageRegistry.routePath, routePath));
    } catch {
      // page_registry may not exist
    }
  }

  async getRegistry(): Promise<PageRegistryRow[]> {
    const allPages = await db.query.pages.findMany({
      where: eq(pages.isTemplate, false),
      orderBy: [asc(pages.title)],
      with: { seo: true },
    });

    const sectionCounts = await db
      .select({
        pageId: pageSections.pageId,
        sectionCount: count(),
      })
      .from(pageSections)
      .groupBy(pageSections.pageId);

    const countMap = new Map(sectionCounts.map((r) => [r.pageId, Number(r.sectionCount)]));

    const navLabels = await this.resolveNavLabels(allPages);

    return allPages.map((page) => {
      const labels = navLabels.get(page.id);
      return {
        id: page.id,
        pageId: page.id,
        routePath: page.fullPath,
        title: page.seo?.title || page.title,
        slug: page.slug,
        pageType: page.pageType || 'standard',
        status: page.status,
        source: 'cms' as const,
        seoStatus: page.seo?.title && page.seo?.description ? 'complete' : 'incomplete',
        sectionCount: countMap.get(page.id) ?? 0,
        templateId: page.templateId,
        previewThumbnail: page.previewThumbnail,
        navigationLabel: labels?.navigation ?? null,
        categoryLabel: labels?.category ?? null,
        subCategoryLabel: labels?.subCategory ?? null,
        subSubCategoryLabel: labels?.subSubCategory ?? null,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        isLinked: true,
      };
    });
  }

  private async resolveNavLabels(
    allPages: Array<{
      id: string;
      categoryId: string | null;
      navigationItemId: string | null;
      megaMenuCategoryId: string | null;
      megaMenuSubCategoryId: string | null;
      megaMenuSubSubCategoryId: string | null;
    }>
  ) {
    const map = new Map<
      string,
      { navigation: string; category: string; subCategory: string; subSubCategory: string }
    >();

    if (!allPages.length) return map;

    const allCategories = await db.query.categories.findMany({
      columns: { id: true, name: true, parentId: true },
    });
    const catById = new Map(allCategories.map((c) => [c.id, c]));

    const navIds = [...new Set(allPages.map((p) => p.navigationItemId).filter(Boolean))] as string[];
    const navRows =
      navIds.length > 0
        ? await db.query.navigationItems.findMany({
            where: inArray(navigationItems.id, navIds),
            columns: { id: true, label: true },
          })
        : [];
    const navById = new Map(navRows.map((n) => [n.id, n]));

    const megaCatIds = [
      ...new Set(allPages.map((p) => p.megaMenuCategoryId).filter(Boolean)),
    ] as string[];
    const megaSubIds = [
      ...new Set(allPages.map((p) => p.megaMenuSubCategoryId).filter(Boolean)),
    ] as string[];
    const megaSubSubIds = [
      ...new Set(allPages.map((p) => p.megaMenuSubSubCategoryId).filter(Boolean)),
    ] as string[];

    const megaCats =
      megaCatIds.length > 0
        ? await db.query.megaMenuCategories.findMany({
            where: inArray(megaMenuCategories.id, megaCatIds),
            columns: { id: true, name: true },
          })
        : [];
    const megaSubs =
      megaSubIds.length > 0
        ? await db.query.megaMenuSubCategories.findMany({
            where: inArray(megaMenuSubCategories.id, megaSubIds),
            columns: { id: true, name: true },
          })
        : [];
    const megaSubSubs =
      megaSubSubIds.length > 0
        ? await db.query.megaMenuSubSubCategories.findMany({
            where: inArray(megaMenuSubSubCategories.id, megaSubSubIds),
            columns: { id: true, name: true },
          })
        : [];

    const megaCatById = new Map(megaCats.map((c) => [c.id, c]));
    const megaSubById = new Map(megaSubs.map((s) => [s.id, s]));
    const megaSubSubById = new Map(megaSubSubs.map((l) => [l.id, l]));

    const pageIds = allPages.map((p) => p.id);
    const megaCatsByPage = pageIds.length > 0
      ? await db.query.megaMenuCategories.findMany({
          where: inArray(megaMenuCategories.pageId, pageIds),
          columns: { name: true, pageId: true },
        })
      : [];
    const megaSubsByPage = pageIds.length > 0
      ? await db.query.megaMenuSubCategories.findMany({
          where: inArray(megaMenuSubCategories.pageId, pageIds),
          columns: { name: true, pageId: true },
        })
      : [];
    const megaSubSubsByPage = pageIds.length > 0
      ? await db.query.megaMenuSubSubCategories.findMany({
          where: inArray(megaMenuSubSubCategories.pageId, pageIds),
          columns: { name: true, pageId: true },
        })
      : [];

    const megaCatByPageId = new Map(megaCatsByPage.map((c) => [c.pageId, c.name]));
    const megaSubByPageId = new Map(megaSubsByPage.map((s) => [s.pageId, s.name]));
    const megaSubSubByPageId = new Map(megaSubSubsByPage.map((l) => [l.pageId, l.name]));

    const resolveCmsCategoryLabels = (categoryId: string) => {
      const leaf = catById.get(categoryId);
      if (!leaf) return { category: '', subCategory: '', subSubCategory: '' };

      if (!leaf.parentId) {
        return { category: leaf.name, subCategory: '', subSubCategory: '' };
      }
      const parent = catById.get(leaf.parentId);
      if (!parent) {
        return { category: leaf.name, subCategory: '', subSubCategory: '' };
      }
      if (!parent.parentId) {
        return { category: parent.name, subCategory: leaf.name, subSubCategory: '' };
      }
      const grand = catById.get(parent.parentId);
      return {
        category: grand?.name ?? parent.name,
        subCategory: parent.name,
        subSubCategory: leaf.name,
      };
    };

    for (const page of allPages) {
      let category = '';
      let subCategory = '';
      let subSubCategory = '';

      if (page.categoryId) {
        const cms = resolveCmsCategoryLabels(page.categoryId);
        category = cms.category;
        subCategory = cms.subCategory;
        subSubCategory = cms.subSubCategory;
      } else {
        if (page.megaMenuCategoryId) {
          category = megaCatById.get(page.megaMenuCategoryId)?.name ?? '';
        } else if (page.id && megaCatByPageId.has(page.id)) {
          category = megaCatByPageId.get(page.id) || '';
        }

        if (page.megaMenuSubCategoryId) {
          subCategory = megaSubById.get(page.megaMenuSubCategoryId)?.name ?? '';
        } else if (page.id && megaSubByPageId.has(page.id)) {
          subCategory = megaSubByPageId.get(page.id) || '';
        }

        if (page.megaMenuSubSubCategoryId) {
          subSubCategory = megaSubSubById.get(page.megaMenuSubSubCategoryId)?.name ?? '';
        } else if (page.id && megaSubSubByPageId.has(page.id)) {
          subSubCategory = megaSubSubByPageId.get(page.id) || '';
        }
      }

      const navigation = page.navigationItemId
        ? navById.get(page.navigationItemId)?.label ?? ''
        : '';

      if (!navigation && !category && !subCategory && !subSubCategory) continue;

      map.set(page.id, { navigation, category, subCategory, subSubCategory });
    }

    return map;
  }

  async linkRegistryToPage(registryId: string, pageId: string) {
    const page = await db.query.pages.findFirst({ where: eq(pages.id, pageId) });
    if (!page) return null;

    const [updated] = await db
      .update(pageRegistry)
      .set({
        pageId: page.id,
        source: 'cms',
        title: page.title,
        pageType: page.pageType,
        updatedAt: new Date(),
      })
      .where(eq(pageRegistry.id, registryId))
      .returning();

    return updated;
  }
}

export const pageRegistryRepository = new PageRegistryRepository();
