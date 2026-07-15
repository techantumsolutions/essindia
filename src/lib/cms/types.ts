export type PageStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type EntityStatus = 'active' | 'inactive' | 'draft' | 'published';

export interface CategoryTreeNode {
  id: string;
  parentId: string | null;
  pageId?: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  orderIndex: number;
  status: string;
  pageCount: number;
  children?: CategoryTreeNode[];
}

export interface PageTreeNode {
  id: string;
  parentId: string | null;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  pageType: string | null;
  categoryId: string | null;
  templateId: string | null;
  updatedAt: Date;
  children?: PageTreeNode[];
}

export interface PageRegistryRow {
  id: string;
  pageId: string | null;
  routePath: string;
  title: string;
  slug: string;
  pageType: string;
  status: string;
  source: 'cms' | 'filesystem';
  seoStatus: 'complete' | 'incomplete' | 'n/a';
  seoDescription?: string;
  heroDescription?: string;
  sectionCount: number;
  templateId: string | null;
  previewThumbnail: string | null;
  navigationLabel: string | null;
  categoryLabel: string | null;
  subCategoryLabel: string | null;
  subSubCategoryLabel: string | null;
  createdAt: Date;
  updatedAt: Date;
  isLinked: boolean;
}

export interface SectionLibraryItem {
  id: string;
  identityHash: string;
  name: string;
  type: string;
  variant: string | null;
  previewThumbnail: string | null;
  contentJson: Record<string, unknown>;
  styleJson: Record<string, unknown>;
  settingsJson: Record<string, unknown>;
  responsiveJson: Record<string, unknown>;
  animationJson: Record<string, unknown>;
  categoryTags: string[];
  sourcePageId?: string | null;
  sourceSectionId?: string | null;
  status: string;
  version: number;
  isLocked: boolean;
  usageCount: number;
  createdAt?: Date;
  updatedAt: Date;
}

export interface TemplateWithSections {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  previewThumbnail: string | null;
  categoryId: string | null;
  status: string;
  usageCount: number;
  updatedAt: Date;
  sections: Array<{
    id: string;
    type: string;
    variant: string | null;
    orderIndex: number;
    contentJson: Record<string, unknown>;
  }>;
}

export interface PageEditorData {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  status: string;
  pageType: string | null;
  categoryId: string | null;
  templateId: string | null;
  parentId: string | null;
  publishedAt: Date | null;
  seo: {
    id: string;
    title: string | null;
    description: string | null;
    ogImage: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    schemaMarkup: Record<string, unknown>;
    ogTitle?: string | null;
    ogDescription?: string | null;
    twitterCard?: string | null;
    twitterTitle?: string | null;
    twitterDescription?: string | null;
    twitterImage?: string | null;
    headerScripts?: string | null;
    footerScripts?: string | null;
    headingH1?: string | null;
  } | null;
  sections: Array<{
    id: string;
    type: string;
    variant: string | null;
    name: string | null;
    content: Record<string, unknown>;
    orderIndex: number;
    isActive: boolean;
    sectionLibraryId: string | null;
  }>;
}
