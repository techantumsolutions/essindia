import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';
import { navigationRepository } from '@/repositories/navigation.repository';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const params = await props.params;
    const body = await request.json();
    const { label, slug, url, icon, isActive, orderIndex, megaMenuEnabled, megaMenuConfig, pageId } =
      body;

    const updated = await db
      .update(navigationItems)
      .set({
        label,
        slug,
        url,
        pageId: pageId !== undefined ? (pageId ?? null) : undefined,
        icon,
        isActive,
        orderIndex,
        megaMenuEnabled,
        megaMenuConfig,
        updatedAt: new Date(),
      })
      .where(eq(navigationItems.id, params.id))
      .returning();

    if (!updated.length) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    await megaMenuRepository.clearCacheForNavItem(params.id, 'header-main');
    await navigationRepository.clearCache('header-main');
    await navigationTreeRepository.clearCache('header-main');

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[API Navigation PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const params = await props.params;
    const deleted = await db
      .delete(navigationItems)
      .where(eq(navigationItems.id, params.id))
      .returning();

    if (!deleted.length) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    await navigationTreeRepository.clearCache('header-main');
    await navigationRepository.clearCache('header-main');

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error('[API Navigation DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
