import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'header-main';

  try {
    const navigationItemId = searchParams.get('navigationItemId');

    if (navigationItemId) {
      const megaMenu = await navigationTreeRepository.getAdminMegaMenuForNavItem(navigationItemId);
      if (!megaMenu) {
        return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
      }
      return NextResponse.json(megaMenu, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const items = await navigationTreeRepository.getAdminHierarchyByLocation(location);
    return NextResponse.json({ items }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    return serverError(error);
  }
}
