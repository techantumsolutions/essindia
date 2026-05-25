import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { megaMenuCategories, megaMenuSubCategories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
  return true; 
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { level, items, navigationItemId } = body; // items: Array of { id: string, orderIndex: number }

    if (!Array.isArray(items) || !level) {
      return NextResponse.json({ error: 'level and items must be provided' }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      if (level === 'category') {
        for (const item of items) {
          await tx.update(megaMenuCategories)
            .set({ orderIndex: item.orderIndex })
            .where(eq(megaMenuCategories.id, item.id));
        }
      } else if (level === 'sub') {
        for (const item of items) {
          await tx.update(megaMenuSubCategories)
            .set({ orderIndex: item.orderIndex })
            .where(eq(megaMenuSubCategories.id, item.id));
        }
      }
    });

    // Invalidate caches if navigationItemId is provided
    if (navigationItemId) {
      await megaMenuRepository.clearCacheForNavItem(navigationItemId, 'header-main');
      await navigationRepository.clearCache('header-main');
      await navigationTreeRepository.clearCache('header-main');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API MegaMenu Reorder POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
