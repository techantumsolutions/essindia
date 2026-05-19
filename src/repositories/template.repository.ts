import { db } from '@/lib/db';
import { templates, templateSections, pages, pageSections } from '@/lib/db/schema';
import { and, asc, desc, eq, isNotNull, ne, sql } from 'drizzle-orm';
import { slugify } from '@/lib/cms/utils';

export class TemplateRepository {
  async findAll() {
    const rows = await db.query.templates.findMany({
      where: ne(templates.status, 'archived'),
      orderBy: [desc(templates.updatedAt)],
      with: {
        templateSections: {
          orderBy: [asc(templateSections.orderIndex)],
        },
      },
    });

    const usageCounts = await db
      .select({
        templateId: pages.templateId,
        count: sql<number>`count(*)::int`,
      })
      .from(pages)
      .where(and(ne(pages.status, 'archived'), isNotNull(pages.templateId)))
      .groupBy(pages.templateId);

    const usageMap = new Map(usageCounts.map((r) => [r.templateId!, Number(r.count)]));

    return rows.map((t) => ({
      ...t,
      pagesUsingCount: usageMap.get(t.id) ?? 0,
    }));
  }

  async findById(id: string) {
    return db.query.templates.findFirst({
      where: eq(templates.id, id),
      with: {
        templateSections: {
          orderBy: [asc(templateSections.orderIndex)],
        },
        category: true,
      },
    });
  }

  async create(data: {
    name: string;
    slug?: string;
    description?: string;
    categoryId?: string | null;
    previewThumbnail?: string;
    status?: string;
    sections?: Array<{
      type: string;
      variant?: string;
      contentJson?: Record<string, unknown>;
      sectionLibraryId?: string | null;
      orderIndex?: number;
    }>;
  }) {
    const slug = data.slug || slugify(data.name);

    const [template] = await db
      .insert(templates)
      .values({
        name: data.name,
        slug,
        description: data.description,
        categoryId: data.categoryId || null,
        previewThumbnail: data.previewThumbnail,
        status: data.status || 'active',
      })
      .returning();

    if (data.sections?.length) {
      await db.insert(templateSections).values(
        data.sections.map((s, i) => ({
          templateId: template.id,
          type: s.type,
          variant: s.variant || 'default',
          contentJson: s.contentJson || {},
          sectionLibraryId: s.sectionLibraryId || null,
          orderIndex: s.orderIndex ?? i,
        }))
      );
    }

    return this.findById(template.id);
  }

  async createFromPage(pageId: string, name?: string) {
    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
      with: {
        sections: {
          orderBy: [asc(pageSections.orderIndex)],
        },
      },
    });

    if (!page) throw new Error('Page not found');

    const templateName = name || `${page.title} Template`;
    const slug = slugify(templateName);

    const [template] = await db
      .insert(templates)
      .values({
        name: templateName,
        slug: `${slug}-${Date.now()}`,
        description: `Created from page: ${page.title}`,
        sourcePageId: pageId,
        categoryId: page.categoryId,
        status: 'active',
      })
      .returning();

    if (page.sections.length) {
      await db.insert(templateSections).values(
        page.sections.map((s, i) => ({
          templateId: template.id,
          type: s.type,
          variant: s.variant || 'default',
          contentJson: s.content as Record<string, unknown>,
          sectionLibraryId: s.sectionLibraryId,
          styleJson: s.styleJson || {},
          settingsJson: s.settingsJson || {},
          responsiveJson: s.responsiveJson || {},
          animationJson: s.animationJson || {},
          orderIndex: s.orderIndex ?? i,
        }))
      );
    }

    return this.findById(template.id);
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      previewThumbnail?: string;
      status?: string;
      sections?: Array<{
        id?: string;
        type: string;
        variant?: string;
        contentJson?: Record<string, unknown>;
        orderIndex?: number;
      }>;
    }
  ) {
    const current = await this.findById(id);
    if (!current) return null;
    if (current.status === 'archived') {
      throw new Error('Cannot update an archived template');
    }

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (data.name !== undefined) patch.name = data.name;
    if (data.description !== undefined) patch.description = data.description;
    if (data.previewThumbnail !== undefined) patch.previewThumbnail = data.previewThumbnail;
    if (data.status !== undefined) patch.status = data.status;
    if (data.slug !== undefined) patch.slug = data.slug;
    else if (data.name !== undefined) patch.slug = slugify(data.name);

    await db.update(templates).set(patch).where(eq(templates.id, id));

    if (data.sections) {
      await db.delete(templateSections).where(eq(templateSections.templateId, id));
      if (data.sections.length) {
        await db.insert(templateSections).values(
          data.sections.map((s, i) => ({
            templateId: id,
            type: s.type,
            variant: s.variant || 'default',
            contentJson: s.contentJson || {},
            orderIndex: s.orderIndex ?? i,
          }))
        );
      }
    }

    return this.findById(id);
  }

  async softDelete(id: string) {
    const current = await this.findById(id);
    if (!current) return;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(and(eq(pages.templateId, id), ne(pages.status, 'archived')));

    if (Number(count) > 0) {
      throw new Error('Cannot delete template linked to active pages');
    }

    await db
      .update(templates)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(templates.id, id));
  }

  async delete(id: string) {
    await this.softDelete(id);
  }

  async incrementUsage(id: string) {
    const t = await this.findById(id);
    if (!t) return;
    await db
      .update(templates)
      .set({ usageCount: t.usageCount + 1, updatedAt: new Date() })
      .where(eq(templates.id, id));
  }
}

export const templateRepository = new TemplateRepository();
