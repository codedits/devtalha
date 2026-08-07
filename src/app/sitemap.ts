import type { MetadataRoute } from "next";
import { getWorks } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talha-irfan.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const works = await getWorks();
    const dynamicWorkRoutes: MetadataRoute.Sitemap = works.map((work) => ({
      url: `${baseUrl}/projects/${work.id}`,
      lastModified: work.updated_at || new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicWorkRoutes];
  } catch (error) {
    console.error("Error generating sitemap dynamic routes:", error);
    return staticRoutes;
  }
}
