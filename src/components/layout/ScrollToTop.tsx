'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

/** Ensures every route change starts at the top of the page. */
export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;

    const toTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    toTop();
    const frame = window.requestAnimationFrame(toTop);
    const timer = window.setTimeout(toTop, 0);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
