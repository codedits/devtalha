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
  type WhyChooseUsSection,
} from "@/types/content";
import type { Tables } from "@/types/supabase";
import {
  HOMEPAGE_SECTION_DEFINITIONS,
  normalizeHomepageSectionOrder,
  type HomepageSectionKey,
} from "@/lib/admin/homepageSections";

type SectionOrderRow = {
  section_key: string;
  sort_order: number;
};

function clampNonNegativeInteger(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.trunc(parsed));
}

async function fetchSingle<K extends "hero" | "about" | "reachus" | "footer" | "why_choose_us">(section: K) {
  const { data, error } = await supabase
    .from(section)
    .select("*")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle<any>();
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

function getWorkByIdCached(id: string) {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("id", id)
        .single<Tables<"works">>();

      if (error) return null;
      return data as WorksItem;
    },
    ["portfolio-query-work-by-id", id],
    {
      revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
      tags: getSectionTags("works"),
    }
  )();
}

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

const getWhyChooseUsCached = unstable_cache(
  async () => fetchSingle("why_choose_us"),
  ["portfolio-query-why-choose-us"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("why_choose_us"),
  }
);

const getHomepageSectionOrderCached = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("section_order")
      .select("section_key, sort_order")
      .order("sort_order", { ascending: true })
      .returns<SectionOrderRow[]>();

    if (error) {
      // Allow deployments where section_order is not migrated yet.
      return null;
    }

    return data ?? [];
  },
  ["portfolio-query-section-order"],
  {
    revalidate: PORTFOLIO_CACHE_REVALIDATE_SECONDS,
    tags: getSectionTags("section_order"),
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
  return getWorkByIdCached(id) as Promise<WorksItem | null>;
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

export async function getWhyChooseUs() {
  const meta = (await getWhyChooseUsCached()) as WhyChooseUsSection | null;
  if (!meta) {
    return {
      id: "",
      label: "[ WHY CHOOSE US ]",
      heading: "A studio cut for brands that refuse to play safe",
      studio_name: "Talha Studio®",
      studio_image_url:
        "https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=1000&auto=format&fit=crop",
      studio_since: "Since 2019",
      testimonial_text:
        '"Working with this team was the difference between having a website and having a digital brand. Our bounce rate dropped by nearly half within the first month, the site finally feels like it represents us"',
      revenue_stat: "$20M+",
      revenue_label: "Revenue generated for our clients",
      scale_stat: "120+",
      scale_description:
        "From New York to Dubai, our work has no borders. We collaborate across time zones to deliver systems and designs that scale.",
      updated_at: null,
    } satisfies WhyChooseUsSection;
  }
  return meta as WhyChooseUsSection;
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

export async function getHomepageSectionOrder() {
  const rows = await getHomepageSectionOrderCached();
  if (!rows || rows.length === 0) {
    return HOMEPAGE_SECTION_DEFINITIONS.map((item) => item.key);
  }

  const ordered = rows
    .slice()
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((item) => String(item.section_key ?? "").trim());

  return normalizeHomepageSectionOrder(ordered) as HomepageSectionKey[];
}
