import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Mail } from "lucide-react";
import { LiquidButton } from "@/components/ui/LiquidButton";

import { getReachus, getWorkById } from "@/lib/queries";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [work, reachus] = await Promise.all([getWorkById(id), getReachus()]);

  if (!work) {
    notFound();
  }

  const projectTitle = String(work.title ?? "Project");
  const client = String(work.client ?? "Client Project");
  const coverImage = String(work.image_url ?? "");
  const secondaryImage = String(work.hover_image_url ?? coverImage);

  const description = work.summary?.trim() ||
    "This project blends strategy, clean UI, and performance-focused implementation. The result is a polished digital experience designed to look premium and feel effortless across devices.";

  const projectUrl = work.project_url?.trim() ?? "";
  const contactEmail = reachus.email?.trim() || 'hello@talha.com';
  const galleryImages = Array.isArray(work.gallery_images)
    ? work.gallery_images.filter((img): img is string => typeof img === "string" && img.trim().length > 0)
    : [];

  const detailImages = [coverImage, secondaryImage, ...galleryImages].filter(
    (img): img is string => typeof img === "string" && img.trim().length > 0
  );

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <section className="border-b border-border/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back To Projects
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Project Detail</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-8 lg:grid-cols-12 lg:gap-14 lg:py-16">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-card border border-border/10">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={projectTitle}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] overflow-hidden bg-card border border-border/10">
              {detailImages[1] ? (
                <Image
                  src={detailImages[1]}
                  alt={`${projectTitle} secondary visual`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 28vw"
                />
              ) : null}
            </div>
            <div className="bg-card border border-border/10 p-6 md:p-8 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Category</p>
              <p className="text-xl font-medium text-foreground mb-6 tracking-tight">{client}</p>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Status</p>
              <p className="text-xl font-medium text-foreground tracking-tight">Completed</p>
            </div>
          </div>

          {detailImages.length > 2 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {detailImages.slice(2).map((img, idx) => (
                <div key={`${img}-${idx}`} className="relative aspect-[4/3] overflow-hidden bg-card border border-border/10">
                  <Image
                    src={img}
                    alt={`${projectTitle} gallery image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 28vw"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5 lg:pl-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">[ CASE STUDY ]</p>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-tighter text-foreground">{projectTitle}</h1>

          <p className="mt-10 text-[17px] leading-relaxed text-muted-foreground font-medium">{description}</p>

          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {projectUrl ? (
              <LiquidButton
                as="a"
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={14} />
                Live Project
              </LiquidButton>
            ) : (
              <LiquidButton
                as="a"
                href={`mailto:${contactEmail}?subject=Project Live Link Request: ${projectTitle}`}
              >
                <Mail size={14} />
                Request Link
              </LiquidButton>
            )}
            <Link href="/projects" className="inline-block">
              <LiquidButton
                variant="secondary"
                className="bg-foreground text-background border border-foreground hover:opacity-90 w-full"
              >
                All Projects
              </LiquidButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
