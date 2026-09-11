import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface UserPermissions {
  cms: boolean;
  charts: boolean;
}

export interface AdminUserSession {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'agent';
  accessPermissions: UserPermissions;
  avatarUrl?: string | null;
}

export const SESSION_COOKIE_NAME = 'ess_admin_session';

/**
 * Encodes session payload to base64 JSON string
 */
export function encodeSession(session: AdminUserSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

/**
 * Decodes base64 session string
 */
export function decodeSession(token: string): AdminUserSession | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(jsonStr);
    if (data && data.id && data.email && data.role) {
      return data as AdminUserSession;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from server cookies (for Server Actions / API Routes)
 */
export async function getAdminSessionServer(): Promise<AdminUserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value || cookieStore.get('mock-admin-session')?.value;
    if (!token) return null;
    
    // Check if it's legacy mock session cookie
    if (token === 'true') {
      return {
        id: 'super-admin-default-id',
        email: 'admin@essindia.com',
        fullName: 'Super Admin',
        role: 'super_admin',
        accessPermissions: { cms: true, charts: true },
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      };
    }

    return decodeSession(token);
  } catch (error) {
    return null;
  }
}

/**
 * Get current admin session from Request headers/cookies (for NextRequest / proxy)
 */
export function getAdminSessionFromReq(req: NextRequest): AdminUserSession | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || req.cookies.get('mock-admin-session')?.value;
  if (!token) return null;

  if (token === 'true') {
    return {
      id: 'super-admin-default-id',
      email: 'admin@essindia.com',
      fullName: 'Super Admin',
      role: 'super_admin',
      accessPermissions: { cms: true, charts: true },
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    };
  }

  return decodeSession(token);
}

/**
 * Default super admin user object when DB is initializing or empty
 */
export const DEFAULT_SUPER_ADMIN: AdminUserSession = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@essindia.com',
  fullName: 'Super Administrator',
  role: 'super_admin',
  accessPermissions: { cms: true, charts: true },
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
};
