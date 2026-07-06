import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, integer, index, uniqueIndex, type AnyPgColumn } from 'drizzle-orm/pg-core';
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

// --- CATEGORY HIERARCHY ---
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id'),
  pageId: uuid('page_id').references((): AnyPgColumn => pages.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  imageUrl: text('image_url'),
  orderIndex: integer('order_index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  seoId: uuid('seo_id').references(() => seoMetadata.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxCategoriesParent: index('idx_categories_parent').on(table.parentId),
  uniqueCategorySlug: uniqueIndex('unique_category_slug').on(table.slug),
}));

// --- PAGES MODULE ---
export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id'),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  fullPath: text('full_path').notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  pageType: varchar('page_type', { length: 100 }).default('standard'),
  templateId: uuid('template_id').references((): AnyPgColumn => templates.id, { onDelete: 'set null' }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  navigationItemId: uuid('navigation_item_id'),
  depthLevel: integer('depth_level').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  megaMenuCategoryId: uuid('mega_menu_category_id'),
  megaMenuSubCategoryId: uuid('mega_menu_sub_category_id'),
  megaMenuSubSubCategoryId: uuid('mega_menu_sub_sub_category_id'),
  isTemplate: boolean('is_template').default(false).notNull(),
  previewThumbnail: text('preview_thumbnail'),
  seoId: uuid('seo_id').references(() => seoMetadata.id, { onDelete: 'set null' }),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => ({
  idxPagesSlug: index('idx_pages_slug').on(table.slug),
  idxPagesParent: index('idx_pages_parent').on(table.parentId),
  idxPagesNavigationDepth: index('idx_pages_navigation_depth').on(table.navigationItemId, table.depthLevel),
  idxPagesNavSort: index('idx_pages_nav_sort').on(table.navigationItemId, table.sortOrder),
  uniquePath: uniqueIndex('unique_page_path').on(table.fullPath),
}));

// --- SECTIONS LIBRARY ---
export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  identityHash: varchar('identity_hash', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  variant: varchar('variant', { length: 50 }).default('default'),
  previewThumbnail: text('preview_thumbnail'),
  contentJson: jsonb('content_json').notNull().default('{}'),
  styleJson: jsonb('style_json').default('{}'),
  settingsJson: jsonb('settings_json').default('{}'),
  responsiveJson: jsonb('responsive_json').default('{}'),
  animationJson: jsonb('animation_json').default('{}'),
  categoryTags: jsonb('category_tags').default('[]'),
  sourcePageId: uuid('source_page_id').references(() => pages.id, { onDelete: 'set null' }),
  sourceSectionId: uuid('source_section_id'),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  version: integer('version').notNull().default(1),
  isLocked: boolean('is_locked').default(false).notNull(),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxSectionsType: index('idx_sections_type').on(table.type),
  idxSectionsStatus: index('idx_sections_status').on(table.status),
  idxSectionsSourcePage: index('idx_sections_source_page').on(table.sourcePageId),
}));

export const pageRegistry = pgTable('page_registry', {
  id: uuid('id').primaryKey().defaultRandom(),
  routePath: text('route_path').notNull().unique(),
  source: varchar('source', { length: 50 }).notNull().default('filesystem'),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }),
  pageType: varchar('page_type', { length: 100 }).default('standard'),
  isDynamic: boolean('is_dynamic').default(false).notNull(),
  lastScannedAt: timestamp('last_scanned_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxPageRegistryPage: index('idx_page_registry_page').on(table.pageId),
}));

export const sectionImportLogs = pgTable('section_import_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  sectionId: uuid('section_id').references(() => sections.id, { onDelete: 'set null' }),
  sourcePageId: uuid('source_page_id').references(() => pages.id, { onDelete: 'set null' }),
  sourceSectionId: uuid('source_section_id'),
  identityHash: varchar('identity_hash', { length: 64 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('imported'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  idxSectionImportLogsHash: index('idx_section_import_logs_hash').on(table.identityHash),
}));

export const sectionVersions = pgTable('section_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sectionId: uuid('section_id').notNull().references(() => sections.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  contentJson: jsonb('content_json').notNull().default('{}'),
  styleJson: jsonb('style_json').default('{}'),
  settingsJson: jsonb('settings_json').default('{}'),
  responsiveJson: jsonb('responsive_json').default('{}'),
  animationJson: jsonb('animation_json').default('{}'),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  idxSectionVersionsSection: index('idx_section_versions_section').on(table.sectionId),
}));

