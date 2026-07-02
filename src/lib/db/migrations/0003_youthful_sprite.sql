CREATE TABLE "footer_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logo_url" text,
	"description" text,
	"twitter_url" text,
	"linkedin_url" text,
	"facebook_url" text,
	"youtube_url" text,
	"countries" jsonb DEFAULT '[]' NOT NULL,
	"links" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
