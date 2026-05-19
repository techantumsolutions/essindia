import { NextResponse } from 'next/server';
import { megaMenuRepository } from '@/repositories/mega-menu.repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const navigationItemId = searchParams.get('navigationItemId');
  const location = searchParams.get('location');

  try {
    if (navigationItemId) {
      const megaMenu = await megaMenuRepository.getMegaMenuByNavigationItemId(navigationItemId);
      return NextResponse.json({ megaMenu });
    }

    if (location) {
      const megaMenus = await megaMenuRepository.getMegaMenusByLocation(location);
      return NextResponse.json({ megaMenus });
    }

    return NextResponse.json({ error: 'navigationItemId or location required' }, { status: 400 });
  } catch (error) {
    console.error('[API Public MegaMenu]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
