import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { encodeSession, SESSION_COOKIE_NAME, DEFAULT_SUPER_ADMIN } from '@/lib/auth/session';
import crypto from 'crypto';

function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check database user
    const [foundUser] = await db.select().from(users).where(eq(users.email, normalizedEmail));
    let user = foundUser;

    // Fallback: Default Super Admin initialization if email is admin@essindia.com
    if (!user && normalizedEmail === 'admin@essindia.com' && password === 'admin123') {
      try {
        const [createdUser] = await db.insert(users).values({
          id: crypto.randomUUID(),
          email: 'admin@essindia.com',
          passwordHash: hashPassword('admin123'),
          role: 'super_admin',
          fullName: 'Super Administrator',
          status: 'active',
          accessPermissions: { cms: true, charts: true },
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        }).returning();
        user = createdUser;
      } catch (insertError) {
        console.warn('Unable to seed super admin user into DB:', insertError);
      }
    }

    if (user) {
      if (user.status === 'inactive') {
        return NextResponse.json({ error: 'Your account is deactivated. Please contact Super Admin.' }, { status: 403 });
      }

      // Password verification
      const hashedInput = hashPassword(password);
      const isPasswordValid = user.passwordHash ? user.passwordHash === hashedInput : (password === 'admin123');

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
      }

      const permissions = (user.accessPermissions as { cms: boolean; charts: boolean }) || {
        cms: user.role !== 'agent',
        charts: user.role === 'super_admin' || user.role === 'agent'
      };

      const sessionPayload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName || 'Admin User',
        role: (user.role as 'super_admin' | 'admin' | 'agent') || 'admin',
        accessPermissions: permissions,
        avatarUrl: user.avatarUrl
      };

      const encoded = encodeSession(sessionPayload);

      const response = NextResponse.json({
        success: true,
        user: sessionPayload
      });

      // Set cookies
      response.cookies.set(SESSION_COOKIE_NAME, encoded, {
        path: '/',
        httpOnly: false, // accessible to client for sync
        maxAge: 604800,
        sameSite: 'lax'
      });
      response.cookies.set('mock-admin-session', 'true', {
        path: '/',
        maxAge: 604800,
        sameSite: 'lax'
      });

      return response;
    }

    // Default fallback for initial super admin if DB insert failed
    if (normalizedEmail === 'admin@essindia.com' && password === 'admin123') {
      const encoded = encodeSession(DEFAULT_SUPER_ADMIN);
      const response = NextResponse.json({
        success: true,
        user: DEFAULT_SUPER_ADMIN
      });

      response.cookies.set(SESSION_COOKIE_NAME, encoded, {
        path: '/',
        httpOnly: false,
        maxAge: 604800,
        sameSite: 'lax'
      });
      response.cookies.set('mock-admin-session', 'true', {
        path: '/',
        maxAge: 604800,
        sameSite: 'lax'
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials. Please try again.' }, { status: 401 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
