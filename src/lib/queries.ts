import { unstable_cache } from "next/cache";

import {
  getSectionTags,
  PORTFOLIO_CACHE_REVALIDATE_SECONDS,
} from "@/lib/admin/cache";
import { supabase } from "@/lib/supabase";
import {
  parseAboutStats,
  parseReachSocials,
  type AboutSection,
  type FooterSection,
  type HeroSection,
  type ProcessMetaSection,
  type ProcessStepItem,
  type ReachusSection,
  type ServicesMetaSection,
  type ServicesItem,
  type WorksMetaSection,
  type WorksItem,
} from "@/types/content";
import type { Tables } from "@/types/supabase";

function clampNonNegativeInteger(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.trunc(parsed));
}

async function fetchSingle<K extends "hero" | "about" | "reachus" | "footer">(section: K) {
  const { data, error } = await supabase
    .from(section)
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle<Tables<K>>();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No rows found for ${section}`);
  return data;
}

async function fetchList<K extends "works" | "services" | "process_steps">(section: K) {
  const { data, error } = await supabase
    .from(section)
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<Tables<K>[]>();
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchOptionalSingle<K extends "works_meta" | "services_meta" | "process_meta">(section: K) {
  const { data, error } = await supabase
    .from(section)
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle<Tables<K>>();
  if (error) {
    // Allow deployments where meta tables are not migrated yet.
    return null;
  }
  return data;
}

const getHeroCached = unstable_cache(
  async () => fetchSingle("hero"),
  ["portfolio-query-hero"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("hero"),
  }
);

const getAboutCached = unstable_cache(
  async () => fetchSingle("about"),
  ["portfolio-query-about"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("about"),
  }
);

const getWorksCached = unstable_cache(
  async () => fetchList("works"),
  ["portfolio-query-works"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("works"),
  }
);

const getServicesCached = unstable_cache(
  async () => fetchList("services"),
  ["portfolio-query-services"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("services"),
  }
);

const getProcessStepsCached = unstable_cache(
  async () => fetchList("process_steps"),
  ["portfolio-query-process-steps"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("process_steps"),
  }
);

const getReachusCached = unstable_cache(
  async () => fetchSingle("reachus"),
  ["portfolio-query-reachus"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("reachus"),
  }
);

const getFooterCached = unstable_cache(
  async () => fetchSingle("footer"),
  ["portfolio-query-footer"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("footer"),
  }
);

const getWorksMetaCached = unstable_cache(
  async () => fetchOptionalSingle("works_meta"),
  ["portfolio-query-works-meta"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("works_meta"),
  }
);

const getServicesMetaCached = unstable_cache(
  async () => fetchOptionalSingle("services_meta"),
  ["portfolio-query-services-meta"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("services_meta"),
  }
);

const getProcessMetaCached = unstable_cache(
  async () => fetchOptionalSingle("process_meta"),
  ["portfolio-query-process-meta"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("process_meta"),
  }
);

export async function getHero() {
  return getHeroCached() as Promise<HeroSection>;
}

export async function getAbout() {
  const about = (await getAboutCached()) as Tables<"about">;
  return {
    ...about,
    stats: parseAboutStats(about.stats),
  } satisfies AboutSection;
}

export async function getWorks() {
  return getWorksCached() as Promise<WorksItem[]>;
}

export async function getWorksMeta() {
  const meta = (await getWorksMetaCached()) as Tables<"works_meta"> | null;
  if (!meta) {
    return {
      id: "",
      homepage_label: "[ FEATURED PROJECTS ]",
      homepage_heading: "Works.",
      featured_count: 4,
      archive_heading: "Archive.",
      updated_at: null,
    } satisfies WorksMetaSection;
  }

  return {
    ...meta,
    featured_count: clampNonNegativeInteger(meta.featured_count, 4),
  } satisfies WorksMetaSection;
}

export async function getWorkById(id: string) {
  const { data, error } = await supabase
    .from("works")
    .select("*")
    .eq("id", id)
    .single<Tables<"works">>();

  if (error) return null;
  return data as WorksItem;
}

export async function getServices() {
  return getServicesCached() as Promise<ServicesItem[]>;
}

export async function getServicesMeta() {
  const meta = (await getServicesMetaCached()) as Tables<"services_meta"> | null;
  return (
    meta ?? {
      id: "",
      label: "[ OUR SERVICES ]",
      profile_image_url:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800",
      intro_text:
        "We define the foundation of your brand voice, visuals, and values shaped into a system built for long-term clarity.",
      cta_text: "Start a project",
      cta_url: "#contact",
      updated_at: null,
    }
  ) satisfies ServicesMetaSection;
}

export async function getProcessSteps() {
  return getProcessStepsCached() as Promise<ProcessStepItem[]>;
}

export async function getProcessMeta() {
  const meta = (await getProcessMetaCached()) as Tables<"process_meta"> | null;
  return (
    meta ?? {
      id: "",
      label: "[ OUR PROCESS ]",
      updated_at: null,
    }
  ) satisfies ProcessMetaSection;
}

export async function getReachus() {
  const reachus = (await getReachusCached()) as Tables<"reachus">;
  return {
    ...reachus,
    socials: parseReachSocials(reachus.socials),
  } satisfies ReachusSection;
}

export async function getFooter() {
  return getFooterCached() as Promise<FooterSection>;
}