// --- TEMPLATES ---
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  previewThumbnail: text('preview_thumbnail'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  sourcePageId: uuid('source_page_id').references(() => pages.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const templateSections = pgTable('template_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').notNull().references(() => templates.id, { onDelete: 'cascade' }),
  sectionLibraryId: uuid('section_library_id').references(() => sections.id, { onDelete: 'set null' }),
  type: varchar('type', { length: 100 }).notNull(),
  variant: varchar('variant', { length: 50 }).default('default'),
  contentJson: jsonb('content_json').notNull().default('{}'),
  styleJson: jsonb('style_json').default('{}'),
  settingsJson: jsonb('settings_json').default('{}'),
  responsiveJson: jsonb('responsive_json').default('{}'),
  animationJson: jsonb('animation_json').default('{}'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxTemplateSectionsTemplate: index('idx_template_sections_template').on(table.templateId),
}));

// --- PAGE SECTIONS (instances on pages) ---
export const pageSections = pgTable('page_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  sectionLibraryId: uuid('section_library_id').references(() => sections.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }),
  type: varchar('type', { length: 100 }).notNull(),
  variant: varchar('variant', { length: 50 }).default('default'),
  content: jsonb('content').notNull().default('{}'),
  styleJson: jsonb('style_json').default('{}'),
  settingsJson: jsonb('settings_json').default('{}'),
  responsiveJson: jsonb('responsive_json').default('{}'),
  animationJson: jsonb('animation_json').default('{}'),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  scheduling: jsonb('scheduling'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxPageSectionsPageId: index('idx_page_sections_page_id').on(table.pageId),
}));

export const pageRevisions = pgTable('page_revisions', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  snapshot: jsonb('snapshot').notNull(),
  note: varchar('note', { length: 500 }),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  idxPageRevisionsPage: index('idx_page_revisions_page').on(table.pageId),
}));

export const reusableComponents = pgTable('reusable_components', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  componentType: varchar('component_type', { length: 100 }).notNull(),
  contentJson: jsonb('content_json').notNull().default('{}'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const animationSettings = pgTable('animation_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  preset: varchar('preset', { length: 100 }).notNull(),
  config: jsonb('config').notNull().default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- NAVIGATION & MEGA MENU ---
export const navigationMenus = pgTable('navigation_menus', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  location: varchar('location', { length: 100 }).notNull(), // 'header', 'footer', 'sidebar'
  logoUrl: text('logo_url').default('/footer-logo.png'),
  getStartedText: varchar('get_started_text', { length: 255 }).default('Get started'),
  getStartedLink: varchar('get_started_link', { length: 500 }).default('/contact-us'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const navigationItems = pgTable('navigation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuId: uuid('menu_id').notNull().references(() => navigationMenus.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  label: varchar('label', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  url: varchar('url', { length: 500 }),
  icon: varchar('icon', { length: 100 }),
  orderIndex: integer('order_index').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  megaMenuEnabled: boolean('mega_menu_enabled').default(false).notNull(),
  megaMenuConfig: jsonb('mega_menu_config').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- MEGA MENU HIERARCHY (Navigation → Category → Sub → Sub-Sub → Page) ---
export const megaMenuCategories = pgTable('mega_menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  navigationItemId: uuid('navigation_item_id')
    .notNull()
    .references(() => navigationItems.id, { onDelete: 'cascade' }),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  icon: varchar('icon', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxMegaMenuCategoriesNav: index('idx_mega_menu_categories_nav').on(table.navigationItemId),
  uniqueMegaCategorySlug: uniqueIndex('unique_mega_category_nav_slug').on(
    table.navigationItemId,
    table.slug
  ),
}));

export const megaMenuSubCategories = pgTable('mega_menu_sub_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => megaMenuCategories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  orderIndex: integer('order_index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxMegaMenuSubCategoriesCat: index('idx_mega_menu_sub_categories_cat').on(table.categoryId),
  uniqueMegaSubSlug: uniqueIndex('unique_mega_sub_category_slug').on(table.categoryId, table.slug),
}));

export const megaMenuSubSubCategories = pgTable('mega_menu_sub_sub_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  subCategoryId: uuid('sub_category_id')
    .notNull()
    .references(() => megaMenuSubCategories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  pageId: uuid('page_id').references(() => pages.id, { onDelete: 'set null' }),
  orderIndex: integer('order_index').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxMegaMenuSubSubSub: index('idx_mega_menu_sub_sub_sub').on(table.subCategoryId),
  uniqueMegaSubSubSlug: uniqueIndex('unique_mega_sub_sub_slug').on(table.subCategoryId, table.slug),
}));

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
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: 'category_hierarchy' }),
  children: many(categories, { relationName: 'category_hierarchy' }),
  seo: one(seoMetadata, { fields: [categories.seoId], references: [seoMetadata.id] }),
  page: one(pages, { fields: [categories.pageId], references: [pages.id] }),
  pages: many(pages),
  templates: many(templates),
}));

