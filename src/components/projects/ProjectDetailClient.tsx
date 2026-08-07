"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  ExternalLink, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  ChevronDown,
  ArrowUp,
  ThumbsUp,
  Share2,
  Eye,
  CheckCircle2
} from "lucide-react";
import { 
  motion, 
  AnimatePresence 
} from "framer-motion";

import MediaRenderer from "@/components/ui/MediaRenderer";
import type { WorksItem } from "@/types/content";

type ProjectDetailClientProps = {
  project: WorksItem;
  nextProject: WorksItem | null;
};

export default function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Appreciation / Like counter state
  const [likesCount, setLikesCount] = useState(384);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleLikeToggle = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Scroll states for floating back-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset scroll on project change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.id]);

  // Gallery Setup
  const rawGallery = Array.isArray(project.gallery_images)
    ? project.gallery_images.filter((img): img is string => Boolean(img && img.trim()))
    : [];
  const imageSet = [project.image_url, ...rawGallery].filter((img): img is string => Boolean(img && img.trim()));

  // Dynamic Scope
  const scopeItems = Array.isArray(project.scope) ? project.scope.filter((item) => Boolean(item && item.title)) : [];
  const [activeAccordion, setActiveAccordion] = useState<number | null>(scopeItems.length > 0 ? 0 : null);

  // Lightbox Modal State
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

  useEffect(() => {
    setZoomLevel(1);
  }, [activeImageIndex]);

  const projectYear = project.created_at ? new Date(project.created_at).getFullYear() : null;

  return (
    <main ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-blue-600 selection:text-white relative font-sans pb-24">
      
      {/* 1. PROJECT TITLE & CREATOR HEADER (Padded under global Navbar) */}
      <section className="pt-28 sm:pt-32 md:pt-36 pb-10 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">

          {/* Top Breadcrumb & Live Link Bar */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Selection</span>
            </Link>

            {project.project_url && (
              <a
                href={project.project_url.startsWith('http') ? project.project_url : `https://${project.project_url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-all shadow-md"
              >
                <span>Visit Site</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          
          {/* Tags & Client Badge */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {project.client && (
              <span className="px-3.5 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-mono font-bold tracking-widest uppercase">
                {project.client}
              </span>
            )}
            <span className="px-3.5 py-1 rounded-full border border-border/40 text-muted-foreground text-xs font-mono font-medium tracking-wider uppercase">
              UI/UX & Web Development
            </span>
            {projectYear && (
              <span className="text-xs font-mono text-muted-foreground">
                • {projectYear}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
            {project.title}
          </h1>

          {/* Author & Appreciation Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/20">
            {/* Creator Profile */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-neutral-800 relative border border-white/20">
                <Image
                  src="/assets/contact-portrait.png"
                  alt="Talha Irfan"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-foreground">Talha Irfan</h4>
                  <CheckCircle2 size={13} className="text-blue-500 fill-blue-500/20" />
                </div>
                <p className="text-xs text-muted-foreground">Full-Stack & Interactive Motion Designer</p>
              </div>
            </div>

            {/* View / Like Metrics */}
            <div className="flex items-center gap-5 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye size={15} />
                <span>1.8k Views</span>
              </div>

              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                  hasLiked 
                    ? "bg-blue-600 border-blue-600 text-white font-bold" 
                    : "border-border/40 hover:border-foreground/30 text-foreground"
                }`}
              >
                <ThumbsUp size={14} className={hasLiked ? "fill-white" : ""} />
                <span>{likesCount}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PROJECT OVERVIEW & BRIEF (If summary exists) */}
      {project.summary && project.summary.trim() && (
        <section className="py-8 px-4 md:px-8 max-w-5xl mx-auto mb-8">
          <div className="bg-card/40 border border-border/30 rounded-xl p-6 sm:p-10">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-blue-500 uppercase block mb-3">
              PROJECT OVERVIEW
            </span>
            <p className="text-base sm:text-xl md:text-2xl font-medium tracking-tight leading-relaxed text-foreground">
              {project.summary}
            </p>
          </div>
        </section>
      )}

      {/* 3. FULL-WIDTH VERTICAL SHOWCASE CANVAS */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16 my-8">
        {imageSet.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx === 0 ? 0 : 0.1 }}
            onClick={() => setActiveImageIndex(idx)}
            className="relative w-full overflow-hidden rounded-lg md:rounded-xl border border-border/30 shadow-2xl bg-card group cursor-pointer"
          >
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9]">
              <MediaRenderer
                src={img}
                alt={`${project.title} showcase slide ${idx + 1}`}
                fill
                priority={idx === 0}
                quality={90}
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                videoClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />
            </div>

            {/* Hover Expand Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
                <Maximize2 size={13} />
                <span>Inspect Visual</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 4. SCOPE & SERVICES (If items exist) */}
      {scopeItems.length > 0 && (
        <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto my-12 border-t border-b border-border/20">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            
            <div className="md:w-1/3 shrink-0">
              <span className="text-xs font-mono font-bold tracking-[0.25em] text-blue-500 uppercase block mb-2">
                PROJECT DELIVERABLES
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Scope of Work
              </h3>
            </div>

            <div className="md:w-2/3 space-y-3.5 w-full">
              {scopeItems.map((item, idx) => {
                const isOpen = activeAccordion === idx;
                return (
                  <div
                    key={idx}
                    className={`border border-border/30 rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? "bg-card/60 border-foreground/20" : "bg-transparent hover:border-border/60"}`}
                  >
                    <button
                      onClick={() => setActiveAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer gap-4"
                    >
                      <span className="text-sm md:text-base font-semibold text-foreground">{item.title}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-muted-foreground"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs md:text-sm leading-relaxed text-muted-foreground px-4 md:px-5 pb-5 pt-1">
                            {item.description}
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
      )}

      {/* 5. APPRECIATION CALL-TO-ACTION & AUTHOR CARD */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-card/40 border border-border/30 rounded-xl p-8 sm:p-12 flex flex-col items-center gap-6 shadow-xl">
          
          {/* Big Like Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLikeToggle}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all shadow-2xl cursor-pointer ${
              hasLiked ? "bg-blue-600 text-white ring-4 ring-blue-500/30" : "bg-foreground text-background hover:bg-foreground/90"
            }`}
          >
            <ThumbsUp size={24} className={hasLiked ? "fill-white" : ""} />
            <span className="text-[10px] font-mono font-bold">{likesCount}</span>
          </motion.button>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {hasLiked ? "Thank you for the appreciation!" : "Liked this project?"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Give it an appreciation or share it with your network.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/40 hover:border-foreground/30 text-xs font-semibold text-foreground transition-all cursor-pointer bg-background"
            >
              <Share2 size={14} />
              <span>{copiedLink ? "Link Copied!" : "Share Project"}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. NEXT PROJECT BANNER */}
      {nextProject && (
        <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
          <Link
            href={`/projects/${nextProject.id}`}
            className="group relative w-full overflow-hidden rounded-xl border border-border/30 bg-card p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-foreground/20 block"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-blue-500 uppercase">
                NEXT PROJECT
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground group-hover:text-blue-500 transition-colors">
                {nextProject.title}
              </h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Client: {nextProject.client}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full border border-border/40 flex items-center justify-center text-foreground group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronRight size={20} />
            </div>
          </Link>
        </section>
      )}

      {/* 7. FLOATING ACTION TOOLBAR (Sticky at Bottom Center) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card/90 backdrop-blur-xl border border-border/40 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
            hasLiked 
              ? "bg-blue-600 text-white" 
              : "bg-foreground/5 hover:bg-foreground/10 text-foreground"
          }`}
        >
          <ThumbsUp size={14} className={hasLiked ? "fill-white" : ""} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
        >
          <Share2 size={13} />
          <span className="hidden sm:inline">{copiedLink ? "Copied" : "Share"}</span>
        </button>

        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-full bg-foreground/10 text-foreground flex items-center justify-center hover:bg-foreground/20 transition-colors cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp size={14} />
          </button>
        )}
      </div>

      {/* 8. LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4"
          >
            {/* Close Overlay */}
            <div className="absolute inset-0" onClick={() => setActiveImageIndex(null)} />

            {/* Header controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
              <span className="text-white/60 font-mono text-xs">
                Exhibit {activeImageIndex + 1} / {imageSet.length}
              </span>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="relative max-w-5xl w-full h-[75vh] flex items-center justify-center overflow-hidden pointer-events-none">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ scale: zoomLevel }}
                drag={zoomLevel > 1}
                className="relative w-full h-full pointer-events-auto flex items-center justify-center"
              >
                <MediaRenderer
                  src={imageSet[activeImageIndex]}
                  alt="Gallery exhibit detail"
                  fill
                  quality={90}
                  sizes="90vw"
                  priority
                  className="object-contain select-none"
                  videoClassName="w-full h-full max-h-[75vh] object-contain"
                  controls={true}
                  muted={true}
                  loop={true}
                  autoPlay={true}
                />
              </motion.div>
            </div>

            {/* Prev / Next controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-auto">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + imageSet.length) % imageSet.length : null))}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % imageSet.length : null))}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
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