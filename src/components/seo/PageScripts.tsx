import Script from 'next/script';

interface PageScriptsProps {
  headerScripts?: string | null;
  footerScripts?: string | null;
}

/** Per-page scripts from SEO metadata — no-op when empty. */
export function PageScripts({ headerScripts, footerScripts }: PageScriptsProps) {
  return (
    <>
      {headerScripts?.trim() ? (
        <Script
          id="page-header-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: headerScripts }}
        />
      ) : null}
      {footerScripts?.trim() ? (
        <Script
          id="page-footer-scripts"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{ __html: footerScripts }}
        />
      ) : null}
    </>
  );
}
