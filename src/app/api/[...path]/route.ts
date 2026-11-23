import { NextResponse } from 'next/server';

/**
 * Fence for unmatched /api/* paths.
 * Without this, Next can fall through to the public [...slug] page and return HTML 404
 * for nested API routes (including /api/admin/auth/login).
 */
function unmatched() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export const GET = unmatched;
export const POST = unmatched;
export const PUT = unmatched;
export const PATCH = unmatched;
export const DELETE = unmatched;
