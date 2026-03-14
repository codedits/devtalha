"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

import { getWorkByIdUncached } from "@/lib/queries";
import { RollText } from "@/components/ui/RollText";
import { LiquidButton } from "@/components/ui/LiquidButton";
import BlurText from "@/components/BlurText";
import type { WorksItem } from "@/types/content";

export default function ProjectDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const [project, setProject] = useState<WorksItem | null>(null);
	const [loading, setLoading] = useState(true);

	// Parallax for main image
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"]
	});
	const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
	const yMove = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getWorkByIdUncached(id);
				if (data) {
					setProject(data);
				}
			} catch (err) {
				console.error("Error fetching project:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [id]);

	if (loading) {
		return (
			<main className="min-h-screen bg-background relative selection:bg-foreground selection:text-background overflow-x-hidden">
				{/* Navigation Skeleton */}
				<nav className="fixed top-24 left-0 w-full z-[100] px-4 md:px-12">
					<div className="mx-auto max-w-screen-2xl">
						<div className="w-16 h-4 bg-foreground/5 rounded animate-pulse" />
					</div>
				</nav>
				
				{/* Minimal Loading Indicator */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-6 h-6 border-2 border-foreground/5 border-t-foreground/20 rounded-full animate-spin" />
				</div>
				
				{/* Container ref hydration shell */}
				<section ref={containerRef} className="invisible" aria-hidden="true" />
			</main>
		);
	}

	if (!project) {
		notFound();
	}

	const gallery = Array.isArray(project.gallery_images) ? project.gallery_images : [];
	const imageSet = [project.image_url, ...gallery];

	return (
		<main className="min-h-screen bg-background selection:bg-foreground selection:text-background overflow-x-hidden">
			{/* Navigation Header */}
			<nav className="fixed top-24 left-0 w-full z-[100] pointer-events-none px-4 md:px-12">
				<div className="mx-auto max-w-screen-2xl">
					<Link
						href="/projects"
						className="pointer-events-auto group inline-flex items-center gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60 transition-all hover:text-foreground"
					>
						<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
						<RollText>Index</RollText>
					</Link>
				</div>
			</nav>

			{/* Editorial Hero Section */}
			<section className="relative pt-[120px] md:pt-[180px] pb-12 md:pb-24 px-4 md:px-12">
				<div className="mx-auto max-w-screen-2xl">
					<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-20">
						{/* Title & Metadata */}
						<div className="max-w-4xl">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
							>
								<div className="flex items-center gap-4 mb-6 md:mb-10">
									<span className="h-[1px] w-12 bg-foreground/10" />
									<span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">
										{project.client} // Project Case
									</span>
								</div>
								
								<BlurText 
									text={project.title}
									delay={50}
									animateBy="words"
									className="text-[clamp(3.5rem,10vw,7.5rem)] font-medium leading-[0.9] md:leading-[0.85] tracking-tight md:tracking-tighter text-foreground"
								/>
							</motion.div>
						</div>

						{/* Quick Stats Sidebar */}
						<div className="lg:w-1/3 xl:w-1/4 border-l border-foreground/10 pl-6 md:pl-10">
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 1, delay: 0.8 }}
								className="space-y-8"
							>
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-1">
										<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Client</h4>
										<p className="text-sm md:text-base text-foreground/90 font-medium">{project.client}</p>
									</div>
									<div className="space-y-1">
										<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Year</h4>
										<p className="text-sm md:text-base text-foreground/90 font-medium font-mono">{project.created_at ? new Date(project.created_at).getFullYear() : '—'}</p>
									</div>
								</div>
								{project.summary && (
									<div className="space-y-2">
										<h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Overview</h4>
										<p className="text-sm md:text-base leading-relaxed text-muted-foreground italic">
											{project.summary.split('.')[0]}.
										</p>
									</div>
								)}
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Feature Image with Parallax */}
			<section ref={containerRef} className="px-4 md:px-6 mb-16 md:mb-32">
				<motion.div
					className="mx-auto max-w-[1600px] relative aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-xl md:rounded-[2rem] bg-muted/20"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 2 }}
				>
					<motion.div
						style={{ scale, y: yMove }}
						className="absolute inset-0 will-change-transform"
					>
						<Image
							src={project.image_url}
							alt={project.title}
							fill
							priority
							quality={90}
							sizes="100vw"
							className="object-cover"
						/>
					</motion.div>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
				</motion.div>
			</section>

			{/* Content Deep Dive */}
			<section className="mx-auto max-w-screen-2xl px-4 md:px-12 py-8 md:py-16 mb-16 md:mb-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
					<div className="lg:col-span-7">
						<motion.h2
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-100px" }}
							transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
							className="text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.15] tracking-tight text-foreground"
						>
							{project.summary || 'A thoughtfully crafted digital experience.'}
						</motion.h2>
					</div>
					<div className="lg:col-span-5 flex flex-col justify-between">
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1, delay: 0.3 }}
						>
							<p className="text-base md:text-lg leading-relaxed text-muted-foreground/80 mb-8 md:mb-12">
								{project.summary}
							</p>
							{project.project_url && (
								<LiquidButton as="a" href={project.project_url} target="_blank" rounded="full" className="group w-full md:w-auto">
									Explore Live Site <ExternalLink size={14} className="ml-2 opacity-50 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
								</LiquidButton>
							)}
						</motion.div>
					</div>
				</div>
			</section>

			{/* Dynamic Gallery */}
			<section className="px-4 md:px-12 mb-16 md:mb-32">
				<div className="mx-auto max-w-[1600px]">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
						{imageSet.slice(1).map((img, idx) => {
							// Dynamic grid sizing pattern
							const isLong = idx % 5 === 0;
							const isPortrait = idx % 5 === 1 || idx % 5 === 2;
							
							let colSpan = "lg:col-span-4";
							if (isLong) colSpan = "lg:col-span-8 md:col-span-2";
							if (isPortrait) colSpan = "lg:col-span-6 md:col-span-1";

							const aspect = isLong ? "aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/8]" : "aspect-[4/5] md:aspect-square lg:aspect-[4/5]";

							return (
								<motion.div
									key={idx}
									className={`${colSpan} ${aspect} relative bg-muted/50 rounded-2xl md:rounded-[2rem] overflow-hidden group border border-foreground/5 shadow-2xl shadow-black/5`}
									initial={{ opacity: 0, y: 40 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{ duration: 1, delay: (idx % 3) * 0.15, ease: [0.22, 1, 0.36, 1] }}
								>
									<Image
										src={img}
										alt={`Project detail ${idx + 1}`}
										fill
										className="object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
										sizes="(max-width: 1024px) 100vw, 50vw"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

		</main>
	);
}

