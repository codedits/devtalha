"use client";

import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { ProcessMetaSection, ProcessStepItem } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT } from "@/lib/motion";

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

import { RollText } from "./ui/RollText";

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: BASE_REVEAL.duration,
      ease: PREMIUM_EASE,
    }
  })
};

export default function Process({ data, meta }: { data?: ProcessStepItem[] | null; meta?: ProcessMetaSection | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const label = meta?.label?.trim() || '[ OUR PROCESS ]';
  const steps = data && data.length > 0
    ? data.map((s) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        description: s.description,
      }))
    : [];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, REVEAL_VIEWPORT);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : isMobile ? ["-10%", "10%"] : ["-20%", "20%"]
  );

  return (
    <section id="process" className="dark:section-dark bg-background text-foreground pt-12 md:pt-16 pb-24 md:pb-32 relative overflow-hidden section-shell" ref={sectionRef}>
      {/* Animated background gradient */}
      <motion.div 
        className="absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
        style={{ x: backgroundX }}
      />
      
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={BASE_REVEAL}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground block">
            {label}
          </span>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 border border-zinc-200 dark:border-white/15"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ ...BASE_REVEAL, delay: 0.15 }}
        >
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id} 
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col justify-between p-5 sm:p-8 md:p-10 min-h-[220px] sm:min-h-[300px] lg:min-h-[450px] bg-background group/roll cursor-default border-zinc-200 dark:border-white/15 relative overflow-hidden ${
                idx % 2 === 0 ? "border-r" : "border-r-0"
              } ${
                idx < 2 ? "border-b" : "border-b-0"
              } ${
                idx !== 3 ? "lg:border-r" : "lg:border-r-0"
              } lg:border-b-0 ${
                allowHover ? "hover:bg-card transition-colors duration-300" : ""
              }`}
            >
              {/* Hover line accent */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-foreground origin-left"
                initial={{ scaleX: 0 }}
                whileHover={allowHover ? { scaleX: 1 } : undefined}
                transition={allowHover ? { duration: 0.4, ease: PREMIUM_EASE } : undefined}
              />
              
              {/* Card Top */}
              <div className="flex justify-between items-start">
                <motion.span 
                  className="text-xs font-bold tracking-[0.2em] text-foreground group-hover/roll:text-foreground transition-colors duration-500"
                  whileHover={allowHover ? { x: 5 } : undefined}
                >
                  <RollText>{step.number}</RollText>
                </motion.span>
                <motion.span 
                  className="text-foreground group-hover/roll:text-foreground transition-all duration-500"
                  whileHover={allowHover ? {
                    x: 5,
                    y: -5,
                    scale: 1.2
                  } : undefined}
                  transition={allowHover ? { type: "spring", stiffness: 260, damping: 22 } : undefined}
                >
                  <ArrowUpRight size={18} strokeWidth={1} />
                </motion.span>
              </div>
              
              {/* Card Bottom */}
              <div className="mt-auto">
                <motion.h3 
                  className="text-lg sm:text-2xl lg:text-3xl tracking-tight mb-2 sm:mb-5 font-medium"
                  whileHover={allowHover ? { x: 10 } : undefined}
                  transition={allowHover ? { duration: 0.3, ease: PREMIUM_EASE } : undefined}
                >
                  <RollText>{step.title}</RollText>
                </motion.h3>
                <motion.p 
                  className="text-[12px] sm:text-[14px] md:text-[15px] text-foreground leading-relaxed sm:leading-[1.7] group-hover/roll:text-foreground transition-colors duration-500 font-medium"
                  initial={{ opacity: 1 }}
                  whileHover={allowHover ? { opacity: 1 } : undefined}
                >
                  {step.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
          {steps.length === 0 ? (
            <div className="col-span-full p-8 text-sm text-muted-foreground">No process steps added yet.</div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
