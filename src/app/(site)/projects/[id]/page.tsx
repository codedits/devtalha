import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailClient from "@/components/projects/ProjectDetailClient";

import { getWorkById, getWorks } from "@/lib/queries";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 604800;

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getWorkById(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Talha Irfan`,
    description: project.summary || `Project showcase for ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.summary || `Project showcase for ${project.title}`,
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getWorkById(id);

  if (!project) {
    notFound();
  }

  const works = await getWorks();
  const currentIndex = works.findIndex((w) => w.id === id);
  const nextProject = currentIndex !== -1 && works.length > 1
    ? works[(currentIndex + 1) % works.length]
    : null;

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}

