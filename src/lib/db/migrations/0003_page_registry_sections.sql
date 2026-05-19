ALTER TABLE sections ADD COLUMN IF NOT EXISTS source_page_id uuid REFERENCES pages(id) ON DELETE SET NULL;
ALTER TABLE sections ADD COLUMN IF NOT EXISTS source_section_id uuid;

CREATE TABLE IF NOT EXISTS page_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path text NOT NULL UNIQUE,
  source varchar(50) NOT NULL DEFAULT 'filesystem',
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  title varchar(255),
  page_type varchar(100) DEFAULT 'standard',
  is_dynamic boolean NOT NULL DEFAULT false,
  last_scanned_at timestamp NOT NULL DEFAULT now(),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_registry_page ON page_registry(page_id);
CREATE INDEX IF NOT EXISTS idx_page_registry_source ON page_registry(source);

CREATE TABLE IF NOT EXISTS section_import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE SET NULL,
  source_page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  source_section_id uuid,
  identity_hash varchar(64) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'imported',
  message text,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_section_import_logs_hash ON section_import_logs(identity_hash);
