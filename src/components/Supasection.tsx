"use client";

import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import React, { useRef } from "react";
import MediaRenderer from "@/components/ui/MediaRenderer";
import SvgFollowScroll from "./SvgFollowScroll";
import type { SupasectionSection } from "@/types/content";

export default function Supasection({ data }: { data?: SupasectionSection | null }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const label = data?.label?.trim() || "[ DESIGN & DEVELOPMENT ]";
  const heading = data?.heading?.trim() || "Designing. \nCoding. \nElevating Experience.";
  const description = data?.description?.trim() || "Merging technical precision with interactive motion design. Scroll down to witness a signature trail of digital craftsmanship.";
  const imageUrl = data?.image_url?.trim() || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600";

  // Track scroll of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth scroll progress using spring dynamics for a subtle, responsive lag feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65, // faster response
    damping: 35,
    restDelta: 0.001
  });

  // Fade out and scale down header text earlier as we scroll (using smoothProgress)
  const headerOpacity = useTransform(smoothProgress, [0.12, 0.30], [1, 0]);
  const headerScale = useTransform(smoothProgress, [0.12, 0.30], [1, 0.95]);

  // Image scaling from 0 to 1 after drawing completes (progress 0.55 to 0.90) (using smoothProgress)
  const imageScale = useTransform(smoothProgress, [0.55, 0.90], [0, 1], { clamp: true });

  return (
    <section
      ref={containerRef}
      className="relative mx-auto h-[280vh] md:h-[400vh] w-full bg-background text-foreground transition-colors duration-500"
    >
      {/* Sticky Viewport Wrapper - Pinned/Locked container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Background Stroke */}
        <SvgFollowScroll scrollYProgress={smoothProgress} />

        {/* Intro Block (Sticky & Fades out) */}
        <motion.div
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="absolute top-1/4 flex flex-col items-center justify-center gap-6 text-center z-10 pointer-events-none px-4"
        >
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground">
            {label}
          </span>
          <h2 className="font-sans text-5xl md:text-8xl font-medium tracking-tighter leading-none whitespace-pre-line">
            {heading}
          </h2>
          <p className="font-sans max-w-xl text-md md:text-lg text-muted-foreground/80 font-medium mt-4">
            {description}
          </p>
        </motion.div>

        {/* Full Viewport Image (Sticky & Scales from 0 to 1 after drawing completes) */}
        <motion.div
          style={{ scale: imageScale }}
          className="absolute inset-0 w-full h-full overflow-hidden z-20 origin-center"
        >
          <MediaRenderer
            src={imageUrl}
            alt="Abstract brand concept render"
            fill
            className="object-cover"
            videoClassName="absolute inset-0 h-full w-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            quality={90}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
