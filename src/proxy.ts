import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { getPreferredHost, shouldForceHttps } from '@/lib/seo/site-url';

/**
 * Edge proxy:
 * - Optional host/HTTPS canonicalization when ENABLE_HOST_REDIRECTS=true
 * - Admin session gate for /admin/*
 * CMS path redirects are handled in public page routes (Node) to avoid Edge DB/fetch cost.
 */
export default async function proxy(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const pathname = url.pathname;

    if (process.env.ENABLE_HOST_REDIRECTS === 'true') {
      const preferredHost = getPreferredHost();
      const host = request.headers.get('host')?.split(':')[0] || '';
      const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');

      if (preferredHost && host && host !== preferredHost && !host.includes('localhost')) {
        const redirectUrl = new URL(request.url);
        redirectUrl.host = preferredHost;
        if (shouldForceHttps()) redirectUrl.protocol = 'https:';
        return NextResponse.redirect(redirectUrl, 301);
      }

      if (shouldForceHttps() && proto === 'http' && !host.includes('localhost')) {
        const redirectUrl = new URL(request.url);
        redirectUrl.protocol = 'https:';
        return NextResponse.redirect(redirectUrl, 301);
      }
    }

    if (pathname.startsWith('/admin')) {
      return await updateSession(request);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Proxy session error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Host canonicalization matches public pages when ENABLE_HOST_REDIRECTS=true
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
