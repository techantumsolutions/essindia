import type { Metadata } from 'next';
import { absoluteUrl, getSiteUrl } from './site-url';

export interface PageSeoInput {
  title?: string | null;
  pageTitle?: string | null;
  description?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  twitterCard?: string | null;
  schemaMarkup?: Record<string, unknown> | null;
  fullPath?: string | null;
}

function toAbsoluteImage(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return absoluteUrl(src.startsWith('/') ? src : `/${src}`);
}

/**
 * Builds Next.js Metadata (canonical, robots, Open Graph, Twitter) from CMS SEO fields.
 * Existing pages keep working when new optional fields are absent.
 */
export function buildPageMetadata(seo: PageSeoInput): Metadata {
  const title = seo.title || seo.pageTitle || undefined;
  const description = seo.description || undefined;
  const ogImage = toAbsoluteImage(seo.ogImage);
  const twitterImage = toAbsoluteImage(seo.twitterImage) || ogImage;
  const canonical =
    seo.canonicalUrl ||
    (seo.fullPath ? absoluteUrl(seo.fullPath === '/' ? '/' : seo.fullPath) : undefined);

  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const twitterTitle = seo.twitterTitle || ogTitle;
  const twitterDescription = seo.twitterDescription || ogDescription;
  const twitterCard =
    (seo.twitterCard as 'summary' | 'summary_large_image' | undefined) || 'summary_large_image';

  const metadata: Metadata = {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'website',
      siteName: 'ESS India',
      url: canonical,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };

  if (
    seo.schemaMarkup &&
    typeof seo.schemaMarkup === 'object' &&
    Object.keys(seo.schemaMarkup).length > 0
  ) {
    metadata.other = {
      'script:ld+json': JSON.stringify(seo.schemaMarkup),
    };
  }

  return metadata;
}
