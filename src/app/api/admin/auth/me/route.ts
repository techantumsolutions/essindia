import { NextResponse } from 'next/server';
import { getAdminSessionServer, DEFAULT_SUPER_ADMIN } from '@/lib/auth/session';

export async function GET() {
  const session = await getAdminSessionServer();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: session
  });
}
