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
import { 
  motion, 
  useScroll, 
  useTransform, 
  AnimatePresence, 
  useInView, 
  useMotionValue, 
  useSpring 
} from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";

import BlurText from "@/components/BlurText";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RollText } from "@/components/ui/RollText";
import type { WorksItem } from "@/types/content";

type ProjectDetailClientProps = {
  project: WorksItem;
  nextProject: WorksItem | null;
};

// Premium Animated Counter Component using Framer Motion
function AnimatedCounter({ 
  value, 
  suffix = "" 
}: { 
  value: number; 
  suffix?: string; 
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 45, damping: 25 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
  }, [springValue]);

  return (
    <span ref={ref} className="font-mono">
      {display}
      {suffix}
    </span>
  );
}

// Alternating Parallax Gallery Item
function GalleryItem({ 
  img, 
  index, 
  onClick 
}: { 
  img: string; 
  index: number; 
  onClick: () => void; 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const isEven = index % 2 === 0;
  const yOffset = useTransform(scrollYProgress, [0, 1], isEven ? [-50, 50] : [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y: yOffset }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl cursor-pointer group aspect-[16/10] w-full ${isEven ? "md:translate-y-12" : ""}`}
    >
      <motion.div style={{ scale: imageScale }} className="absolute inset-0 w-full h-full">
        <Image
          src={img}
          alt={`Showcase detail ${index}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-90 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
        />
      </motion.div>
      
      {/* Absolute Tint Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />

      {/* Floating Hover Indicator */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <motion.div 
          initial={{ scale: 0.85 }}
          whileHover={{ scale: 1 }}
          className="bg-white text-black text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-full flex items-center gap-2 shadow-lg"
        >
          <Maximize2 size={12} />
          <span>Expand Detail</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLElement>(null);
  
  // Parallax Scroll calculations for Hero Image
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "28%"]);
  const heroImageScale = useTransform(heroScroll, [0, 1], [1, 1.18]);
  const heroImageOpacity = useTransform(heroScroll, [0, 0.8], [1, 0.15]);
  const heroTextY = useTransform(heroScroll, [0, 1], [0, 120]);

  // Next Project Portal Scroll-driven mask scaling
  const { scrollYProgress: nextScrollProgress } = useScroll({
    target: nextSectionRef,
    offset: ["start end", "end end"]
  });

  const portalScale = useTransform(nextScrollProgress, [0.1, 0.95], [0.55, 1.25]);
  const portalRadius = useTransform(nextScrollProgress, [0.1, 0.9], ["9999px", "0px"]);
  const portalOpacity = useTransform(nextScrollProgress, [0, 0.2], [0, 1]);
  const titleScale = useTransform(nextScrollProgress, [0.1, 0.9], [0.8, 1.12]);
  const titleY = useTransform(nextScrollProgress, [0.1, 0.95], [80, 0]);
  
  // Scroll progress for floating nav progress bar
  const { scrollYProgress: pageScrollProgress } = useScroll();

  // Floating states
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

  // Deterministic metrics generation based on project title
  const metrics = useMemo(() => {
    const seed = project.title.charCodeAt(0) + (project.client?.charCodeAt(0) || 0);
    return [
      { 
        value: 92 + (seed % 8), 
        suffix: "/100", 
        label: "Performance",
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
        label: "Interactive Speed",
        icon: Layers,
        desc: "Reduction in code bundle size & latency."
      },
    ];
  }, [project]);

  // Tech stack definition
  const techStack = [
    { name: "Next.js", color: "bg-white/10 dark:bg-white/5 border-neutral-300 dark:border-neutral-800" },
    { name: "Framer Motion", color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400" },
    { name: "Tailwind CSS", color: "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400" },
    { name: "TypeScript", color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400" },
    { name: "Supabase DB", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
    { name: "PostgreSQL", color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400" }
  ];

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const dbScope = Array.isArray(project.scope) ? project.scope : [];
  const scopeItems = dbScope.length > 0 ? dbScope.map((item: any) => ({
    title: item.title,
    desc: item.description,
  })) : [
    {
      title: "Interactive Experience Design",
      desc: "Designed the interactive flow from visual mockups to live animations. Built responsive layout structures and custom parallax engines that work seamlessly across high-refresh screens and mobile touch displays."
    },
    {
      title: "Data Architecture & API Hooks",
      desc: "Optimized queries utilizing Next.js caching layers and Supabase client structures. Seeding dynamic data pipelines allowed for sub-millisecond page rendering and fast incremental static regeneration."
    },
    {
      title: "Performance & Code Profiling",
      desc: "Removed layout shifts and streamlined script executions. Bundles were optimized down by 45% using code splitting, dynamic imports, and lazy loading strategies to hit 100% Core Web Vital compliance."
    }
  ];

  // Force scroll to top on navigation/project ID change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.id]);

  return (
    <main ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-x-hidden relative font-sans">
      
      {/* Ambient background gradients */}
      <div className="absolute top-0 left-0 w-full h-[150vh] -z-20 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rose-600/5 blur-[120px]" />
      </div>

      {/* Floating Sticky Nav Pill */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 z-[100] w-[90%] max-w-xl bg-card/80 backdrop-blur-xl border border-border/50 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between"
          >
            <Link
              href="/projects"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={12} />
              <span>Index</span>
            </Link>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] max-w-[160px] truncate text-foreground font-sans text-center">
              {project.title}
            </span>

            {project.project_url ? (
              <a
                href={project.project_url.startsWith('http') ? project.project_url : `https://${project.project_url}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground border border-foreground/15 hover:border-foreground rounded-full px-3 py-1 transition-all bg-foreground/[0.03]"
              >
                <span>Live</span>
                <ExternalLink size={8} />
              </a>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/45">
                Project Detail
              </span>
            )}

            {/* Scroll progress bar attached to nav bar */}
            <motion.div 
              style={{ scaleX: pageScrollProgress }}
              className="absolute bottom-0 left-6 right-6 h-[2px] bg-foreground/80 origin-left"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Index Link */}
      <nav className="absolute top-10 left-0 w-full z-50 pointer-events-none px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/projects"
            className="pointer-events-auto group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <RollText>Back to selection</RollText>
          </Link>
        </div>
      </nav>

      {/* 1. IMMERSIVE HERO SECTION */}
      <section ref={heroRef} className="relative min-h-screen lg:h-screen w-full flex flex-col justify-end items-start lg:overflow-hidden px-6 md:px-12 pb-16 md:pb-24 pt-24 lg:pt-0">
        {/* Parallax Background Cover Image */}
        <motion.div 
          style={{ y: heroImageY, scale: heroImageScale, opacity: heroImageOpacity }}
          className="absolute inset-0 z-0 w-full h-full will-change-transform"
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
          {/* Dark gradient overlay to make white text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]" />
        </motion.div>

        {/* Text and Metadata Panel */}
        <motion.div 
          style={{ y: heroTextY }}
          className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8 md:gap-12"
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
                [ PROJECT // {project.client} ]
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.84] md:leading-[0.8] lg:leading-[0.74] text-white max-w-5xl">
              <BlurText
                text={project.title}
                delay={30}
                animateBy="words"
                className="font-bold inline-block"
              />
            </h1>
          </div>

          {/* Translucent Glassmorphic Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 w-full mt-4">
            <div className="space-y-1">
              <h4 className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">Client</h4>
              <p className="text-sm text-white font-medium truncate">{project.client}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">Year</h4>
              <p className="text-sm text-white font-mono font-medium">
                {project.created_at ? new Date(project.created_at).getFullYear() : "2026"}
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">Capabilities</h4>
              <p className="text-sm text-white font-medium">Design & Dev</p>
            </div>

            <div className="space-y-1 flex flex-col justify-center">
              {project.project_url ? (
                <a
                  href={project.project_url.startsWith('http') ? project.project_url : `https://${project.project_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-block"
                >
                  <LiquidButton size="small" className="w-full flex items-center justify-center gap-1.5" rounded="full">
                    <span>Launch Site</span>
                    <ExternalLink size={12} />
                  </LiquidButton>
                </a>
              ) : (
                <span className="text-xs font-semibold text-white/40 text-center uppercase tracking-widest">
                  Project Showcase
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Animated scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 pointer-events-none animate-bounce">
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-white">Scroll</span>
          <div className="w-4 h-6 border border-white/50 rounded-full flex justify-center p-1">
            <span className="w-1 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </section>

      {/* 2. THE BRIEF / CHALLENGE SECTION */}
      <section className="relative py-24 md:py-36 px-6 max-w-7xl mx-auto border-b border-border/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          {/* Sticky vertical label */}
          <div className="md:col-span-4 md:sticky md:top-28 self-start">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-muted-foreground block">
              [ 01 // THE CHALLENGE ]
            </span>
          </div>

          {/* Description narrative */}
          <div className="md:col-span-8 space-y-8">
            {(() => {
              const summaryText = project.summary || "Co-creating a design-first digital ecosystem that establishes a new benchmark for speed, clarity, and interactive narrative.";
              const firstLetter = summaryText.trim().charAt(0);
              const remainingText = summaryText.trim().slice(1);
              return (
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="text-2xl md:text-3xl font-medium tracking-tight leading-relaxed text-foreground"
                >
                  <span className="float-left text-5xl md:text-7xl font-bold font-mono mr-4 mt-1 leading-[0.75] text-indigo-500">
                    {firstLetter}
                  </span>
                  {remainingText}
                </motion.h2>
              );
            })()}
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-3xl"
            >
              We deep-dived into the workflows of the {project.client} brand, engineering custom layouts designed to maximize performance and highlight content. Our mission centered on building an expressive interface that acts as an asset for client conversion and brand narrative expansion.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID STATS & TECH STACK */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto border-b border-border/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics Panel */}
          <div className="bg-card/25 backdrop-blur-md border border-border/30 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[350px] relative overflow-hidden group hover:border-foreground/15 transition-all duration-500">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.03] rounded-full blur-[110px] pointer-events-none group-hover:bg-indigo-500/[0.05] transition-all duration-700" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                [ IMPACT ANALYSIS ]
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">System Performance Benchmarks</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/20">
              {metrics.map((m, idx) => (
                <div key={m.label} className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">{m.label}</span>
                  <div className="text-xl sm:text-3xl font-bold tracking-tight text-foreground flex items-baseline">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal hidden sm:block">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Engine / Tech Stack Card */}
          <div className="bg-card/25 backdrop-blur-md border border-border/30 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[350px] relative overflow-hidden group hover:border-foreground/15 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                [ PRODUCTION ENGINE ]
              </span>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Technologies</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-8">
              {techStack.map((tech) => (
                <motion.div
                  key={tech.name}
                  whileHover={{ y: -2 }}
                  className={`px-3.5 py-1.5 text-[10px] font-medium tracking-wide rounded-full border shadow-sm flex items-center gap-1.5 cursor-default ${tech.color}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCOPE OF WORK TIMELINE */}
      <section className="py-20 md:py-28 px-6 max-w-7xl mx-auto border-b border-border/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-muted-foreground block">
              [ 02 // PROJECT SCOPE ]
            </span>
          </div>

          <div className="md:col-span-8 space-y-4">
            {scopeItems.map((item, idx) => {
              const isOpen = activeAccordion === idx;
              
              // Resolve icon dynamically based on title keywords or index
              let Icon = Layers;
              const titleLower = (item.title ?? "").toLowerCase();
              if (titleLower.includes("design") || titleLower.includes("experience") || titleLower.includes("ui") || titleLower.includes("ux")) {
                Icon = Monitor;
              } else if (titleLower.includes("data") || titleLower.includes("database") || titleLower.includes("backend") || titleLower.includes("api") || titleLower.includes("hook")) {
                Icon = Database;
              } else if (titleLower.includes("performance") || titleLower.includes("code") || titleLower.includes("profiling") || titleLower.includes("speed") || titleLower.includes("optimization")) {
                Icon = Cpu;
              } else if (idx === 0) {
                Icon = Monitor;
              } else if (idx === 1) {
                Icon = Database;
              } else if (idx === 2) {
                Icon = Cpu;
              }

              return (
                <div
                  key={idx}
                  className={`border border-border/20 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "bg-card/30 border-foreground/10" : "bg-transparent hover:border-border/60"}`}
                >
                  <button
                    onClick={() => setActiveAccordion(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl border ${isOpen ? "bg-foreground/5 border-foreground/10" : "border-transparent"}`}>
                        <Icon size={18} className="text-foreground/80" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs leading-relaxed text-muted-foreground px-6 pb-6 pt-1 max-w-2xl">
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
      </section>

      {/* 5. PARALLAX EXHBIT GALLERY */}
      {imageSet.length > 1 && (
        <section className="py-24 md:py-36 px-6 max-w-7xl mx-auto border-b border-border/30">
          <div className="mb-16 text-center md:text-left">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-muted-foreground block mb-3">
              [ 03 // PROJECT EXHIBIT ]
            </span>
            <h3 className="text-2xl md:text-4xl font-semibold tracking-tight">Gallery Showcase</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pb-12">
            {imageSet.slice(1).map((img, idx) => (
              <GalleryItem 
                key={idx} 
                img={img} 
                index={idx} 
                onClick={() => setActiveImageIndex(idx + 1)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. NEXT PROJECT EXPANDING PORTAL TRANSITION */}
      {nextProject && (
        <section 
          ref={nextSectionRef}
          className="relative min-h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-background select-none"
        >
          {/* Scroll Zoom Circular Mask Portal */}
          <motion.div 
            style={{ 
              scale: portalScale, 
              borderRadius: portalRadius,
              opacity: portalOpacity
            }}
            className="absolute inset-0 z-0 w-full h-full overflow-hidden origin-center shadow-2xl"
          >
            {/* The Background next project cover image */}
            <Image
              src={nextProject.image_url}
              alt={nextProject.title}
              fill
              quality={90}
              className="object-cover"
            />
            {/* Dark mask overlay */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] transition-all" />
          </motion.div>

          {/* Centered Typography Elements */}
          <div className="relative z-10 text-center max-w-3xl px-6 pointer-events-none flex flex-col items-center gap-6">
            <motion.span 
              style={{ y: titleY }}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 block"
            >
              UP NEXT // PORTAL TRANSITION
            </motion.span>

            <motion.h2
              style={{ scale: titleScale, y: titleY }}
              className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white leading-none"
            >
              {nextProject.title}
            </motion.h2>

            <motion.div 
              style={{ y: titleY }}
              className="text-[10px] uppercase font-bold tracking-[0.25em] text-white/50"
            >
              Client: {nextProject.client}
            </motion.div>

            {/* Click to enter project link */}
            <motion.div
              style={{ y: titleY }}
              className="mt-6 pointer-events-auto"
            >
              <Link href={`/projects/${nextProject.id}`}>
                <LiquidButton size="default" className="flex items-center gap-2" rounded="full">
                  <span>View Project</span>
                  <ChevronRight size={14} />
                </LiquidButton>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Floating Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-card border border-border text-foreground flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 7. PREMIUM LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4"
          >
            {/* Close Overlay Click Area */}
            <div className="absolute inset-0" onClick={() => setActiveImageIndex(null)} />

            {/* Lightbox Header Bar */}
            <div className="absolute top-6 left-0 w-full px-6 md:px-12 flex items-center justify-between z-10 pointer-events-none">
              <span className="text-white/50 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                <span>Showcase Exhibit {activeImageIndex + 1} / {imageSet.length}</span>
                {zoomLevel > 1 && (
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Drag to pan detail
                  </span>
                )}
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                  title="Close Exhibit"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Draggable Stage */}
            <div className="relative max-w-5xl w-full h-[75vh] flex items-center justify-center overflow-hidden">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                style={{ scale: zoomLevel }}
                drag={zoomLevel > 1}
                dragConstraints={{ 
                  left: -400 * (zoomLevel - 1), 
                  right: 400 * (zoomLevel - 1), 
                  top: -250 * (zoomLevel - 1), 
                  bottom: 250 * (zoomLevel - 1) 
                }}
                dragElastic={0.15}
                className="relative w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing max-h-[85%] md:max-h-[90%] flex items-center justify-center"
              >
                <Image
                  src={imageSet[activeImageIndex]}
                  alt="Exhibit view"
                  fill
                  quality={90}
                  priority
                  className="object-contain select-none pointer-events-none"
                />
              </motion.div>
            </div>

            {/* Image Selector / Bottom Navigation */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + imageSet.length) % imageSet.length : null))}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-2xl cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % imageSet.length : null))}
                className="w-11 h-11 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-colors shadow-2xl cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}