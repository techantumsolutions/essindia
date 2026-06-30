import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formSubmissions, applications } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const leads = await db.query.formSubmissions.findMany({
      where: eq(formSubmissions.status, 'new'),
      orderBy: [desc(formSubmissions.createdAt)],
      limit: 5,
    });

    const apps = await db.query.applications.findMany({
      where: eq(applications.status, 'applied'),
      orderBy: [desc(applications.createdAt)],
      limit: 5,
    });

    return NextResponse.json({ leads, apps });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.update(formSubmissions).set({ status: 'read' }).where(eq(formSubmissions.status, 'new'));
    await db.update(applications).set({ status: 'reviewed' }).where(eq(applications.status, 'applied'));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
  }
}
