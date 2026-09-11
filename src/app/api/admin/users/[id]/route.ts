import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminSessionServer } from '@/lib/auth/session';
import crypto from 'crypto';

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSessionServer();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();

    const { email, password, fullName, role, accessPermissions, status, avatarUrl } = body;

    const [existing] = await db.select().from(users).where(eq(users.id, userId));

    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (email) updatePayload.email = email.toLowerCase().trim();
    if (fullName !== undefined) updatePayload.fullName = fullName;
    if (role) updatePayload.role = role;
    if (status) updatePayload.status = status;
    if (accessPermissions) updatePayload.accessPermissions = accessPermissions;
    if (avatarUrl) updatePayload.avatarUrl = avatarUrl;
    if (password && password.trim() !== '') {
      updatePayload.passwordHash = hashPassword(password);
      updatePayload.plainPassword = password;
    }

    const [updatedUser] = await db.update(users)
      .set(updatePayload)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        status: updatedUser.status,
        accessPermissions: updatedUser.accessPermissions,
        plainPassword: updatedUser.plainPassword,
        avatarUrl: updatedUser.avatarUrl,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSessionServer();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    if (userId === session.id) {
      return NextResponse.json({ error: 'You cannot delete your own Super Admin account' }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
