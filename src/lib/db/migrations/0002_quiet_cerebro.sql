CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(100),
	"company" varchar(255),
	"country" varchar(100),
	"message" text,
	"form_type" varchar(50) DEFAULT 'contact' NOT NULL,
	"page_name" varchar(255),
	"pdf_url" varchar(512),
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "page_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "depth_level" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pages_navigation_depth" ON "pages" USING btree ("navigation_item_id","depth_level");--> statement-breakpoint
CREATE INDEX "idx_pages_nav_sort" ON "pages" USING btree ("navigation_item_id","sort_order");