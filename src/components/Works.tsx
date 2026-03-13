"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { LiquidButton } from "./ui/LiquidButton";
import BlurText from "./BlurText";
import type { WorksItem } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

type WorkCardData = {
  id: string;
  title: string;
  client: string;
  imageUrl: string;
  hoverImageUrl: string;
};

const DEFAULT_WORKS = [
  {
    id: '1',
    title: 'Scarlet Design Studio',
    client: 'Fashion Brand',
    imageUrl: 'https://framerusercontent.com/images/rSYCc9NuZxZZzbjxPH3muXhXZvg.jpg',
    hoverImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Amber Studio',
    client: 'Creative Production',
    imageUrl: 'https://framerusercontent.com/images/vRcX31A0p0E7RIv4uPKIu2atBg.jpg',
    hoverImageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Keystone Studio',
    client: 'Architectural Firm',
    imageUrl: 'https://framerusercontent.com/images/f7oyi2aIDMI2iUNKjywMMhvxJw.jpg',
    hoverImageUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Visual Storytelling',
    client: 'Photography Studio',
    imageUrl: 'https://framerusercontent.com/images/0VcBF1ImnGMwpgj0OP6dMfTTM0.jpg',
    hoverImageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Lorian Dashboard',
    client: 'Web App',
    imageUrl: 'https://framerusercontent.com/images/mWAJSY1ma2RpRuDO7LuohAtnsI.jpg',
    hoverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Estate Collective',
    client: 'Real Estate',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
    hoverImageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop',
  },
];

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  })
};

const WorkCard: React.FC<{ work: WorkCardData; index: number }> = ({ work, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showHoverImage, setShowHoverImage] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;

  const motionCardProps = prefersReducedMotion || isMobile
    ? {}
    : {
        variants: cardVariants,
        initial: "hidden",
        animate: isInView ? "visible" : "hidden",
      };

  return (
    <motion.div
      ref={ref}
      custom={index}
      {...motionCardProps}
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
          transition={allowHover ? { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
        >
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            className="object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image
                src={work.hoverImageUrl}
                alt={`${work.title} Hover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            transition={allowHover ? { duration: 0.4, delay: 0.1 } : undefined}
          >
            {work.client}
          </motion.span>
          <motion.h3 
            className="text-white text-2xl md:text-3xl font-medium"
            initial={{ opacity: 1, y: 0 }}
            whileHover={allowHover ? { y: -5 } : undefined}
            transition={allowHover ? { duration: 0.4, delay: 0.15 } : undefined}
          >
            {work.title}
          </motion.h3>
          
          {/* Animated line on hover */}
          <motion.div
            className="h-[1px] bg-white/40 mt-4"
            initial={{ width: 0 }}
            whileHover={allowHover ? { width: "100px" } : undefined}
            transition={allowHover ? { duration: 0.5, delay: 0.2 } : undefined}
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
    : DEFAULT_WORKS;

  const visibleWorks = typeof featuredCount === "number" ? works.slice(0, featuredCount) : works;

  return (
    <section className="py-24 md:py-32 section-shell" id={sectionId}>
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        {/* Editorial Header */}
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
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
      <div className="w-full px-[2px] pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {visibleWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
