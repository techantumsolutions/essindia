'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * On thank-you pages, if `?pdf=` is present, open that PDF in a new tab after delayMs.
 * Also surfaces a short countdown notice.
 */
export function ThankYouPdfHandler({
  delayMs = 5000,
  notice,
}: {
  delayMs?: number;
  notice?: string;
}) {
  const searchParams = useSearchParams();
  const opened = useRef(false);
  const pdf = searchParams.get('pdf');
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(delayMs / 1000));

  useEffect(() => {
    if (!pdf || opened.current) return;

    const started = Date.now();
    const tick = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((delayMs - (Date.now() - started)) / 1000));
      setSecondsLeft(remaining);
    }, 250);

    const timer = window.setTimeout(() => {
      if (opened.current) return;
      opened.current = true;
      try {
        window.open(pdf, '_blank', 'noopener,noreferrer');
      } catch {
        // ignore popup blockers silently
      }
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(tick);
    };
  }, [pdf, delayMs]);

  if (!pdf) return null;

  return (
    <p className="text-sm text-slate-500 max-w-xl mx-auto">
      {notice || 'Your document will open in a new tab shortly.'}
      {secondsLeft > 0 ? ` Opening in ${secondsLeft}s…` : ' Opening…'}
    </p>
  );
}
