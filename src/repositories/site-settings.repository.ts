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

const DEFAULT_SEO_GLOBALS: SeoGlobals = {
  headerScripts: '',
  footerScripts: '',
  robotsExtraDisallow: [],
  preferWww: false,
  forceHttps: true,
};

const SEO_GLOBALS_KEY = 'seo_globals';
const CACHE_KEY = 'site_settings:seo_globals';

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
}

export const siteSettingsRepository = new SiteSettingsRepository();
