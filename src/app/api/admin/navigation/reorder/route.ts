import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const body = await request.json();
    const { items } = body; // Array of { id: string, orderIndex: number }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    // Update each item's orderIndex in transaction
    await db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(navigationItems)
          .set({ orderIndex: item.orderIndex })
          .where(eq(navigationItems.id, item.id));
      }
    });

    // Invalidate caches
    await navigationRepository.clearCache('header-main');
    await navigationTreeRepository.clearCache('header-main');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Navigation Reorder POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
