ALTER TABLE pages ADD COLUMN IF NOT EXISTS navigation_item_id uuid REFERENCES navigation_items(id) ON DELETE SET NULL;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS mega_menu_category_id uuid REFERENCES mega_menu_categories(id) ON DELETE SET NULL;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS mega_menu_sub_category_id uuid REFERENCES mega_menu_sub_categories(id) ON DELETE SET NULL;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS mega_menu_sub_sub_category_id uuid REFERENCES mega_menu_sub_sub_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_pages_navigation_item ON pages(navigation_item_id);
CREATE INDEX IF NOT EXISTS idx_pages_mega_category ON pages(mega_menu_category_id);
