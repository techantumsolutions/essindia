ALTER TABLE navigation_items ADD COLUMN IF NOT EXISTS slug varchar(255);

CREATE TABLE IF NOT EXISTS mega_menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  navigation_item_id uuid NOT NULL REFERENCES navigation_items(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  status varchar(50) NOT NULL DEFAULT 'active',
  icon varchar(100),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mega_menu_categories_nav ON mega_menu_categories(navigation_item_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_mega_category_nav_slug ON mega_menu_categories(navigation_item_id, slug);

CREATE TABLE IF NOT EXISTS mega_menu_sub_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES mega_menu_categories(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  description text,
  thumbnail text,
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  order_index integer NOT NULL DEFAULT 0,
  status varchar(50) NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mega_menu_sub_categories_cat ON mega_menu_sub_categories(category_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_mega_sub_category_slug ON mega_menu_sub_categories(category_id, slug);

CREATE TABLE IF NOT EXISTS mega_menu_sub_sub_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_category_id uuid NOT NULL REFERENCES mega_menu_sub_categories(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  slug varchar(255) NOT NULL,
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  order_index integer NOT NULL DEFAULT 0,
  status varchar(50) NOT NULL DEFAULT 'active',
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mega_menu_sub_sub_sub ON mega_menu_sub_sub_categories(sub_category_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_mega_sub_sub_slug ON mega_menu_sub_sub_categories(sub_category_id, slug);
