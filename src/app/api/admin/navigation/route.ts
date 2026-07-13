import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationMenus, navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';
import { revalidatePath } from 'next/cache';

import { navigationRepository } from '@/repositories/navigation.repository';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const compact = searchParams.get('compact') === 'true';

    if (location) {
      const menu = await db.query.navigationMenus.findFirst({
        where: eq(navigationMenus.location, location),
      });

      if (!menu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

      const items = await db.query.navigationItems.findMany({
        where: eq(navigationItems.menuId, menu.id),
      });

      if (compact) {
        return NextResponse.json(
          {
            menu,
            items: items
              .filter((item) => !item.parentId)
              .map((item) => ({
                id: item.id,
                label: item.label,
                slug: item.slug,
                megaMenuEnabled: item.megaMenuEnabled,
                orderIndex: item.orderIndex,
              })),
          },
          { headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' } }
        );
      }

      const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
          .filter((item) => item.parentId === parentId)
          .map((item) => ({
            ...item,
            children: buildTree(items, item.id),
          }));
      };

      const linkedPagesByNavItem =
        await navigationTreeRepository.getLinkedPagesByNavItemForAdmin(location);

      return NextResponse.json(
        { menu, items: buildTree(items), linkedPagesByNavItem },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const menus = await db.query.navigationMenus.findMany();
    return NextResponse.json(menus, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('[API Navigation GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const { type, menuId, parentId, label, url, icon, location, name } = body;

    if (type === 'menu') {
      const newMenu = await db
        .insert(navigationMenus)
        .values({
          name,
          location,
        })
        .returning();
      return NextResponse.json(newMenu[0]);
    }

    if (type === 'item') {
      const newItem = await db
        .insert(navigationItems)
        .values({
          menuId,
          parentId: parentId || null,
          label,
          url: url || '#',
          icon,
        })
        .returning();
      return NextResponse.json(newItem[0]);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('[API Navigation POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const { location, logoUrl, getStartedText, getStartedLink } = body;

    if (!location) {
      return NextResponse.json({ error: 'location is required' }, { status: 400 });
    }

    const updated = await db
      .update(navigationMenus)
      .set({
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        getStartedText: getStartedText !== undefined ? getStartedText : undefined,
        getStartedLink: getStartedLink !== undefined ? getStartedLink : undefined,
        updatedAt: new Date(),
      })
      .where(eq(navigationMenus.location, location))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    await navigationRepository.clearCache('header-main');
    await navigationTreeRepository.clearCache('header-main');

    // Force revalidation of all layouts and pages (which includes the header components)
    revalidatePath('/', 'layout');

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[API Navigation PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
