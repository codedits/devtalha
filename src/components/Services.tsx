"use client";

import React, { useState, useRef } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { LiquidButton } from "./ui/LiquidButton";
import type { ServicesItem } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Service {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}

const SERVICES: Service[] = [
  {
    id: 'brand-strategy',
    title: 'Brand Strategy',
    description: 'Building the foundation of your brand from positioning and tone to messaging and visual direction. We define how your brand should feel and communicate.',
    tags: ['Brand Positioning', 'Visual Identity', 'Messaging Framework', 'Creative Direction'],
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512413914844-083f47459220?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'website-design',
    title: 'Website Design',
    description: 'Crafting digital experiences that bridge the gap between aesthetics and performance. We build websites that don’t just look good, but convert.',
    tags: ['UI/UX Design', 'Responsive Design', 'Design Systems', 'Prototyping'],
    images: [
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Storytelling through media. We produce high-quality visual and written content that resonates with your audience and builds trust.',
    tags: ['Photography', 'Videography', 'Copywriting', 'Social Media'],
    images: [
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'product-design',
    title: 'Product Design',
    description: 'User-centric interfaces for modern software. We design intuitive, scalable products that solve complex problems simply.',
    tags: ['SaaS Design', 'Mobile Apps', 'Interaction Design', 'Usability Testing'],
    images: [
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600'
    ]
  },
];

export default function Services({ data }: { data?: ServicesItem[] | null }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const servicesList: Service[] = data && data.length > 0
    ? data.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        tags: s.tags ?? [],
        images: s.images ?? [],
      }))
    : SERVICES;
  const [openService, setOpenService] = useState<string>(servicesList[0]?.id ?? '');

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion || isMobile ? ["0%", "0%"] : ["10%", "-10%"]
  );

  return (
    <section id="services" className="section-dark py-24 md:py-32 relative overflow-hidden section-shell" ref={sectionRef}>
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
        animate={prefersReducedMotion ? undefined : {
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={prefersReducedMotion ? undefined : { duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-6 md:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column */}
          <motion.div 
            className="lg:col-span-3 flex flex-col items-center text-center lg:items-start lg:text-left"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-[0.2em] mb-12 text-muted-foreground block"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              [ OUR SERVICES ]
            </motion.span>
            
            <motion.div 
              className="w-full aspect-[4/5] relative overflow-hidden mb-6 bg-card"
              style={{ y: imageY }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={isInView ? { opacity: 0.9, scale: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full h-full"
              >
                <Image
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800"
                  alt="Representative Profile"
                  fill
                  className="object-cover grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  quality={80}
                />
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-[13px] text-muted-foreground leading-[1.6] max-w-[280px] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              We define the foundation of your brand voice, visuals, and values shaped into a system built for long-term clarity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full flex justify-center md:justify-start"
            >
              <LiquidButton className="w-full max-w-[260px]">
                Start a project <ArrowRight size={14} strokeWidth={2.5} />
              </LiquidButton>
            </motion.div>
          </motion.div>

          {/* Right Column (Accordion) */}
          <div className="lg:col-span-9 lg:mt-16">
            <motion.div 
              className="border-t border-border"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {servicesList.map((service, idx) => {
                const isOpen = openService === service.id;
                
                return (
                  <motion.div 
                    key={service.id} 
                    className="border-b border-border"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                  >
                    <motion.button 
                      onClick={() => setOpenService(isOpen ? '' : service.id)}
                      className="w-full py-6 md:py-8 flex justify-between items-center group text-left"
                      whileHover={allowHover ? { x: 10 } : undefined}
                      transition={allowHover ? { duration: 0.3 } : undefined}
                    >
                      <motion.span 
                        className="block text-3xl md:text-5xl tracking-tight font-medium transition-all duration-500 text-foreground"
                        animate={{ 
                          opacity: isOpen ? 1 : 0.7,
                        }}
                      >
                        {service.title}
                      </motion.span>
                      <motion.span 
                        className="block text-foreground"
                        animate={{ rotate: isOpen ? 0 : -90 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isOpen ? <Minus size={24} strokeWidth={1} /> : <Plus size={24} strokeWidth={1} />}
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 pt-2">
                            <motion.p 
                              className="text-[17px] text-muted-foreground max-w-2xl leading-relaxed mb-8"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                            >
                              {service.description}
                            </motion.p>
                            
                            <motion.div 
                              className="flex flex-wrap gap-3 mb-8"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {service.tags.map((tag, tagIdx) => (
                                <motion.span 
                                  key={tag} 
                                  className="border border-border px-5 py-2 text-[11px] font-medium tracking-wider text-foreground/80 uppercase hover:bg-foreground hover:text-background transition-colors duration-300 cursor-default"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + tagIdx * 0.05 }}
                                  whileHover={allowHover ? { scale: 1.05 } : undefined}
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {service.images.map((img, imgIdx) => (
                                <motion.div 
                                  key={imgIdx} 
                                  className="aspect-[4/3] relative overflow-hidden bg-card"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + imgIdx * 0.1, duration: 0.5 }}
                                >
                                  <motion.div
                                    whileHover={allowHover ? { scale: 1.08 } : undefined}
                                    transition={allowHover ? { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } : undefined}
                                    className="w-full h-full"
                                  >
                                    <Image
                                      src={img}
                                      alt={`${service.title} detail ${imgIdx + 1}`}
                                      fill
                                      className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                                      sizes="(max-width: 768px) 100vw, 33vw"
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
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
