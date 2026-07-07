'use client';

import React from 'react';
import { ContactLeadModal } from './ContactLeadModal';
import { CtaLeadModal } from './CtaLeadModal';

export function FormModalProvider() {
  const [form1Open, setForm1Open] = React.useState(false);
  const [form2Open, setForm2Open] = React.useState(false);
  const [pdfUrl, setPdfUrl] = React.useState<string | undefined>(undefined);
  const [pageName, setPageName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Intercept anchor clicks
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#form1') {
          e.preventDefault();
          e.stopPropagation();
          setForm1Open(true);
          return;
        } else if (href === '#form2') {
          e.preventDefault();
          e.stopPropagation();
          const docUrl = anchor.getAttribute('data-pdf-url') || undefined;
          const pageTitle = anchor.getAttribute('data-page-name') || undefined;
          setPdfUrl(docUrl);
          setPageName(pageTitle);
          setForm2Open(true);
          return;
        }
      }
      
      // Intercept button clicks
      const button = target.closest('button');
      if (button) {
        const action = button.getAttribute('data-action') || button.getAttribute('onClick');
        const hrefAttribute = button.getAttribute('href'); // button could have a custom link href
        
        const targetForm = action === '#form1' || hrefAttribute === '#form1' 
          ? '#form1' 
          : (action === '#form2' || hrefAttribute === '#form2' ? '#form2' : null);

        if (targetForm === '#form1') {
          e.preventDefault();
          e.stopPropagation();
          setForm1Open(true);
        } else if (targetForm === '#form2') {
          e.preventDefault();
          e.stopPropagation();
          const docUrl = button.getAttribute('data-pdf-url') || undefined;
          const pageTitle = button.getAttribute('data-page-name') || undefined;
          setPdfUrl(docUrl);
          setPageName(pageTitle);
          setForm2Open(true);
        }
      }
    };

    // Use capturing phase so we intercept before standard routing kicks in
    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  return (
    <>
      <ContactLeadModal 
        isOpen={form1Open} 
        onClose={() => setForm1Open(false)} 
      />
      <CtaLeadModal 
        isOpen={form2Open} 
        onClose={() => setForm2Open(false)} 
        pdfUrl={pdfUrl}
        pageName={pageName}
      />
    </>
  );
}
