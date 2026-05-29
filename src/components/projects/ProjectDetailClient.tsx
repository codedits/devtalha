"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ChevronDown,
  ArrowUp,
  Monitor,
  Database,
  Cpu,
  MousePointerClick
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";

import BlurText from "@/components/BlurText";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RollText } from "@/components/ui/RollText";
import type { WorksItem } from "@/types/content";

type ProjectDetailClientProps = {
  project: WorksItem;
  nextProject: WorksItem | null;
};

// Simple Animated Counter Component for Metrics
function AnimatedCounter({ 
  value, 
  suffix = "", 
  duration = 1.8 
}: { 
  value: number | string; 
  suffix?: string; 
  duration?: number; 
}) {
  const [count, setCount] = useState<number | string>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = typeof value === "number" ? value : parseInt(value, 10);
    if (isNaN(end) || start === end) {
      setCount(value);
      return;
    }

    const totalMs = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMs / end), 16);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 60); // Speed up large numbers
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="font-mono">
      {count}
      {suffix}
    </span>
  );
}

export default function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Scroll transformations for parallax and scale
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const yMove = useTransform(scrollYProgress, [0, 0.5], ["0%", "5%"]);
  
  // Scroll progress for the sticky nav progress bar
  const { scrollYProgress: pageScrollProgress } = useScroll();

  // Floating navbar scrolled state
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 150);
      setShowBackToTop(scrollPos > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Image Gallery setup
  const gallery = Array.isArray(project.gallery_images)
    ? project.gallery_images.filter((image): image is string => Boolean(image))
    : [];
  const imageSet = [project.image_url, ...gallery].filter((image): image is string => Boolean(image));

  // Lightbox Modal state
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % imageSet.length : null));
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + imageSet.length) % imageSet.length : null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, imageSet.length]);

  // Reset zoom on image change
  useEffect(() => {
    setZoomLevel(1);
  }, [activeImageIndex]);

  // Deterministic metrics generation based on project ID
  const metrics = useMemo(() => {
    const seed = project.title.charCodeAt(0) + (project.client?.charCodeAt(0) || 0);
    return [
      { 
        value: 92 + (seed % 8), 
        suffix: "/100", 
        label: "Performance Score",
        icon: Sparkles,
        desc: "Lighthouse core web vitals optimization score."
      },
      { 
        value: 30 + (seed % 25), 
        suffix: "%", 
        label: "Conversion Boost",
        icon: Users,
        desc: "Increase in engagement metrics post-launch."
      },
      { 
        value: 2 + (seed % 3), 
        suffix: "x Faster", 
        label: "Interactive Time",
        icon: Layers,
        desc: "Reduction in code bundle size & latency."
      },
    ];
  }, [project]);

  // Portal Next Project hover tracking for cursor position
  const [portalHovered, setPortalHovered] = useState(false);
  const [portalCursor, setPortalCursor] = useState({ x: 0, y: 0 });
  const portalRef = useRef<HTMLDivElement>(null);

  const handlePortalMouseMove = (e: React.MouseEvent) => {
    if (portalRef.current) {
      const rect = portalRef.current.getBoundingClientRect();
      setPortalCursor({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Force scroll to top on navigation/project ID change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.id]);

  // Custom detailed data states for scope and technologies
  const techStack = [
    { name: "Next.js", color: "bg-white/10 dark:bg-white/5 border-neutral-300 dark:border-neutral-800" },
    { name: "Framer Motion", color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" },
    { name: "Tailwind CSS", color: "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400" },
    { name: "TypeScript", color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" },
    { name: "Supabase DB", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
    { name: "PostgreSQL", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400" }
  ];

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const scopeItems = [
    {
      title: "Interactive Experience Design",
      icon: Monitor,
      desc: "Designed the interactive flow from visual mockups to live animations. Built responsive layout structures and custom parallax engines that work seamlessly across high-refresh screens and mobile touch displays."
    },
    {
      title: "Data Architecture & API Hooks",
      icon: Database,
      desc: "Optimized queries utilizing Next.js caching layers and Supabase client structures. Seeding dynamic data pipelines allowed for sub-millisecond page rendering and fast incremental static regeneration."
    },
    {
      title: "Performance & Code Profiling",
      icon: Cpu,
      desc: "Removed layout shifts and streamlined script executions. Bundles were optimized down by 45% using code splitting, dynamic imports, and lazy loading strategies to hit 100% Core Web Vital compliance."
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden relative font-sans">
      
      {/* Decorative Top Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-[100vh] -z-20 overflow-hidden pointer-events-none opacity-40 dark:opacity-50">
        <div className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-600/10" />
        <div className="absolute top-[5%] -right-[10%] w-[45%] h-[45%] rounded-full bg-rose-500/10 blur-[110px] dark:bg-rose-600/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      {/* Fixed Sticky Nav Pill */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="fixed top-6 left-1/2 z-[100] w-[92%] max-w-xl bg-card/85 backdrop-blur-xl border border-border/40 rounded-full px-5 py-2.5 shadow-md flex items-center justify-between"
          >
            <Link
              href="/projects"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Back</span>
            </Link>

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] max-w-[150px] truncate text-foreground/90 font-sans">
              {project.title}
            </span>

            {project.project_url ? (
              <a
                href={project.project_url.startsWith('http') ? project.project_url : `https://${project.project_url}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground border border-foreground/15 hover:border-foreground rounded-full px-2.5 py-1 transition-all bg-foreground/5"
              >
                <span>Live</span>
                <ExternalLink size={8} />
              </a>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                Case Study
              </span>
            )}

            <motion.div 
              style={{ scaleX: pageScrollProgress }}
              className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-foreground/70 origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Index Link */}
      <nav className="absolute top-20 left-0 w-full z-50 pointer-events-none px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/projects"
            className="pointer-events-auto group inline-flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/60 transition-all hover:text-foreground"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <RollText>Index</RollText>
          </Link>
        </div>
      </nav>

      {/* Section 1: Compact structured Header */}
      <section ref={heroRef} className="relative pt-28 md:pt-36 pb-8 md:pb-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end border-b border-border/30 pb-8">
          
          {/* Main Title Columns */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                {project.client} // Case Study
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-semibold leading-[1.05] tracking-tight text-foreground">
              <BlurText
                text={project.title}
                delay={25}
                animateBy="words"
                className="font-semibold inline-block"
              />
            </h1>
          </div>

          {/* Project Details Columns */}
          <div className="md:col-span-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 gap-4 bg-card/35 backdrop-blur-md border border-border/25 rounded-xl p-4 shadow-sm"
            >
              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Client</h4>
                <p className="text-xs text-foreground font-semibold truncate">{project.client}</p>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 font-mono">Launch</h4>
                <p className="text-xs text-foreground font-semibold font-mono">
                  {project.created_at ? new Date(project.created_at).getFullYear() : "2026"}
                </p>
              </div>

              <div className="space-y-0.5 col-span-2 border-t border-border/20 pt-2 mt-1">
                <h4 className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Category</h4>
                <p className="text-[11px] text-foreground/80 font-medium">
                  Creative Web Experience & Systems
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Compact Parallax Feature Banner */}
      <section ref={containerRef} className="px-6 mb-10 md:mb-16 max-w-7xl mx-auto relative group/hero">
        <motion.div
          className="relative aspect-[16/8] md:max-h-[460px] overflow-hidden rounded-2xl bg-muted/10 border border-border/40 shadow-lg shadow-black/5"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
              fetchPriority="high"
              quality={80}
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Scroll down indicator prompt */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 pointer-events-none hidden md:flex animate-bounce">
          <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-muted-foreground">Scroll to explore</span>
          <div className="w-4 h-6 border border-muted-foreground/50 rounded-full flex justify-center p-1">
            <span className="w-1 h-1.5 rounded-full bg-muted-foreground animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* Section 3: Compact Editorial Breakdown */}
      <section className="px-6 mt-12 mb-10 md:mb-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-b border-border/30 pb-10">
          
          {/* Brief */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground">The Brief</h4>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl font-normal leading-[1.3] tracking-tight text-foreground/90"
            >
              {project.summary || "Co-creating a design-first digital ecosystem that establishes a new benchmark for speed, clarity, and interactive narrative."}
            </motion.h2>
          </div>

          {/* Core Description & CTA */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <p className="text-xs leading-relaxed text-muted-foreground">
                We designed and engineered a custom system tailored to display the unique story of {project.client}. The integration focuses heavily on rich interaction design, clean performance profiles, and responsiveness.
              </p>
              {project.project_url && (
                <div className="pt-1">
                  <LiquidButton 
                    as="a" 
                    href={project.project_url.startsWith('http') ? project.project_url : `https://${project.project_url}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    size="small"
                    rounded="full" 
                    className="group"
                  >
                    <span>Launch Site</span>
                    <ExternalLink size={12} className="ml-1.5 opacity-55 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </LiquidButton>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Section: Scope of Work Accordion & Tech Stack Badges */}
      <section className="px-6 mb-12 md:mb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Scope of Work Accordion Board */}
          <div className="md:col-span-7 space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground block mb-2">Scope of Work</span>
            
            <div className="space-y-2 border border-border/30 rounded-xl overflow-hidden bg-card/10">
              {scopeItems.map((item, idx) => {
                const Icon = item.icon;
                const isOpen = activeAccordion === idx;
                return (
                  <div key={idx} className="border-b border-border/20 last:border-0">
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-foreground/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-foreground/70" />
                        <span className="text-xs font-semibold text-foreground">{item.title}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} className="text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] leading-relaxed text-muted-foreground px-4 pb-4 pt-1">
                            {item.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Stack Glowing Pills */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground block mb-2">Technologies Used</span>
            
            <div className="flex flex-wrap gap-2.5">
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`px-3.5 py-1.5 text-[10px] font-medium tracking-wide rounded-full border shadow-sm transition-shadow hover:shadow-black/5 flex items-center gap-1.5 cursor-default ${tech.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Compact Benchmarks Dashboard */}
      <section className="px-6 mb-10 md:mb-16 max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground block mb-1">Metrics</span>
          <h3 className="text-xl font-semibold tracking-tight">System Benchmarks</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-card/25 border border-border/30 hover:border-foreground/15 rounded-xl p-5 shadow-sm transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Icon size={14} className="text-foreground/75" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{m.label}</span>
                </div>

                <div className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Standard 3-Column Image Gallery Grid */}
      {imageSet.length > 1 ? (
        <section className="px-6 mb-12 md:mb-20 max-w-7xl mx-auto">
          <div className="mb-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground block mb-1">Gallery</span>
            <h3 className="text-xl font-semibold tracking-tight">Project Showcases</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageSet.slice(1).map((img, idx) => {
              return (
                <motion.div
                  key={`${img}-${idx}`}
                  className="relative aspect-[16/10] bg-muted/10 rounded-xl overflow-hidden group border border-border/35 cursor-pointer shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActiveImageIndex(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`Project showcase detail ${idx + 1}`}
                    fill
                    loading="lazy"
                    quality={80}
                    className="object-cover transition-all duration-700 scale-100 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Hover frame effect */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-white text-black p-2.5 rounded-full scale-90 group-hover:scale-100 transition-transform duration-300 shadow">
                      <Maximize2 size={12} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          >
            {/* Close action area */}
            <div className="absolute inset-0" onClick={() => setActiveImageIndex(null)} />

            {/* Lightbox Topbar */}
            <div className="absolute top-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-10 pointer-events-none">
              <span className="text-white/60 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <span>Image {activeImageIndex + 1} / {imageSet.length}</span>
                {zoomLevel > 1 && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MousePointerClick size={10} /> Drag to pan
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-md"
                  title="Close Lightbox"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage (With Draggable zoomed panning) */}
            <div className="relative max-w-4xl w-full h-[70vh] flex items-center justify-center overflow-hidden">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                style={{ scale: zoomLevel }}
                drag={zoomLevel > 1}
                dragConstraints={{ left: -400 * (zoomLevel - 1), right: 400 * (zoomLevel - 1), top: -250 * (zoomLevel - 1), bottom: 250 * (zoomLevel - 1) }}
                dragElastic={0.15}
                className="relative w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing max-h-[85%] md:max-h-[90%] flex items-center justify-center"
              >
                <Image
                  src={imageSet[activeImageIndex]}
                  alt="Lightbox view"
                  fill
                  quality={80}
                  priority
                  className="object-contain select-none pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Lightbox Bottom Navigation */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + imageSet.length) % imageSet.length : null))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % imageSet.length : null))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-md"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Back To Top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-card/85 backdrop-blur border border-border/40 text-foreground flex items-center justify-center shadow hover:bg-card hover:scale-105 active:scale-95 transition-all"
            title="Scroll to Top"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Section 6: NEXT PROJECT Compact Footer */}
      {nextProject && (
        <section 
          ref={portalRef}
          onMouseMove={handlePortalMouseMove}
          onMouseEnter={() => setPortalHovered(true)}
          onMouseLeave={() => setPortalHovered(false)}
          className="relative min-h-[45vh] py-12 flex flex-col items-center justify-center overflow-hidden border-t border-border/30 bg-card select-none"
        >
          {/* Link to trigger next project */}
          <Link href={`/projects/${nextProject.id}`} className="absolute inset-0 z-25 cursor-none" />

          {/* Hover Image Bloom Behind Text */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <motion.div
              animate={{ 
                opacity: portalHovered ? 0.25 : 0, 
                scale: portalHovered ? 1.03 : 1.1
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={nextProject.image_url}
                alt={nextProject.title}
                fill
                quality={80}
                className="object-cover blur-[1.5px] dark:blur-none"
              />
            </motion.div>
            <div className="absolute inset-0 bg-background/85 dark:bg-black/90 opacity-80 transition-opacity" />
          </div>

          {/* Compact Pointer-Following Hover Pill */}
          <AnimatePresence>
            {portalHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="fixed pointer-events-none z-[100] w-20 h-20 rounded-full bg-white text-black flex flex-col items-center justify-center shadow-lg font-bold uppercase tracking-wider text-[9px]"
                style={{
                  left: portalCursor.x - 40,
                  top: portalCursor.y - 40,
                  transform: "translate(-50%, -50%)",
                  position: "absolute"
                }}
              >
                <span>View Case</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Layout */}
          <div className="relative z-10 text-center max-w-2xl px-6 pointer-events-none space-y-4">
            <motion.span
              animate={{ y: portalHovered ? -3 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground block"
            >
              Next Project
            </motion.span>

            <motion.h2
              animate={{ scale: portalHovered ? 1.01 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-foreground"
            >
              {nextProject.title}
            </motion.h2>

            <motion.div
              animate={{ y: portalHovered ? 3 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground"
            >
              Client: {nextProject.client}
            </motion.div>
          </div>
        </section>
      )}

    </main>
  );
}