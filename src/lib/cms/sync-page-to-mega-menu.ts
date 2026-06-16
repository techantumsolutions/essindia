import { db } from '@/lib/db';
import {
  pages,
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
} from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

type SyncPageInput = {
  id: string;
  title: string;
  slug: string;
  navigationItemId: string;
  parentId: string | null;
  depthLevel: number;
  sortOrder: number;
  megaMenuCategoryId?: string | null;
  megaMenuSubCategoryId?: string | null;
  megaMenuSubSubCategoryId?: string | null;
};

type PageMegaMenuIds = {
  id: string;
  title: string;
  slug: string;
  navigationItemId: string | null;
  parentId: string | null;
  megaMenuCategoryId: string | null;
  megaMenuSubCategoryId: string | null;
  megaMenuSubSubCategoryId: string | null;
};

/** Keep linked mega menu labels in sync when page title/slug changes. */
export async function updateMegaMenuFromPage(page: PageMegaMenuIds): Promise<void> {
  const touch = { name: page.title, slug: page.slug, pageId: page.id, updatedAt: new Date() };

  if (page.megaMenuSubSubCategoryId) {
    await db
      .update(megaMenuSubSubCategories)
      .set(touch)
      .where(eq(megaMenuSubSubCategories.id, page.megaMenuSubSubCategoryId));
  }
  if (page.megaMenuSubCategoryId) {
    await db
      .update(megaMenuSubCategories)
      .set(touch)
      .where(eq(megaMenuSubCategories.id, page.megaMenuSubCategoryId));
  }
  if (page.megaMenuCategoryId) {
    await db
      .update(megaMenuCategories)
      .set(touch)
      .where(eq(megaMenuCategories.id, page.megaMenuCategoryId));
  }
}

/** Mirror page hierarchy into mega_menu tables so navbar picks up new pages immediately. */
export async function syncPageToMegaMenu(page: SyncPageInput): Promise<void> {
  if (
    page.megaMenuSubSubCategoryId ||
    page.megaMenuSubCategoryId ||
    page.megaMenuCategoryId
  ) {
    return;
  }

  const depth = page.depthLevel > 0 ? page.depthLevel : page.parentId ? 2 : 1;

  if (!page.parentId || depth === 1) {
    await syncRootPageToMegaMenu(page);
    return;
  }

  const parent = await db.query.pages.findFirst({
    where: eq(pages.id, page.parentId),
    columns: {
      id: true,
      title: true,
      slug: true,
      navigationItemId: true,
      parentId: true,
      megaMenuCategoryId: true,
      megaMenuSubCategoryId: true,
      megaMenuSubSubCategoryId: true,
    },
  });

  if (!parent?.navigationItemId) return;

  if (!parent.megaMenuCategoryId && !parent.megaMenuSubCategoryId) {
    await syncPageToMegaMenu({
      id: parent.id,
      title: parent.title,
      slug: parent.slug,
      navigationItemId: parent.navigationItemId,
      parentId: parent.parentId,
      depthLevel: 1,
      sortOrder: 0,
      megaMenuCategoryId: parent.megaMenuCategoryId,
      megaMenuSubCategoryId: parent.megaMenuSubCategoryId,
      megaMenuSubSubCategoryId: parent.megaMenuSubSubCategoryId,
    });
    const refreshed = await db.query.pages.findFirst({
      where: eq(pages.id, parent.id),
      columns: { megaMenuCategoryId: true, megaMenuSubCategoryId: true },
    });
    parent.megaMenuCategoryId = refreshed?.megaMenuCategoryId ?? null;
    parent.megaMenuSubCategoryId = refreshed?.megaMenuSubCategoryId ?? null;
  }

  if (depth === 2 && parent.megaMenuCategoryId) {
    let sub = await db.query.megaMenuSubCategories.findFirst({
      where: and(
        eq(megaMenuSubCategories.categoryId, parent.megaMenuCategoryId),
        eq(megaMenuSubCategories.slug, page.slug)
      ),
    });

    if (!sub) {
      const [created] = await db
        .insert(megaMenuSubCategories)
        .values({
          categoryId: parent.megaMenuCategoryId,
          name: page.title,
          slug: page.slug,
          pageId: page.id,
          orderIndex: page.sortOrder ?? 999,
          status: 'active',
        })
        .returning();
      sub = created;
    } else {
      await db
        .update(megaMenuSubCategories)
        .set({ pageId: page.id, name: page.title, updatedAt: new Date() })
        .where(eq(megaMenuSubCategories.id, sub.id));
    }

    await db
      .update(pages)
      .set({
        megaMenuCategoryId: parent.megaMenuCategoryId,
        megaMenuSubCategoryId: sub.id,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, page.id));
    return;
  }

  if (depth >= 3 && parent.megaMenuSubCategoryId) {
    let leaf = await db.query.megaMenuSubSubCategories.findFirst({
      where: and(
        eq(megaMenuSubSubCategories.subCategoryId, parent.megaMenuSubCategoryId),
        eq(megaMenuSubSubCategories.slug, page.slug)
      ),
    });

    if (!leaf) {
      const [created] = await db
        .insert(megaMenuSubSubCategories)
        .values({
          subCategoryId: parent.megaMenuSubCategoryId,
          name: page.title,
          slug: page.slug,
          pageId: page.id,
          orderIndex: page.sortOrder ?? 999,
          status: 'active',
        })
        .returning();
      leaf = created;
    } else {
      await db
        .update(megaMenuSubSubCategories)
        .set({ pageId: page.id, name: page.title, updatedAt: new Date() })
        .where(eq(megaMenuSubSubCategories.id, leaf.id));
    }

    await db
      .update(pages)
      .set({
        megaMenuCategoryId: parent.megaMenuCategoryId,
        megaMenuSubCategoryId: parent.megaMenuSubCategoryId,
        megaMenuSubSubCategoryId: leaf.id,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, page.id));
  }
}

