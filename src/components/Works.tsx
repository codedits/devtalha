"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { LiquidButton } from "./ui/LiquidButton";
import BlurText from "./BlurText";
import type { WorksItem } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT } from "@/lib/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type WorkCardData = {
  id: string;
  title: string;
  client: string;
  imageUrl: string;
  hoverImageUrl: string;
};

const WorkCard: React.FC<{ work: WorkCardData; index: number }> = ({ work, index }) => {
  const { allowHover } = useMotionPreferences();

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-end pb-12 md:pb-28 px-6 md:px-20 lg:px-24 group py-24 md:py-0 min-h-[60vh] md:min-h-0">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={work.imageUrl}
          alt={work.title}
          fill
          priority={index < 2}
          className="object-cover transition-transform duration-1000 ease-out scale-100 md:group-hover:scale-[1.02]"
          sizes="100vw"
          quality={90}
        />
        {/* Dark Vignette Overlay for Premium Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/60 z-[1]" />
      </div>

      {/* Floating Link details */}
      <Link
        href={`/projects/${work.id}`}
        className="relative z-10 block text-left group cursor-pointer max-w-4xl text-white"
        data-cursor="view"
        aria-label={`Open ${work.title} project details`}
      >
        <span className="text-white/60 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 block">
          {work.client}
        </span>
        <h3 className="text-white text-5xl md:text-7xl lg:text-[7rem] font-medium leading-[0.82] tracking-tighter mb-8 group-hover:text-white/80 transition-colors">
          {work.title}
        </h3>
        
        {/* Animated line on hover */}
        <div className="h-[1px] bg-white/30 w-16 group-hover:w-32 transition-all duration-500 ease-out" />
      </Link>
    </div>
  );
};

type WorksProps = {
  data?: WorksItem[] | null;
  featuredCount?: number;
  sectionId?: string;
  label?: string;
  heading?: string;
  showViewAll?: boolean;
};

export default function Works({
  data,
  featuredCount,
  sectionId = "work",
  label = "[ SELECTED PROJECTS ]",
  heading = "Works.",
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

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleWorks.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      // The horizontal scroll distance matches the full track width minus screen width
      const scrollAmount = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          pin: true,
          scrub: 1.4, // buttery scrub lag for smooth floating transitions
          invalidateOnRefresh: true,
        }
      });

      tl.to(track, {
        x: -scrollAmount,
        ease: "none",
      });

      // Synchronize scroll-progress indicator line
      tl.to(".scroll-progress-line", {
        scaleX: 1,
        ease: "none",
      }, 0);
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      mm.revert();
      clearTimeout(refreshTimer);
    };
  }, [visibleWorks]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-visible md:overflow-hidden bg-background" 
      id={sectionId}
    >
      {/* Viewport content block */}
      <div className="md:h-screen md:w-full md:flex md:flex-col md:justify-center md:overflow-hidden relative">
        
        {/* Horizontal Track Wrapper */}
        <div 
          ref={trackRef} 
          className="flex flex-col md:flex-row w-full md:w-max items-stretch relative"
        >
          {/* SLIDE 1: Pinned Section Intro */}
          <div className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex flex-col justify-center bg-background px-6 md:px-20 lg:px-24 py-16 md:py-12 select-none border-b border-foreground/5 md:border-none">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
              
              {/* Left Column: Giant Heading */}
              <div className="md:col-span-7 text-left">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={BASE_REVEAL}
                  className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground block mb-6"
                >
                  {label}
                </motion.span>
                <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-medium leading-[0.8] tracking-tighter mb-8 md:mb-12">
                  <BlurText
                    text={heading}
                    delay={80}
                    animateBy="letters"
                    direction="bottom"
                    className="inline-flex"
                  />
                </h2>
                
                <div className="flex items-center gap-4 text-muted-foreground/60 text-xs font-bold uppercase tracking-widest mt-6">
                  <span>SCROLL DOWN TO EXPLORE</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden md:inline-block"
                  >
                    →
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="md:hidden inline-block"
                  >
                    ↓
                  </motion.span>
                </div>
              </div>

              {/* Right Column: Editorial Paragraph & Metadata Grid */}
              <div className="md:col-span-5 flex flex-col justify-center text-left pt-6 md:pt-16 border-t border-foreground/10 md:border-none">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ ...BASE_REVEAL, delay: 0.2 }}
                  className="text-muted-foreground text-sm md:text-base leading-relaxed mb-10 max-w-md font-medium"
                >
                  A curated collection of digital experiences, custom software platforms, and creative campaigns built for high-growth brands. Every project is crafted with meticulous attention to motion design, code quality, and performance that scales.
                </motion.p>

                {/* Metadata Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ ...BASE_REVEAL, delay: 0.3 }}
                  className="grid grid-cols-2 gap-6 border-t border-foreground/10 pt-8"
                >
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase block mb-1">
                      Capabilities
                    </span>
                    <span className="text-xs font-semibold uppercase text-foreground">
                      Full-Stack / Motion
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase block mb-1">
                      Timeline
                    </span>
                    <span className="text-xs font-semibold uppercase text-foreground">
                      2024 - Present
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase block mb-1">
                      Standard
                    </span>
                    <span className="text-xs font-semibold uppercase text-foreground">
                      W3C / Premium
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-muted-foreground/50 uppercase block mb-1">
                      Location
                    </span>
                    <span className="text-xs font-semibold uppercase text-foreground">
                      Worldwide / Remote
                    </span>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>

          {/* SLIDES 2 to N-1: Immersive Project Cards */}
          {visibleWorks.map((work, index) => (
            <div 
              key={work.id} 
              className="w-full md:w-screen h-auto md:h-screen flex-shrink-0"
            >
              <WorkCard work={work} index={index} />
            </div>
          ))}

          {/* SLIDE N: End-of-Track CTA (returns to default theme contrast) */}
          {showViewAll && (
            <div className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex flex-col items-center justify-center bg-background border-t border-foreground/5 md:border-none py-20 md:py-8 px-6 text-center select-none">
              <div className="max-w-xl flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-6 block">
                  MORE CASE STUDIES
                </span>
                <h3 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-10 text-foreground">
                  Discover all my creative experiments
                </h3>
                <Link href="/projects" className="inline-block">
                  <LiquidButton
                    variant="secondary"
                    size="default"
                    rounded="full"
                  >
                    View Full Archive
                  </LiquidButton>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Floating Progress Bar Line (Desktop Overlay) */}
        <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 w-[240px] h-[2px] bg-foreground/10 overflow-hidden rounded-full z-20">
          <div className="scroll-progress-line absolute left-0 top-0 h-full w-full bg-foreground origin-left scale-x-0" />
        </div>

      </div>
    </section>
  );
}
