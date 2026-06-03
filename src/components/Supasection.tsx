"use client";

import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import React, { useRef } from "react";
import Image from "next/image";
import SvgFollowScroll from "./SvgFollowScroll";

export default function Supasection() {
  const containerRef = useRef<HTMLDivElement>(null);

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
  const headerOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);
  const headerScale = useTransform(smoothProgress, [0, 0.18], [1, 0.95]);

  // Image scaling from 0 to 1 after drawing completes (progress 0.45 to 0.85) (using smoothProgress)
  const imageScale = useTransform(smoothProgress, [0.45, 0.85], [0, 1], { clamp: true });

  return (
    <section
      ref={containerRef}
      className="relative mx-auto h-[350vh] w-full bg-background text-foreground transition-colors duration-500"
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
            [ DESIGN & DEVELOPMENT ]
          </span>
          <h2 className="font-sans text-5xl md:text-8xl font-medium tracking-tighter leading-none">
            Designing. <br /> Coding. <br />
            Elevating Experience.
          </h2>
          <p className="font-sans max-w-xl text-md md:text-lg text-muted-foreground/80 font-medium mt-4">
            Merging technical precision with interactive motion design. Scroll down to witness a signature trail of digital craftsmanship.
          </p>
        </motion.div>

        {/* Full Viewport Image (Sticky & Scales from 0 to 1 after drawing completes) */}
        <motion.div
          style={{ scale: imageScale }}
          className="absolute inset-0 w-full h-full overflow-hidden z-20 origin-center"
        >
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600"
            alt="Abstract brand concept render"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
