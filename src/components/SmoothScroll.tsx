"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const destroyLenis = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;

      // Remove the GSAP Ticker callback
      if ((lenis as any)._tickerCallback) {
        gsap.ticker.remove((lenis as any)._tickerCallback);
      }
      
      lenis.destroy();
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

      // Synchronize ScrollTrigger updates with Lenis scroll movements
      lenis.on("scroll", ScrollTrigger.update);

      // Synchronize Lenis frames with the GSAP Ticker rendering thread
      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      
      // Store reference on lenis object for cleanup
      (lenis as any)._tickerCallback = tickerCallback;

      // Set lag smoothing to 0 to prevent GSAP jumps on heavy loads
      gsap.ticker.lagSmoothing(0);
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