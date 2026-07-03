import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const submissions = await db.select().from(formSubmissions).orderBy(desc(formSubmissions.createdAt));

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('[Admin Forms API Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
