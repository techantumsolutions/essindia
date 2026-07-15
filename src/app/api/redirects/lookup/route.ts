import { NextResponse } from 'next/server';
import { redirectRepository } from '@/repositories/redirect.repository';

/**
 * Internal/public lookup for CMS redirects (used by proxy).
 * Returns 204 when no redirect matches.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    const map = await redirectRepository.getEnabledMap();
    const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    const hit = map[normalized] || map[path];
    if (!hit) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(hit);
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
