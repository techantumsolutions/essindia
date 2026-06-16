import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { megaMenuCategories, megaMenuSubCategories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

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
