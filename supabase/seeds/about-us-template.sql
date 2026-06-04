-- Supabase Database Seed: About Us Template
-- Creates the About Us page template and registers the sequence of block components

-- 1. Insert Template definition
INSERT INTO templates (
  id, 
  name, 
  slug, 
  description, 
  status, 
  created_at, 
  updated_at
) VALUES (
  'a04b281f-7b7c-4e89-a2a1-12f5a89403d1',
  'About Us',
  'about-us',
  'Standard About Us template containing Hero, Company Intro, Mission & Vision, Services, Technology Upgradation, Why ESS, and Call-to-Action blocks.',
  'published',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 2. Clear existing sections for this template to prevent duplicates
DELETE FROM template_sections WHERE template_id = 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1';

-- 3. Insert blocks in sequential order
INSERT INTO template_sections (
  id, 
  template_id, 
  type, 
  variant, 
  content_json, 
  order_index, 
  created_at, 
  updated_at
) VALUES 
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsHero', 'default', '{}'::jsonb, 0, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsCompanyIntro', 'default', '{}'::jsonb, 1, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsMissionVision', 'default', '{}'::jsonb, 2, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsServicesOverview', 'default', '{}'::jsonb, 3, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsTransformationSection', 'default', '{}'::jsonb, 4, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsWhyEss', 'default', '{}'::jsonb, 5, NOW(), NOW()),
  (gen_random_uuid(), 'a04b281f-7b7c-4e89-a2a1-12f5a89403d1', 'AboutUsCta', 'default', '{}'::jsonb, 6, NOW(), NOW());
