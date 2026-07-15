/**
 * Idempotent SEO / redirects / site settings schema extensions.
 * Run: npx tsx scripts/apply-seo-extensions-migration.ts
 */
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar(100) NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS url_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path varchar(500) NOT NULL,
  to_path varchar(1000) NOT NULL,
  status_code integer NOT NULL DEFAULT 301,
  is_enabled boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_url_redirects_from_path ON url_redirects (from_path);
CREATE INDEX IF NOT EXISTS idx_url_redirects_enabled ON url_redirects (is_enabled);

ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS og_title varchar(255);
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS og_description text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_card varchar(50) DEFAULT 'summary_large_image';
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_title varchar(255);
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_description text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS twitter_image text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS header_scripts text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS footer_scripts text;
ALTER TABLE seo_metadata ADD COLUMN IF NOT EXISTS heading_h1 varchar(500);

INSERT INTO site_settings (key, value)
VALUES (
  'seo_globals',
  '{
    "headerScripts": "",
    "footerScripts": "",
    "robotsExtraDisallow": [],
    "preferWww": false,
    "forceHttps": true
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
