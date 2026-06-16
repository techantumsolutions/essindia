import { NextResponse } from 'next/server';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'header-main';

  try {
    const tree = await navigationTreeRepository.getTreeByLocation(location);
    const megaMenus = await navigationTreeRepository.getMegaMenusByLocation(location);
    const navigation = await navigationTreeRepository.getNavigationByLocation(location, 'public');
    return NextResponse.json({ location, tree, megaMenus, navigation });
  } catch (error) {
    console.error('[API Navigation Tree]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
