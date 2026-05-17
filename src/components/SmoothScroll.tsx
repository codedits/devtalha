"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    let rafId = 0;

    const destroyLenis = () => {
      window.cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const createLenis = () => {
      if (lenisRef.current) return;

      const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
    };

    const syncLenisState = () => {
      const shouldEnable = !reducedMotionQuery.matches && !mobileQuery.matches;

      if (shouldEnable) {
        createLenis();
      } else {
        destroyLenis();
      }
    };

    syncLenisState();

    reducedMotionQuery.addEventListener("change", syncLenisState);
    mobileQuery.addEventListener("change", syncLenisState);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncLenisState);
      mobileQuery.removeEventListener("change", syncLenisState);
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}