'use client';

import React from 'react';
import { ContactLeadModal } from '@/components/ui/ContactLeadModal';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';

export type CtaFormType = '' | 'contact' | 'cta';

/**
 * Shared hook: returns an onClick handler + the modal JSX for a CTA button.
 * If formType is empty or not set, falls back to navigating to the URL.
 */
export function useCtaAction(url: string, formType: CtaFormType = '', pdfUrl?: string) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (formType === 'contact' || formType === 'cta') {
      setIsOpen(true);
    } else {
      if (url) window.location.href = url;
    }
  }, [url, formType]);

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
