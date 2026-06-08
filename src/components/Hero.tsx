"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, useVelocity, useAnimationFrame } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import MediaRenderer from "@/components/ui/MediaRenderer";
import { isVideoUrl } from "@/lib/media";
import type { HeroSection } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export default function Hero({ data }: { data?: HeroSection | null }) {
  const { allowParallax, isMobile } = useMotionPreferences();
  const isVideoMode = data?.media_type === "video" && !!data?.media_url;
  const activeVideoUrl = isVideoMode ? data.media_url : null;
  const isVideo = isVideoMode ? isVideoUrl(data.media_url) : isVideoUrl(data?.background_image_url ?? "");
  const heading = data?.heading ?? 'I build brands, campaigns, and digital experience';
  const desktopBgImage = data?.background_image_url ?? 'https://images.unsplash.com/photo-1582150816999-5c92a8c15401?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const mobileBgImage = data?.mobile_background_image_url?.trim() || desktopBgImage;
  const hasMobileImage = !isVideo && mobileBgImage !== desktopBgImage;
  const nameLabel = data?.name_label ?? 'TALHA IRFAN';
  const [isDesktopLoaded, setIsDesktopLoaded] = useState(false);
  const [isMobileLoaded, setIsMobileLoaded] = useState(false);
  const isLoaded = isVideo ? isDesktopLoaded : (hasMobileImage ? (isDesktopLoaded || isMobileLoaded) : isDesktopLoaded);
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
    if (!isVideo && desktopImageRef.current?.complete) setIsDesktopLoaded(true);
    if (!isVideo && mobileImageRef.current?.complete) setIsMobileLoaded(true);

    // Safety fallback: if images/video load slowly or fail to load, force
    // animation to start after 2.5 seconds to avoid a blank screen.
    const timer = setTimeout(() => {
      setIsDesktopLoaded(true);
      setIsMobileLoaded(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasMobileImage, isVideo]);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 100,
    mass: 1.2
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const baseSpeed = -0.55; // Very slow and elegant at static

  useAnimationFrame((time, delta) => {
    if (!shouldAnimate) return;

    let moveBy = baseSpeed * (delta / 1000);

    // Speed up based on scroll velocity (scaled down on mobile to absorb native touch flick spikes)
    const velocityVal = Math.abs(velocityFactor.get());
    const velocityScale = isMobile ? 0.3 : 1.0;
    moveBy += moveBy * velocityVal * velocityScale;

    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

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
        className={`relative h-full w-full flex flex-col items-start justify-start pt-28 sm:pt-32 md:pt-24 rounded-none overflow-hidden px-10 md:px-16 lg:px-20 border-0 md:border border-white/10 ${shouldAnimate ? 'is-visible' : ''}`}
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
            {activeVideoUrl ? (
              <MediaRenderer
                src={activeVideoUrl}
                alt="Hero Background Video"
                fill
                priority
                fetchPriority="high"
                onLoad={() => setIsDesktopLoaded(true)}
                className="absolute inset-0 h-full w-full object-cover animate-none"
              />
            ) : (
              <>
                <div className={`absolute inset-0 ${hasMobileImage ? 'hidden md:block' : ''}`}>
                  <MediaRenderer
                    imageRef={desktopImageRef}
                    src={desktopBgImage}
                    alt="Hero Background"
                    fill
                    priority
                    fetchPriority="high"
                    quality={80}
                    className="object-cover animate-none"
                    sizes="(max-width: 768px) 100vw, calc(100vw - 1rem)"
                    onLoad={() => setIsDesktopLoaded(true)}
                  />
                </div>

                {hasMobileImage && (
                  <div className="absolute inset-0 md:hidden">
                    <MediaRenderer
                      imageRef={mobileImageRef}
                      src={mobileBgImage}
                      alt="Hero Background"
                      fill
                      priority
                      fetchPriority="high"
                      quality={80}
                      className="object-cover animate-none"
                      sizes="100vw"
                      onLoad={() => setIsMobileLoaded(true)}
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* Animated gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: (data?.overlay_opacity ?? 60) / 100 } : { opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1] pointer-events-none"
          />
        </motion.div>

        {/* Text Content with Parallax */}
        <motion.div
          className="relative z-10 w-full pointer-events-none"
          style={{ y: textY }}
        >
          <div className="flex flex-col items-start text-left w-full">
            {/* Sliding/Blurring Heading Reveal - Infinite Velocity Marquee */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="w-screen -mx-10 md:-mx-16 lg:-mx-20 overflow-hidden whitespace-nowrap relative z-10 my-2 md:my-4"
            >
              <motion.div
                style={{ x }}
                className="hero-marquee-wrapper flex flex-row w-max"
              >
                <div className="hero-marquee-track flex flex-row items-center whitespace-nowrap">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="text-6xl md:text-7xl lg:text-[7.5rem] font-medium tracking-tighter uppercase text-white flex items-center gap-6 whitespace-nowrap pr-8 md:pr-12"
                    >
                      {heading}
                      <span className="inline-block w-3 h-3 md:w-5 md:h-5 rounded-full bg-white/30" />
                    </span>
                  ))}
                </div>
                <div className="hero-marquee-track flex flex-row items-center whitespace-nowrap" aria-hidden="true">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="text-6xl md:text-7xl lg:text-[7.5rem] font-medium tracking-tighter uppercase text-white flex items-center gap-6 whitespace-nowrap pr-8 md:pr-12"
                    >
                      {heading}
                      <span className="inline-block w-3 h-3 md:w-5 md:h-5 rounded-full bg-white/30" />
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
