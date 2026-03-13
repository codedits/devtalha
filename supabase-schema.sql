-- ============================================================
-- Portfolio CMS Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- 1. Hero Section (single row)
CREATE TABLE IF NOT EXISTS hero (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT NOT NULL DEFAULT 'I build brands, campaigns, and digital experience',
  background_image_url TEXT NOT NULL DEFAULT '',
  name_label TEXT NOT NULL DEFAULT 'TALHA IRFAN',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. About Section (single row)
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '[ WHO I AM ]',
  heading TEXT NOT NULL DEFAULT 'A student and developer building premium digital products at unprecedented speed',
  description TEXT NOT NULL DEFAULT '',
  stats JSONB NOT NULL DEFAULT '[
    {"value": 15, "suffix": "+", "label": "Projects Delivered"},
    {"value": 8, "suffix": "+", "label": "Core Technologies"},
    {"value": 2, "suffix": "x", "label": "Faster with AI"},
    {"value": 100, "suffix": "%", "label": "Code Quality Focus"}
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Works (multiple rows)
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  project_url TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  hover_image_url TEXT NOT NULL DEFAULT '',
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure new columns exist in older databases
ALTER TABLE works ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';
ALTER TABLE works ADD COLUMN IF NOT EXISTS project_url TEXT NOT NULL DEFAULT '';
ALTER TABLE works ADD COLUMN IF NOT EXISTS gallery_images TEXT[] NOT NULL DEFAULT '{}';

-- 4. Services (multiple rows)
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Process Steps (multiple rows)
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5b. Works Section Meta (single row)
CREATE TABLE IF NOT EXISTS works_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  homepage_label TEXT NOT NULL DEFAULT '[ FEATURED PROJECTS ]',
  homepage_heading TEXT NOT NULL DEFAULT 'Works.',
  featured_count INT NOT NULL DEFAULT 4,
  archive_heading TEXT NOT NULL DEFAULT 'Archive.',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5c. Services Section Meta (single row)
CREATE TABLE IF NOT EXISTS services_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '[ OUR SERVICES ]',
  profile_image_url TEXT NOT NULL DEFAULT '',
  intro_text TEXT NOT NULL DEFAULT 'We define the foundation of your brand voice, visuals, and values shaped into a system built for long-term clarity.',
  cta_text TEXT NOT NULL DEFAULT 'Start a project',
  cta_url TEXT NOT NULL DEFAULT '#contact',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5d. Process Section Meta (single row)
CREATE TABLE IF NOT EXISTS process_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '[ OUR PROCESS ]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5e. Homepage Section Order (multiple rows)
CREATE TABLE IF NOT EXISTS section_order (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT section_order_valid_key CHECK (
    section_key IN ('hero', 'about', 'works', 'services', 'process', 'reachus')
  )
);

-- 6. Reach Us Section (single row)
CREATE TABLE IF NOT EXISTS reachus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL DEFAULT '[ REACH US ]',
  heading TEXT NOT NULL DEFAULT 'Have a bold idea? Let''s shape it.',
  email TEXT NOT NULL DEFAULT 'hello@talha.com',
  office_title TEXT NOT NULL DEFAULT 'OFFICE',
  office_line_1 TEXT NOT NULL DEFAULT 'Available Worldwide',
  office_line_2 TEXT NOT NULL DEFAULT 'Working Remotely',
  office_line_3 TEXT NOT NULL DEFAULT 'Based in PK',
  inquiry_title TEXT NOT NULL DEFAULT 'INQUIRIES',
  inquiry_text TEXT NOT NULL DEFAULT 'For new projects and partnership questions:',
  socials JSONB NOT NULL DEFAULT '[
    {"name": "INSTAGRAM", "href": "#"},
    {"name": "X / TWITTER", "href": "#"},
    {"name": "LINKEDIN", "href": "#"}
  ]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure new columns exist in older databases
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS office_title TEXT NOT NULL DEFAULT 'OFFICE';
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS office_line_1 TEXT NOT NULL DEFAULT 'Available Worldwide';
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS office_line_2 TEXT NOT NULL DEFAULT 'Working Remotely';
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS office_line_3 TEXT NOT NULL DEFAULT 'Based in PK';
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS inquiry_title TEXT NOT NULL DEFAULT 'INQUIRIES';
ALTER TABLE reachus ADD COLUMN IF NOT EXISTS inquiry_text TEXT NOT NULL DEFAULT 'For new projects and partnership questions:';

-- 7. Footer (single row)
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_heading TEXT NOT NULL DEFAULT 'Stay connected',
  newsletter_description TEXT NOT NULL DEFAULT 'Join our newsletter and stay updated on the latest trends in digital design',
  brand_name TEXT NOT NULL DEFAULT 'TALHA',
  email TEXT NOT NULL DEFAULT 'hello@talha.com',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS Policies: Public read, authenticated write
