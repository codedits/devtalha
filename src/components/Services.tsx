"use client";

import React, { useState, useRef } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import Image from "next/image";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { LiquidButton } from "./ui/LiquidButton";
import type { ServicesItem, ServicesMetaSection } from "@/types/content";
import { useIsMobile } from "@/hooks/useIsMobile";

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
    <section id="services" className="section-dark bg-background text-foreground pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden section-shell" ref={sectionRef}>
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
              {label}
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
                  src={profileImageUrl}
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
              {introText}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full flex justify-center md:justify-start"
            >
              <LiquidButton as="a" href={ctaUrl} className="w-full max-w-[260px]">
                {ctaText} <ArrowRight size={14} strokeWidth={2.5} />
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
              {servicesList.length === 0 ? (
                <div className="py-10 text-sm text-muted-foreground">No services added yet.</div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
