import Script from 'next/script';
import { siteSettingsRepository } from '@/repositories/site-settings.repository';

/**
 * Injects CMS-configured global header/footer scripts.
 * Empty by default — no visual change until admins add scripts.
 */
export async function GlobalScripts({ position }: { position: 'header' | 'footer' }) {
  try {
    const settings = await siteSettingsRepository.getSeoGlobals();
    const raw = position === 'header' ? settings.headerScripts : settings.footerScripts;
    if (!raw?.trim()) return null;

    return (
      <Script
        id={`global-${position}-scripts`}
        strategy={position === 'header' ? 'afterInteractive' : 'lazyOnload'}
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  } catch {
    return null;
  }
}
