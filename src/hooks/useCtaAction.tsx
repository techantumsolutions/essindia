'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContactLeadModal } from '@/components/ui/ContactLeadModal';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';

export type CtaFormType = '' | 'contact' | 'cta';

/**
 * Shared hook: returns an onClick handler + the modal JSX for a CTA button.
 * If formType is empty or not set, falls back to navigating to the URL.
 */
export function useCtaAction(url: string, formType: CtaFormType = '', pdfUrl?: string) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (formType === 'contact' || formType === 'cta') {
      setIsOpen(true);
    } else if (url) {
      if (
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:')
      ) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    }
  }, [url, formType, router]);

  const modalNode = React.useMemo(() => {
    if (formType === 'contact') {
      return (
        <ContactLeadModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      );
    }
    if (formType === 'cta') {
      return (
        <CtaLeadModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          pdfUrl={pdfUrl}
        />
      );
    }
    return null;
  }, [formType, isOpen, pdfUrl]);

  return { handleClick, modalNode };
}