-- ============================================================

ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE works_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE reachus ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Public read for all tables
DROP POLICY IF EXISTS "Public read" ON hero;
CREATE POLICY "Public read" ON hero FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON about;
CREATE POLICY "Public read" ON about FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON works;
CREATE POLICY "Public read" ON works FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON services;
CREATE POLICY "Public read" ON services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON process_steps;
CREATE POLICY "Public read" ON process_steps FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON works_meta;
CREATE POLICY "Public read" ON works_meta FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON services_meta;
CREATE POLICY "Public read" ON services_meta FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON process_meta;
CREATE POLICY "Public read" ON process_meta FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON section_order;
CREATE POLICY "Public read" ON section_order FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON reachus;
CREATE POLICY "Public read" ON reachus FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read" ON footer;
CREATE POLICY "Public read" ON footer FOR SELECT USING (true);

-- Service role can do everything (admin panel uses service role key)
-- No additional policies needed since service role bypasses RLS

-- ============================================================
-- Storage Bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read on storage
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects 
FOR SELECT USING (bucket_id = 'portfolio-images');

-- Allow service role uploads (handled by default)

-- ============================================================
-- Seed Data
-- ============================================================

-- Seed Hero
INSERT INTO hero (heading, background_image_url, name_label)
SELECT * FROM (VALUES (
  'I build brands, campaigns, and digital experience',
  'https://images.unsplash.com/photo-1582150816999-5c92a8c15401?q=80&w=1170&auto=format&fit=crop',
  'TALHA IRFAN'
)) AS seed(heading, background_image_url, name_label)
WHERE NOT EXISTS (SELECT 1 FROM hero);

-- Seed About
INSERT INTO about (label, heading, description, stats)
SELECT * FROM (VALUES (
  '[ WHO I AM ]',
  'A student and developer building premium digital products at unprecedented speed',
  'I work at the intersection of code and design, obsessing over every pixel and interaction. By integrating AI into my workflow, I move at speed most teams can only dream of while maintaining the quality of a dedicated studio.',
  '[{"value": 15, "suffix": "+", "label": "Projects Delivered"}, {"value": 8, "suffix": "+", "label": "Core Technologies"}, {"value": 2, "suffix": "x", "label": "Faster with AI"}, {"value": 100, "suffix": "%", "label": "Code Quality Focus"}]'::jsonb
)) AS seed(label, heading, description, stats)
WHERE NOT EXISTS (SELECT 1 FROM about);

