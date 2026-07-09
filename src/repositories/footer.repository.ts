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
    social?: {
      twitter: { url: string; enabled: boolean };
      linkedin: { url: string; enabled: boolean };
      facebook: { url: string; enabled: boolean };
      youtube: { url: string; enabled: boolean };
      instagram: { url: string; enabled: boolean };
    };
    bottomLinks?: FooterLink[];
    copyright?: string;
    titles?: {
      company?: string;
      products?: string;
      industries?: string;
      services?: string;
    };
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
    titles: {
      company: 'Company',
      products: 'Products',
      industries: 'Industries',
      services: 'Services'
    },
    copyright: 'Copyright © 2026. Eastern Software Solutions Pvt. Ltd All Rights Reserved',
    bottomLinks: [
      { label: 'Trust & security', url: '#', pageId: null },
      { label: 'Terms of Use', url: '#', pageId: null },
      { label: 'Privacy Policy', url: '#', pageId: null },
      { label: 'Cookies Policy', url: '#', pageId: null },
      { label: 'Settings', url: '#', pageId: null }
    ],
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
    ],
    social: {
      twitter: { url: '#', enabled: true },
      linkedin: { url: '#', enabled: true },
      facebook: { url: '#', enabled: true },
      youtube: { url: '#', enabled: true },
      instagram: { url: '#', enabled: false }
    }
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
      const dbLinks = (settings.links as any) || {};
      const social = dbLinks.social || {
        twitter: { url: settings.twitterUrl || defaultFooterSettings.twitterUrl || '', enabled: !!settings.twitterUrl },
        linkedin: { url: settings.linkedinUrl || defaultFooterSettings.linkedinUrl || '', enabled: !!settings.linkedinUrl },
        facebook: { url: settings.facebookUrl || defaultFooterSettings.facebookUrl || '', enabled: !!settings.facebookUrl },
        youtube: { url: settings.youtubeUrl || defaultFooterSettings.youtubeUrl || '', enabled: !!settings.youtubeUrl },
        instagram: { url: '#', enabled: false }
      };

      return {
        id: settings.id,
        logoUrl: settings.logoUrl ?? defaultFooterSettings.logoUrl,
        description: settings.description ?? defaultFooterSettings.description,
        twitterUrl: settings.twitterUrl ?? defaultFooterSettings.twitterUrl,
        linkedinUrl: settings.linkedinUrl ?? defaultFooterSettings.linkedinUrl,
        facebookUrl: settings.facebookUrl ?? defaultFooterSettings.facebookUrl,
        youtubeUrl: settings.youtubeUrl ?? defaultFooterSettings.youtubeUrl,
        countries: (settings.countries as string[]) || defaultFooterSettings.countries,
        links: {
          company: dbLinks.company || defaultFooterSettings.links.company,
          products: dbLinks.products || defaultFooterSettings.links.products,
          industries: dbLinks.industries || defaultFooterSettings.links.industries,
          services: dbLinks.services || defaultFooterSettings.links.services,
          social,
          bottomLinks: dbLinks.bottomLinks || defaultFooterSettings.links.bottomLinks,
          copyright: dbLinks.copyright ?? defaultFooterSettings.links.copyright,
          titles: dbLinks.titles || defaultFooterSettings.links.titles
        },
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
    
    // Ensure we keep the schema columns in sync with the social links object
    const social = data.links.social || {
      twitter: { url: data.twitterUrl || '', enabled: !!data.twitterUrl },
      linkedin: { url: data.linkedinUrl || '', enabled: !!data.linkedinUrl },
      facebook: { url: data.facebookUrl || '', enabled: !!data.facebookUrl },
      youtube: { url: data.youtubeUrl || '', enabled: !!data.youtubeUrl },
      instagram: { url: '', enabled: false }
    };

    if (existing) {
      const [updated] = await db
        .update(footerSettings)
        .set({
          logoUrl: data.logoUrl,
          description: data.description,
          twitterUrl: social.twitter?.url || '',
          linkedinUrl: social.linkedin?.url || '',
          facebookUrl: social.facebook?.url || '',
          youtubeUrl: social.youtube?.url || '',
          countries: data.countries,
          links: data.links,
          updatedAt: new Date(),
        })
        .where(eq(footerSettings.id, existing.id))
        .returning();

      const dbLinks = (updated.links as any) || {};

      return {
        id: updated.id,
        logoUrl: updated.logoUrl ?? '',
        description: updated.description ?? '',
        twitterUrl: updated.twitterUrl ?? '',
        linkedinUrl: updated.linkedinUrl ?? '',
        facebookUrl: updated.facebookUrl ?? '',
        youtubeUrl: updated.youtubeUrl ?? '',
        countries: updated.countries as string[],
        links: {
          company: dbLinks.company || [],
          products: dbLinks.products || [],
          industries: dbLinks.industries || [],
          services: dbLinks.services || [],
          social: dbLinks.social || social,
          bottomLinks: dbLinks.bottomLinks || [],
          copyright: dbLinks.copyright ?? '',
          titles: dbLinks.titles || defaultFooterSettings.links.titles
        },
      };
    } else {
      const [inserted] = await db
        .insert(footerSettings)
        .values({
          logoUrl: data.logoUrl,
          description: data.description,
          twitterUrl: social.twitter?.url || '',
          linkedinUrl: social.linkedin?.url || '',
          facebookUrl: social.facebook?.url || '',
          youtubeUrl: social.youtube?.url || '',
          countries: data.countries,
          links: data.links,
        })
        .returning();

      const dbLinks = (inserted.links as any) || {};

      return {
        id: inserted.id,
        logoUrl: inserted.logoUrl ?? '',
        description: inserted.description ?? '',
        twitterUrl: inserted.twitterUrl ?? '',
        linkedinUrl: inserted.linkedinUrl ?? '',
        facebookUrl: inserted.facebookUrl ?? '',
        youtubeUrl: inserted.youtubeUrl ?? '',
        countries: inserted.countries as string[],
        links: {
          company: dbLinks.company || [],
          products: dbLinks.products || [],
          industries: dbLinks.industries || [],
          services: dbLinks.services || [],
          social: dbLinks.social || social,
          bottomLinks: dbLinks.bottomLinks || [],
          copyright: dbLinks.copyright ?? '',
          titles: dbLinks.titles || defaultFooterSettings.links.titles
        },
      };
    }
  }
}

// We need a way to reference eq in the file.
import { eq } from 'drizzle-orm';

export const footerRepository = new FooterRepository();
