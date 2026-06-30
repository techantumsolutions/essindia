import { db } from '@/lib/db';
import { sections, sectionVersions, sectionImportLogs, pageSections, pages } from '@/lib/db/schema';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { generateSectionIdentityHash, generateSectionContentHash } from '@/lib/cms/utils';
import { isValidSectionType } from '@/lib/cms/section-registry';

export class SectionLibraryRepository {
  async findAll(filters?: { search?: string; type?: string; status?: string }) {
    const conditions = [];
    if (filters?.type) conditions.push(eq(sections.type, filters.type));
    if (filters?.status) conditions.push(eq(sections.status, filters.status));
    if (filters?.search) {
      conditions.push(
        or(
          ilike(sections.name, `%${filters.search}%`),
          ilike(sections.type, `%${filters.search}%`)
        )!
      );
    }

    return db.query.sections.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(sections.updatedAt)],
    });
  }

  async findById(id: string) {
    return db.query.sections.findFirst({
      where: eq(sections.id, id),
      with: { versions: { orderBy: [desc(sectionVersions.version)], limit: 10 } },
    });
  }

  async findByHash(hash: string) {
    return db.query.sections.findFirst({
      where: eq(sections.identityHash, hash),
    });
  }

  async create(data: {
    name: string;
    type: string;
    variant?: string;
    previewThumbnail?: string;
    contentJson?: Record<string, unknown>;
    styleJson?: Record<string, unknown>;
    settingsJson?: Record<string, unknown>;
    responsiveJson?: Record<string, unknown>;
    animationJson?: Record<string, unknown>;
    categoryTags?: string[];
    status?: string;
  }) {
    if (!isValidSectionType(data.type)) {
      throw new Error(`Invalid section type: ${data.type}`);
    }

    const contentJson = data.contentJson || {};
    const identityHash = generateSectionIdentityHash(data.type, data.name, contentJson);

    const existing = await this.findByHash(identityHash);
    if (existing) {
      const error = new Error('Section already exists in library.');
      (error as Error & { code: string }).code = 'DUPLICATE_SECTION';
      throw error;
    }

    const [created] = await db
      .insert(sections)
      .values({
        identityHash,
        name: data.name,
        type: data.type,
        variant: data.variant || 'default',
        previewThumbnail: data.previewThumbnail,
        contentJson,
        styleJson: data.styleJson || {},
        settingsJson: data.settingsJson || {},
        responsiveJson: data.responsiveJson || {},
        animationJson: data.animationJson || {},
        categoryTags: data.categoryTags || [],
        status: data.status || 'draft',
        version: 1,
      })
      .returning();

    await db.insert(sectionVersions).values({
      sectionId: created.id,
      version: 1,
      contentJson,
      styleJson: data.styleJson || {},
      settingsJson: data.settingsJson || {},
      responsiveJson: data.responsiveJson || {},
      animationJson: data.animationJson || {},
    });

    return created;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      type: string;
      variant: string;
      previewThumbnail: string;
      contentJson: Record<string, unknown>;
      styleJson: Record<string, unknown>;
      settingsJson: Record<string, unknown>;
      responsiveJson: Record<string, unknown>;
      animationJson: Record<string, unknown>;
      categoryTags: string[];
      status: string;
      isLocked: boolean;
    }>
  ) {
    const current = await this.findById(id);
    if (!current) return null;
    if (current.isLocked) {
      throw new Error('Section is locked and cannot be edited.');
    }

    const newVersion = current.version + 1;
    const contentJson = data.contentJson ?? (current.contentJson as Record<string, unknown>);

    const [updated] = await db
      .update(sections)
      .set({
        ...data,
        contentJson: data.contentJson ?? current.contentJson,
        version: newVersion,
        updatedAt: new Date(),
      })
      .where(eq(sections.id, id))
      .returning();

    if (data.contentJson || data.styleJson) {
      await db.insert(sectionVersions).values({
        sectionId: id,
        version: newVersion,
        contentJson,
        styleJson: data.styleJson ?? (current.styleJson as Record<string, unknown>) ?? {},
        settingsJson: data.settingsJson ?? (current.settingsJson as Record<string, unknown>) ?? {},
        responsiveJson: data.responsiveJson ?? (current.responsiveJson as Record<string, unknown>) ?? {},
        animationJson: data.animationJson ?? (current.animationJson as Record<string, unknown>) ?? {},
      });
    }

    return updated;
  }

  async clone(id: string, newName?: string) {
    const source = await this.findById(id);
    if (!source) return null;

    return this.create({
      name: newName || `${source.name} (Copy)`,
      type: source.type,
      variant: source.variant || 'default',
      previewThumbnail: source.previewThumbnail || undefined,
      contentJson: source.contentJson as Record<string, unknown>,
      styleJson: source.styleJson as Record<string, unknown>,
      settingsJson: source.settingsJson as Record<string, unknown>,
      responsiveJson: source.responsiveJson as Record<string, unknown>,
      animationJson: source.animationJson as Record<string, unknown>,
      categoryTags: (source.categoryTags as string[]) || [],
      status: 'draft',
    });
  }

  async incrementUsage(id: string) {
    await db
      .update(sections)
      .set({ usageCount: sql`${sections.usageCount} + 1` })
      .where(eq(sections.id, id));
  }

  async decrementUsage(id: string) {
    await db
      .update(sections)
      .set({ usageCount: sql`GREATEST(${sections.usageCount} - 1, 0)` })
      .where(eq(sections.id, id));
  }

  async delete(id: string) {
    const current = await this.findById(id);
    if (!current) return;
    if (current.isLocked) {
      throw new Error('Section is locked and cannot be deleted.');
    }
    await db.delete(sections).where(eq(sections.id, id));
  }

  async importFromPage(
    pageId: string,
    sectionIds: string[]
  ): Promise<{
    imported: Array<{ id: string; name: string }>;
    skipped: Array<{ sectionId: string; reason: string }>;
  }> {
    const imported: Array<{ id: string; name: string }> = [];
    const skipped: Array<{ sectionId: string; reason: string }> = [];

    const page = await db.query.pages.findFirst({
      where: eq(pages.id, pageId),
      columns: { id: true, templateId: true, fullPath: true },
    });

    const pageSectionsList = await db.query.pageSections.findMany({
      where: eq(pageSections.pageId, pageId),
      orderBy: [asc(pageSections.orderIndex)],
    });

    const selected = pageSectionsList.filter((s) => sectionIds.includes(s.id));

    for (const ps of selected) {
      const content = (ps.content as Record<string, unknown>) || {};
      const variant = ps.variant || 'default';
      const identityHash = generateSectionContentHash(ps.type, variant, content);

      const existing = await this.findByHash(identityHash);
      if (existing) {
        skipped.push({
          sectionId: ps.id,
          reason: 'Section already exists in library',
        });
        await db.insert(sectionImportLogs).values({
          sectionId: existing.id,
          sourcePageId: pageId,
          sourceSectionId: ps.id,
          identityHash,
          status: 'skipped',
          message: JSON.stringify({
            reason: 'Section already exists in library',
            sourceTemplateId: page?.templateId ?? null,
            importedFrom: page?.fullPath ?? null,
          }),
        });
        continue;
      }

      const name = ps.name || `${ps.type} section`;
      const [created] = await db
        .insert(sections)
        .values({
          identityHash,
          name,
          type: ps.type,
          variant,
          contentJson: content,
          styleJson: (ps.styleJson as Record<string, unknown>) || {},
          settingsJson: (ps.settingsJson as Record<string, unknown>) || {},
          responsiveJson: (ps.responsiveJson as Record<string, unknown>) || {},
          animationJson: (ps.animationJson as Record<string, unknown>) || {},
          sourcePageId: pageId,
          sourceSectionId: ps.id,
          status: 'active',
          version: 1,
        })
        .returning();

      await db.insert(sectionVersions).values({
        sectionId: created.id,
        version: 1,
        contentJson: content,
        styleJson: (ps.styleJson as Record<string, unknown>) || {},
        settingsJson: (ps.settingsJson as Record<string, unknown>) || {},
        responsiveJson: (ps.responsiveJson as Record<string, unknown>) || {},
        animationJson: (ps.animationJson as Record<string, unknown>) || {},
      });

      await db.insert(sectionImportLogs).values({
        sectionId: created.id,
        sourcePageId: pageId,
        sourceSectionId: ps.id,
        identityHash,
        status: 'imported',
        message: JSON.stringify({
          importedFrom: page?.fullPath ?? null,
          sourceTemplateId: page?.templateId ?? null,
          importedAt: new Date().toISOString(),
          version: 1,
        }),
      });

      imported.push({ id: created.id, name: created.name });
    }

    return { imported, skipped };
  }
}

export const sectionLibraryRepository = new SectionLibraryRepository();
