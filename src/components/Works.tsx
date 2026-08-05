"use client";

import Link from "next/link";
import MediaRenderer from "@/components/ui/MediaRenderer";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LiquidButton } from "./ui/LiquidButton";
import BlurText from "./BlurText";
import type { WorksItem } from "@/types/content";
import { BASE_REVEAL, REVEAL_VIEWPORT } from "@/lib/motion";

type WorkCardData = {
  id: string;
  title: string;
  client: string;
  imageUrl: string;
  hoverImageUrl: string;
};

type WorksProps = {
  data?: WorksItem[] | null;
  featuredCount?: number;
  sectionId?: string;
  label?: string;
  heading?: string;
  showViewAll?: boolean;
};

// Desktop Widescreen Stacked Card
function StackedCard({
  work,
  index,
  total,
}: {
  work: WorkCardData;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Self-contained scroll tracking for each card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"]
  });

  // Scale down and dim smoothly as scroll advances past this card
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const filter = useTransform(scrollYProgress, [0, 1], ["brightness(1)", "brightness(0.55)"]);

  // Staggered top offset so behind cards stay visible at top of stack
  const topOffset = 70 + index * 32;

  return (
    <div
      ref={cardRef}
      className="sticky h-screen flex items-start justify-center pointer-events-none w-full"
      style={{ top: `${topOffset}px` }}
    >
      <motion.div
        style={{
          scale,
          filter,
        }}
        className="w-full max-w-5xl md:max-w-[1080px] lg:max-w-[1180px] h-[72vh] md:h-[75vh] rounded-xl md:rounded-2xl overflow-hidden bg-neutral-950 border border-white/20 dark:border-white/15 relative pointer-events-auto group cursor-pointer origin-top shadow-2xl"
      >
        <Link
          href={`/projects/${work.id}`}
          className="w-full h-full relative flex flex-col justify-between p-6 sm:p-10 md:p-14"
          data-cursor="view"
          aria-label={`Open ${work.title} project details`}
        >
          {/* Media Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-muted">
            <MediaRenderer
              src={work.imageUrl}
              alt={work.title}
              fill
              priority={index < 2}
              className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.02]"
              videoClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.02]"
              sizes="100vw"
              quality={90}
            />
            {/* Subtle Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
          </div>

          {/* Minimal Top Bar */}
          <div className="relative z-10 flex items-center justify-between pointer-events-none">
            <span className="text-white/70 font-mono text-[10px] sm:text-xs font-medium tracking-widest uppercase">
              0{index + 1} / 0{total}
            </span>

            {work.client && (
              <span className="text-white/70 font-mono text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase">
                {work.client}
              </span>
            )}
          </div>

          {/* Minimal Bottom Info Section */}
          <div className="relative z-10 flex items-end justify-between gap-4">
            <h3 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight group-hover:text-white/90 transition-colors">
              {work.title}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors hidden sm:inline-block">
                View Project
              </span>
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <span className="text-sm font-mono group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

// Mobile Responsive Card (Fast horizontal swipe, no scroll lock)
function MobileProjectCard({
  work,
  index,
  total,
}: {
  work: WorkCardData;
  index: number;
  total: number;
}) {
  return (
    <div className="snap-center w-[85vw] sm:w-[380px] shrink-0 h-[440px] rounded-xl overflow-hidden bg-neutral-950 border border-white/20 relative flex flex-col justify-between p-6 group cursor-pointer shadow-lg">
      <Link
        href={`/projects/${work.id}`}
        className="w-full h-full relative flex flex-col justify-between"
        aria-label={`Open ${work.title} project details`}
      >
        {/* Media Background */}
        <div className="absolute -m-6 inset-0 w-[calc(100%+3rem)] h-[calc(100%+3rem)] overflow-hidden bg-muted">
          <MediaRenderer
            src={work.imageUrl}
            alt={work.title}
            fill
            sizes="85vw"
            quality={85}
            className="object-cover"
            videoClassName="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />
        </div>

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-white/80 font-mono text-[10px] font-medium tracking-widest uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            0{index + 1} / 0{total}
          </span>
          {work.client && (
            <span className="text-white/80 font-mono text-[10px] font-medium tracking-widest uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 truncate max-w-[140px]">
              {work.client}
            </span>
          )}
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div>
            <span className="text-white/60 font-mono text-[9px] font-bold uppercase tracking-widest block mb-1">
              PROJECT
            </span>
            <h3 className="text-white text-2xl font-bold tracking-tight leading-tight">
              {work.title}
            </h3>
          </div>

          <div className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <span className="text-xs font-mono font-bold">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Works({
  data,
  featuredCount,
  sectionId = "work",
  label = "[ SELECTED PROJECTS ]",
  heading = "Projects.",
  showViewAll = false,
}: WorksProps) {
  const works: WorkCardData[] = data && data.length > 0
    ? data.map((w) => ({
      id: w.id,
      title: w.title,
      client: w.client,
      imageUrl: w.image_url,
      hoverImageUrl: w.hover_image_url,
    }))
    : [];

  const visibleWorks = typeof featuredCount === "number" ? works.slice(0, featuredCount) : works;
  const sectionRef = useRef<HTMLDivElement>(null);

  if (visibleWorks.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-background select-none py-14 md:py-28"
      id={sectionId}
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-20">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={REVEAL_VIEWPORT}
              transition={BASE_REVEAL}
              className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-3"
            >
              {label}
            </motion.span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tighter leading-none">
              <BlurText
                text={heading}
                delay={60}
                animateBy="letters"
                direction="bottom"
                className="inline-flex"
              />
            </h2>
          </div>

          {/* Desktop Scroll Indicator */}
          <div className="hidden md:flex items-center gap-3 text-muted-foreground/70 text-xs font-mono font-bold uppercase tracking-widest">
            <span>SCROLL TO UNSTACK</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex md:hidden items-center gap-2 text-muted-foreground/80 text-[10px] font-mono font-bold uppercase tracking-widest">
            <span>SWIPE TO EXPLORE</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* MOBILE LAYOUT (md:hidden): Clean Horizontal Touch Swipe Carousel */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 -mx-4 px-4 pb-4">
          {visibleWorks.map((work, index) => (
            <MobileProjectCard
              key={work.id}
              work={work}
              index={index}
              total={visibleWorks.length}
            />
          ))}
        </div>

        {/* DESKTOP LAYOUT (hidden md:flex): Sticky Widescreen Stacking Cards */}
        <div className="hidden md:flex relative w-full max-w-5xl md:max-w-[1080px] lg:max-w-[1180px] mx-auto flex-col items-center">
          {visibleWorks.map((work, index) => (
            <StackedCard
              key={work.id}
              work={work}
              index={index}
              total={visibleWorks.length}
            />
          ))}
        </div>

        {/* Bottom CTA / View Full Archive */}
        {showViewAll && (
          <div className="mt-16 md:mt-36 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-4 block">
              MORE EXPERIMENTS
            </span>
            <h3 className="text-xl md:text-4xl font-medium tracking-tight mb-8 text-foreground">
              Discover the complete project archive
            </h3>
            <Link href="/projects">
              <LiquidButton variant="secondary" size="default" rounded="full">
                View Full Archive →
              </LiquidButton>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}