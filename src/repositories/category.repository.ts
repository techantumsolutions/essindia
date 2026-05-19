import { db } from '@/lib/db';
import { categories, pages } from '@/lib/db/schema';
import { and, asc, eq, isNull, ne, sql } from 'drizzle-orm';
import { buildCategoryTree, slugify } from '@/lib/cms/utils';
import type { CategoryTreeNode } from '@/lib/cms/types';

export class CategoryRepository {
  async getAll() {
    return db.query.categories.findMany({
      where: ne(categories.status, 'archived'),
      orderBy: [asc(categories.orderIndex), asc(categories.name)],
    });
  }

  async getTree(): Promise<CategoryTreeNode[]> {
    const all = await this.getAll();
    return buildCategoryTree(all) as CategoryTreeNode[];
  }

  async getById(id: string) {
    return db.query.categories.findFirst({
      where: eq(categories.id, id),
      with: { seo: true, children: true },
    });
  }

  async getChildren(parentId: string | null) {
    return db.query.categories.findMany({
      where: parentId ? eq(categories.parentId, parentId) : isNull(categories.parentId),
      orderBy: [asc(categories.orderIndex)],
    });
  }

  private async assertSlugUnique(slug: string, excludeId?: string) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    if (existing && existing.id !== excludeId) {
      throw new Error('A category with this slug already exists');
    }
  }

  private async assertParentValid(categoryId: string | null, parentId: string | null) {
    if (!parentId) return;
    if (categoryId && parentId === categoryId) {
      throw new Error('Category cannot be its own parent');
    }
    if (categoryId && (await this.isDescendantOf(categoryId, parentId))) {
      throw new Error('Circular hierarchy is not allowed');
    }
    const parent = await db.query.categories.findFirst({
      where: eq(categories.id, parentId),
    });
    if (!parent || parent.status === 'archived') {
      throw new Error('Parent category not found');
    }
  }

  private async isDescendantOf(ancestorId: string, possibleDescendantId: string): Promise<boolean> {
    let current: string | null = possibleDescendantId;
    const seen = new Set<string>();
    while (current) {
      if (current === ancestorId) return true;
      if (seen.has(current)) return false;
      seen.add(current);
      const parentId: string | null = (
        await db.query.categories.findFirst({
          where: eq(categories.id, current),
          columns: { parentId: true },
        })
      )?.parentId ?? null;
      current = parentId;
    }
    return false;
  }

  async create(data: {
    name: string;
    slug?: string;
    parentId?: string | null;
    description?: string;
    icon?: string;
    imageUrl?: string;
    orderIndex?: number;
    status?: string;
  }) {
    const slug = data.slug || slugify(data.name);
    await this.assertSlugUnique(slug);
    await this.assertParentValid(null, data.parentId ?? null);

    const [created] = await db
      .insert(categories)
      .values({
        name: data.name,
        slug,
        parentId: data.parentId || null,
        description: data.description,
        icon: data.icon,
        imageUrl: data.imageUrl || null,
        orderIndex: data.orderIndex ?? 0,
        status: data.status || 'active',
      })
      .returning();
    return created;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      parentId: string | null;
      description: string;
      icon: string;
      imageUrl: string;
      orderIndex: number;
      status: string;
    }>
  ) {
    const current = await this.getById(id);
    if (!current) return null;
    if (current.status === 'archived') {
      throw new Error('Cannot update an archived category');
    }

    const slug = data.slug ?? current.slug;
    if (data.slug) await this.assertSlugUnique(slug, id);

    if (data.parentId !== undefined) {
      await this.assertParentValid(id, data.parentId);
    }

    const [updated] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async delete(id: string) {
    const current = await this.getById(id);
    if (!current) return;

    const children = await this.getChildren(id);
    if (children.some((c) => c.status !== 'archived')) {
      throw new Error('Cannot delete category with child categories. Remove or reassign children first.');
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pages)
      .where(and(eq(pages.categoryId, id), ne(pages.status, 'archived')));

    if (Number(count) > 0) {
      throw new Error('Cannot delete category linked to active pages');
    }

    await db
      .update(categories)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(categories.id, id));
  }
}

export const categoryRepository = new CategoryRepository();