export const sectionsRelations = relations(sections, ({ many }) => ({
  versions: many(sectionVersions),
  templateSections: many(templateSections),
  pageSections: many(pageSections),
}));

export const sectionVersionsRelations = relations(sectionVersions, ({ one }) => ({
  section: one(sections, { fields: [sectionVersions.sectionId], references: [sections.id] }),
  author: one(users, { fields: [sectionVersions.authorId], references: [users.id] }),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(categories, { fields: [templates.categoryId], references: [categories.id] }),
  sourcePage: one(pages, { fields: [templates.sourcePageId], references: [pages.id] }),
  templateSections: many(templateSections),
  pages: many(pages),
}));

export const templateSectionsRelations = relations(templateSections, ({ one }) => ({
  template: one(templates, { fields: [templateSections.templateId], references: [templates.id] }),
  sectionLibrary: one(sections, { fields: [templateSections.sectionLibraryId], references: [sections.id] }),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  parent: one(pages, { fields: [pages.parentId], references: [pages.id], relationName: 'page_hierarchy' }),
  children: many(pages, { relationName: 'page_hierarchy' }),
  sections: many(pageSections),
  seo: one(seoMetadata, { fields: [pages.seoId], references: [seoMetadata.id] }),
  author: one(users, { fields: [pages.authorId], references: [users.id] }),
  category: one(categories, { fields: [pages.categoryId], references: [categories.id] }),
  template: one(templates, { fields: [pages.templateId], references: [templates.id] }),
  revisions: many(pageRevisions),
}));

export const pageSectionsRelations = relations(pageSections, ({ one }) => ({
  page: one(pages, { fields: [pageSections.pageId], references: [pages.id] }),
  sectionLibrary: one(sections, { fields: [pageSections.sectionLibraryId], references: [sections.id] }),
}));

export const pageRevisionsRelations = relations(pageRevisions, ({ one }) => ({
  page: one(pages, { fields: [pageRevisions.pageId], references: [pages.id] }),
  author: one(users, { fields: [pageRevisions.authorId], references: [users.id] }),
}));

export const navigationMenusRelations = relations(navigationMenus, ({ many }) => ({
  items: many(navigationItems),
}));

export const navigationItemsRelations = relations(navigationItems, ({ one, many }) => ({
  menu: one(navigationMenus, { fields: [navigationItems.menuId], references: [navigationMenus.id] }),
  parent: one(navigationItems, { fields: [navigationItems.parentId], references: [navigationItems.id], relationName: 'nav_hierarchy' }),
  children: many(navigationItems, { relationName: 'nav_hierarchy' }),
  page: one(pages, { fields: [navigationItems.pageId], references: [pages.id] }),
  megaMenuCategories: many(megaMenuCategories),
}));

