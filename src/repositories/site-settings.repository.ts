import { db } from '@/lib/db';
import { siteSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withCache, safeRedisDel } from '@/lib/redis';

export interface SeoGlobals {
  headerScripts: string;
  footerScripts: string;
  robotsExtraDisallow: string[];
  preferWww: boolean;
  forceHttps: boolean;
}

export interface FormTypeSettings {
  thankYouUrl: string;
}

export interface FormSettings {
  contact: FormTypeSettings;
  cta: FormTypeSettings;
}

const DEFAULT_SEO_GLOBALS: SeoGlobals = {
  headerScripts: '',
  footerScripts: '',
  robotsExtraDisallow: [],
  preferWww: false,
  forceHttps: true,
};

const DEFAULT_FORM_SETTINGS: FormSettings = {
  contact: { thankYouUrl: '/thank-you' },
  cta: { thankYouUrl: '/thank-you' },
};

const SEO_GLOBALS_KEY = 'seo_globals';
const FORM_SETTINGS_KEY = 'form_settings';
const CACHE_KEY = 'site_settings:seo_globals';
const FORM_SETTINGS_CACHE_KEY = 'site_settings:form_settings';

export class SiteSettingsRepository {
  async getSeoGlobals(): Promise<SeoGlobals> {
    try {
      return await withCache(CACHE_KEY, async () => {
        const row = await db.query.siteSettings.findFirst({
          where: eq(siteSettings.key, SEO_GLOBALS_KEY),
        });
        if (!row?.value || typeof row.value !== 'object') return DEFAULT_SEO_GLOBALS;
        return { ...DEFAULT_SEO_GLOBALS, ...(row.value as Partial<SeoGlobals>) };
      }, 300);
    } catch {
      return DEFAULT_SEO_GLOBALS;
    }
  }

  async updateSeoGlobals(partial: Partial<SeoGlobals>): Promise<SeoGlobals> {
    const current = await this.getSeoGlobals();
    const next = { ...current, ...partial };

    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, SEO_GLOBALS_KEY),
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value: next, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({ key: SEO_GLOBALS_KEY, value: next });
    }

    await safeRedisDel(CACHE_KEY);
    return next;
  }

  async getFormSettings(): Promise<FormSettings> {
    try {
      return await withCache(FORM_SETTINGS_CACHE_KEY, async () => {
        const row = await db.query.siteSettings.findFirst({
          where: eq(siteSettings.key, FORM_SETTINGS_KEY),
        });
        if (!row?.value || typeof row.value !== 'object') return DEFAULT_FORM_SETTINGS;
        const value = row.value as Partial<FormSettings>;
        return {
          contact: {
            thankYouUrl:
              value.contact?.thankYouUrl?.trim() || DEFAULT_FORM_SETTINGS.contact.thankYouUrl,
          },
          cta: {
            thankYouUrl: value.cta?.thankYouUrl?.trim() || DEFAULT_FORM_SETTINGS.cta.thankYouUrl,
          },
        };
      }, 300);
    } catch {
      return DEFAULT_FORM_SETTINGS;
    }
  }

  async updateFormSettings(partial: {
    contact?: { thankYouUrl?: string };
    cta?: { thankYouUrl?: string };
  }): Promise<FormSettings> {
    const current = await this.getFormSettings();
    const next: FormSettings = {
      contact: {
        thankYouUrl:
          partial.contact?.thankYouUrl !== undefined
            ? partial.contact.thankYouUrl.trim()
            : current.contact.thankYouUrl,
      },
      cta: {
        thankYouUrl:
          partial.cta?.thankYouUrl !== undefined
            ? partial.cta.thankYouUrl.trim()
            : current.cta.thankYouUrl,
      },
    };

    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.key, FORM_SETTINGS_KEY),
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set({ value: next, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id));
    } else {
      await db.insert(siteSettings).values({ key: FORM_SETTINGS_KEY, value: next });
    }

    await safeRedisDel(FORM_SETTINGS_CACHE_KEY);
    return next;
  }
}

export const siteSettingsRepository = new SiteSettingsRepository();
export { DEFAULT_FORM_SETTINGS };
