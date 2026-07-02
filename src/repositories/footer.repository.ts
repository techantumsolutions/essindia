import { db } from '@/lib/db';
import { footerSettings } from '@/lib/db/schema';
import { cache } from 'react';
import { logger } from '@/lib/logger';

export interface FooterLink {
  label: string;
  url: string;
  pageId: string | null;
}

export interface FooterSettingsData {
  id?: string;
  logoUrl: string;
  description: string;
  twitterUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  countries: string[];
  links: {
    company: FooterLink[];
    products: FooterLink[];
    industries: FooterLink[];
    services: FooterLink[];
  };
}

export const defaultFooterSettings: FooterSettingsData = {
  logoUrl: '/footer-logo.png',
  description: 'is a member of Electronics & Computer Software Export Promotion Council - registering authority for Electronics and Software exporters as per the Foreign Trade Policy (FTP) of India.',
  twitterUrl: '#',
  linkedinUrl: '#',
  facebookUrl: '#',
  youtubeUrl: '#',
  countries: ['India', 'Middle East', 'Africa', 'USA'],
  links: {
    company: [
      { label: 'About', url: '#', pageId: null },
      { label: 'Leadership', url: '#', pageId: null },
      { label: 'Career', url: '#', pageId: null },
      { label: 'Partners', url: '#', pageId: null },
      { label: 'Blog', url: '#', pageId: null },
      { label: 'Case Studies', url: '#', pageId: null },
      { label: 'Testimonials', url: '#', pageId: null },
      { label: 'FAQs', url: '#', pageId: null },
      { label: 'Contact us', url: '#', pageId: null }
    ],
    products: [
      { label: 'Modules', url: '/modules', pageId: null },
      { label: 'ERP Software', url: '#', pageId: null },
      { label: 'ERP for Small Business', url: '#', pageId: null },
      { label: 'Cloud ERP Solutions', url: '#', pageId: null },
      { label: 'Finance Management Softw', url: '#', pageId: null },
      { label: 'HR Management System', url: '#', pageId: null },
      { label: 'Supply Chain Management', url: '#', pageId: null },
      { label: 'CRM Software', url: '#', pageId: null },
      { label: 'Manufacturing ERP', url: '#', pageId: null }
    ],
    industries: [
      { label: 'ERP for Manufacturing Industry', url: '#', pageId: null },
      { label: 'ERP for Healthcare', url: '#', pageId: null },
      { label: 'ERP for Retail Business', url: '#', pageId: null },
      { label: 'ERP for Logistics', url: '#', pageId: null },
      { label: 'ERP for Construction', url: '#', pageId: null },
      { label: 'Custom ERP Solutions', url: '#', pageId: null }
    ],
    services: [
      { label: 'ERP Implementation Service', url: '#', pageId: null },
      { label: 'ERP Consulting', url: '#', pageId: null },
      { label: 'ERP Support & Maintenance', url: '#', pageId: null },
      { label: 'Cloud Migration Services', url: '#', pageId: null },
      { label: 'Managed IT Services', url: '#', pageId: null }
    ]
  }
};

export class FooterRepository {
  /**
   * Get footer settings from DB, fallback to default.
   */
  getFooterSettings = cache(async (): Promise<FooterSettingsData> => {
    try {
      const [settings] = await db.select().from(footerSettings).limit(1);
      if (!settings) {
        return defaultFooterSettings;
      }
      return {
        id: settings.id,
        logoUrl: settings.logoUrl ?? defaultFooterSettings.logoUrl,
        description: settings.description ?? defaultFooterSettings.description,
        twitterUrl: settings.twitterUrl ?? defaultFooterSettings.twitterUrl,
        linkedinUrl: settings.linkedinUrl ?? defaultFooterSettings.linkedinUrl,
        facebookUrl: settings.facebookUrl ?? defaultFooterSettings.facebookUrl,
        youtubeUrl: settings.youtubeUrl ?? defaultFooterSettings.youtubeUrl,
        countries: (settings.countries as string[]) || defaultFooterSettings.countries,
        links: (settings.links as any) || defaultFooterSettings.links,
      };
    } catch (error) {
      logger.error('[FooterRepository] Error fetching footer settings, returning defaults', error);
      return defaultFooterSettings;
    }
  });

  /**
   * Update footer settings.
   */
  async updateFooterSettings(data: Omit<FooterSettingsData, 'id'>): Promise<FooterSettingsData> {
    const [existing] = await db.select().from(footerSettings).limit(1);

    if (existing) {
      const [updated] = await db
        .update(footerSettings)
        .set({
          logoUrl: data.logoUrl,
          description: data.description,
          twitterUrl: data.twitterUrl,
          linkedinUrl: data.linkedinUrl,
          facebookUrl: data.facebookUrl,
          youtubeUrl: data.youtubeUrl,
          countries: data.countries,
          links: data.links,
          updatedAt: new Date(),
        })
        .where(eq(footerSettings.id, existing.id))
        .returning();

      return {
        id: updated.id,
        logoUrl: updated.logoUrl ?? '',
        description: updated.description ?? '',
        twitterUrl: updated.twitterUrl ?? '',
        linkedinUrl: updated.linkedinUrl ?? '',
        facebookUrl: updated.facebookUrl ?? '',
        youtubeUrl: updated.youtubeUrl ?? '',
        countries: updated.countries as string[],
        links: updated.links as any,
      };
    } else {
      const [inserted] = await db
        .insert(footerSettings)
        .values({
          logoUrl: data.logoUrl,
          description: data.description,
          twitterUrl: data.twitterUrl,
          linkedinUrl: data.linkedinUrl,
          facebookUrl: data.facebookUrl,
          youtubeUrl: data.youtubeUrl,
          countries: data.countries,
          links: data.links,
        })
        .returning();

      return {
        id: inserted.id,
        logoUrl: inserted.logoUrl ?? '',
        description: inserted.description ?? '',
        twitterUrl: inserted.twitterUrl ?? '',
        linkedinUrl: inserted.linkedinUrl ?? '',
        facebookUrl: inserted.facebookUrl ?? '',
        youtubeUrl: inserted.youtubeUrl ?? '',
        countries: inserted.countries as string[],
        links: inserted.links as any,
      };
    }
  }
}

// We need a way to reference eq in the file.
import { eq } from 'drizzle-orm';

export const footerRepository = new FooterRepository();
