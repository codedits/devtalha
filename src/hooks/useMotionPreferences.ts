"use client";

import { useReducedMotion } from "framer-motion";

import { useIsMobile } from "@/hooks/useIsMobile";

export function useMotionPreferences() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  // Parallax (scroll-linked motion) works great on mobile — just reduce intensity
  const allowParallax = !prefersReducedMotion;

  return {
    prefersReducedMotion,
    isMobile,
    allowHover,
    allowParallax,
  };
}
