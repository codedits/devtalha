"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BlurText from "./BlurText";
import type { HeroSection } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

export default function Hero({ data }: { data?: HeroSection | null }) {
  const { allowParallax, isMobile } = useMotionPreferences();
  const heading = data?.heading ?? 'I build brands, campaigns, and digital experience';
  const desktopBgImage = data?.background_image_url ?? 'https://images.unsplash.com/photo-1582150816999-5c92a8c15401?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const mobileBgImage = data?.mobile_background_image_url?.trim() || desktopBgImage;
  const hasMobileImage = mobileBgImage !== desktopBgImage;
  const nameLabel = data?.name_label ?? 'TALHA IRFAN';
  const [isDesktopLoaded, setIsDesktopLoaded] = useState(false);
  const [isMobileLoaded, setIsMobileLoaded] = useState(false);
  const isLoaded = hasMobileImage ? (isDesktopLoaded || isMobileLoaded) : isDesktopLoaded;
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const shouldAnimate = isLoaded && preloaderFinished;
  const desktopImageRef = useRef<HTMLImageElement>(null);
  const mobileImageRef = useRef<HTMLImageElement>(null);

  // Mouse Coordinates for Interactive Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to filter raw mouse movements
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 200 });

  // Map mouse coordinates to tiny pixel shifts (-20px to 20px)
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  useEffect(() => {
    // If preloader is already visited, bypass waiting
    const hasVisited = sessionStorage.getItem("portfolio-visited") === "true";
    if (hasVisited) {
      setPreloaderFinished(true);
      return;
    }

    const handleComplete = () => {
      setPreloaderFinished(true);
    };

    window.addEventListener("preloader-complete", handleComplete);
    return () => {
      window.removeEventListener("preloader-complete", handleComplete);
    };
  }, []);

  useEffect(() => {
    // Fallback if image is already cached.
    if (desktopImageRef.current?.complete) setIsDesktopLoaded(true);
    if (mobileImageRef.current?.complete) setIsMobileLoaded(true);
  }, [hasMobileImage]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize coordinates around screen center (-0.5 to 0.5)
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax scroll transitions for image and text (reduced intensity on mobile)
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    allowParallax ? (isMobile ? [1, 1.06] : [1, 1.16]) : [1, 1]
  );
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    allowParallax ? (isMobile ? [1, 0.3] : [1, 0.08]) : [1, 1]
  );
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    allowParallax ? (isMobile ? [0, 30] : [0, 72]) : [0, 0]
  );

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-screen w-full px-0 pt-0 md:px-2 md:pt-2 relative z-10"
    >
      <div
        ref={containerRef}
        className={`relative h-full w-full flex flex-col items-start justify-center md:justify-end rounded-none overflow-hidden pb-0 md:pb-24 px-10 md:px-16 lg:px-20 border-0 md:border border-white/10 ${shouldAnimate ? 'is-visible' : ''}`}
      >
        {/* Animated Background Container (Handles Zoom-in and Fade-in Reveal) */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden bg-black"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Inner Parallax Image Wrapper (Handles Mouse & Scroll Moves) */}
          <motion.div
            className="absolute -inset-[30px] z-0"
            style={{
              scale: imageScale,
              opacity: imageOpacity,
              x: imageX,
              y: imageY,
            }}
          >
            <div className={`absolute inset-0 ${hasMobileImage ? 'hidden md:block' : ''}`}>
              <Image
                ref={desktopImageRef}
                src={desktopBgImage}
                alt="Hero Background"
                fill
                priority
                fetchPriority="high"
                quality={80}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, calc(100vw - 1rem)"
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
                  quality={80}
                  className="object-cover"
                  sizes="100vw"
                  onLoad={() => setIsMobileLoaded(true)}
                />
              </div>
            )}
          </motion.div>

          {/* Animated gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1] pointer-events-none"
          />
        </motion.div>

        {/* Text Content with Parallax */}
        <motion.div
          className="relative z-10 w-full max-w-xl md:max-w-2xl lg:max-w-3xl pointer-events-none"
          style={{ y: textY }}
        >
          <div className="flex flex-col items-start text-left">
            {/* Sliding Subtext Reveal */}
            <div className="overflow-hidden mb-4">
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={shouldAnimate ? { y: 0, opacity: 0.8 } : { y: "100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1], delay: 0.35 }}
                className="block text-[10px] font-bold tracking-[0.22em] uppercase text-white"
              >
                {nameLabel}
              </motion.span>
            </div>

            {/* Sliding/Blurring Heading Reveal */}
            <div className="hero-text w-full">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[0.82] md:leading-[0.78] lg:leading-[0.74] tracking-[-0.07em] text-white">
                <div className={shouldAnimate ? "opacity-100" : "opacity-0 pointer-events-none"} style={{ transition: "opacity 0.3s ease" }}>
                  {shouldAnimate && (
                    <BlurText
                      text={heading}
                      delay={200}
                      animateBy="words"
                      direction="bottom"
                      className="inline-flex flex-wrap"
                    />
                  )}
                </div>
              </h1>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
