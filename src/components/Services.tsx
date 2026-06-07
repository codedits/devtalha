"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { LiquidButton } from "./ui/LiquidButton";
import BlockRevealText from "./BlockRevealText";
import type { ServicesItem, ServicesMetaSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT } from "@/lib/motion";
import { RollText } from "./ui/RollText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

export default function Services({ data, meta }: { data?: ServicesItem[] | null; meta?: ServicesMetaSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const label = meta?.label?.trim() || '[ OUR SERVICES ]';
  const profileImageUrl =
    meta?.profile_image_url?.trim() ||
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800';
  const introText =
    meta?.intro_text?.trim() ||
    'We define the foundation of your brand voice, visuals, and values shaped into a system built for long-term clarity.';
  const ctaText = meta?.cta_text?.trim() || 'Start a project';
  const ctaUrl = meta?.cta_url?.trim() || '#contact';

  const servicesList: Service[] = data && data.length > 0
    ? data.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      tags: s.tags ?? [],
      images: s.images ?? [],
    }))
    : [];

  const [openService, setOpenService] = useState<string>(servicesList[0]?.id ?? '');
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, REVEAL_VIEWPORT);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : isMobile ? ["4%", "-4%"] : ["8%", "-8%"]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      const serviceItems = gsap.utils.toArray(".gsap-services-item");

      // Desktop layout (1024px and above) - split and contract inwards
      mm.add("(min-width: 1024px)", () => {
        gsap.set(leftColRef.current, { x: -180, opacity: 0 });
        gsap.set(serviceItems, { x: 180, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          }
        });

        tl.to(leftColRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        })
        .to(serviceItems, {
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.12
        }, "-=0.8");
      });

      // Tablet layout (768px - 1023px) - columns contract slightly
      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        gsap.set(leftColRef.current, { x: -100, opacity: 0 });
        gsap.set(serviceItems, { x: 100, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          }
        });

        tl.to(leftColRef.current, {
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power2.out"
        })
        .to(serviceItems, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        }, "-=0.6");
      });

      // Mobile layout (<768px) - Left column from left, list items from right
      mm.add("(max-width: 767px)", () => {
        gsap.set(leftColRef.current, { x: -60, opacity: 0 });
        gsap.set(serviceItems, { x: 60, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse",
          }
        });

        tl.to(leftColRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out"
        })
        .to(serviceItems, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        }, "-=0.6");
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!allowHover || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      id="services"
      className="dark:section-dark bg-background text-foreground pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden section-shell"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Premium ambient decorative particles and orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.03] blur-[120px] pointer-events-none"
        animate={prefersReducedMotion ? undefined : {
          x: [0, 40, 0],
          y: [0, -30, 0]
        }}
        transition={prefersReducedMotion ? undefined : { duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-rose-600/[0.02] blur-[110px] pointer-events-none"
        animate={prefersReducedMotion ? undefined : {
          x: [0, -30, 0],
          y: [0, 40, 0]
        }}
        transition={prefersReducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]" />

      {/* Floating magnetic preview on link hover (Luxury portfolio effect) */}
      <AnimatePresence>
        {allowHover && hoveredService && openService !== hoveredService && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute pointer-events-none z-30 w-72 h-44 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl bg-card"
            style={{
              left: mousePos.x + 25,
              top: mousePos.y - 90,
            }}
          >
            {servicesList.find(s => s.id === hoveredService)?.images[0] ? (
              <Image
                src={servicesList.find(s => s.id === hoveredService)!.images[0]}
                alt="Preview"
                fill
                quality={80}
                sizes="288px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest text-white/40">
                Design Studio
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-zinc-200/20 dark:border-white/5 text-[9px] font-bold uppercase tracking-wider text-white">
              View Scope
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

          {/* Left Column */}
          <div
            ref={leftColRef}
            className="gsap-services-left lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-left opacity-0"
          >
            <motion.span
              className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-foreground block"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {label}
            </motion.span>

            <h2 className="text-3xl md:text-[2.25rem] font-semibold leading-[0.95] md:leading-[0.92] tracking-tight mb-8 text-center lg:text-left text-foreground">
              <BlockRevealText
                text="Creative solutions for ambitious brands"
                blockColor="bg-foreground"
                scrub={false}
              />
            </h2>

            <motion.div
              className="w-full aspect-[4/5] relative overflow-hidden mb-6 bg-card rounded-2xl border border-zinc-200 dark:border-white/5 shadow-lg group/profile"
              style={{ y: imageY }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.15 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, ease: PREMIUM_EASE }}
                className="w-full h-full"
              >
                <Image
                  src={profileImageUrl}
                  alt="Representative Profile"
                  fill
                  className="object-cover group-hover/profile:scale-[1.02] transition-all duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  quality={90}
                />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-xs md:text-sm text-foreground leading-[1.6] max-w-[300px] mb-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {introText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full flex justify-center md:justify-start"
            >
              <LiquidButton as="a" href={ctaUrl} className="w-full max-w-[260px]" rounded="full">
                <span>{ctaText}</span>
                <ArrowRight size={14} strokeWidth={2.5} className="ml-1.5" />
              </LiquidButton>
            </motion.div>
          </div>

          {/* Right Column (Accordion) */}
          <div className="lg:col-span-8 lg:mt-16">
            <div className="border-t border-black/10 dark:border-white/10">
              {servicesList.map((service, idx) => {
                const isOpen = openService === service.id;
                const formattedIdx = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    key={service.id}
                    className="gsap-services-item border-b border-black/10 dark:border-white/10 opacity-0"
                    onMouseEnter={() => setHoveredService(service.id)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <motion.button
                      onClick={() => setOpenService(isOpen ? '' : service.id)}
                      className="w-full py-6 md:py-8 flex justify-between items-center group/service text-left cursor-pointer"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-6 md:gap-10">
                        <span className="font-mono text-xs text-foreground group-hover/service:text-foreground transition-colors">
                          {formattedIdx}
                        </span>
                        <motion.span
                          className="block text-2xl md:text-4xl tracking-tight font-medium transition-colors duration-300 text-foreground group-hover/service:text-foreground"
                          animate={{
                            opacity: 1,
                          }}
                        >
                          {service.title}
                        </motion.span>
                      </div>

                      {/* Plus/Minus Indicator with neat transitions */}
                      <motion.div
                        className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground/80 group-hover/service:border-foreground/30 group-hover/service:text-foreground transition-all duration-300"
                        animate={{
                          rotate: isOpen ? 45 : 0,
                          backgroundColor: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0)"
                        }}
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: PREMIUM_EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 pt-2 pl-4 sm:pl-12 md:pl-16">
                            <motion.p
                              className="text-sm md:text-base text-foreground max-w-2xl leading-relaxed mb-6 font-medium"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              {service.description}
                            </motion.p>

                            {/* Structured Tag Badges */}
                            <motion.div
                              className="flex flex-wrap gap-2.5 mb-8"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15 }}
                            >
                              {service.tags.map((tag, tagIdx) => (
                                <motion.span
                                  key={tag}
                                  className="border border-zinc-200 dark:border-white/10 hover:border-foreground/30 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-wide text-foreground/75 hover:text-foreground hover:bg-foreground/5 transition-all duration-300 cursor-default flex items-center gap-1.5"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 + tagIdx * 0.04 }}
                                >
                                  <span className="w-1 h-1 rounded-full bg-foreground/60" />
                                  <RollText>{tag}</RollText>
                                </motion.span>
                              ))}
                            </motion.div>

                            {/* Images Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                              {service.images.map((img, imgIdx) => (
                                <motion.div
                                  key={imgIdx}
                                  className="aspect-[4/3] relative overflow-hidden bg-card rounded-xl border border-zinc-200 dark:border-white/5"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 + imgIdx * 0.08, duration: 0.4 }}
                                >
                                  <motion.div
                                    whileHover={allowHover ? { scale: 1.05 } : undefined}
                                    transition={allowHover ? { duration: 0.4, ease: PREMIUM_EASE } : undefined}
                                    className="relative w-full h-full"
                                  >
                                    <Image
                                      src={img}
                                      alt={`${service.title} detail ${imgIdx + 1}`}
                                      fill
                                      className="object-cover transition-transform duration-300"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
                                      quality={80}
                                    />
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              {servicesList.length === 0 ? (
                <div className="py-10 text-sm text-muted-foreground">No services added yet.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
