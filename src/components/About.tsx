"use client";

import { motion, useSpring, useMotionValue, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import BlockRevealText from "./BlockRevealText";
import type { AboutSection, AboutStat } from "@/types/content";
import { useMotionPreferences } from "@/hooks/useMotionPreferences";
import { BASE_REVEAL, PREMIUM_EASE, REVEAL_VIEWPORT, staggerContainer } from "@/lib/motion";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, REVEAL_VIEWPORT);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 30, damping: 25 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsub = springValue.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [springValue]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// Animation variants
const containerVariants = staggerContainer(0.1, 0.12);

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...BASE_REVEAL, ease: PREMIUM_EASE }
  }
};

export default function About({ data }: { data?: AboutSection | null }) {
  const { allowHover, allowParallax } = useMotionPreferences();
  const stats: AboutStat[] = data?.stats ?? [];
  const label = data?.label?.trim() ?? '';
  const heading = data?.heading?.trim() ?? '';
  const description = data?.description?.trim() ?? '';

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], allowParallax ? ["-5%", "5%"] : ["0%", "0%"]);

  return (
    <section className="py-32 relative overflow-hidden section-shell" id="about" ref={sectionRef}>
      {/* Subtle animated background element */}
      <motion.div 
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-foreground/[0.02] blur-3xl pointer-events-none"
        style={{ y: backgroundY }}
      />
      
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">

        {/* Section label with line animation */}
        {label ? (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "100%" }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.9, ease: PREMIUM_EASE }}
            className="mb-16"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ ...BASE_REVEAL, delay: 0.2 }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground block"
            >
              {label}
            </motion.span>
          </motion.div>
        ) : null}

        {/* Main text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {heading ? (
            <h2 className="text-3xl md:text-[2.75rem] font-medium leading-[0.95] md:leading-[0.9] tracking-tight text-center md:text-left">
              <BlockRevealText
                text={heading}
                blockColor="bg-foreground"
                scrub={false}
              />
            </h2>
          ) : <div />}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            className="flex flex-col justify-center"
          >
            {description ? (
              <motion.p variants={itemVariants} className="text-muted-foreground text-lg leading-relaxed">
                {description}
              </motion.p>
            ) : null}
          </motion.div>
        </div>

        {/* Stats — Animated bento grid */}
        {stats.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-border"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`bg-background p-8 md:p-12 flex flex-col group cursor-default ${
                  allowHover ? "hover:bg-card transition-colors duration-300" : ""
                }`}
              >
                <motion.span 
                  className="text-4xl md:text-5xl font-semibold tracking-tight mb-3"
                  whileHover={allowHover ? { scale: 1.05, x: 5 } : undefined}
                  transition={allowHover ? { type: "spring", stiffness: 260, damping: 22 } : undefined}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </motion.span>
                <motion.span 
                  className="text-muted-foreground text-sm group-hover:text-foreground transition-colors duration-300"
                >
                  {stat.label}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
