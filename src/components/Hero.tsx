"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import BlurText from "./BlurText";
import type { HeroSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Hero({ data }: { data?: HeroSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const heading = data?.heading ?? 'I build brands, campaigns, and digital experience';
  const bgImage = data?.background_image_url ?? 'https://images.unsplash.com/photo-1582150816999-5c92a8c15401?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const nameLabel = data?.name_label ?? 'TALHA IRFAN';

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? [1, 1] : [1, 1.2]
  );
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    prefersReducedMotion || isMobile ? [1, 1] : [1, 0]
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? [0, 0] : [0, 100]
  );

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col items-start justify-end overflow-hidden pb-20 md:pb-24 px-10 md:px-16 lg:px-20">
      {/* Animated Background with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <Image
          src={bgImage}
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Animated gradient overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]"
        />
      </motion.div>

      {/* Text Content with Parallax */}
      <motion.div
        className="relative z-10 w-full max-w-xl md:max-w-2xl lg:max-w-3xl pointer-events-none"
        style={{ y: textY }}
      >
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="w-full"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[0.85] tracking-[-0.07em] text-white">
              <BlurText
                text={heading}
                delay={200}
                animateBy="words"
                direction="bottom"
                className="inline-flex flex-wrap"
              />
            </h1>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
