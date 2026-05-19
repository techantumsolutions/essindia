-- Enterprise CMS extension (backward compatible)

CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "parent_id" uuid,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "description" text,
  "icon" varchar(100),
  "image_url" text,
  "order_index" integer DEFAULT 0 NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "seo_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "unique_category_slug" ON "categories" ("slug");
CREATE INDEX IF NOT EXISTS "idx_categories_parent" ON "categories" ("parent_id");

CREATE TABLE IF NOT EXISTS "sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "identity_hash" varchar(64) NOT NULL,
  "name" varchar(255) NOT NULL,
  "type" varchar(100) NOT NULL,
  "variant" varchar(50) DEFAULT 'default',
  "preview_thumbnail" text,
  "content_json" jsonb DEFAULT '{}' NOT NULL,
  "style_json" jsonb DEFAULT '{}',
  "settings_json" jsonb DEFAULT '{}',
  "responsive_json" jsonb DEFAULT '{}',
  "animation_json" jsonb DEFAULT '{}',
  "category_tags" jsonb DEFAULT '[]',
  "status" varchar(50) DEFAULT 'draft' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "is_locked" boolean DEFAULT false NOT NULL,
  "usage_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "sections_identity_hash_unique" UNIQUE("identity_hash")
);

CREATE INDEX IF NOT EXISTS "idx_sections_type" ON "sections" ("type");
CREATE INDEX IF NOT EXISTS "idx_sections_status" ON "sections" ("status");

CREATE TABLE IF NOT EXISTS "section_versions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "section_id" uuid NOT NULL,
  "version" integer NOT NULL,
  "content_json" jsonb DEFAULT '{}' NOT NULL,
  "style_json" jsonb DEFAULT '{}',
  "settings_json" jsonb DEFAULT '{}',
  "responsive_json" jsonb DEFAULT '{}',
  "animation_json" jsonb DEFAULT '{}',
  "author_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_section_versions_section" ON "section_versions" ("section_id");

CREATE TABLE IF NOT EXISTS "templates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "description" text,
  "preview_thumbnail" text,
  "category_id" uuid,
  "source_page_id" uuid,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "usage_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "templates_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "template_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "template_id" uuid NOT NULL,
  "section_library_id" uuid,
  "type" varchar(100) NOT NULL,
  "variant" varchar(50) DEFAULT 'default',
  "content_json" jsonb DEFAULT '{}' NOT NULL,
  "style_json" jsonb DEFAULT '{}',
  "settings_json" jsonb DEFAULT '{}',
  "responsive_json" jsonb DEFAULT '{}',
  "animation_json" jsonb DEFAULT '{}',
  "order_index" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_template_sections_template" ON "template_sections" ("template_id");

CREATE TABLE IF NOT EXISTS "page_revisions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "page_id" uuid NOT NULL,
  "snapshot" jsonb NOT NULL,
  "note" varchar(500),
  "author_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_page_revisions_page" ON "page_revisions" ("page_id");

CREATE TABLE IF NOT EXISTS "reusable_components" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "component_type" varchar(100) NOT NULL,
  "content_json" jsonb DEFAULT '{}' NOT NULL,
  "status" varchar(50) DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "reusable_components_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "animation_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "preset" varchar(100) NOT NULL,
  "config" jsonb DEFAULT '{}' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Extend pages table
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "category_id" uuid;
ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "preview_thumbnail" text;

-- template_id remains varchar(100) for backward compatibility

-- Extend page_sections
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "section_library_id" uuid;
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "name" varchar(255);
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "style_json" jsonb DEFAULT '{}';
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "settings_json" jsonb DEFAULT '{}';
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "responsive_json" jsonb DEFAULT '{}';
ALTER TABLE "page_sections" ADD COLUMN IF NOT EXISTS "animation_json" jsonb DEFAULT '{}';

-- Foreign keys
ALTER TABLE "categories" ADD CONSTRAINT "categories_seo_id_seo_metadata_id_fk"
  FOREIGN KEY ("seo_id") REFERENCES "public"."seo_metadata"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "section_versions" ADD CONSTRAINT "section_versions_section_id_sections_id_fk"
  FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "section_versions" ADD CONSTRAINT "section_versions_author_id_users_id_fk"
  FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "templates" ADD CONSTRAINT "templates_category_id_categories_id_fk"
  FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "templates" ADD CONSTRAINT "templates_source_page_id_pages_id_fk"
  FOREIGN KEY ("source_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_template_id_templates_id_fk"
  FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_section_library_id_sections_id_fk"
  FOREIGN KEY ("section_library_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_page_id_pages_id_fk"
  FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_author_id_users_id_fk"
  FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

ALTER TABLE "pages" ADD CONSTRAINT "pages_category_id_categories_id_fk"
  FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;

ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_section_library_id_sections_id_fk"
  FOREIGN KEY ("section_library_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;
