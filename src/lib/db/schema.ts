import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- USERS & RBAC ---
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('editor'), // 'super_admin', 'content_manager', 'seo_manager', 'editor'
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- SEO MODULE ---
export const seoMetadata = pgTable('seo_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  ogImage: text('og_image'),
  canonicalUrl: text('canonical_url'),
  noIndex: boolean('no_index').default(false).notNull(),
  schemaMarkup: jsonb('schema_markup').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- PAGES MODULE ---
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id'), // Self-reference for hierarchy
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  fullPath: text('full_path').notNull().unique(), // e.g. /solutions/erp/overview
  status: varchar('status', { length: 50 }).notNull().default('draft'), // 'draft', 'published', 'scheduled', 'archived'
  pageType: varchar('page_type', { length: 100 }).default('standard'), // 'standard', 'landing', 'blog_post', 'solution'
  templateId: varchar('template_id', { length: 100 }), 
  seoId: uuid('seo_id').references(() => seoMetadata.id, { onDelete: 'set null' }),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => ({
  idxPagesSlug: index('idx_pages_slug').on(table.slug),
  idxPagesParent: index('idx_pages_parent').on(table.parentId),
  uniquePath: uniqueIndex('unique_page_path').on(table.fullPath),
}));

// --- SECTIONS & TEMPLATES ---
export const pageSections = pgTable('page_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(), // 'hero', 'features', 'grid', etc.
  variant: varchar('variant', { length: 50 }).default('default'),
  content: jsonb('content').notNull().default('{}'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  scheduling: jsonb('scheduling'), // { startAt: Date, endAt: Date }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxPageSectionsPageId: index('idx_page_sections_page_id').on(table.pageId),
}));

// --- NAVIGATION & MEGA MENU ---
export const navigationMenus = pgTable('navigation_menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  location: varchar('location', { length: 100 }).notNull(), // 'header', 'footer', 'sidebar'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const navigationItems = pgTable('navigation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuId: uuid('menu_id').notNull().references(() => navigationMenus.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  label: varchar('label', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }),
  icon: varchar('icon', { length: 100 }),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  megaMenuEnabled: boolean('mega_menu_enabled').default(false).notNull(),
  megaMenuConfig: jsonb('mega_menu_config').default('{}'), // Multi-column layout, featured items
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- MEDIA LIBRARY ---
export const mediaLibrary = pgTable('media_library', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size'), // in bytes
  dimensions: jsonb('dimensions'), // { width: number, height: number }
  altText: varchar('alt_text', { length: 255 }),
  folder: varchar('folder', { length: 255 }).default('uploads'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- SOLUTIONS & INDUSTRIES (Domain Specific) ---
export const solutionCategories = pgTable('solution_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- FORMS & LEADS ---
export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  config: jsonb('config').notNull(), // Field definitions
  successMessage: text('success_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').references(() => forms.id),
  data: jsonb('data').notNull(),
  status: varchar('status', { length: 50 }).default('new'), // 'new', 'contacted', 'qualified', 'closed'
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- RELATIONS ---
export const pagesRelations = relations(pages, ({ one, many }) => ({
  parent: one(pages, { fields: [pages.parentId], references: [pages.id], relationName: 'page_hierarchy' }),
  children: many(pages, { relationName: 'page_hierarchy' }),
  sections: many(pageSections),
  seo: one(seoMetadata, { fields: [pages.seoId], references: [seoMetadata.id] }),
  author: one(users, { fields: [pages.authorId], references: [users.id] }),
}));

export const pageSectionsRelations = relations(pageSections, ({ one }) => ({
  page: one(pages, { fields: [pageSections.pageId], references: [pages.id] }),
}));

export const navigationMenusRelations = relations(navigationMenus, ({ many }) => ({
  items: many(navigationItems),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  menu: one(navigationMenus, { fields: [navigationItems.menuId], references: [navigationMenus.id] }),
  parent: one(navigationItems, { fields: [navigationItems.parentId], references: [navigationItems.id], relationName: 'nav_hierarchy' }),
  children: many(navigationItems, { relationName: 'nav_hierarchy' }),
  page: one(pages, { fields: [navigationItems.pageId], references: [pages.id] }),
}));
