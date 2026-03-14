"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { LiquidButton } from "./ui/LiquidButton";
import BlurText from "./BlurText";
import type { WorksItem } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT } from "@/lib/motion";

type WorkCardData = {
  id: string;
  title: string;
  client: string;
  imageUrl: string;
  hoverImageUrl: string;
};

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: BASE_REVEAL.duration,
      ease: PREMIUM_EASE,
    }
  })
};

const WorkCard: React.FC<{ work: WorkCardData; index: number }> = ({ work, index }) => {
  const [showHoverImage, setShowHoverImage] = useState(false);
  const { allowHover } = useMotionPreferences();

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      <Link
        href={`/projects/${work.id}`}
        className="relative block group overflow-hidden bg-muted aspect-square md:aspect-auto md:h-[600px] cursor-pointer"
        aria-label={`Open ${work.title} project details`}
        onPointerEnter={() => allowHover && setShowHoverImage(true)}
        onPointerLeave={() => setShowHoverImage(false)}
        onFocus={() => allowHover && setShowHoverImage(true)}
        onBlur={() => setShowHoverImage(false)}
      >
        {/* Default Image with subtle zoom on scroll */}
        <motion.div
          className="absolute inset-0"
          whileHover={allowHover ? { scale: 1.02 } : undefined}
          transition={allowHover ? { duration: 0.5, ease: PREMIUM_EASE } : undefined}
        >
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            className={`object-cover transition-opacity duration-700 ease-in-out ${allowHover ? "group-hover:opacity-0" : ""}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
          />
        </motion.div>

        {/* Hover Image with enhanced animation */}
        <AnimatePresence>
          {showHoverImage && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1.05, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.45, ease: PREMIUM_EASE }}
            >
              <Image
                src={work.hoverImageUrl}
                alt={`${work.title} Hover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Overlay Content with staggered text animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-6 md:p-10 text-left z-10"
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.span
            className="text-white/90 font-bold tracking-[0.2em] text-[10px] uppercase mb-2"
            initial={{ opacity: 1, y: 0 }}
            whileHover={allowHover ? { y: -5 } : undefined}
            transition={allowHover ? { duration: 0.3, delay: 0.05, ease: PREMIUM_EASE } : undefined}
          >
            {work.client}
          </motion.span>
          <motion.h3
            className="text-white text-2xl md:text-3xl font-medium"
            initial={{ opacity: 1, y: 0 }}
            whileHover={allowHover ? { y: -5 } : undefined}
            transition={allowHover ? { duration: 0.3, delay: 0.1, ease: PREMIUM_EASE } : undefined}
          >
            {work.title}
          </motion.h3>

          {/* Animated line on hover */}
          <motion.div
            className="h-[1px] bg-white/40 mt-4"
            initial={{ width: 0 }}
            whileHover={allowHover ? { width: "100px" } : undefined}
            transition={allowHover ? { duration: 0.4, delay: 0.15, ease: PREMIUM_EASE } : undefined}
          />
        </motion.div>
      </Link>
    </motion.div>
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

  return (
    <section className="py-10 md:py-12 w-full" id={sectionId}>
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        {/* Editorial Header */}
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={BASE_REVEAL}
            className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground block mb-8"
          >
            {label}
          </motion.span>
          <h2 className="text-7xl md:text-8xl lg:text-[10rem] font-medium leading-[0.85] tracking-tighter">
            <BlurText
              text={heading}
              delay={100}
              animateBy="letters"
              direction="bottom"
              className="inline-flex"
            />
          </h2>

          {showViewAll && (
            <motion.div
              className="mt-8 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ ...BASE_REVEAL, delay: 0.25 }}
            >
              <Link href="/projects" className="inline-block">
                <LiquidButton
                  variant="secondary"
                  size="small"
                  rounded="full"
                >
                  View All Projects
                </LiquidButton>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Refined high-density grid with ultra-thin padding and gaps */}
      <div className="w-full px-[2px] pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {visibleWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} />
          ))}
        </div>
        {visibleWorks.length === 0 ? (
          <div className="px-6 md:px-8 pt-8 text-sm text-muted-foreground">No projects added yet.</div>
        ) : null}
      </div>
    </section>
  );
}
