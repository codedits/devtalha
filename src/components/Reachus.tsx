"use client";

import React, { useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import type { ReachSocial, ReachusSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from 'next/image';

const MotionImage = motion(Image);

export default function Reachus({ data }: { data?: ReachusSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract data from props
  const label = data?.label?.trim() ?? '';
  const marqueeText = data?.heading?.trim() ?? '';
  const email = data?.email?.trim() ?? '';
  const officeTitle = data?.office_title?.trim() ?? '';
  const officeLine1 = data?.office_line_1?.trim() ?? '';
  const officeLine2 = data?.office_line_2?.trim() ?? '';
  const officeLine3 = data?.office_line_3?.trim() ?? '';
  const inquiryTitle = data?.inquiry_title?.trim() ?? '';
  const inquiryText = data?.inquiry_text?.trim() ?? '';
  const backgroundMedia = data?.background_image_url ?? '';
  const portraitMedia = data?.portrait_image_url ?? '';
  const socials: ReachSocial[] = data?.socials ?? [];

  const sectionRef = useRef<HTMLElement>(null);

  // Multi-Layer Scroll Parallax targeting BOTH images
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Image 1: Villa Background Image Translation
  const bgY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : (isMobile ? ["-8%", "8%"] : ["-16%", "16%"])
  );

  // Image 1: Villa Background Image Zoom Parallax
  const bgScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.02, 1.08, 1.15]
  );

  // Marquee Box & Crosshairs Parallax
  const containerY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : (isMobile ? [5, -5] : [15, -15])
  );

  // Image 2: Foreground Portrait Card Frame Translation
  const cardY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : (isMobile ? [-15, 15] : [-40, 40])
  );

  // Image 2: Parallax Movement INSIDE the Portrait Card image frame
  const portraitImageY = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : (isMobile ? ["-6%", "6%"] : ["-12%", "12%"])
  );

  // Image 2: Subtle scale shift inside the Portrait Card
  const portraitImageScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.1, 1.15, 1.2]
  );

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className="px-0 py-0 md:px-6 md:py-6 w-full">
      <section
        id="contact"
        className="min-h-[140vh] md:min-h-[150vh] relative overflow-hidden section-dark select-none rounded-none md:rounded-lg border-0 border-transparent md:border md:border-white/15 shadow-none md:shadow-2xl"
        ref={sectionRef}
      >
        {/* Image 1: Villa Background Image with Parallax & Subtle Zoom */}
        {backgroundMedia ? (
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <MotionImage
              src={backgroundMedia}
              alt="Villa Background"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 1920px, 100vw"
              quality={90}
              style={{
                y: bgY,
                scale: bgScale
              }}
            />
          </div>
        ) : null}

        {/* Dark Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-black/20 bg-gradient-to-b from-black/20 via-black/10 to-black/30 z-0 pointer-events-none" />

        {/* Absolute Dead Center Zone for Marquee Box & Crosshairs */}
        <motion.div
          className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78vw] md:w-[52vw] max-w-[720px] h-[140px] md:h-[175px] flex items-center justify-center pointer-events-none"
          style={{ y: containerY }}
        >

          {/* 4 Corner Plus (+) Crosshairs */}
          <span className="absolute top-0 left-0 text-white text-2xl md:text-3xl font-light leading-none select-none -translate-x-1/2 -translate-y-1/2 z-30">+</span>
          <span className="absolute bottom-0 left-0 text-white text-2xl md:text-3xl font-light leading-none select-none -translate-x-1/2 translate-y-1/2 z-30">+</span>
          <span className="absolute top-0 right-0 text-white text-2xl md:text-3xl font-light leading-none select-none translate-x-1/2 -translate-y-1/2 z-30">+</span>
          <span className="absolute bottom-0 right-0 text-white text-2xl md:text-3xl font-light leading-none select-none translate-x-1/2 translate-y-1/2 z-30">+</span>

          {/* Sliding Marquee */}
          <div
            className="w-full overflow-hidden flex items-center whitespace-nowrap relative z-10 pointer-events-none select-none h-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
            }}
          >
            <motion.div
              className="flex gap-16 whitespace-nowrap items-center"
              animate={prefersReducedMotion ? {} : { x: ["0%", "-50%"] }}
              transition={{
                ease: "linear",
                duration: isMobile ? 26 : 42,
                repeat: Infinity
              }}
            >
              <div className="flex gap-16 whitespace-nowrap text-6xl md:text-8xl lg:text-[112px] font-medium tracking-tight text-white leading-none">
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
              </div>
              <div className="flex gap-16 whitespace-nowrap text-6xl md:text-8xl lg:text-[108px] font-medium tracking-tight text-white leading-none">
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
                <span>{marqueeText}</span>
              </div>
            </motion.div>
          </div>

          {/* Image 2: Centered Floating Portrait Card with Parallax Frame AND Internal Image Parallax */}
          <motion.div
            className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ y: cardY }}
          >
            <div
              className="relative w-[145px] h-[200px] md:w-[230px] md:h-[320px] rounded-md md:rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              {/* Internal Image Parallax inside the card frame */}
              <div className="w-full h-full relative overflow-hidden select-none pointer-events-none">
                {portraitMedia ? (
                  <MotionImage
                    src={portraitMedia}
                    alt="Contact Portrait"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 145px, 230px"
                    quality={90}
                    style={{
                      y: portraitImageY,
                      scale: portraitImageScale
                    }}
                  />
                ) : null}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </motion.div>

        {/* Bottom Action Trigger: Positioned at section base */}
        <div className="absolute z-30 bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <button
            onClick={handleContactClick}
            className="group flex flex-col items-center cursor-pointer text-white/90 hover:text-white transition-colors"
          >
            <div className="flex items-start gap-1 text-xs md:text-sm font-normal tracking-wide text-white select-none">
              <span>Contact Now</span>
              <span className="text-[9px] relative top-0.5 leading-none">⌝</span>
            </div>
            <div className="w-[160px] md:w-[210px] h-[1px] bg-white/60 mt-1.5 relative overflow-hidden">
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out" />
            </div>
          </button>
        </div>

        {/* Contact Details Glassmorphic Overlay Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-neutral-950/90 border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden relative shadow-2xl"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 240 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all duration-200 z-50 cursor-pointer"
                >
                  <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-14">

                  {/* Left Column */}
                  <div className="flex flex-col justify-between gap-8">
                    <div className="flex flex-col gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                        {inquiryTitle}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white font-display">
                        Let's shape your idea.
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                        {inquiryText}
                      </p>
                    </div>

                    {email ? (
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center gap-3 text-xl md:text-2xl font-medium tracking-tight text-white hover:text-white/70 transition-colors border-b border-white/20 pb-2 w-fit group"
                      >
                        {email}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : null}
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-8 justify-between md:border-l md:border-white/10 md:pl-10">

                    {/* Office Info */}
                    {(officeTitle || officeLine1 || officeLine2 || officeLine3) ? (
                      <div>
                        {officeTitle ? (
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-3 block">
                            {officeTitle}
                          </span>
                        ) : null}
                        <p className="text-white/80 text-sm leading-relaxed">
                          {[officeLine1, officeLine2, officeLine3].filter(Boolean).map((line, idx, arr) => (
                            <React.Fragment key={idx}>
                              {line}
                              {idx < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      </div>
                    ) : null}

                    {/* Socials */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-1 block">
                        FIND US
                      </span>
                      <div className="flex flex-col gap-2">
                        {socials.map((social) => (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-bold tracking-widest text-white/60 hover:text-white transition-colors group"
                          >
                            <span>{social.name}</span>
                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
