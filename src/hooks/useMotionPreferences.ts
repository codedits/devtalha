"use client";

import { useReducedMotion } from "framer-motion";

import { useIsMobile } from "@/hooks/useIsMobile";

export function useMotionPreferences() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const allowHover = !prefersReducedMotion && !isMobile;
  const allowParallax = !prefersReducedMotion && !isMobile;

  return {
    prefersReducedMotion,
    isMobile,
    allowHover,
    allowParallax,
  };
}
