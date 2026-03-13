"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type SectionParallaxProps = {
  children: ReactNode;
  strength?: number;
  zIndex?: number;
  className?: string;
};

export function SectionParallax({
  children,
  strength = 100,
  zIndex,
  className,
}: SectionParallaxProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? [0, 0] : [-strength, strength]
  );

  return (
    <section
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={zIndex === undefined ? undefined : { zIndex }}
    >
      <motion.div style={{ y }} className="relative w-full motion-safe:will-change-transform">
        {children}
      </motion.div>
    </section>
  );
}
