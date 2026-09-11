import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  response.cookies.set('mock-admin-session', '', { path: '/', maxAge: 0 });

  return response;
}
