import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.get('mock-admin-session')?.value === 'true') {
    return true;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Route handlers may reject cookie writes during read-only phases.
            }
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}
