import { db } from '@/lib/db';
import {
  pages,
  pageSections,
  pageRevisions,
  pageRegistry,
  seoMetadata,
  categories,
  navigationItems,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
  templates,
  templateSections,
} from '@/lib/db/schema';
import { asc, desc, eq, ne, or, and, isNull, ilike, inArray } from 'drizzle-orm';
import { buildFullPath, buildPageTree, slugify } from '@/lib/cms/utils';
import {
  buildPagePathFromNavAndCategorySlugs,
  buildPagePathFromNavHierarchy,
  resolvePageSlug,
} from '@/lib/cms/build-page-path-from-nav';
import { templateRepository } from './template.repository';
import { sectionLibraryRepository } from './section-library.repository';
import { pageRegistryRepository } from './page-registry.repository';
import { redirectRepository } from './redirect.repository';
import {
  assertNoCircularParent,
  computeDepthFromMegaMenuSelection,
  computeDepthFromParent,
} from '@/lib/cms/page-navigation';
import { safeRedisDel, safeRedisKeys } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { isMissingSchemaError } from '@/lib/cms/pg-error';
import { syncPageToMegaMenu, updateMegaMenuFromPage } from '@/lib/cms/sync-page-to-mega-menu';
import { navigationTreeRepository } from './navigation-tree.repository';

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

  private fetchPageWithRelations(whereClause: any) {
    return db.query.pages.findFirst({
      where: whereClause,
      with: {
        seo: true,
        sections: {
          orderBy: [asc(pageSections.orderIndex)],
        },
        category: true,
        template: {
          with: {
            templateSections: {
              orderBy: [asc(templateSections.orderIndex)],
            },
          },
        },
      },
    });
  }

  async getById(id: string, includeDraft = true) {
    let page = await this.fetchPageWithRelations(eq(pages.id, id));

    let regRecord: any = null;

    if (!page) {
      try {
        const reg = await db.query.pageRegistry.findFirst({
          where: eq(pageRegistry.id, id),
        });
        if (reg) {
          regRecord = reg;
          if (reg.pageId) {
            page = await this.fetchPageWithRelations(eq(pages.id, reg.pageId));
          }
          if (!page && reg.routePath) {
            page = await this.fetchPageWithRelations(eq(pages.fullPath, reg.routePath));
          }
        }
      } catch {
        // pageRegistry table might not exist
      }
    }

    if (!page) {
      page = await this.fetchPageWithRelations(or(eq(pages.fullPath, id), eq(pages.slug, id)));
    }

    // Auto-provision page record if requested by registry ID but no page record exists yet
    if (!page && regRecord) {
      try {
        const routePath = regRecord.routePath || '/';
        const title = regRecord.title || 'Untitled Page';
        const rawSlug = routePath.split('/').filter(Boolean).pop() || 'index';

        const [created] = await db
          .insert(pages)
          .values({
            title,
            slug: rawSlug,
            fullPath: routePath,
            status: 'published',
            pageType: regRecord.pageType || 'standard',
            updatedAt: new Date(),
          })
          .returning();

        if (created) {
          try {
            await db
              .update(pageRegistry)
              .set({ pageId: created.id, source: 'cms', updatedAt: new Date() })
              .where(eq(pageRegistry.id, regRecord.id));
          } catch {
            // ignore registry update if schema not ready
          }

          page = await this.fetchPageWithRelations(eq(pages.id, created.id));
        }
      } catch (err) {
        console.error('Failed to auto-provision page from registry entry:', err);
      }
    }

    // Ultimate Fallback: Auto-create page for any requested ID/slug so editing never returns 404
    if (!page) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const targetId = isUuid ? id : undefined;
        const pageTitle = isUuid ? 'New Page' : id.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const pageSlug = isUuid ? `page-${id}` : id.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
        const pagePath = isUuid ? `/_page_${id}` : (id.startsWith('/') ? id : `/${id}`);

        let [created] = await db
          .insert(pages)
          .values({
            ...(targetId ? { id: targetId } : {}),
            title: pageTitle,
            slug: pageSlug,
            fullPath: pagePath,
            status: 'published',
            pageType: 'standard',
            updatedAt: new Date(),
          })
          .onConflictDoNothing()
          .returning();

        if (created) {
          page = await this.fetchPageWithRelations(eq(pages.id, created.id));
        } else {
          page = await this.fetchPageWithRelations(or(eq(pages.id, id), eq(pages.fullPath, pagePath), eq(pages.slug, pageSlug)));

          if (!page && isUuid) {
            const uniquePath = `/_auto_${id}_${Date.now()}`;
            const uniqueSlug = `auto-${id}-${Date.now()}`;
            const [retryCreated] = await db
              .insert(pages)
              .values({
                id,
                title: 'New Page',
                slug: uniqueSlug,
                fullPath: uniquePath,
                status: 'published',
                pageType: 'standard',
                updatedAt: new Date(),
              })
              .returning();

            if (retryCreated) {
              page = await this.fetchPageWithRelations(eq(pages.id, retryCreated.id));
            }
          }
        }
      } catch (err) {
        console.error('Failed to auto-create page for requested ID:', err);
      }
    }

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
    const placement = await this.resolveNavigationPlacement(data);
    let fullPath: string;

    if (placement.parentId) {
      const parent = await db.query.pages.findFirst({
        where: eq(pages.id, placement.parentId),
        columns: { fullPath: true },
      });
      fullPath = buildFullPath(parent?.fullPath || null, pageSlug);
    } else if (placement.navigationItemId) {
      const nav = await db.query.navigationItems.findFirst({
        where: eq(navigationItems.id, placement.navigationItemId),
      });
      if (!nav) throw new Error('Invalid navigation menu item');

      const navSlug = slugify(nav.label) || nav.slug?.replace(/^\//, '') || '';

      if (data.categoryId) {
        const categorySlugs = await this.getCategorySlugPath(data.categoryId);
        fullPath = buildPagePathFromNavAndCategorySlugs(navSlug, categorySlugs, pageSlug);
      } else {
        let categorySlug: string | undefined;
        let subSlug: string | undefined;
        let subSubSlug: string | undefined;

        if (data.megaMenuCategoryId) {
          const cat = await db.query.megaMenuCategories.findFirst({
            where: eq(megaMenuCategories.id, data.megaMenuCategoryId),
          });
          if (!cat || cat.navigationItemId !== nav.id) {
            throw new Error('Category does not belong to the selected menu item');
          }
          categorySlug = cat.slug;

          if (data.megaMenuSubCategoryId) {
            const sub = await db.query.megaMenuSubCategories.findFirst({
              where: eq(megaMenuSubCategories.id, data.megaMenuSubCategoryId),
            });
            if (!sub || sub.categoryId !== cat.id) {
              throw new Error('Sub category does not belong to the selected category');
            }
            subSlug = sub.slug;

            if (data.megaMenuSubSubCategoryId) {
              const subSub = await db.query.megaMenuSubSubCategories.findFirst({
                where: eq(megaMenuSubSubCategories.id, data.megaMenuSubSubCategoryId),
              });
              if (!subSub || subSub.subCategoryId !== sub.id) {
                throw new Error('Sub sub category does not belong to the selected sub category');
              }
              subSubSlug = subSub.slug;
            }
          }
        }

        fullPath = buildPagePathFromNavHierarchy({
          navSlug,
          categorySlug,
          subSlug,
          subSubSlug,
          pageSlug,
        });
      }

      const existing = await db.query.pages.findFirst({ where: eq(pages.fullPath, fullPath) });
      if (existing) throw new Error('A page with this route already exists');
    } else {
      fullPath = buildFullPath(null, pageSlug);
    }

    // Check if a page with the exact same title already exists
    const existingTitlePage = await db.query.pages.findFirst({
      where: ilike(pages.title, data.title.trim()),
    });
    if (existingTitlePage) {
      throw new Error(`The page title "${data.title.trim()}" is already allocated to another page. Please change the page title.`);
    }

    const duplicate = await db.query.pages.findFirst({ where: eq(pages.fullPath, fullPath) });
    if (duplicate) throw new Error('Duplicate page path');

    const [seo] = await db.insert(seoMetadata).values({ title: data.title }).returning();

    const pageValues = {
      title: data.title,
      slug: pageSlug,
      fullPath,
      parentId: placement.parentId,
      categoryId: data.categoryId || null,
      templateId: data.templateId || null,
      navigationItemId: placement.navigationItemId,
      megaMenuCategoryId: data.megaMenuCategoryId || null,
      megaMenuSubCategoryId: data.megaMenuSubCategoryId || null,
      megaMenuSubSubCategoryId: data.megaMenuSubSubCategoryId || null,
      pageType: data.pageType || 'standard',
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date() : null,
      seoId: seo.id,
      isTemplate: false,
    };

    const [page] = await this.insertPageRecord({
      ...pageValues,
      depthLevel: placement.depthLevel,
      sortOrder: placement.sortOrder,
    });

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
    } else if (data.megaMenuCategoryId) {
      await db
        .update(megaMenuCategories)
        .set({ pageId: page.id, updatedAt: new Date() })
        .where(eq(megaMenuCategories.id, data.megaMenuCategoryId));
    } else if (placement.navigationItemId) {
      await syncPageToMegaMenu({
        id: page.id,
        title: page.title,
        slug: page.slug,
        navigationItemId: placement.navigationItemId,
        parentId: placement.parentId,
        depthLevel: placement.depthLevel,
        sortOrder: placement.sortOrder,
      });
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
        
        const libraryIds = template.templateSections
          .map(ts => ts.sectionLibraryId)
          .filter(Boolean) as string[];
          
        for (const sid of libraryIds) {
          await sectionLibraryRepository.incrementUsage(sid);
        }
      }
    }

    await pageRegistryRepository.registerCmsPage(page);
    await this.invalidateNavigationCache();
    await this.invalidateCache(fullPath);
    return this.getById(page.id);
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      fullPath: string;
      parentId: string | null;
      categoryId: string | null;
      status: string;
      pageType: string;
      publishedAt: Date | null;
      navigationItemId: string | null;
      depthLevel: number;
      sortOrder: number;
      megaMenuCategoryId: string | null;
      megaMenuSubCategoryId: string | null;
      megaMenuSubSubCategoryId: string | null;
    }>
  ) {
    const current = await this.getById(id);
    if (!current) return null;

    let fullPath = current.fullPath;
    let parentId = data.parentId !== undefined ? data.parentId : current.parentId;
    let navigationItemId =
      data.navigationItemId !== undefined ? data.navigationItemId : current.navigationItemId;
    let depthLevel = current.depthLevel ?? 0;
    let sortOrder = current.sortOrder ?? 0;

    if (data.parentId !== undefined || data.navigationItemId !== undefined) {
      const placement = await this.resolveNavigationPlacement(
        {
          title: current.title,
          parentId,
          navigationItemId,
          megaMenuCategoryId: current.megaMenuCategoryId,
          megaMenuSubCategoryId: current.megaMenuSubCategoryId,
          megaMenuSubSubCategoryId: current.megaMenuSubSubCategoryId,
        },
        id
      );
      parentId = placement.parentId;
      navigationItemId = placement.navigationItemId;
      depthLevel = placement.depthLevel;
      sortOrder = placement.sortOrder;
    }

    if (
      data.slug !== undefined ||
      data.title !== undefined ||
      data.fullPath !== undefined ||
      data.parentId !== undefined ||
      data.navigationItemId !== undefined ||
      data.categoryId !== undefined ||
      data.megaMenuCategoryId !== undefined ||
      data.megaMenuSubCategoryId !== undefined ||
      data.megaMenuSubSubCategoryId !== undefined
    ) {
      const pageSlug = resolvePageSlug(data.title || current.title, data.slug || current.slug);
      
      let finalParentId = parentId;
      let finalNavId = navigationItemId;
      let finalMegaCatId = data.megaMenuCategoryId !== undefined ? data.megaMenuCategoryId : current.megaMenuCategoryId;
      let finalMegaSubId = data.megaMenuSubCategoryId !== undefined ? data.megaMenuSubCategoryId : current.megaMenuSubCategoryId;
      let finalMegaSubSubId = data.megaMenuSubSubCategoryId !== undefined ? data.megaMenuSubSubCategoryId : current.megaMenuSubSubCategoryId;
      let finalCatId = data.categoryId !== undefined ? data.categoryId : current.categoryId;

      if (finalParentId) {
        const parent = await db.query.pages.findFirst({
          where: eq(pages.id, finalParentId),
          columns: { fullPath: true },
        });
        fullPath = buildFullPath(parent?.fullPath || null, pageSlug);
      } else if (finalNavId) {
        const nav = await db.query.navigationItems.findFirst({
          where: eq(navigationItems.id, finalNavId),
        });
        if (!nav) throw new Error('Invalid navigation menu item');
        const navSlug = slugify(nav.label) || nav.slug?.replace(/^\//, '') || '';

        if (finalCatId) {
          const categorySlugs = await this.getCategorySlugPath(finalCatId);
          fullPath = buildPagePathFromNavAndCategorySlugs(navSlug, categorySlugs, pageSlug);
        } else {
          let categorySlug: string | undefined;
          let subSlug: string | undefined;
          let subSubSlug: string | undefined;

          if (finalMegaCatId) {
            const cat = await db.query.megaMenuCategories.findFirst({
              where: eq(megaMenuCategories.id, finalMegaCatId),
            });
            if (cat) {
              categorySlug = cat.slug;
              if (finalMegaSubId) {
                const sub = await db.query.megaMenuSubCategories.findFirst({
                  where: eq(megaMenuSubCategories.id, finalMegaSubId),
                });
                if (sub) {
                  subSlug = sub.slug;
                  if (finalMegaSubSubId) {
                    const subSub = await db.query.megaMenuSubSubCategories.findFirst({
                      where: eq(megaMenuSubSubCategories.id, finalMegaSubSubId),
                    });
                    if (subSub) {
                      subSubSlug = subSub.slug;
                    }
                  }
                }
              }
            }
          }

          fullPath = buildPagePathFromNavHierarchy({
            navSlug,
            categorySlug,
            subSlug,
            subSubSlug,
            pageSlug,
          });
        }
      } else {
        fullPath = buildFullPath(null, pageSlug);
      }

      // Explicit fullPath override takes precedence if supplied
      if (data.fullPath !== undefined && data.fullPath.trim()) {
        let rawPath = data.fullPath.trim();
        if (!rawPath.startsWith('/')) rawPath = `/${rawPath}`;
        if (rawPath.length > 1 && rawPath.endsWith('/')) rawPath = rawPath.slice(0, -1);
        rawPath = rawPath.replace(/\/+/g, '/');
        fullPath = rawPath;

        const parts = rawPath.split('/').filter(Boolean);
        if (parts.length > 0) {
          data.slug = parts[parts.length - 1];
        }
      }

      if (fullPath !== current.fullPath) {
        const duplicate = await db.query.pages.findFirst({
          where: and(eq(pages.fullPath, fullPath), ne(pages.id, id)),
        });
        if (duplicate) {
          throw new Error(`The route "${fullPath}" is already used by another page ("${duplicate.title}")`);
        }
      }
    }

    const updatePayload = {
      ...data,
      parentId,
      navigationItemId,
      depthLevel,
      sortOrder,
      fullPath,
      updatedAt: new Date(),
      ...(data.status === 'published' && !current.publishedAt
        ? { publishedAt: new Date() }
        : {}),
    };

    let updated;
    try {
      [updated] = await db.update(pages).set(updatePayload).where(eq(pages.id, id)).returning();
    } catch (error) {
      if (!isMissingSchemaError(error)) throw error;
      const { depthLevel: _depth, sortOrder: _sort, ...basePayload } = updatePayload;
      [updated] = await db.update(pages).set(basePayload).where(eq(pages.id, id)).returning();
    }

    await this.saveRevision(id);
    await this.syncNavigationLinks(updated.id, {
      title: updated.title,
      slug: updated.slug,
      navigationItemId: updated.navigationItemId,
      parentId: updated.parentId,
      depthLevel: updated.depthLevel ?? depthLevel,
      sortOrder: updated.sortOrder ?? sortOrder,
      megaMenuCategoryId: updated.megaMenuCategoryId,
      megaMenuSubCategoryId: updated.megaMenuSubCategoryId,
      megaMenuSubSubCategoryId: updated.megaMenuSubSubCategoryId,
    });
    await this.invalidateNavigationCache();
    await this.invalidateCache(current.fullPath);

    if (fullPath !== current.fullPath) {
      await this.invalidateCache(fullPath);

      // Auto-create 301 redirect from old path to new path if old path was valid
      if (current.fullPath && current.fullPath !== '/' && current.fullPath !== fullPath) {
        try {
          await redirectRepository.create({
            fromPath: current.fullPath,
            toPath: fullPath,
            statusCode: 301,
            notes: `Auto-created on page slug change from ${current.fullPath} to ${fullPath}`,
          });
        } catch {
          // Ignore if redirect for this path already exists
        }
      }

      // Cascade path update to child pages
      try {
        const childPages = await db.query.pages.findMany({
          where: eq(pages.parentId, id),
          columns: { id: true, slug: true },
        });
        for (const child of childPages) {
          await this.update(child.id, { slug: child.slug });
        }
      } catch (err) {
        console.error('Failed to cascade child page path updates:', err);
      }
    }

    return this.getById(updated.id);
  }

  async updateSeo(pageId: string, seoData: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    schemaMarkup?: Record<string, unknown>;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    headerScripts?: string;
    footerScripts?: string;
    headingH1?: string;
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
      content?: Record<string, unknown> | null;
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
        pageId: page.id,
        type: data.type,
        variant: data.variant || 'default',
        name: data.name,
        content,
        sectionLibraryId: data.sectionLibraryId || null,
        orderIndex,
      })
      .returning();

    await this.saveRevision(page.id);
    await this.invalidateCache(page.fullPath);
    return section;
  }

  async updateSection(
    sectionId: string,
    data: Partial<{
      content: Record<string, unknown> | null;
      type: string;
      variant: string;
      name: string;
      isActive: boolean;
      orderIndex: number;
    }>
  ) {
    const { content, ...rest } = data;

    let [updated] = await db
      .update(pageSections)
      .set({
        ...rest,
        ...(content !== undefined ? { content: content ?? {} } : {}),
        updatedAt: new Date(),
      })
      .where(eq(pageSections.id, sectionId))
      .returning();

    if (!updated) {
      // Fallback: Check if it's a template section
      const { name, ...templateRest } = rest;
      const [templateUpdated] = await db
        .update(templateSections)
        .set({
          ...templateRest,
          ...(content !== undefined ? { contentJson: content ?? {} } : {}),
          updatedAt: new Date(),
        })
        .where(eq(templateSections.id, sectionId))
        .returning();

      if (!templateUpdated) {
        console.error(`[updateSection] Section ${sectionId} not found in pageSections or templateSections`);
        return null;
      }
      return templateUpdated;
    }

    // Fetch the page for cache invalidation and revision saving.
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, updated.pageId),
    }).catch(() => null);

    if (page) {
      await this.saveRevision(updated.pageId).catch(() => null);
      await this.invalidateCache(page.fullPath).catch(() => null);
    }

    return updated;
  }

  async updateSections(
    pageId: string,
    sections: Array<{
      id: string;
      content?: Record<string, unknown> | null;
      name?: string;
      variant?: string;
      isActive?: boolean;
    }>
  ) {
    if (!sections.length) return [];

    const updatedSections = await Promise.all(
      sections.map(async (s) => {
        if (!s.id) return null;
        const { content, ...rest } = s;

        let [updated] = await db
          .update(pageSections)
          .set({
            ...rest,
            ...(content !== undefined ? { content: content ?? {} } : {}),
            updatedAt: new Date(),
          })
          .where(eq(pageSections.id, s.id))
          .returning();

        if (!updated) {
          const { name, ...templateRest } = rest;
          const [templateUpdated] = await db
            .update(templateSections)
            .set({
              ...templateRest,
              ...(content !== undefined ? { contentJson: content ?? {} } : {}),
              updatedAt: new Date(),
            })
            .where(eq(templateSections.id, s.id))
            .returning();
          return templateUpdated || null;
        }

        return updated;
      })
    );

    const validUpdated = updatedSections.filter(Boolean);
    const firstUpdated = validUpdated[0] as any;
    const targetPageId = pageId || (firstUpdated && 'pageId' in firstUpdated ? firstUpdated.pageId : null);

    if (targetPageId) {
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, targetPageId),
      }).catch(() => null);

      if (page) {
        await this.saveRevision(targetPageId).catch(() => null);
        await this.invalidateCache(page.fullPath).catch(() => null);
      }
    }

    return validUpdated;
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

  async deleteSection(sectionId: string, pageId?: string): Promise<boolean> {
    if (!sectionId?.trim()) return false;
    const cleanSectionId = sectionId.trim();

    try {
      // 1. Direct atomic delete from pageSections
      const [deleted] = await db
        .delete(pageSections)
        .where(eq(pageSections.id, cleanSectionId))
        .returning();

      if (deleted) {
        const targetPageId = pageId || deleted.pageId;
        if (deleted.sectionLibraryId) {
          sectionLibraryRepository.decrementUsage(deleted.sectionLibraryId).catch(() => null);
        }
        if (targetPageId) {
          this.saveRevision(targetPageId).catch((err) => console.error('[deleteSection] saveRevision error:', err));
          this.getById(targetPageId)
            .then((p) => {
              if (p?.fullPath) this.invalidateCache(p.fullPath);
            })
            .catch(() => null);
        }
        return true;
      }
    } catch (err) {
      console.error('[deleteSection] Error deleting from pageSections:', err);
    }

    try {
      // 2. Fallback: check if it's a template section
      const [deletedTemplate] = await db
        .delete(templateSections)
        .where(eq(templateSections.id, cleanSectionId))
        .returning();

      if (deletedTemplate) {
        return true;
      }
    } catch (err) {
      console.error('[deleteSection] Error deleting from templateSections:', err);
    }

    return false;
  }

  async duplicate(id: string) {
    const page = await this.getById(id);
    if (!page) return null;

    const cleanBaseSlug = page.slug.replace(/-copy(-\d+)?$/, '');
    const cleanBaseTitle = page.title.replace(/\s*\(Copy\s*\d*\)$/i, '');
    const basePath = page.fullPath.replace(/-copy(-\d+)?$/, '').replace(/\/$/, '');

    let candidateSlug = `${cleanBaseSlug}-copy`;
    let candidateFullPath = `${basePath}-copy`;
    let candidateTitle = `${cleanBaseTitle} (Copy)`;
    let counter = 1;

    while (true) {
      const existing = await db.query.pages.findFirst({ where: eq(pages.fullPath, candidateFullPath) });
      if (!existing) break;

      candidateSlug = `${cleanBaseSlug}-copy-${counter}`;
      candidateFullPath = `${basePath}-copy-${counter}`;
      candidateTitle = `${cleanBaseTitle} (Copy ${counter})`;
      counter++;
    }

    const [seo] = await db.insert(seoMetadata).values({ title: candidateTitle }).returning();

    const [copy] = await db
      .insert(pages)
      .values({
        title: candidateTitle,
        slug: candidateSlug,
        fullPath: candidateFullPath,
        parentId: page.parentId,
        categoryId: page.categoryId,
        templateId: page.templateId,
        // Clear navigation placement so the copy doesn't hijack the original's menu slot
        navigationItemId: null,
        depthLevel: page.depthLevel,
        sortOrder: page.sortOrder,
        megaMenuCategoryId: null,
        megaMenuSubCategoryId: null,
        megaMenuSubSubCategoryId: null,
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

  async delete(id: string): Promise<boolean> {
    const [page] = await db
      .select({
        id: pages.id,
        fullPath: pages.fullPath,
        seoId: pages.seoId,
      })
      .from(pages)
      .where(eq(pages.id, id))
      .limit(1);

    if (!page) return false;

    await db.update(pages).set({ parentId: null }).where(eq(pages.parentId, id));

    try {
      await db
        .delete(pageRegistry)
        .where(or(eq(pageRegistry.pageId, id), eq(pageRegistry.routePath, page.fullPath)));
    } catch {
      // page_registry may not exist
    }

    const pageSectionsData = await db
      .select({ sectionLibraryId: pageSections.sectionLibraryId })
      .from(pageSections)
      .where(eq(pageSections.pageId, id));

    await db.delete(pages).where(eq(pages.id, id));

    for (const ps of pageSectionsData) {
      if (ps.sectionLibraryId) {
        await sectionLibraryRepository.decrementUsage(ps.sectionLibraryId);
      }
    }

    if (page.seoId) {
      try {
        await db.delete(seoMetadata).where(eq(seoMetadata.id, page.seoId));
      } catch {
        // seo row may be referenced elsewhere
      }
    }

    await pageRegistryRepository.removeByRoute(page.fullPath);
    await this.invalidateNavigationCache();
    await this.invalidateCache(page.fullPath);
    return true;
  }

  private async resolveNavigationPlacement(
    data: {
      title: string;
      parentId?: string | null;
      navigationItemId?: string | null;
      megaMenuCategoryId?: string | null;
      megaMenuSubCategoryId?: string | null;
      megaMenuSubSubCategoryId?: string | null;
    },
    pageId: string | null = null
   ) {
    let navigationItemId = data.navigationItemId || null;
    
    // Automatically infer navigationItemId from megaMenuCategoryId if not explicitly provided
    if (!navigationItemId && data.megaMenuCategoryId) {
      const cat = await db.query.megaMenuCategories.findFirst({
        where: eq(megaMenuCategories.id, data.megaMenuCategoryId),
        columns: { navigationItemId: true },
      });
      if (cat?.navigationItemId) {
        navigationItemId = cat.navigationItemId;
      }
    }

    let parentId = data.parentId || null;
    let parentDepth: number | null = null;

    if (parentId) {
      const parentPage = await this.getParentPageForPlacement(parentId);
      if (!parentPage) throw new Error('Invalid parent page');

      if (
        navigationItemId &&
        parentPage.navigationItemId &&
        navigationItemId !== parentPage.navigationItemId
      ) {
        throw new Error('Parent page belongs to a different navigation item');
      }

      if (!navigationItemId && parentPage.navigationItemId) {
        navigationItemId = parentPage.navigationItemId;
      }

      parentDepth = parentPage.depthLevel;
    }

    if (navigationItemId) {
      const nav = await db.query.navigationItems.findFirst({
        where: eq(navigationItems.id, navigationItemId),
        columns: { id: true },
      });
      if (!nav) throw new Error('Invalid navigation menu item');
    }

    const hierarchyRows = await db
      .select({ id: pages.id, parentId: pages.parentId })
      .from(pages)
      .where(eq(pages.isTemplate, false));
    assertNoCircularParent(pageId, parentId, hierarchyRows);

    const depthLevel = parentId
      ? computeDepthFromParent(parentDepth)
      : navigationItemId
        ? computeDepthFromMegaMenuSelection(data)
        : 0;

    const sortOrder =
      navigationItemId || parentId
        ? await this.getNextSortOrder(navigationItemId, parentId, pageId)
        : 0;

    return { navigationItemId, parentId, depthLevel, sortOrder };
  }

  private async getNextSortOrder(
    navigationItemId: string | null,
    parentId: string | null,
    excludePageId: string | null = null
  ) {
    try {
      const conditions = [eq(pages.isTemplate, false)];

      if (navigationItemId) {
        conditions.push(eq(pages.navigationItemId, navigationItemId));
      }
      conditions.push(parentId ? eq(pages.parentId, parentId) : isNull(pages.parentId));

      const rows = await db
        .select({ sortOrder: pages.sortOrder, id: pages.id })
        .from(pages)
        .where(and(...conditions));

      const siblingOrders = rows
        .filter((row) => row.id !== excludePageId)
        .map((row) => row.sortOrder ?? 0);

      return (siblingOrders.length ? Math.max(...siblingOrders) : -1) + 1;
    } catch (error) {
      if (isMissingSchemaError(error)) return 0;
      throw error;
    }
  }

  private async getParentPageForPlacement(parentId: string): Promise<{
    id: string;
    parentId: string | null;
    navigationItemId: string | null;
    depthLevel: number | null;
  } | null> {
    try {
      const parentPage = await db.query.pages.findFirst({
        where: eq(pages.id, parentId),
        columns: {
          id: true,
          parentId: true,
          navigationItemId: true,
          depthLevel: true,
        },
      });
      return parentPage
        ? {
            ...parentPage,
            depthLevel: parentPage.depthLevel ?? null,
          }
        : null;
    } catch (error) {
      if (!isMissingSchemaError(error)) throw error;
      const parentPage = await db.query.pages.findFirst({
        where: eq(pages.id, parentId),
        columns: {
          id: true,
          parentId: true,
          navigationItemId: true,
        },
      });
      return parentPage
        ? {
            ...parentPage,
            depthLevel: null,
          }
        : null;
    }
  }

  private async insertPageRecord(
    values: typeof pages.$inferInsert & { depthLevel?: number; sortOrder?: number }
  ) {
    try {
      const [page] = await db.insert(pages).values(values).returning();
      return [page];
    } catch (error) {
      if (!isMissingSchemaError(error)) throw error;
      const { depthLevel: _depth, sortOrder: _sort, ...baseValues } = values;
      return db.insert(pages).values(baseValues).returning();
    }
  }

  private async invalidateNavigationCache() {
    await navigationTreeRepository.clearCache('header-main');
    // Revalidate public pages only — revalidating root layout also refreshes /admin
    // and can trigger Supabase middleware churn that looks like a logout.
    revalidatePath('/', 'page');
  }

  private async syncNavigationLinks(
    pageId: string,
    page: {
      title: string;
      slug: string;
      navigationItemId: string | null;
      parentId: string | null;
      depthLevel: number;
      sortOrder: number;
      megaMenuCategoryId: string | null;
      megaMenuSubCategoryId: string | null;
      megaMenuSubSubCategoryId: string | null;
    }
  ) {
    if (!page.navigationItemId) return;

    if (page.megaMenuCategoryId || page.megaMenuSubCategoryId || page.megaMenuSubSubCategoryId) {
      await updateMegaMenuFromPage({
        id: pageId,
        title: page.title,
        slug: page.slug,
        navigationItemId: page.navigationItemId,
        parentId: page.parentId,
        megaMenuCategoryId: page.megaMenuCategoryId,
        megaMenuSubCategoryId: page.megaMenuSubCategoryId,
        megaMenuSubSubCategoryId: page.megaMenuSubSubCategoryId,
      });
      return;
    }

    await syncPageToMegaMenu({
      id: pageId,
      title: page.title,
      slug: page.slug,
      navigationItemId: page.navigationItemId,
      parentId: page.parentId,
      depthLevel: page.depthLevel,
      sortOrder: page.sortOrder,
    });
  }

  private async findTemplateSummary(templateId: string | null) {
    if (!templateId) return null;
    const [row] = await db
      .select({ id: templates.id, name: templates.name })
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);
    return row ?? null;
  }

  private async getCategorySlugPath(categoryId: string): Promise<string[]> {
    const slugs: string[] = [];
    let currentId: string | null = categoryId;

    while (currentId) {
      const [row] = await db
        .select({
          slug: categories.slug,
          parentId: categories.parentId,
          status: categories.status,
        })
        .from(categories)
        .where(eq(categories.id, currentId))
        .limit(1);

      if (!row || row.status === 'archived') {
        throw new Error('Invalid category');
      }
      slugs.unshift(row.slug);
      currentId = row.parentId;
    }

    return slugs;
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
      },
    });

    return Promise.all(
      rows.map(async (p) => {
        const template = await this.findTemplateSummary(p.templateId);
        return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      route: p.fullPath,
      status: p.status,
      templateId: p.templateId,
      templateName: template?.name ?? null,
      previewThumbnail: p.previewThumbnail,
      sectionCount: p.sections.length,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
      })
    );
  }

  async listPageSections(pageId: string) {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
      columns: { id: true, title: true, fullPath: true, templateId: true },
      with: {
        sections: { orderBy: [asc(pageSections.orderIndex)] },
      },
    });
    if (!page) return null;

    const template = await this.findTemplateSummary(page.templateId);

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
      sourceTemplateName: template?.name ?? null,
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

  /** Sync page fullPaths when a category, sub-category, or sub-sub-category slug/name is updated. */
  async syncPagePathsForCategoryChange(
    targetId: string,
    level: 'category' | 'sub' | 'sub-sub'
  ) {
    const pageIdSet = new Set<string>();

    if (level === 'category') {
      const cat = await db.query.megaMenuCategories.findFirst({
        where: eq(megaMenuCategories.id, targetId),
        with: {
          subCategories: {
            with: {
              subSubCategories: true,
            },
          },
        },
      });
      if (cat) {
        if (cat.pageId) pageIdSet.add(cat.pageId);

        const subIds = cat.subCategories.map((s) => s.id);
        const leafIds = cat.subCategories.flatMap((s) => s.subSubCategories.map((l) => l.id));

        cat.subCategories.forEach((sub) => {
          if (sub.pageId) pageIdSet.add(sub.pageId);
          sub.subSubCategories.forEach((leaf) => {
            if (leaf.pageId) pageIdSet.add(leaf.pageId);
          });
        });

        const linkedCatPages = await db.query.pages.findMany({
          where: eq(pages.megaMenuCategoryId, targetId),
          columns: { id: true },
        });
        linkedCatPages.forEach((p) => pageIdSet.add(p.id));

        if (subIds.length > 0) {
          const linkedSubPages = await db.query.pages.findMany({
            where: inArray(pages.megaMenuSubCategoryId, subIds),
            columns: { id: true },
          });
          linkedSubPages.forEach((p) => pageIdSet.add(p.id));
        }

        if (leafIds.length > 0) {
          const linkedLeafPages = await db.query.pages.findMany({
            where: inArray(pages.megaMenuSubSubCategoryId, leafIds),
            columns: { id: true },
          });
          linkedLeafPages.forEach((p) => pageIdSet.add(p.id));
        }
      }
    } else if (level === 'sub') {
      const sub = await db.query.megaMenuSubCategories.findFirst({
        where: eq(megaMenuSubCategories.id, targetId),
        with: {
          subSubCategories: true,
        },
      });
      if (sub) {
        if (sub.pageId) pageIdSet.add(sub.pageId);
        const leafIds = sub.subSubCategories.map((l) => l.id);

        sub.subSubCategories.forEach((leaf) => {
          if (leaf.pageId) pageIdSet.add(leaf.pageId);
        });

        const linkedSubPages = await db.query.pages.findMany({
          where: eq(pages.megaMenuSubCategoryId, targetId),
          columns: { id: true },
        });
        linkedSubPages.forEach((p) => pageIdSet.add(p.id));

        if (leafIds.length > 0) {
          const linkedLeafPages = await db.query.pages.findMany({
            where: inArray(pages.megaMenuSubSubCategoryId, leafIds),
            columns: { id: true },
          });
          linkedLeafPages.forEach((p) => pageIdSet.add(p.id));
        }
      }
    } else if (level === 'sub-sub') {
      const leaf = await db.query.megaMenuSubSubCategories.findFirst({
        where: eq(megaMenuSubSubCategories.id, targetId),
      });
      if (leaf?.pageId) pageIdSet.add(leaf.pageId);

      const linkedPages = await db.query.pages.findMany({
        where: eq(pages.megaMenuSubSubCategoryId, targetId),
        columns: { id: true },
      });
      linkedPages.forEach((p) => pageIdSet.add(p.id));
    }

    const stdLinkedPages = await db.query.pages.findMany({
      where: eq(pages.categoryId, targetId),
      columns: { id: true },
    });
    stdLinkedPages.forEach((p) => pageIdSet.add(p.id));

    for (const pageId of pageIdSet) {
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, pageId),
      });
      if (!page) continue;

      let categorySlug: string | undefined;
      let subSlug: string | undefined;
      let subSubSlug: string | undefined;
      let navItemId: string | null = page.navigationItemId || null;

      if (page.megaMenuSubSubCategoryId) {
        const leaf = await db.query.megaMenuSubSubCategories.findFirst({
          where: eq(megaMenuSubSubCategories.id, page.megaMenuSubSubCategoryId),
        });
        if (leaf) {
          subSubSlug = leaf.slug;
          const sub = await db.query.megaMenuSubCategories.findFirst({
            where: eq(megaMenuSubCategories.id, leaf.subCategoryId),
          });
          if (sub) {
            subSlug = sub.slug;
            const cat = await db.query.megaMenuCategories.findFirst({
              where: eq(megaMenuCategories.id, sub.categoryId),
            });
            if (cat) {
              categorySlug = cat.slug;
              if (!navItemId) navItemId = cat.navigationItemId;
            }
          }
        }
      } else if (page.megaMenuSubCategoryId) {
        const sub = await db.query.megaMenuSubCategories.findFirst({
          where: eq(megaMenuSubCategories.id, page.megaMenuSubCategoryId),
        });
        if (sub) {
          subSlug = sub.slug;
          const cat = await db.query.megaMenuCategories.findFirst({
            where: eq(megaMenuCategories.id, sub.categoryId),
          });
          if (cat) {
            categorySlug = cat.slug;
            if (!navItemId) navItemId = cat.navigationItemId;
          }
        }
      } else if (page.megaMenuCategoryId) {
        const cat = await db.query.megaMenuCategories.findFirst({
          where: eq(megaMenuCategories.id, page.megaMenuCategoryId),
        });
        if (cat) {
          categorySlug = cat.slug;
          if (!navItemId) navItemId = cat.navigationItemId;
        }
      }

      if (!categorySlug && !subSlug && !subSubSlug) {
        const catAsPage = await db.query.megaMenuCategories.findFirst({
          where: eq(megaMenuCategories.pageId, page.id),
        });
        if (catAsPage) {
          categorySlug = catAsPage.slug;
          if (!navItemId) navItemId = catAsPage.navigationItemId;
        } else {
          const subAsPage = await db.query.megaMenuSubCategories.findFirst({
            where: eq(megaMenuSubCategories.pageId, page.id),
          });
          if (subAsPage) {
            subSlug = subAsPage.slug;
            const cat = await db.query.megaMenuCategories.findFirst({
              where: eq(megaMenuCategories.id, subAsPage.categoryId),
            });
            if (cat) {
              categorySlug = cat.slug;
              if (!navItemId) navItemId = cat.navigationItemId;
            }
          } else {
            const leafAsPage = await db.query.megaMenuSubSubCategories.findFirst({
              where: eq(megaMenuSubSubCategories.pageId, page.id),
            });
            if (leafAsPage) {
              subSubSlug = leafAsPage.slug;
              const sub = await db.query.megaMenuSubCategories.findFirst({
                where: eq(megaMenuSubCategories.id, leafAsPage.subCategoryId),
              });
              if (sub) {
                subSlug = sub.slug;
                const cat = await db.query.megaMenuCategories.findFirst({
                  where: eq(megaMenuCategories.id, sub.categoryId),
                });
                if (cat) {
                  categorySlug = cat.slug;
                  if (!navItemId) navItemId = cat.navigationItemId;
                }
              }
            }
          }
        }
      }

      let navSlug = '';
      if (navItemId) {
        const nav = await db.query.navigationItems.findFirst({
          where: eq(navigationItems.id, navItemId),
        });
        if (nav) {
          navSlug = slugify(nav.label) || nav.slug?.replace(/^\//, '') || '';
        }
      }

      const pageSlug = resolvePageSlug(page.title, page.slug);

      const newFullPath = buildPagePathFromNavHierarchy({
        navSlug,
        categorySlug,
        subSlug,
        subSubSlug,
        pageSlug,
      });

      if (newFullPath !== page.fullPath || (navItemId && navItemId !== page.navigationItemId)) {
        await db
          .update(pages)
          .set({
            fullPath: newFullPath,
            navigationItemId: navItemId || page.navigationItemId,
            updatedAt: new Date(),
          })
          .where(eq(pages.id, page.id));

        await this.invalidateCache(page.fullPath);
        await this.invalidateCache(newFullPath);
        revalidatePath('/', 'layout');
      }
    }


  }

  private async invalidateCache(fullPath: string) {
    const keys = await safeRedisKeys('page:*');
    if (keys.length > 0) await safeRedisDel(...keys);
    await safeRedisDel(`page:${fullPath}`, 'page_paths', 'page_paths_sitemap_v2');
  }
}

export const pageAdminRepository = new PageAdminRepository();