-- Seed Works
INSERT INTO works (title, client, summary, project_url, image_url, hover_image_url, gallery_images, sort_order)
SELECT * FROM (VALUES
('Scarlet Design Studio', 'Fashion Brand', 'A premium e-commerce visual system with bold editorial direction and responsive product storytelling.', 'https://example.com/scarlet', 'https://framerusercontent.com/images/rSYCc9NuZxZZzbjxPH3muXhXZvg.jpg', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop'], 1),
('Amber Studio', 'Creative Production', 'A conversion-focused studio site balancing motion design with high-performance rendering.', 'https://example.com/amber', 'https://framerusercontent.com/images/vRcX31A0p0E7RIv4uPKIu2atBg.jpg', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1400&auto=format&fit=crop'], 2),
('Keystone Studio', 'Architectural Firm', 'A minimalist portfolio platform showcasing architecture projects with clean typographic hierarchy.', 'https://example.com/keystone', 'https://framerusercontent.com/images/f7oyi2aIDMI2iUNKjywMMhvxJw.jpg', 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1472220625704-91e1462799b2?q=80&w=1400&auto=format&fit=crop'], 3),
('Visual Storytelling', 'Photography Studio', 'An immersive gallery-first experience crafted to spotlight campaign visuals across devices.', 'https://example.com/visual-storytelling', 'https://framerusercontent.com/images/0VcBF1ImnGMwpgj0OP6dMfTTM0.jpg', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&auto=format&fit=crop'], 4),
('Lorian Dashboard', 'Web App', 'A polished analytics product UI with modular components and fast data-heavy interactions.', 'https://example.com/lorian', 'https://framerusercontent.com/images/mWAJSY1ma2RpRuDO7LuohAtnsI.jpg', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1551281044-8b8f3c6f0c7a?q=80&w=1400&auto=format&fit=crop'], 5),
('Estate Collective', 'Real Estate', 'A real-estate showcase optimized for trust, clarity, and lead generation.', 'https://example.com/estate-collective', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1400&auto=format&fit=crop'], 6)
) AS seed(title, client, summary, project_url, image_url, hover_image_url, gallery_images, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM works);

-- Seed Services
INSERT INTO services (title, description, tags, images, sort_order)
SELECT * FROM (VALUES
('Brand Strategy', 'Building the foundation of your brand from positioning and tone to messaging and visual direction.', ARRAY['Brand Positioning', 'Visual Identity', 'Messaging Framework', 'Creative Direction'], ARRAY['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'], 1),
('Website Design', 'Crafting digital experiences that bridge the gap between aesthetics and performance.', ARRAY['UI/UX Design', 'Responsive Design', 'Design Systems', 'Prototyping'], ARRAY['https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600'], 2),
('Content Creation', 'Storytelling through media. We produce high-quality visual and written content.', ARRAY['Photography', 'Videography', 'Copywriting', 'Social Media'], ARRAY['https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=600', 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=600'], 3),
('Product Design', 'End-to-end product design from concept to launch, ensuring a seamless user experience.', ARRAY['UX Research', 'Product Strategy', 'Interface Design', 'User Testing'], ARRAY['https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600'], 4)
) AS seed(title, description, tags, images, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- Seed Process Steps
INSERT INTO process_steps (number, title, description, sort_order)
SELECT * FROM (VALUES
('[ 01 ]', 'Discovery', 'We cut through the noise, understand your brand, your audience, and your goals. No cookie-cutter playbooks only sharp strategies.', 1),
('[ 02 ]', 'Designing', 'From sketches to high-fidelity prototypes, we shape bold concepts into tangible visuals. Expect motion, layouts, and interactions.', 2),
('[ 03 ]', 'Development', 'Design isn''t enough, it has to perform. We develop responsive, fast, and scalable systems.', 3),
('[ 04 ]', 'Launch', 'We don''t vanish after launch. From performance optimization to continuous iterations, we ensure your brand stays sharp.', 4)
) AS seed(number, title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM process_steps);

-- Seed Works Meta
INSERT INTO works_meta (homepage_label, homepage_heading, featured_count, archive_heading)
SELECT * FROM (VALUES ('[ FEATURED PROJECTS ]', 'Works.', 4, 'Archive.'))
AS seed(homepage_label, homepage_heading, featured_count, archive_heading)
WHERE NOT EXISTS (SELECT 1 FROM works_meta);

-- Seed Services Meta
INSERT INTO services_meta (label, profile_image_url, intro_text, cta_text, cta_url)
SELECT * FROM (VALUES (
  '[ OUR SERVICES ]',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
  'We define the foundation of your brand voice, visuals, and values shaped into a system built for long-term clarity.',
  'Start a project',
  '#contact'
)) AS seed(label, profile_image_url, intro_text, cta_text, cta_url)
WHERE NOT EXISTS (SELECT 1 FROM services_meta);

-- Seed Process Meta
INSERT INTO process_meta (label)
SELECT * FROM (VALUES ('[ OUR PROCESS ]')) AS seed(label)
WHERE NOT EXISTS (SELECT 1 FROM process_meta);

-- Seed Homepage Section Order
INSERT INTO section_order (section_key, title, sort_order)
SELECT * FROM (VALUES
  ('hero', 'Hero', 1),
  ('about', 'About', 2),
  ('works', 'Works', 3),
  ('services', 'Services', 4),
  ('process', 'Process', 5),
  ('reachus', 'Reach Us', 6)
) AS seed(section_key, title, sort_order)
ON CONFLICT (section_key) DO UPDATE
SET
  title = EXCLUDED.title,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Seed Reachus
INSERT INTO reachus (label, heading, email, office_title, office_line_1, office_line_2, office_line_3, inquiry_title, inquiry_text, socials)
SELECT * FROM (VALUES (
  '[ REACH US ]',
  'Have a bold idea? Let''s shape it.',
  'hello@talha.com',
  'OFFICE',
  'Available Worldwide',
  'Working Remotely',
  'Based in PK',
  'INQUIRIES',
  'For new projects and partnership questions:',
  '[{"name": "INSTAGRAM", "href": "#"}, {"name": "X / TWITTER", "href": "#"}, {"name": "LINKEDIN", "href": "#"}]'::jsonb
)) AS seed(label, heading, email, office_title, office_line_1, office_line_2, office_line_3, inquiry_title, inquiry_text, socials)
WHERE NOT EXISTS (SELECT 1 FROM reachus);

-- Seed Footer
INSERT INTO footer (newsletter_heading, newsletter_description, brand_name, email)
SELECT * FROM (VALUES (
  'Stay connected',
  'Join our newsletter and stay updated on the latest trends in digital design',
  'Talha',
  'hello@talha.com'
)) AS seed(newsletter_heading, newsletter_description, brand_name, email)
WHERE NOT EXISTS (SELECT 1 FROM footer);
