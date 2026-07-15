/**
 * Client helper: after form success, redirect to configured thank-you URL
 * (optionally carrying pdf in query string for delayed open).
 */

export type FormTypeKey = 'contact' | 'cta';

export interface FormTypeSettings {
  thankYouUrl: string;
}

export interface FormSettingsMap {
  contact: FormTypeSettings;
  cta: FormTypeSettings;
}

const DEFAULT_SETTINGS: FormSettingsMap = {
  contact: { thankYouUrl: '/thank-you' },
  cta: { thankYouUrl: '/thank-you' },
};

let cachedSettings: FormSettingsMap | null = null;
let inflight: Promise<FormSettingsMap> | null = null;

export async function fetchFormSettings(): Promise<FormSettingsMap> {
  if (cachedSettings) return cachedSettings;
  if (inflight) return inflight;

  inflight = fetch('/api/forms/settings')
    .then(async (res) => {
      if (!res.ok) return DEFAULT_SETTINGS;
      const data = await res.json();
      cachedSettings = {
        contact: { thankYouUrl: data?.contact?.thankYouUrl || DEFAULT_SETTINGS.contact.thankYouUrl },
        cta: { thankYouUrl: data?.cta?.thankYouUrl || DEFAULT_SETTINGS.cta.thankYouUrl },
      };
      return cachedSettings;
    })
    .catch(() => DEFAULT_SETTINGS)
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function invalidateFormSettingsCache() {
  cachedSettings = null;
}

/**
 * Redirects to thank-you page. Passes pdf via query for delayed open.
 * Falls back to opening PDF immediately if no thank-you URL.
 */
export function redirectAfterFormSuccess(options: {
  thankYouUrl?: string | null;
  pdfUrl?: string | null;
}) {
  const thankYouUrl = (options.thankYouUrl || '').trim();
  const pdfUrl = (options.pdfUrl || '').trim();

  if (thankYouUrl) {
    try {
      const url = thankYouUrl.startsWith('http')
        ? new URL(thankYouUrl)
        : new URL(thankYouUrl, window.location.origin);
      if (pdfUrl) {
        url.searchParams.set('pdf', pdfUrl);
      }
      const target = thankYouUrl.startsWith('http')
        ? url.toString()
        : `${url.pathname}${url.search}${url.hash}`;
      window.location.assign(target);
      return;
    } catch {
      window.location.assign(thankYouUrl);
      return;
    }
  }

  if (pdfUrl) {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }
}

export async function completeFormSuccess(formType: FormTypeKey, pdfUrl?: string | null) {
  const settings = await fetchFormSettings();
  const thankYouUrl = settings[formType]?.thankYouUrl || DEFAULT_SETTINGS[formType].thankYouUrl;
  redirectAfterFormSuccess({ thankYouUrl, pdfUrl });
}
