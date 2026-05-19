import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAdminRequest } from '@/lib/cms/auth';
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

  try {
    if (level === 'category') {
      const [row] = await db
        .update(megaMenuCategories)
        .set({
          name,
          slug: slug || (name ? slugify(name) : undefined),
          orderIndex,
          status,
          updatedAt: new Date(),
        })
        .where(eq(megaMenuCategories.id, params.id))
        .returning();
      if (row) await clearCaches(row.navigationItemId);
      return NextResponse.json(row);
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
        const cat = await db.query.megaMenuCategories.findFirst({
          where: eq(megaMenuCategories.id, row.categoryId),
        });
        if (cat) await clearCaches(cat.navigationItemId);
      }
      return NextResponse.json(row);
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
        const sub = await db.query.megaMenuSubCategories.findFirst({
          where: eq(megaMenuSubCategories.id, row.subCategoryId),
          with: { category: true },
        });
        const category = sub?.category;
        if (category && !Array.isArray(category) && 'navigationItemId' in category) {
          await clearCaches(category.navigationItemId as string);
        }
      }
      return NextResponse.json(row);
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
