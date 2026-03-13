export const HOMEPAGE_SECTION_KEYS = [
  "hero",
  "about",
  "why",
  "works",
  "services",
  "process",
  "reachus",
] as const;

export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

export type HomepageSectionDefinition = {
  key: HomepageSectionKey;
  title: string;
};

export const HOMEPAGE_SECTION_DEFINITIONS: HomepageSectionDefinition[] = [
  { key: "hero", title: "Hero" },
  { key: "about", title: "About" },
  { key: "why", title: "Why Choose Us" },
  { key: "works", title: "Works" },
  { key: "services", title: "Services" },
  { key: "process", title: "Process" },
  { key: "reachus", title: "Reach Us" },
];

export function isHomepageSectionKey(value: string): value is HomepageSectionKey {
  return (HOMEPAGE_SECTION_KEYS as readonly string[]).includes(value);
}

export function normalizeHomepageSectionOrder(input: string[]) {
  const valid = input.filter(isHomepageSectionKey);
  const deduped = Array.from(new Set(valid));

  for (const key of HOMEPAGE_SECTION_KEYS) {
    if (!deduped.includes(key)) deduped.push(key);
  }

  return deduped;
}