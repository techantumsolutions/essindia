-- Page hierarchy fields for navigation tree generation
ALTER TABLE pages ADD COLUMN IF NOT EXISTS depth_level integer NOT NULL DEFAULT 0;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_pages_navigation_depth ON pages(navigation_item_id, depth_level);
CREATE INDEX IF NOT EXISTS idx_pages_nav_sort ON pages(navigation_item_id, sort_order);
