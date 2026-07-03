import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { careers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, serverError } from '@/lib/cms/api-response';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.query.careers.findFirst({
      where: eq(careers.id, id),
    });
    if (!item || item.status !== 'active') return notFound('Position not found');
    return NextResponse.json(item);
  } catch (error) {
    return serverError(error);
  }
}
