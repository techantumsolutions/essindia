import { pgTable, text, timestamp, uuid, boolean, jsonb, index, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table (extends Supabase auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // maps to auth.users.id
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  fullName: varchar('full_name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Pages table
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  isPublished: boolean('is_published').default(false).notNull(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  ogImage: text('og_image'),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => {
  return {
    slugIdx: index('idx_pages_slug').on(table.slug)
  }
});

// Page sections (for dynamic page builder)
export const pageSections = pgTable('page_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(), // 'hero', 'services', 'testimonials', etc.
  content: jsonb('content').notNull().default('{}'), // Section specific data
  orderIndex: timestamp('order_index').notNull().defaultNow(), // For sorting
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    pageIdx: index('idx_page_sections_page_id').on(table.pageId)
  }
});

// Navigation Menu
export const navigationMenus = pgTable('navigation_menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  location: varchar('location', { length: 100 }).notNull(), // 'header', 'footer'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const navigationItems = pgTable('navigation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuId: uuid('menu_id').notNull().references(() => navigationMenus.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'), // Self referential for nested menus
  title: varchar('title', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  orderIndex: timestamp('order_index').notNull().defaultNow(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Solutions Categories & Subcategories
export const solutionCategories = pgTable('solution_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media Library
export const mediaFiles = pgTable('media_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: timestamp('size'), // bytes
  altText: varchar('alt_text', { length: 255 }),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
