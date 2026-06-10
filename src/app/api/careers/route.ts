import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { careers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { serverError } from '@/lib/cms/api-response';

export async function GET() {
  try {
    const list = await db.query.careers.findMany({
      where: eq(careers.status, 'active'),
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });
    return NextResponse.json(list);
  } catch (error) {
    return serverError(error);
  }
}
