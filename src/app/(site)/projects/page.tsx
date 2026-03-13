import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Works from "@/components/Works";
import { getWorks, getWorksMeta } from "@/lib/queries";

export default async function ProjectsPage() {
  const [works, worksMeta] = await Promise.all([getWorks(), getWorksMeta()]);

  return (
    <div className="min-h-screen pt-32 md:pt-40">
      <section className="section-dark border-b border-border/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back To Home
          </Link>
          <h1 className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground">All Projects</h1>
        </div>
      </section>

      <Works
        data={works}
        sectionId="projects_list"
        label="[ EXPLORE ]"
        heading={worksMeta.archive_heading}
      />
    </div>
  );
}
