import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import { safeRedisDel, safeRedisKeys } from '@/lib/redis';
import { isAdminRequest } from '@/lib/cms/auth';
import { unauthorized } from '@/lib/cms/api-response';

/**
 * Update a specific page section's content
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const { content, type, isActive } = body;

    logger.info(`[API] Updating section ${id}`, { type });

    // Update the section in DB
    const updated = await db
      .update(pageSections)
      .set({
        ...(content && { content }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(pageSections.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Invalidate caches
    // We don't know the slug here easily, so we might need to clear all page caches 
    // or improve the cache key structure. For now, clear the specific section's parent page if known.
    // As a shortcut for the demo, we'll clear all page-related caches.
    const keys = await safeRedisKeys('page:*');
    if (keys.length > 0) await safeRedisDel(...keys);

    return NextResponse.json(updated[0]);
  } catch (error) {
    logger.error('[API] Failed to update section', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Get a specific section
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const section = await db.query.pageSections.findFirst({
      where: eq(pageSections.id, id),
    });

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    logger.error('[API] Failed to fetch section', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
