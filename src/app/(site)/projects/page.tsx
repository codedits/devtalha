import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getWorks, getWorksMeta } from "@/lib/queries";

type ProjectCardProps = {
  work: {
    id: string;
    title: string;
    client: string;
    imageUrl: string;
    hoverImageUrl: string;
  };
};

function ProjectGridCard({ work }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${work.id}`}
      className="group block w-full text-left cursor-pointer"
      data-cursor="view"
      aria-label={`Open ${work.title} project details`}
    >
      {/* Premium Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-card rounded-2xl border border-foreground/10 shadow-sm mb-6">
        <Image
          src={work.imageUrl}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={80}
        />
        {/* Soft Hover Tint overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Details Row */}
      <div className="flex justify-between items-baseline px-1">
        <div>
          <span className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase block mb-1">
            {work.client}
          </span>
          <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-muted-foreground transition-colors duration-300">
            {work.title}
          </h3>
        </div>
        <span className="text-[9px] font-bold font-mono tracking-widest text-muted-foreground/60 uppercase group-hover:text-foreground transition-colors duration-300">
          [ VIEW ]
        </span>
      </div>
    </Link>
  );
}

export default async function ProjectsPage() {
  const [works, worksMeta] = await Promise.all([getWorks(), getWorksMeta()]);

  const worksData = works.map((w) => ({
    id: w.id,
    title: w.title,
    client: w.client,
    imageUrl: w.image_url,
    hoverImageUrl: w.hover_image_url,
  }));

  const heading = worksMeta?.archive_heading || "Selected Works.";

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 font-sans selection:bg-foreground selection:text-background">
      
      {/* Top Header Navigation */}
      <header className="border-b border-foreground/10 pt-28 pb-6 mb-12">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={12} />
            Back To Home
          </Link>
          <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground/60 uppercase">
            Total Projects: {worksData.length}
          </span>
        </div>
      </header>

      {/* Title Block */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 mb-16">
        <span className="text-[10px] font-bold tracking-[0.25em] text-muted-foreground/80 block mb-4 uppercase">
          [ ARCHIVE ]
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.84] md:leading-[0.8] lg:leading-[0.76] text-foreground">
          {heading}
        </h1>
      </section>

      {/* Portfolio Grid Layout */}
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {worksData.map((work) => (
            <ProjectGridCard key={work.id} work={work} />
          ))}
        </div>

        {worksData.length === 0 && (
          <div className="text-center py-24 text-sm text-muted-foreground font-medium">
            No projects added yet.
          </div>
        )}
      </div>

    </div>
  );
}
