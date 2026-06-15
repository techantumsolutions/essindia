import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { db } from '@/lib/db';
import { careers } from '@/lib/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import { notFound, serverError, unauthorized } from '@/lib/cms/api-response';
import { uniqueSlug } from '@/lib/slugify';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();

    const job = await db.query.careers.findFirst({
      where: eq(careers.id, id),
    });
    if (!job) return notFound('Position not found');

    // If the title changed, regenerate the slug
    let slug = job.slug;
    if (body.title && body.title !== job.title) {
      slug = await uniqueSlug(body.title, async (candidate) => {
        const existing = await db.query.careers.findFirst({
          where: and(eq(careers.slug, candidate), ne(careers.id, id)),
        });
        return !!existing;
      });
    }

    const [updated] = await db
      .update(careers)
      .set({
        ...body,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(careers.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const job = await db.query.careers.findFirst({
      where: eq(careers.id, id),
    });
    if (!job) return notFound('Position not found');

    await db.delete(careers).where(eq(careers.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
