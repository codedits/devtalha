"use client";

import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import BlurText from "./BlurText";
import type { ReachSocial, ReachusSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT, staggerContainer } from "@/lib/motion";

// Animation variants
const containerVariants = staggerContainer(0.14, 0.09);

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...BASE_REVEAL, ease: PREMIUM_EASE }
  }
};

export default function Reachus({ data }: { data?: ReachusSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const label = data?.label?.trim() || '[ REACH US ]';
  const heading = data?.heading ?? 'Have a bold idea? Let\'s shape it.';
  const email = data?.email ?? 'hello@talha.com';
  const officeTitle = data?.office_title?.trim() || 'OFFICE';
  const officeLine1 = data?.office_line_1?.trim() || 'Available Worldwide';
  const officeLine2 = data?.office_line_2?.trim() || 'Working Remotely';
  const officeLine3 = data?.office_line_3?.trim() || 'Based in PK';
  const inquiryTitle = data?.inquiry_title?.trim() || 'INQUIRIES';
  const inquiryText = data?.inquiry_text?.trim() || 'For new projects and partnership questions:';
  const socials: ReachSocial[] = data?.socials?.length ? data.socials : [
    { name: 'INSTAGRAM', href: '#' },
    { name: 'X / TWITTER', href: '#' },
    { name: 'LINKEDIN', href: '#' },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, REVEAL_VIEWPORT);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? ["0%", "0%"] : ["0%", "-20%"]
  );
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion || isMobile ? [1, 1, 1] : [0.8, 1, 1.2]
  );

  return (
    <section id="contact" className="py-24 md:py-48 relative overflow-hidden section-shell" ref={sectionRef}>
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Column: Editorial Heading */}
          <motion.div 
            className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={BASE_REVEAL}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-[0.2em] mb-12 block text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {label}
            </motion.span>
            <h2 className="text-5xl md:text-8xl lg:text-[110px] leading-[0.95] tracking-tighter font-medium mb-12">
              <BlurText 
                text={heading}
                delay={50}
                animateBy="words"
                direction="bottom"
                className="inline-flex"
              />
            </h2>
            
            <motion.a 
              href={`mailto:${email}`}
              className="inline-flex items-center gap-4 text-2xl md:text-3xl font-medium tracking-tight hover:text-foreground/60 transition-all border-b border-foreground/20 pb-4 group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...BASE_REVEAL, delay: 0.25 }}
              whileHover={allowHover ? { x: 10 } : undefined}
            >
              {email} 
              <motion.span
                animate={prefersReducedMotion ? undefined : { x: [0, 5, 0] }}
                transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={28} strokeWidth={1} />
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Right Column: Details & Socials */}
          <motion.div 
            className="lg:col-span-5 lg:pt-32"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* HQ */}
              <motion.div variants={itemVariants}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-muted-foreground/60">
                  {officeTitle}
                </span>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  {officeLine1} <br />
                  {officeLine2} <br />
                  {officeLine3}
                </p>
              </motion.div>

              {/* Inquiry */}
              <motion.div variants={itemVariants}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-6 block text-muted-foreground/60">
                  {inquiryTitle}
                </span>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
                  {inquiryText}
                </p>
                <div className="flex flex-col gap-4">
                  {socials.map((social, idx) => (
                    <motion.a 
                      key={social.name}
                      href={social.href}
                      className="group flex items-center justify-between border-b border-border pb-2 text-[11px] font-bold tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ ...BASE_REVEAL, delay: 0.3 + idx * 0.08 }}
                      whileHover={allowHover ? { x: 5 } : undefined}
                    >
                      {social.name}
                      <motion.span 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={allowHover ? { x: 0 } : undefined}
                      >
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </motion.span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Decorative Elements */}
      <motion.div 
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"
        style={{ y: backgroundY, scale: backgroundScale }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-foreground/[0.015] rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"
        animate={prefersReducedMotion ? undefined : { 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
