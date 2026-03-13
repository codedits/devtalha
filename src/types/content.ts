import type { Json, Tables } from "@/types/supabase";

export type HeroSection = Tables<"hero">;
export type WorksItem = Tables<"works">;
export type ServicesItem = Tables<"services">;
export type ProcessStepItem = Tables<"process_steps">;
export type FooterSection = Tables<"footer">;
export type WorksMetaSection = Tables<"works_meta">;
export type ServicesMetaSection = Tables<"services_meta">;
export type ProcessMetaSection = Tables<"process_meta">;

export type WhyChooseUsSection = {
  id: string;
  label: string;
  heading: string;
  studio_name: string;
  studio_image_url: string;
  studio_since: string;
  testimonial_text: string;
  revenue_stat: string;
  revenue_label: string;
  scale_stat: string;
  scale_description: string;
  updated_at: string | null;
};

export type AboutStat = {
  value: number;
  suffix: string;
  label: string;
};

export type ReachSocial = {
  name: string;
  href: string;
};

export type AboutSection = Omit<Tables<"about">, "stats"> & {
  stats: AboutStat[];
};

export type ReachusSection = Omit<Tables<"reachus">, "socials"> & {
  socials: ReachSocial[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseAboutStats(value: Json): AboutStat[] {
  if (!Array.isArray(value)) return [];

  const parsed: AboutStat[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;

    const rawValue = item["value"];
    const numberValue =
      typeof rawValue === "number"
        ? rawValue
        : typeof rawValue === "string"
          ? Number(rawValue)
          : 0;

    parsed.push({
      value: Number.isFinite(numberValue) ? numberValue : 0,
      suffix: typeof item["suffix"] === "string" ? item["suffix"] : "",
      label: typeof item["label"] === "string" ? item["label"] : "",
    });
  }

  return parsed;
}

export function parseReachSocials(value: Json): ReachSocial[] {
  if (!Array.isArray(value)) return [];

  const parsed: ReachSocial[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;

    parsed.push({
      name: typeof item["name"] === "string" ? item["name"] : "",
      href: typeof item["href"] === "string" ? item["href"] : "#",
    });
  }

  return parsed;
}