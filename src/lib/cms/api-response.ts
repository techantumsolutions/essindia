import { NextResponse } from 'next/server';

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(error: unknown) {
  console.error('[CMS API]', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}