async function syncRootPageToMegaMenu(page: SyncPageInput): Promise<void> {
  let category = await db.query.megaMenuCategories.findFirst({
    where: and(
      eq(megaMenuCategories.navigationItemId, page.navigationItemId),
      eq(megaMenuCategories.slug, page.slug)
    ),
  });

  if (!category) {
    const [created] = await db
      .insert(megaMenuCategories)
      .values({
        navigationItemId: page.navigationItemId,
        name: page.title,
        slug: page.slug,
        pageId: page.id,
        orderIndex: page.sortOrder ?? 999,
        status: 'active',
      })
      .returning();
    category = created;
  } else {
    await db
      .update(megaMenuCategories)
      .set({ pageId: page.id, name: page.title, updatedAt: new Date() })
      .where(eq(megaMenuCategories.id, category.id));
  }

  let sub = await db.query.megaMenuSubCategories.findFirst({
    where: and(
      eq(megaMenuSubCategories.categoryId, category.id),
      eq(megaMenuSubCategories.slug, page.slug)
    ),
  });

  if (!sub) {
    const [created] = await db
      .insert(megaMenuSubCategories)
      .values({
        categoryId: category.id,
        name: page.title,
        slug: page.slug,
        pageId: page.id,
        orderIndex: 0,
        status: 'active',
      })
      .returning();
    sub = created;
  } else {
    await db
      .update(megaMenuSubCategories)
      .set({ pageId: page.id, name: page.title, updatedAt: new Date() })
      .where(eq(megaMenuSubCategories.id, sub.id));
  }

  await db
    .update(pages)
    .set({
      megaMenuCategoryId: category.id,
      megaMenuSubCategoryId: sub.id,
      updatedAt: new Date(),
    })
    .where(eq(pages.id, page.id));
}

/** Ensure every CMS page linked to a nav item has a mega menu entry (website + admin parity). */
export async function ensureNavPagesSyncedToMegaMenu(navigationItemId: string): Promise<void> {
  type Row = {
    id: string;
    title: string;
    slug: string;
    parentId: string | null;
    navigationItemId: string | null;
    depthLevel: number;
    sortOrder: number;
    megaMenuCategoryId: string | null;
    megaMenuSubCategoryId: string | null;
    megaMenuSubSubCategoryId: string | null;
  };

  let rows: Row[] = [];

  try {
    rows = await db
      .select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        parentId: pages.parentId,
        navigationItemId: pages.navigationItemId,
        depthLevel: pages.depthLevel,
        sortOrder: pages.sortOrder,
        megaMenuCategoryId: pages.megaMenuCategoryId,
        megaMenuSubCategoryId: pages.megaMenuSubCategoryId,
        megaMenuSubSubCategoryId: pages.megaMenuSubSubCategoryId,
      })
      .from(pages)
      .where(and(eq(pages.isTemplate, false), eq(pages.navigationItemId, navigationItemId)));
  } catch {
    const basic = await db
      .select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        parentId: pages.parentId,
        navigationItemId: pages.navigationItemId,
        megaMenuCategoryId: pages.megaMenuCategoryId,
        megaMenuSubCategoryId: pages.megaMenuSubCategoryId,
        megaMenuSubSubCategoryId: pages.megaMenuSubSubCategoryId,
      })
      .from(pages)
      .where(and(eq(pages.isTemplate, false), eq(pages.navigationItemId, navigationItemId)));

    rows = basic.map((row) => ({
      ...row,
      depthLevel: 0,
      sortOrder: 0,
    }));
  }

  if (!rows.length) return;

  const byId = new Map(rows.map((row) => [row.id, row]));
  const depthOf = (row: Row) => {
    if (row.depthLevel > 0) return row.depthLevel;
    let depth = 1;
    let current = row.parentId ? byId.get(row.parentId) : null;
    while (current) {
      depth += 1;
      current = current.parentId ? byId.get(current.parentId) : null;
    }
    return depth;
  };

  const sorted = [...rows].sort((a, b) => depthOf(a) - depthOf(b));

  for (const page of sorted) {
    if (page.megaMenuCategoryId || page.megaMenuSubCategoryId || page.megaMenuSubSubCategoryId) {
      await updateMegaMenuFromPage({
        id: page.id,
        title: page.title,
        slug: page.slug,
        navigationItemId: page.navigationItemId,
        parentId: page.parentId,
        megaMenuCategoryId: page.megaMenuCategoryId,
        megaMenuSubCategoryId: page.megaMenuSubCategoryId,
        megaMenuSubSubCategoryId: page.megaMenuSubSubCategoryId,
      });
      continue;
    }

    await syncPageToMegaMenu({
      id: page.id,
      title: page.title,
      slug: page.slug,
      navigationItemId,
      parentId: page.parentId,
      depthLevel: depthOf(page),
      sortOrder: page.sortOrder ?? 0,
    });
  }
}
