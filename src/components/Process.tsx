"use client";

import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { ProcessStepItem } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  { 
    id: '01', 
    number: '[ 01 ]', 
    title: 'Discovery', 
    description: 'We cut through the noise, understand your brand, your audience, and your goals. No cookie-cutter playbooks only sharp strategies.',
  },
  { 
    id: '02', 
    number: '[ 02 ]', 
    title: 'Designing', 
    description: 'From sketches to high-fidelity prototypes, we shape bold concepts into tangible visuals. Expect motion, layouts, and interactions.',
  },
  { 
    id: '03', 
    number: '[ 03 ]', 
    title: 'Development', 
    description: "Design isn't enough, it has to perform. We develop responsive, fast, and scalable systems, seamlessly integrating CMS, animations, and tech.",
  },
  { 
    id: '04', 
    number: '[ 04 ]', 
    title: 'Launch', 
    description: "We don't vanish after launch. From performance optimization to continuous iterations, we ensure your brand stays sharp, fast, and relevant.",
  },
];

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  })
};

export default function Process({ data }: { data?: ProcessStepItem[] | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const steps = data && data.length > 0
    ? data.map((s) => ({
        id: s.id,
        number: s.number,
        title: s.title,
        description: s.description,
      }))
    : PROCESS_STEPS;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? ["0%", "0%"] : ["-20%", "20%"]
  );

  return (
    <section id="process" className="section-dark py-24 md:py-32 relative overflow-hidden section-shell" ref={sectionRef}>
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
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block">
            [ OUR PROCESS ]
          </span>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-border"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id} 
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={allowHover ? {
                backgroundColor: "hsl(var(--card))",
                transition: { duration: 0.3 }
              } : undefined}
              className={`flex flex-col justify-between p-8 md:p-10 min-h-[300px] lg:min-h-[450px] bg-background group cursor-default border-b lg:border-b-0 ${idx !== 3 ? 'lg:border-r' : ''} border-border relative overflow-hidden`}
            >
              {/* Hover line accent */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-foreground origin-left"
                initial={{ scaleX: 0 }}
                whileHover={allowHover ? { scaleX: 1 } : undefined}
                transition={allowHover ? { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
              />
              
              {/* Card Top */}
              <div className="flex justify-between items-start">
                <motion.span 
                  className="text-xs font-bold tracking-[0.2em] text-muted-foreground/60 group-hover:text-foreground transition-colors duration-500"
                  whileHover={allowHover ? { x: 5 } : undefined}
                >
                  {step.number}
                </motion.span>
                <motion.span 
                  className="text-muted-foreground/40 group-hover:text-foreground transition-all duration-500"
                  whileHover={allowHover ? {
                    x: 5,
                    y: -5,
                    scale: 1.2
                  } : undefined}
                  transition={allowHover ? { type: "spring", stiffness: 300 } : undefined}
                >
                  <ArrowUpRight size={18} strokeWidth={1} />
                </motion.span>
              </div>
              
              {/* Card Bottom */}
              <div className="mt-auto">
                <motion.h3 
                  className="text-3xl tracking-tight mb-5 font-medium"
                  whileHover={allowHover ? { x: 10 } : undefined}
                  transition={allowHover ? { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  className="text-[14px] text-muted-foreground/70 leading-[1.7] group-hover:text-muted-foreground transition-colors duration-500"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {step.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
