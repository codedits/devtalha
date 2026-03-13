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
  type ProcessStepItem,
  type ReachusSection,
  type ServicesItem,
  type WorksItem,
} from "@/types/content";
import type { Tables } from "@/types/supabase";

async function fetchSingle<K extends "hero" | "about" | "reachus" | "footer">(section: K) {
  const { data, error } = await supabase.from(section).select("*").single<Tables<K>>();
  if (error) throw new Error(error.message);
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

export async function getProcessSteps() {
  return getProcessStepsCached() as Promise<ProcessStepItem[]>;
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
