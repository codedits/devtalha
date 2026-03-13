export const SINGLE_ROW_SECTIONS = [
  "hero",
  "about",
  "reachus",
  "footer",
  "works_meta",
  "services_meta",
  "process_meta",
  "why_choose_us",
] as const;

export const MULTI_ROW_SECTIONS = ["works", "services", "process_steps", "section_order"] as const;

export const ADMIN_SECTIONS = [...SINGLE_ROW_SECTIONS, ...MULTI_ROW_SECTIONS] as const;

export type AdminSingleSection = (typeof SINGLE_ROW_SECTIONS)[number];
export type AdminMultiRowSection = (typeof MULTI_ROW_SECTIONS)[number];
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const EDITABLE_FIELDS: Record<AdminSection, readonly string[]> = {
  hero: ["heading", "background_image_url", "mobile_background_image_url", "name_label"],
  about: ["label", "heading", "description", "stats"],
  reachus: [
    "label",
    "heading",
    "email",
    "office_title",
    "office_line_1",
    "office_line_2",
    "office_line_3",
    "inquiry_title",
    "inquiry_text",
    "socials",
  ],
  footer: ["newsletter_heading", "newsletter_description", "brand_name", "email"],
  works_meta: ["homepage_label", "homepage_heading", "featured_count", "archive_heading"],
  services_meta: ["label", "profile_image_url", "intro_text", "cta_text", "cta_url"],
  process_meta: ["label"],
  why_choose_us: [
    "label",
    "heading",
    "studio_name",
    "studio_image_url",
    "studio_since",
    "testimonial_text",
    "revenue_stat",
    "revenue_label",
    "scale_stat",
    "scale_description",
  ],
  works: ["title", "client", "summary", "project_url", "image_url", "hover_image_url", "gallery_images", "sort_order"],
  services: ["title", "description", "tags", "images", "sort_order"],
  process_steps: ["number", "title", "description", "sort_order"],
  section_order: ["section_key", "title", "sort_order"],
};

export const REQUIRED_MULTI_ROW_FIELDS: Partial<Record<AdminMultiRowSection, readonly string[]>> = {
  works: ["title", "client", "image_url"],
  services: ["title"],
  process_steps: ["number", "title"],
  section_order: ["section_key", "title"],
};

export function isAdminSection(value: string): value is AdminSection {
  return (ADMIN_SECTIONS as readonly string[]).includes(value);
}

export function isSingleRowSection(value: string): value is AdminSingleSection {
  return (SINGLE_ROW_SECTIONS as readonly string[]).includes(value);
}

export function isMultiRowSection(value: string): value is AdminMultiRowSection {
  return (MULTI_ROW_SECTIONS as readonly string[]).includes(value);
}
