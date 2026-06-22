import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  parentId: z.string().uuid().nullable().optional(),
  pageId: z.string().uuid().nullable().optional(),
  description: z.string().optional(),
  icon: z.string().max(100).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  orderIndex: z.number().int().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const sectionLibrarySchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  variant: z.string().max(50).optional(),
  previewThumbnail: z.string().optional(),
  contentJson: z.record(z.string(), z.unknown()).optional(),
  styleJson: z.record(z.string(), z.unknown()).optional(),
  settingsJson: z.record(z.string(), z.unknown()).optional(),
  responsiveJson: z.record(z.string(), z.unknown()).optional(),
  animationJson: z.record(z.string(), z.unknown()).optional(),
  categoryTags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  previewThumbnail: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
});

export const createPageSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  parentId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  templateId: z.string().uuid().nullable().optional(),
  pageType: z.string().max(100).optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional(),
  navigationItemId: z.string().uuid().nullable().optional(),
  megaMenuCategoryId: z.string().uuid().nullable().optional(),
  megaMenuSubCategoryId: z.string().uuid().nullable().optional(),
  megaMenuSubSubCategoryId: z.string().uuid().nullable().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  parentId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional(),
  pageType: z.string().max(100).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const seoSchema = z.object({
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
  schemaMarkup: z.record(z.string(), z.unknown()).optional(),
});

export const pageSectionSchema = z.object({
  type: z.string().min(1).max(100),
  variant: z.string().max(50).optional(),
  name: z.string().max(255).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  sectionLibraryId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().int().optional(),
});

export const reorderSectionsSchema = z.object({
  sectionIds: z.array(z.string().uuid()),
});
