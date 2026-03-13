"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BlurText from "./BlurText";
import type { HeroSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Hero({ data }: { data?: HeroSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const heading = data?.heading ?? 'I build brands, campaigns, and digital experience';
  const desktopBgImage = data?.background_image_url ?? 'https://images.unsplash.com/photo-1582150816999-5c92a8c15401?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const mobileBgImage = data?.mobile_background_image_url?.trim() || desktopBgImage;
  const hasMobileImage = mobileBgImage !== desktopBgImage;
  const nameLabel = data?.name_label ?? 'TALHA IRFAN';
  const [isDesktopLoaded, setIsDesktopLoaded] = useState(false);
  const [isMobileLoaded, setIsMobileLoaded] = useState(false);
  const isLoaded = hasMobileImage ? (isDesktopLoaded || isMobileLoaded) : isDesktopLoaded;
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const desktopImageRef = useRef<HTMLImageElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Fallback if image is already cached.
    if (desktopImageRef.current?.complete) setIsDesktopLoaded(true);
    if (mobileImageRef.current?.complete) setIsMobileLoaded(true);
  }, [hasMobileImage]);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsAnimationFinished(true);
      }, 1500); // Slightly longer than 1.4s animation
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const containerRef = useRef<HTMLDivElement>(null);
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
    <section className="h-[85vh] md:h-screen w-full px-2 pt-2 relative z-10">
      <div ref={containerRef} className={`relative h-full w-full flex flex-col items-start justify-end rounded-[1.5rem] md:rounded-[2rem] overflow-hidden pb-10 md:pb-24 px-10 md:px-16 lg:px-20 border border-white/10 ${isLoaded ? 'is-visible' : ''}`}>
        {/* Animated Background with Parallax */}
        <motion.div
          className={`absolute inset-0 z-0 ${isLoaded ? 'animate-image-entrance' : 'opacity-0'}`}
          style={isAnimationFinished ? { scale: imageScale, opacity: imageOpacity } : {}}
        >
          <div className="absolute inset-0 h-full w-full bg-black">
            <div className={`absolute inset-0 ${hasMobileImage ? 'hidden md:block' : ''}`}>
              <Image
                ref={desktopImageRef}
                src={desktopBgImage}
                alt="Hero Background"
                fill
                priority
                fetchPriority="high"
                quality={85}
                className="object-cover"
                sizes="(max-width: 768px) 0px, calc(100vw - 1rem)"
                onLoad={() => setIsDesktopLoaded(true)}
              />
            </div>

            {hasMobileImage && (
              <div className="absolute inset-0 md:hidden">
                <Image
                  ref={mobileImageRef}
                  src={mobileBgImage}
                  alt="Hero Background"
                  fill
                  priority
                  fetchPriority="high"
                  quality={85}
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 1rem), 0px"
                  onLoad={() => setIsMobileLoaded(true)}
                />
              </div>
            )}
          </div>
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
          style={isAnimationFinished ? { y: textY } : {}}
        >
          <div className="flex flex-col items-start text-left">
            <span
              className="hero-subtext mb-4 text-[10px] font-bold tracking-[0.22em] uppercase text-white/80"
            >
              {nameLabel}
            </span>
            <div
              className="hero-text w-full"
            >
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[0.85] tracking-[-0.07em] text-white">
                {isLoaded ? (
                  <BlurText
                    text={heading}
                    delay={200}
                    animateBy="words"
                    direction="bottom"
                    className="inline-flex flex-wrap"
                  />
                ) : (
                  <span className="opacity-0">{heading}</span>
                )}
              </h1>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
