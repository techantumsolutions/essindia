CREATE TABLE "animation_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"preset" varchar(100) NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"career_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(100) NOT NULL,
	"experience" varchar(255) NOT NULL,
	"current_company" varchar(255),
	"notice_period" varchar(100) NOT NULL,
	"linkedin_profile" varchar(500),
	"portfolio_url" varchar(500),
	"resume_url" text NOT NULL,
	"cover_letter" text,
	"status" varchar(50) DEFAULT 'applied' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "careers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(300) NOT NULL,
	"department" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(50) DEFAULT 'Full-Time' NOT NULL,
	"experience" varchar(100) NOT NULL,
	"location" varchar(100) NOT NULL,
	"about_text" text NOT NULL,
	"requirements" jsonb DEFAULT '[]' NOT NULL,
	"responsibilities" jsonb DEFAULT '[]' NOT NULL,
	"nice_to_have" jsonb DEFAULT '[]' NOT NULL,
	"what_we_offer" jsonb DEFAULT '[]' NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "careers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
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
--> statement-breakpoint
CREATE TABLE "mega_menu_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"navigation_item_id" uuid NOT NULL,
	"page_id" uuid,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"icon" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mega_menu_sub_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"thumbnail" text,
	"page_id" uuid,
	"order_index" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mega_menu_sub_sub_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sub_category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"page_id" uuid,
	"order_index" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_path" text NOT NULL,
	"source" varchar(50) DEFAULT 'filesystem' NOT NULL,
	"page_id" uuid,
	"title" varchar(255),
	"page_type" varchar(100) DEFAULT 'standard',
	"is_dynamic" boolean DEFAULT false NOT NULL,
	"last_scanned_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_registry_route_path_unique" UNIQUE("route_path")
);
--> statement-breakpoint
CREATE TABLE "page_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"note" varchar(500),
	"author_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reusable_components" (
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
--> statement-breakpoint
CREATE TABLE "section_import_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid,
	"source_page_id" uuid,
	"source_section_id" uuid,
	"identity_hash" varchar(64) NOT NULL,
	"status" varchar(50) DEFAULT 'imported' NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section_versions" (
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
--> statement-breakpoint
CREATE TABLE "sections" (
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
	"source_page_id" uuid,
	"source_section_id" uuid,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sections_identity_hash_unique" UNIQUE("identity_hash")
);
--> statement-breakpoint
CREATE TABLE "template_sections" (
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
--> statement-breakpoint
CREATE TABLE "templates" (
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
--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "template_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD COLUMN "slug" varchar(255);--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "section_library_id" uuid;--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "style_json" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "settings_json" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "responsive_json" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "page_sections" ADD COLUMN "animation_json" jsonb DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "navigation_item_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "mega_menu_category_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "mega_menu_sub_category_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "mega_menu_sub_sub_category_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "preview_thumbnail" text;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_career_id_careers_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."careers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_seo_id_seo_metadata_id_fk" FOREIGN KEY ("seo_id") REFERENCES "public"."seo_metadata"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_categories" ADD CONSTRAINT "mega_menu_categories_navigation_item_id_navigation_items_id_fk" FOREIGN KEY ("navigation_item_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_categories" ADD CONSTRAINT "mega_menu_categories_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_sub_categories" ADD CONSTRAINT "mega_menu_sub_categories_category_id_mega_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."mega_menu_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_sub_categories" ADD CONSTRAINT "mega_menu_sub_categories_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_sub_sub_categories" ADD CONSTRAINT "mega_menu_sub_sub_categories_sub_category_id_mega_menu_sub_categories_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."mega_menu_sub_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mega_menu_sub_sub_categories" ADD CONSTRAINT "mega_menu_sub_sub_categories_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_registry" ADD CONSTRAINT "page_registry_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_revisions" ADD CONSTRAINT "page_revisions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_import_logs" ADD CONSTRAINT "section_import_logs_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_import_logs" ADD CONSTRAINT "section_import_logs_source_page_id_pages_id_fk" FOREIGN KEY ("source_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_versions" ADD CONSTRAINT "section_versions_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_versions" ADD CONSTRAINT "section_versions_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_source_page_id_pages_id_fk" FOREIGN KEY ("source_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_sections" ADD CONSTRAINT "template_sections_section_library_id_sections_id_fk" FOREIGN KEY ("section_library_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_source_page_id_pages_id_fk" FOREIGN KEY ("source_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_categories_parent" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_category_slug" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_mega_menu_categories_nav" ON "mega_menu_categories" USING btree ("navigation_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_mega_category_nav_slug" ON "mega_menu_categories" USING btree ("navigation_item_id","slug");--> statement-breakpoint
CREATE INDEX "idx_mega_menu_sub_categories_cat" ON "mega_menu_sub_categories" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_mega_sub_category_slug" ON "mega_menu_sub_categories" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "idx_mega_menu_sub_sub_sub" ON "mega_menu_sub_sub_categories" USING btree ("sub_category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_mega_sub_sub_slug" ON "mega_menu_sub_sub_categories" USING btree ("sub_category_id","slug");--> statement-breakpoint
CREATE INDEX "idx_page_registry_page" ON "page_registry" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_page_revisions_page" ON "page_revisions" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "idx_section_import_logs_hash" ON "section_import_logs" USING btree ("identity_hash");--> statement-breakpoint
CREATE INDEX "idx_section_versions_section" ON "section_versions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "idx_sections_type" ON "sections" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_sections_status" ON "sections" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_sections_source_page" ON "sections" USING btree ("source_page_id");--> statement-breakpoint
CREATE INDEX "idx_template_sections_template" ON "template_sections" USING btree ("template_id");--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_section_library_id_sections_id_fk" FOREIGN KEY ("section_library_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;