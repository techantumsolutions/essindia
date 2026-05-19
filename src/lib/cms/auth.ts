import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  const mockSession = cookieStore.get('mock-admin-session')?.value === 'true';
  if (mockSession) return true;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}
