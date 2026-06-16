import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationMenus, navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (location) {
      const menu = await db.query.navigationMenus.findFirst({
        where: eq(navigationMenus.location, location),
      });

      if (!menu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });

      const items = await db.query.navigationItems.findMany({
        where: eq(navigationItems.menuId, menu.id),
      });

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
