import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminSessionServer } from '@/lib/auth/session';
import crypto from 'crypto';

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

export async function GET() {
  try {
    const session = await getAdminSessionServer();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      status: users.status,
      accessPermissions: users.accessPermissions,
      plainPassword: users.plainPassword,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    }).from(users).orderBy(desc(users.createdAt));

    // Format output
    const formatted = allUsers.map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName || '',
      role: u.role,
      status: u.status || 'active',
      accessPermissions: u.accessPermissions || { cms: true, charts: true },
      plainPassword: u.plainPassword || '',
      avatarUrl: u.avatarUrl,
      createdAt: u.createdAt
    }));

    // Check if default super admin is in DB, if not include fallback super admin
    const hasDefaultSuperAdmin = formatted.some(u => u.email === 'admin@essindia.com');
    if (!hasDefaultSuperAdmin) {
      formatted.unshift({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@essindia.com',
        fullName: 'Super Administrator',
        role: 'super_admin',
        status: 'active',
        accessPermissions: { cms: true, charts: true },
        plainPassword: 'admin123',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        createdAt: new Date() as any
      });
    }

    return NextResponse.json({ users: formatted });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSessionServer();
    if (!session || session.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, fullName, role, accessPermissions, status, avatarUrl } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email address already exists' }, { status: 400 });
    }

    // Default permissions based on role
    const permissions = accessPermissions || {
      cms: role !== 'agent',
      charts: role === 'super_admin' || role === 'agent'
    };

    const [newUser] = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      plainPassword: password,
      fullName: fullName || '',
      role: role as 'super_admin' | 'admin' | 'agent',
      status: status || 'active',
      accessPermissions: permissions,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`
    }).returning();

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        status: newUser.status,
        accessPermissions: newUser.accessPermissions,
        plainPassword: newUser.plainPassword,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
