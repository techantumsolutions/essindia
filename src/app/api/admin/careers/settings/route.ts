import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { db } from '@/lib/db';
import { careersSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { serverError, unauthorized } from '@/lib/cms/api-response';

export async function GET() {
  try {
    const configs = await db.select().from(careersSettings).limit(1);
    const config = configs[0];
    return NextResponse.json({
      hrEmail: config?.hrEmail || 'hr@example.com',
    });
  } catch (error) {
    // If the table doesn't exist yet or connection fails due to paused DB, fall back to default
    console.error('Error fetching HR email config:', error);
    return NextResponse.json({ hrEmail: 'hr@example.com' });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const { hrEmail } = await request.json();
    if (!hrEmail) {
      return NextResponse.json({ error: 'HR Email is required' }, { status: 400 });
    }

    const configs = await db.select().from(careersSettings).limit(1);
    const config = configs[0];

    let updated;
    if (config) {
      [updated] = await db
        .update(careersSettings)
        .set({ hrEmail, updatedAt: new Date() })
        .where(eq(careersSettings.id, config.id))
        .returning();
    } else {
      [updated] = await db
        .insert(careersSettings)
        .values({ hrEmail })
        .returning();
    }

    return NextResponse.json({ hrEmail: updated.hrEmail });
  } catch (error) {
    return serverError(error);
  }
}
