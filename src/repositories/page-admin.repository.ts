import { db } from '@/lib/db';
import {
  pages,
  pageSections,
  pageRevisions,
  seoMetadata,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
} from '@/lib/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { buildFullPath, buildPageTree, slugify } from '@/lib/cms/utils';
import { buildPagePathFromNavHierarchy, resolvePageSlug } from '@/lib/cms/build-page-path-from-nav';
import { templateRepository } from './template.repository';
import { sectionLibraryRepository } from './section-library.repository';
import { pageRegistryRepository } from './page-registry.repository';
import { navigationTreeRepository } from './navigation-tree.repository';
import { safeRedisDel, safeRedisKeys } from '@/lib/redis';
import type { PageTreeNode } from '@/lib/cms/types';

export class PageAdminRepository {
  async getTree(): Promise<PageTreeNode[]> {
    const all = await db.query.pages.findMany({
      where: eq(pages.isTemplate, false),
      orderBy: [asc(pages.title)],
      columns: {
        id: true,
        parentId: true,
        title: true,
        slug: true,
        fullPath: true,
        status: true,
        pageType: true,
        categoryId: true,
        templateId: true,
        updatedAt: true,
      },
    });
    return buildPageTree(all) as PageTreeNode[];
  }

  async getById(id: string, includeDraft = true) {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, id),
      with: {
        seo: true,
        sections: {
          orderBy: [asc(pageSections.orderIndex)],
        },
        category: true,
        template: true,
      },
    });
    if (!page) return null;
    if (!includeDraft && page.status !== 'published') return null;
    return page;
  }

  async create(data: {
    title: string;
    slug?: string;
    parentId?: string | null;
    categoryId?: string | null;
    templateId?: string | null;
    pageType?: string;
    status?: string;
    navigationItemId?: string | null;
    megaMenuCategoryId?: string | null;
    megaMenuSubCategoryId?: string | null;
    megaMenuSubSubCategoryId?: string | null;
  }) {
    const pageSlug = resolvePageSlug(data.title, data.slug);
    let fullPath: string;

    if (data.navigationItemId && data.megaMenuCategoryId) {
      const nav = await db.query.navigationItems.findFirst({
        where: eq(navigationItems.id, data.navigationItemId),
      });
      const cat = await db.query.megaMenuCategories.findFirst({
        where: eq(megaMenuCategories.id, data.megaMenuCategoryId),
      });
      const sub = data.megaMenuSubCategoryId
        ? await db.query.megaMenuSubCategories.findFirst({
            where: eq(megaMenuSubCategories.id, data.megaMenuSubCategoryId),
          })
        : null;
      const subSub = data.megaMenuSubSubCategoryId
        ? await db.query.megaMenuSubSubCategories.findFirst({
            where: eq(megaMenuSubSubCategories.id, data.megaMenuSubSubCategoryId),
          })
        : null;

      if (!nav || !cat) throw new Error('Invalid navigation hierarchy mapping');

      const existing = await db.query.pages.findFirst({
        where: eq(pages.fullPath, buildPagePathFromNavHierarchy({
          navSlug: nav.slug || slugify(nav.label),
          categorySlug: cat.slug,
          subSlug: sub?.slug,
          subSubSlug: subSub?.slug,
          pageSlug: !subSub ? pageSlug : undefined,
        })),
      });
      if (existing) throw new Error('A page with this route already exists');

      fullPath = buildPagePathFromNavHierarchy({
        navSlug: nav.slug || slugify(nav.label),
        categorySlug: cat.slug,
        subSlug: sub?.slug,
        subSubSlug: subSub?.slug,
        pageSlug: !subSub ? pageSlug : undefined,
      });
    } else {
      let parentPath: string | null = null;
      if (data.parentId) {
        const parent = await db.query.pages.findFirst({
          where: eq(pages.id, data.parentId),
          columns: { fullPath: true },
        });
        parentPath = parent?.fullPath || null;
      }
      fullPath = buildFullPath(parentPath, pageSlug);
    }

    const duplicate = await db.query.pages.findFirst({ where: eq(pages.fullPath, fullPath) });
    if (duplicate) throw new Error('Duplicate page path');

    const [seo] = await db.insert(seoMetadata).values({ title: data.title }).returning();

    const [page] = await db
      .insert(pages)
      .values({
        title: data.title,
        slug: pageSlug,
        fullPath,
        parentId: data.parentId || null,
        categoryId: data.categoryId || null,
        templateId: data.templateId || null,
        navigationItemId: data.navigationItemId || null,
        megaMenuCategoryId: data.megaMenuCategoryId || null,
        megaMenuSubCategoryId: data.megaMenuSubCategoryId || null,
        megaMenuSubSubCategoryId: data.megaMenuSubSubCategoryId || null,
        pageType: data.pageType || 'standard',
        status: data.status || 'draft',
        seoId: seo.id,
        isTemplate: false,
      })
      .returning();

    if (data.megaMenuSubSubCategoryId) {
      await db
        .update(megaMenuSubSubCategories)
        .set({ pageId: page.id, updatedAt: new Date() })
        .where(eq(megaMenuSubSubCategories.id, data.megaMenuSubSubCategoryId));
    } else if (data.megaMenuSubCategoryId) {
      await db
        .update(megaMenuSubCategories)
        .set({ pageId: page.id, updatedAt: new Date() })
        .where(eq(megaMenuSubCategories.id, data.megaMenuSubCategoryId));
    }

    if (data.templateId) {
      const template = await templateRepository.findById(data.templateId);
      if (template?.templateSections?.length) {
        await db.insert(pageSections).values(
          template.templateSections.map((ts) => ({
            pageId: page.id,
            type: ts.type,
            variant: ts.variant || 'default',
            content: ts.contentJson || {},
            styleJson: ts.styleJson || {},
            settingsJson: ts.settingsJson || {},
            responsiveJson: ts.responsiveJson || {},
            animationJson: ts.animationJson || {},
            sectionLibraryId: ts.sectionLibraryId,
            orderIndex: ts.orderIndex,
          }))
        );
        await templateRepository.incrementUsage(data.templateId);
      }
    }

    await pageRegistryRepository.registerCmsPage(page);
    await navigationTreeRepository.clearCache('header-main');
    await this.invalidateCache(fullPath);
    return this.getById(page.id);
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      parentId: string | null;
      categoryId: string | null;
      status: string;
      pageType: string;
      publishedAt: Date | null;
    }>
  ) {
    const current = await this.getById(id);
    if (!current) return null;

    let fullPath = current.fullPath;
    if (data.slug || data.parentId !== undefined) {
      let parentPath: string | null = null;
      const parentId = data.parentId !== undefined ? data.parentId : current.parentId;
      if (parentId) {
        const parent = await db.query.pages.findFirst({
          where: eq(pages.id, parentId),
          columns: { fullPath: true },
        });
        parentPath = parent?.fullPath || null;
      }
      fullPath = buildFullPath(parentPath, data.slug || current.slug);
    }

    const [updated] = await db
      .update(pages)
      .set({
        ...data,
        fullPath,
        updatedAt: new Date(),
        ...(data.status === 'published' && !current.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      })
      .where(eq(pages.id, id))
      .returning();

    await this.saveRevision(id);
    await this.invalidateCache(current.fullPath);
    if (fullPath !== current.fullPath) await this.invalidateCache(fullPath);

    return this.getById(updated.id);
  }

  async updateSeo(pageId: string, seoData: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    schemaMarkup?: Record<string, unknown>;
  }) {
    const page = await this.getById(pageId);
    if (!page) return null;

    if (page.seoId) {
      await db
        .update(seoMetadata)
        .set({ ...seoData, updatedAt: new Date() })
        .where(eq(seoMetadata.id, page.seoId));
    } else {
      const [seo] = await db.insert(seoMetadata).values(seoData).returning();
      await db.update(pages).set({ seoId: seo.id }).where(eq(pages.id, pageId));
    }

    await this.invalidateCache(page.fullPath);
    return this.getById(pageId);
  }

  async addSection(
    pageId: string,
    data: {
      type: string;
      variant?: string;
      name?: string;
      content?: Record<string, unknown>;
      sectionLibraryId?: string | null;
      orderIndex?: number;
    }
  ) {
    const page = await this.getById(pageId);
    if (!page) return null;

    const maxOrder = page.sections.reduce((m, s) => Math.max(m, s.orderIndex), -1);
    const orderIndex = data.orderIndex ?? maxOrder + 1;

    let content = data.content || {};
    if (data.sectionLibraryId) {
      const lib = await sectionLibraryRepository.findById(data.sectionLibraryId);
      if (lib) {
        content = lib.contentJson as Record<string, unknown>;
        await sectionLibraryRepository.incrementUsage(data.sectionLibraryId);
      }
    }

    const [section] = await db
      .insert(pageSections)
      .values({
        pageId,
        type: data.type,
        variant: data.variant || 'default',
        name: data.name,
        content,
        sectionLibraryId: data.sectionLibraryId || null,
        orderIndex,
      })
      .returning();

    await this.saveRevision(pageId);
    await this.invalidateCache(page.fullPath);
    return section;
  }

  async updateSection(
    sectionId: string,
    data: Partial<{
      content: Record<string, unknown>;
      type: string;
      variant: string;
      name: string;
      isActive: boolean;
      orderIndex: number;
    }>
  ) {
    const section = await db.query.pageSections.findFirst({
      where: eq(pageSections.id, sectionId),
      with: { page: true },
    });
    if (!section) return null;

    const [updated] = await db
      .update(pageSections)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pageSections.id, sectionId))
      .returning();

    if (section.page) {
      await this.saveRevision(section.pageId);
      await this.invalidateCache(section.page.fullPath);
    }

    return updated;
  }

  async reorderSections(pageId: string, sectionIds: string[]) {
    const page = await this.getById(pageId);
    if (!page) return null;

    await Promise.all(
      sectionIds.map((id, index) =>
        db
          .update(pageSections)
          .set({ orderIndex: index, updatedAt: new Date() })
          .where(eq(pageSections.id, id))
      )
    );

    await this.saveRevision(pageId);
    await this.invalidateCache(page.fullPath);
    return this.getById(pageId);
  }

  async deleteSection(sectionId: string) {
    const section = await db.query.pageSections.findFirst({
      where: eq(pageSections.id, sectionId),
      with: { page: true },
    });
    if (!section) return;

    await db.delete(pageSections).where(eq(pageSections.id, sectionId));

    if (section.page) {
      await this.saveRevision(section.pageId);
      await this.invalidateCache(section.page.fullPath);
    }
  }

  async duplicate(id: string) {
    const page = await this.getById(id);
    if (!page) return null;

    const slug = `${page.slug}-copy`;
    const fullPath = `${page.fullPath.replace(/\/$/, '')}-copy`;

    const [seo] = await db.insert(seoMetadata).values({ title: `${page.title} (Copy)` }).returning();

    const [copy] = await db
      .insert(pages)
      .values({
        title: `${page.title} (Copy)`,
        slug,
        fullPath,
        parentId: page.parentId,
        categoryId: page.categoryId,
        templateId: page.templateId,
        pageType: page.pageType,
        status: 'draft',
        seoId: seo.id,
        isTemplate: false,
      })
      .returning();

    if (page.sections.length) {
      await db.insert(pageSections).values(
        page.sections.map((s) => ({
          pageId: copy.id,
          type: s.type,
          variant: s.variant,
          name: s.name,
          content: s.content,
          styleJson: s.styleJson,
          settingsJson: s.settingsJson,
          responsiveJson: s.responsiveJson,
          animationJson: s.animationJson,
          sectionLibraryId: s.sectionLibraryId,
          orderIndex: s.orderIndex,
          isActive: s.isActive,
        }))
      );
    }

    return this.getById(copy.id);
  }

  async delete(id: string) {
    const page = await this.getById(id);
    if (!page) return;
    await db.delete(pages).where(eq(pages.id, id));
    await this.invalidateCache(page.fullPath);
  }

  async getRevisions(pageId: string) {
    return db.query.pageRevisions.findMany({
      where: eq(pageRevisions.pageId, pageId),
      orderBy: [desc(pageRevisions.createdAt)],
      limit: 20,
    });
  }

  async listForImport() {
    const rows = await db.query.pages.findMany({
      where: eq(pages.isTemplate, false),
      orderBy: [desc(pages.updatedAt)],
      columns: {
        id: true,
        title: true,
        slug: true,
        fullPath: true,
        status: true,
        templateId: true,
        previewThumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        sections: { columns: { id: true } },
        template: { columns: { id: true, name: true } },
      },
    });

    return rows.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      route: p.fullPath,
      status: p.status,
      templateId: p.templateId,
      templateName: p.template?.name ?? null,
      previewThumbnail: p.previewThumbnail,
      sectionCount: p.sections.length,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async listPageSections(pageId: string) {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
      columns: { id: true, title: true, fullPath: true, templateId: true },
      with: {
        sections: { orderBy: [asc(pageSections.orderIndex)] },
        template: { columns: { id: true, name: true } },
      },
    });
    if (!page) return null;

    return page.sections.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      variant: s.variant,
      orderIndex: s.orderIndex,
      previewThumbnail:
        (s.content as { previewThumbnail?: string } | null)?.previewThumbnail ??
        (s.content as { image?: string } | null)?.image ??
        null,
      createdAt: s.createdAt,
      sourcePageId: pageId,
      sourceRoute: page.fullPath,
      sourceTemplateId: page.templateId,
      sourceTemplateName: page.template?.name ?? null,
    }));
  }

  private async saveRevision(pageId: string) {
    const page = await this.getById(pageId);
    if (!page) return;

    await db.insert(pageRevisions).values({
      pageId,
      snapshot: {
        page: {
          title: page.title,
          slug: page.slug,
          fullPath: page.fullPath,
          status: page.status,
        },
        seo: page.seo,
        sections: page.sections,
      },
      note: 'Auto-saved revision',
    });
  }

  private async invalidateCache(fullPath: string) {
    const keys = await safeRedisKeys('page:*');
    if (keys.length > 0) await safeRedisDel(...keys);
    await safeRedisDel(`page:${fullPath}`, 'page_paths');
  }
}

export const pageAdminRepository = new PageAdminRepository();
