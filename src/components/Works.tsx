"use client";

import Link from "next/link";
import MediaRenderer from "@/components/ui/MediaRenderer";
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { LiquidButton } from "./ui/LiquidButton";
import BlurText from "./BlurText";
import type { WorksItem } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT } from "@/lib/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SvgFollowScroll from "./SvgFollowScroll";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  return (
    <Link
      href={`/projects/${work.id}`}
      className="w-full h-full group cursor-pointer relative"
      data-cursor="view"
      aria-label={`Open ${work.title} project details`}
    >
      {/* Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-muted">
        <MediaRenderer
          src={work.imageUrl}
          alt={work.title}
          fill
          priority={index < 2}
          className="object-cover transition-transform duration-1000 ease-out scale-100 group-hover:scale-[1.03]"
          videoClassName="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out scale-100 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={85}
        />
        {/* Soft overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Info Panel Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end text-left z-10">
        {/* Details */}
        <div className="space-y-1 md:space-y-3">
          <span className="text-white/70 font-mono text-[9px] sm:text-xs font-bold uppercase tracking-[0.2em] block">
            {work.client}
          </span>
          <h3 className="text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-tight group-hover:text-white/85 transition-colors duration-300">
            {work.title}
          </h3>
        </div>

        {/* Bottom CTA Arrow */}
        <div className="flex justify-between items-center mt-3 md:mt-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 group-hover:text-white transition-colors">
            View Project
          </span>
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider font-mono">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
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

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (visibleWorks.length === 0) return;

    const mm = gsap.matchMedia(containerRef);

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        }
      });

      // Complete the horizontal translation and progress bar at 90% scroll progress, leaving 10% scroll delay
      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        duration: 0.9,
      }, 0);

      tl.to(".scroll-progress-line", {
        scaleX: 1,
        ease: "none",
        duration: 0.9,
      }, 0);

      // Extend timeline duration to 1.0 to create the pause at the end
      tl.set({}, {}, 1.0);
    });

    ScrollTrigger.refresh();
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
      className="relative w-full bg-background h-auto md:h-[var(--desktop-height)]"
      style={{
        "--desktop-height": visibleWorks.length === 0 ? "auto" : `${(visibleWorks.length + 1.3 + (showViewAll ? 1 : 0)) * 100}vh`
      } as React.CSSProperties}
      id={sectionId}
    >
      {/* Viewport content block - Pinned sticky container */}
      <div className="relative w-full h-auto md:sticky md:top-0 md:h-screen md:overflow-hidden">

        {/* Horizontal Track Wrapper */}
        <div
          ref={trackRef}
          className="flex flex-col md:flex-row w-full md:w-max items-stretch relative md:will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {/* SLIDE 1: Section Intro */}
          <div className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex flex-col justify-center bg-background px-6 md:px-20 lg:px-24 py-16 md:py-12 select-none">
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-16 items-center">

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
                <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-medium leading-[0.78] md:leading-[0.74] lg:leading-[0.7] tracking-tighter mb-4 md:mb-12">
                  <BlurText
                    text={heading}
                    delay={80}
                    animateBy="letters"
                    direction="bottom"
                    className="inline-flex"
                  />
                </h2>

                <div className="flex items-center gap-4 text-muted-foreground/60 text-xs font-bold uppercase tracking-widest mt-2 md:mt-6">
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

              {/* Right Column: Paragraph & Metadata Grid */}
              <div className="md:col-span-5 flex flex-col justify-center text-left pt-4 md:pt-16 border-t border-foreground/10 md:border-none">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ ...BASE_REVEAL, delay: 0.2 }}
                  className="text-muted-foreground text-xs md:text-base leading-relaxed mb-4 md:mb-10 max-w-md font-medium"
                >
                  A curated collection of digital experiences, custom software platforms, and creative campaigns built for high-growth brands. Every project is crafted with meticulous attention to motion design, code quality, and performance that scales.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={{ ...BASE_REVEAL, delay: 0.3 }}
                  className="hidden md:grid grid-cols-2 gap-6 border-t border-foreground/10 pt-8"
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

          {/* SLIDES 2 to N-1: Project Cards */}
          {visibleWorks.map((work, index) => (
            <div
              key={work.id}
              className="w-full md:w-screen h-auto md:h-screen md:flex-shrink-0 flex items-center justify-center py-6 md:py-0 px-4 md:px-0"
            >
              <div className="w-full max-w-[540px] md:w-[70vw] lg:w-[60vw] h-[280px] sm:h-[340px] md:h-[60vh] md:min-h-[420px] md:max-h-[500px] relative rounded-3xl overflow-hidden flex-shrink-0 bg-card border border-border shadow-2xl flex flex-col">
                <WorkCard work={work} index={index} />
              </div>
            </div>
          ))}

          {/* SLIDE N: End-of-Track CTA */}
          {showViewAll && (
            <div className="w-full md:w-screen h-auto md:h-screen flex-shrink-0 flex flex-col items-center justify-center bg-background py-16 md:py-8 px-6 text-center select-none">
              <div className="max-w-xl flex flex-col items-center">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-6 block">
                  MORE PROJECTS
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

        {/* Floating Progress Bar Line */}
        <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 w-[240px] h-[2px] bg-foreground/10 overflow-hidden rounded-full z-20">
          <div className="scroll-progress-line absolute left-0 top-0 h-full w-full bg-foreground origin-left scale-x-0" />
        </div>

      </div>
    </section>
  );
}