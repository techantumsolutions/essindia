import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  megaMenuCategories,
  megaMenuSubCategories,
  megaMenuSubSubCategories,
  navigationItems,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isAdminRequest } from '@/lib/cms/auth';
import { slugify } from '@/lib/cms/utils';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const navigationItemId = searchParams.get('navigationItemId');
  if (!navigationItemId) {
    return NextResponse.json({ error: 'navigationItemId required' }, { status: 400 });
  }

  const payload = await megaMenuRepository.getMegaMenuByNavigationItemId(navigationItemId);
  const navItem = await db.query.navigationItems.findFirst({
    where: eq(navigationItems.id, navigationItemId),
  });

  return NextResponse.json({ navItem, megaMenu: payload });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { level, navigationItemId, categoryId, subCategoryId, name, slug, description, thumbnail, pageId, orderIndex, status } = body;

    if (level === 'category') {
      if (!navigationItemId || !name) {
        return NextResponse.json({ error: 'navigationItemId and name required' }, { status: 400 });
      }
      const [row] = await db
        .insert(megaMenuCategories)
        .values({
          navigationItemId,
          pageId: pageId ?? null,
          name,
          slug: slug || slugify(name),
          orderIndex: orderIndex ?? 0,
          status: status ?? 'active',
        })
        .returning();
      await invalidateMegaMenuCache(navigationItemId);
      return NextResponse.json(row);
    }

    if (level === 'sub') {
      if (!categoryId || !name) {
        return NextResponse.json({ error: 'categoryId and name required' }, { status: 400 });
      }
      const [row] = await db
        .insert(megaMenuSubCategories)
        .values({
          categoryId,
          name,
          slug: slug || slugify(name),
          description: description ?? null,
          thumbnail: thumbnail ?? null,
          pageId: pageId ?? null,
          orderIndex: orderIndex ?? 0,
          status: status ?? 'active',
        })
        .returning();
      await invalidateMegaMenuCacheByCategory(categoryId);
      return NextResponse.json(row);
    }

    if (level === 'sub-sub') {
      if (!subCategoryId || !name) {
        return NextResponse.json({ error: 'subCategoryId and name required' }, { status: 400 });
      }
      const [row] = await db
        .insert(megaMenuSubSubCategories)
        .values({
          subCategoryId,
          name,
          slug: slug || slugify(name),
          pageId: pageId ?? null,
          orderIndex: orderIndex ?? 0,
          status: status ?? 'active',
        })
        .returning();
      await invalidateMegaMenuCacheBySubCategory(subCategoryId);
      return NextResponse.json(row);
    }

    return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
  } catch (error) {
    console.error('[API MegaMenu POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function invalidateMegaMenuCache(navigationItemId: string) {
  await megaMenuRepository.clearCacheForNavItem(navigationItemId, 'header-main');
  await navigationRepository.clearCache('header-main');
  await navigationTreeRepository.clearCache('header-main');
  await navigationTreeRepository.clearCache('header-main');
}

async function invalidateMegaMenuCacheByCategory(categoryId: string) {
  const cat = await db.query.megaMenuCategories.findFirst({
    where: eq(megaMenuCategories.id, categoryId),
  });
  if (cat) await invalidateMegaMenuCache(cat.navigationItemId);
}

async function invalidateMegaMenuCacheBySubCategory(subCategoryId: string) {
  const sub = await db.query.megaMenuSubCategories.findFirst({
    where: eq(megaMenuSubCategories.id, subCategoryId),
    with: { category: true },
  });
  if (sub?.category && !Array.isArray(sub.category)) await invalidateMegaMenuCache(sub.category.navigationItemId);
}