export const megaMenuCategoriesRelations = relations(megaMenuCategories, ({ one, many }) => ({
  navigationItem: one(navigationItems, {
    fields: [megaMenuCategories.navigationItemId],
    references: [navigationItems.id],
  }),
  page: one(pages, { fields: [megaMenuCategories.pageId], references: [pages.id] }),
  subCategories: many(megaMenuSubCategories),
}));

export const megaMenuSubCategoriesRelations = relations(megaMenuSubCategories, ({ one, many }) => ({
  category: one(megaMenuCategories, {
    fields: [megaMenuSubCategories.categoryId],
    references: [megaMenuCategories.id],
  }),
  page: one(pages, { fields: [megaMenuSubCategories.pageId], references: [pages.id] }),
  subSubCategories: many(megaMenuSubSubCategories),
}));

export const megaMenuSubSubCategoriesRelations = relations(megaMenuSubSubCategories, ({ one }) => ({
  subCategory: one(megaMenuSubCategories, {
    fields: [megaMenuSubSubCategories.subCategoryId],
    references: [megaMenuSubCategories.id],
  }),
  page: one(pages, { fields: [megaMenuSubSubCategories.pageId], references: [pages.id] }),
}));

// --- CAREERS & APPLICATIONS ---
export const careers = pgTable('careers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  department: varchar('department', { length: 255 }).notNull(),
  description: text('description').notNull(),
  type: varchar('type', { length: 50 }).notNull().default('Full-Time'),
  experience: varchar('experience', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  aboutText: text('about_text').notNull(),
  requirements: jsonb('requirements').default('[]').notNull(),
  responsibilities: jsonb('responsibilities').default('[]').notNull(),
  niceToHave: jsonb('nice_to_have').default('[]').notNull(),
  whatWeOffer: jsonb('what_we_offer').default('[]').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  jdUrl: text('jd_url'),
  budgetRange: text('budget_range'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  careerId: uuid('career_id').notNull().references(() => careers.id, { onDelete: 'cascade' }),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  experience: varchar('experience', { length: 255 }).notNull(),
  currentCompany: varchar('current_company', { length: 255 }),
  noticePeriod: varchar('notice_period', { length: 100 }).notNull(),
  linkedInProfile: varchar('linkedin_profile', { length: 500 }),
  portfolioUrl: varchar('portfolio_url', { length: 500 }),
  resumeUrl: text('resume_url').notNull(),
  coverLetter: text('cover_letter'),
  status: varchar('status', { length: 50 }).default('applied').notNull(), // 'applied', 'reviewed', 'shortlisted', 'rejected'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const careersRelations = relations(careers, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  career: one(careers, { fields: [applications.careerId], references: [careers.id] }),
}));

// Trigger HMR cache reload

export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }),
  company: varchar('company', { length: 255 }),
  country: varchar('country', { length: 100 }),
  message: text('message'),
  formType: varchar('form_type', { length: 50 }).default('contact').notNull(),
  pageName: varchar('page_name', { length: 255 }),
  pdfUrl: varchar('pdf_url', { length: 512 }),
  status: varchar('status', { length: 50 }).default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const footerSettings = pgTable('footer_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  logoUrl: text('logo_url'),
  description: text('description'),
  twitterUrl: text('twitter_url'),
  linkedinUrl: text('linkedin_url'),
  facebookUrl: text('facebook_url'),
  youtubeUrl: text('youtube_url'),
  countries: jsonb('countries').default('[]').notNull(), // string[] (up to 4 countries)
  links: jsonb('links').default('{}').notNull(), // { company: Link[], products: Link[], industries: Link[], services: Link[] }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const careersSettings = pgTable('careers_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  hrEmail: varchar('hr_email', { length: 255 }).notNull().default('hr@example.com'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


