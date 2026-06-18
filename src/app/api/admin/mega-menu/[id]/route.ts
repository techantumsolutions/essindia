import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
  pages,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAdminRequest } from '@/lib/cms/auth';

function isValidUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
import { slugify } from '@/lib/cms/utils';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await props.params;
  const body = await request.json();
  const { level, name, slug, description, thumbnail, pageId, orderIndex, status } = body;

  if (!isValidUuid(params.id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    if (level === 'category') {
      const [row] = await db
        .update(megaMenuCategories)
        .set({
          name,
          pageId: pageId !== undefined ? (pageId ?? null) : undefined,
          slug: slug || (name ? slugify(name) : undefined),
          orderIndex,
          status,
          updatedAt: new Date(),
        })
        .where(eq(megaMenuCategories.id, params.id))
        .returning();

      if (row) {
        if (row.pageId) {
          await db
            .update(pages)
            .set({
              sortOrder: orderIndex,
              title: name,
              slug: slug || (name ? slugify(name) : undefined),
              updatedAt: new Date(),
            })
            .where(eq(pages.id, row.pageId));
        }
        await clearCaches(row.navigationItemId);
        return NextResponse.json(row);
      } else {
        const [pageRow] = await db
          .update(pages)
          .set({
            sortOrder: orderIndex,
            title: name,
            slug: slug || (name ? slugify(name) : undefined),
            updatedAt: new Date(),
          })
          .where(eq(pages.id, params.id))
          .returning();

        if (pageRow) {
          if (pageRow.navigationItemId) await clearCaches(pageRow.navigationItemId);
          return NextResponse.json({
            id: pageRow.id,
            name: pageRow.title,
            slug: pageRow.slug,
            orderIndex: pageRow.sortOrder,
            status: pageRow.status === 'published' ? 'active' : 'inactive',
          });
        }
      }
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (level === 'sub') {
      const [row] = await db
        .update(megaMenuSubCategories)
        .set({
          name,
          slug: slug || (name ? slugify(name) : undefined),
          description,
          thumbnail,
          pageId,
          orderIndex,
          status,
          updatedAt: new Date(),
        })
        .where(eq(megaMenuSubCategories.id, params.id))
        .returning();

      if (row) {
        if (row.pageId) {
          await db
            .update(pages)
            .set({
              sortOrder: orderIndex,
              title: name,
              slug: slug || (name ? slugify(name) : undefined),
              updatedAt: new Date(),
            })
            .where(eq(pages.id, row.pageId));
        }
        const cat = await db.query.megaMenuCategories.findFirst({
          where: eq(megaMenuCategories.id, row.categoryId),
        });
        if (cat) await clearCaches(cat.navigationItemId);
        return NextResponse.json(row);
      } else {
        const [pageRow] = await db
          .update(pages)
          .set({
            sortOrder: orderIndex,
            title: name,
            slug: slug || (name ? slugify(name) : undefined),
            updatedAt: new Date(),
          })
          .where(eq(pages.id, params.id))
          .returning();

        if (pageRow) {
          if (pageRow.navigationItemId) await clearCaches(pageRow.navigationItemId);
          return NextResponse.json({
            id: pageRow.id,
            name: pageRow.title,
            slug: pageRow.slug,
            orderIndex: pageRow.sortOrder,
            status: pageRow.status === 'published' ? 'active' : 'inactive',
          });
        }
      }
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
    }

    if (level === 'sub-sub') {
      const [row] = await db
        .update(megaMenuSubSubCategories)
        .set({
          name,
          slug: slug || (name ? slugify(name) : undefined),
          pageId,
          orderIndex,
          status,
          updatedAt: new Date(),
        })
        .where(eq(megaMenuSubSubCategories.id, params.id))
        .returning();

      if (row) {
        if (row.pageId) {
          await db
            .update(pages)
            .set({
              sortOrder: orderIndex,
              title: name,
              slug: slug || (name ? slugify(name) : undefined),
              updatedAt: new Date(),
            })
            .where(eq(pages.id, row.pageId));
        }
        const sub = await db.query.megaMenuSubCategories.findFirst({
          where: eq(megaMenuSubCategories.id, row.subCategoryId),
          with: { category: true },
        });
        const category = sub?.category;
        if (category && !Array.isArray(category) && 'navigationItemId' in category) {
          await clearCaches(category.navigationItemId as string);
        }
        return NextResponse.json(row);
      } else {
        const [pageRow] = await db
          .update(pages)
          .set({
            sortOrder: orderIndex,
            title: name,
            slug: slug || (name ? slugify(name) : undefined),
            updatedAt: new Date(),
          })
          .where(eq(pages.id, params.id))
          .returning();

        if (pageRow) {
          if (pageRow.navigationItemId) await clearCaches(pageRow.navigationItemId);
          return NextResponse.json({
            id: pageRow.id,
            name: pageRow.title,
            slug: pageRow.slug,
            orderIndex: pageRow.sortOrder,
            status: pageRow.status === 'published' ? 'active' : 'inactive',
          });
        }
      }
      return NextResponse.json({ error: 'Leaf link not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
  } catch (error) {
    console.error('[API MegaMenu PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = await props.params;
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  if (!isValidUuid(params.id)) {
    return NextResponse.json({ success: true });
  }

  try {
    if (level === 'category') {
      const existing = await db.query.megaMenuCategories.findFirst({
        where: eq(megaMenuCategories.id, params.id),
      });
      await db.delete(megaMenuCategories).where(eq(megaMenuCategories.id, params.id));
      if (existing) await clearCaches(existing.navigationItemId);
      return NextResponse.json({ success: true });
    }

    if (level === 'sub') {
      const existing = await db.query.megaMenuSubCategories.findFirst({
        where: eq(megaMenuSubCategories.id, params.id),
        with: { category: true },
      });
      await db.delete(megaMenuSubCategories).where(eq(megaMenuSubCategories.id, params.id));
      if (existing?.category && !Array.isArray(existing.category)) await clearCaches(existing.category.navigationItemId);
      return NextResponse.json({ success: true });
    }

    if (level === 'sub-sub') {
      const existing = await db.query.megaMenuSubSubCategories.findFirst({
        where: eq(megaMenuSubSubCategories.id, params.id),
        with: { subCategory: { with: { category: true } } },
      });
      await db.delete(megaMenuSubSubCategories).where(eq(megaMenuSubSubCategories.id, params.id));
      const sub = existing?.subCategory && !Array.isArray(existing.subCategory) ? existing.subCategory : null;
      const cat = sub?.category && !Array.isArray(sub.category) ? sub.category : null;
      const navId = cat?.navigationItemId;
      if (navId) await clearCaches(navId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'level query param required' }, { status: 400 });
  } catch (error) {
    console.error('[API MegaMenu DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function clearCaches(navigationItemId: string) {
  await megaMenuRepository.clearCacheForNavItem(navigationItemId, 'header-main');
  await navigationRepository.clearCache('header-main');
  await navigationTreeRepository.clearCache('header-main');
}
