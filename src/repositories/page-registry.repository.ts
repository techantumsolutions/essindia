import { db } from '@/lib/db';
import {
  pageRegistry,
  pages,
  pageSections,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
} from '@/lib/db/schema';
import { asc, count, eq, isNull } from 'drizzle-orm';
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

    return { discovered: discovered.length, linked };
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

    const cmsRows: PageRegistryRow[] = allPages.map((page) => {
      const labels = navLabels.get(page.id);
      return {
        id: page.id,
        pageId: page.id,
        routePath: page.fullPath,
        title: page.title,
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

    let unlinked: PageRegistryRow[] = [];
    try {
      const registryOnly = await db.query.pageRegistry.findMany({
        where: isNull(pageRegistry.pageId),
        orderBy: [asc(pageRegistry.routePath)],
      });

      unlinked = registryOnly.map((r) => ({
        id: r.id,
        pageId: null,
        routePath: r.routePath,
        title: r.title || r.routePath,
        slug: r.routePath.replace(/^\//, '') || 'index',
        pageType: r.pageType || 'static',
        status: 'filesystem',
        source: 'filesystem' as const,
        seoStatus: 'n/a' as const,
        sectionCount: 0,
        templateId: null,
        previewThumbnail: null,
        navigationLabel: null,
        categoryLabel: null,
        subCategoryLabel: null,
        subSubCategoryLabel: null,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        isLinked: false,
      }));
    } catch {
      // page_registry table may not exist yet
    }

    const cmsPaths = new Set(cmsRows.map((r) => r.routePath));
    return [...cmsRows, ...unlinked.filter((r) => !cmsPaths.has(r.routePath))];
  }

  private async resolveNavLabels(
    allPages: Array<{
      id: string;
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

    for (const page of allPages) {
      if (!page.navigationItemId) continue;

      const nav = await db.query.navigationItems.findFirst({
        where: eq(navigationItems.id, page.navigationItemId),
      });
      let category: string | null = null;
      let subCategory: string | null = null;
      let subSubCategory: string | null = null;

      if (page.megaMenuCategoryId) {
        const cat = await db.query.megaMenuCategories.findFirst({
          where: eq(megaMenuCategories.id, page.megaMenuCategoryId),
        });
        category = cat?.name ?? null;
      }
      if (page.megaMenuSubCategoryId) {
        const sub = await db.query.megaMenuSubCategories.findFirst({
          where: eq(megaMenuSubCategories.id, page.megaMenuSubCategoryId),
        });
        subCategory = sub?.name ?? null;
      }
      if (page.megaMenuSubSubCategoryId) {
        const leaf = await db.query.megaMenuSubSubCategories.findFirst({
          where: eq(megaMenuSubSubCategories.id, page.megaMenuSubSubCategoryId),
        });
        subSubCategory = leaf?.name ?? null;
      }

      map.set(page.id, {
        navigation: nav?.label ?? '',
        category: category ?? '',
        subCategory: subCategory ?? '',
        subSubCategory: subSubCategory ?? '',
      });
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
