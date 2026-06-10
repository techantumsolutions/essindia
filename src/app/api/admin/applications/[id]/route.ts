import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { db } from '@/lib/db';
import { applications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, serverError, unauthorized } from '@/lib/cms/api-response';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, id),
    });
    if (!app) return notFound('Application not found');

    const [updated] = await db
      .update(applications)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}
