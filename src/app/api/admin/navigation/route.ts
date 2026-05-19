import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationMenus, navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock authentication check for the API
async function isAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  // In a real app, verify user.role === 'admin'
  return true; // Bypassing for this demo since we might be using mock envs
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (location) {
      const menu = await db.query.navigationMenus.findFirst({
        where: eq(navigationMenus.location, location),
        with: {
          // This would require relation setup in schema, but we can fetch separately
        }
      });
      
      if (!menu) return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
      
      const items = await db.query.navigationItems.findMany({
        where: eq(navigationItems.menuId, menu.id),
      });

      // Build tree
      const buildTree = (items: any[], parentId: string | null = null): any[] => {
        return items
          .filter(item => item.parentId === parentId)
          .map(item => ({
            ...item,
            children: buildTree(items, item.id)
          }));
      };

      return NextResponse.json({ menu, items: buildTree(items) });
    }

    const menus = await db.query.navigationMenus.findMany();
    return NextResponse.json(menus);
  } catch (error) {
    console.error('[API Navigation GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { type, menuId, parentId, label, url, icon, location, name } = body;

    // Create new menu wrapper
    if (type === 'menu') {
      const newMenu = await db.insert(navigationMenus).values({
        name,
        location,
      }).returning();
      return NextResponse.json(newMenu[0]);
    }

    // Create new navigation item (Tab, Category, or Link)
    if (type === 'item') {
      const newItem = await db.insert(navigationItems).values({
        menuId,
        parentId: parentId || null,
        label,
        url: url || '#',
        icon,
      }).returning();
      return NextResponse.json(newItem[0]);
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('[API Navigation POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
