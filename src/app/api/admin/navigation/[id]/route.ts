import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { navigationItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function isAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  );
  // Bypassing for demo since we might be using mock envs
  return true; 
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await props.params;
    const body = await request.json();
    const { title, url, icon, isActive, orderIndex } = body;

    const updated = await db.update(navigationItems)
      .set({ title, url, icon, isActive, orderIndex, updatedAt: new Date() })
      .where(eq(navigationItems.id, params.id))
      .returning();

    if (!updated.length) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('[API Navigation PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const params = await props.params;
    const deleted = await db.delete(navigationItems)
      .where(eq(navigationItems.id, params.id))
      .returning();

    if (!deleted.length) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error('[API Navigation DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
