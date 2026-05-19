import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { navigationTreeRepository } from '@/repositories/navigation-tree.repository';
import { serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'header-main';

  try {
    const items = await navigationTreeRepository.getTreeByLocation(location);
    return NextResponse.json({ items });
  } catch (error) {
    return serverError(error);
  }
}
