"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

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
  const { allowParallax } = useMotionPreferences();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    allowParallax ? [-strength, strength] : [0, 0]
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
