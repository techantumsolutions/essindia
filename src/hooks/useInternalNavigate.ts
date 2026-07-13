'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useInternalNavigate() {
  const router = useRouter();

  return useCallback((url: string) => {
    if (!url) return;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:')
    ) {
      window.location.href = url;
      return;
    }
    router.push(url);
  }, [router]);
}
