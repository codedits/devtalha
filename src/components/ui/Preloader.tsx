"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the user has already loaded the site in this session
    const hasVisited = sessionStorage.getItem("portfolio-visited");
    if (hasVisited === "true") {
      setIsComplete(true);
      return;
    }

    // Lock page scroll
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          sessionStorage.setItem("portfolio-visited", "true");
          // Restore page scroll
          document.body.style.overflow = "unset";
        },
      });

      // Animate text entrances
      tl.fromTo(
        [titleRef.current, subRef.current],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
      );

      // Animate counter progress value
      const counterVal = { value: 0 };
      tl.to(
        counterVal,
        {
          value: 100,
          duration: 2.0,
          ease: "power2.out",
          onUpdate: () => {
            if (progressTextRef.current) {
              progressTextRef.current.innerText = String(
                Math.floor(counterVal.value)
              ).padStart(2, "0");
            }
          },
        },
        "-=0.4"
      );

      // Wipe out details right before page wipe
      tl.to(
        [titleRef.current, subRef.current, counterRef.current],
        { opacity: 0, y: -20, duration: 0.45, ease: "power2.in", stagger: 0.08 },
        "+=0.1"
      );

      // Slide up the full screen preloader curtain
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        },
        "-=0.15"
      );
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "unset";
    };
  }, []);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-[#070707] text-[#f7f7f7] z-[99999] flex flex-col justify-between p-8 md:p-16 select-none font-sans"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
        <div ref={titleRef} className="overflow-hidden">
          <span>TALHA IRFAN</span>
        </div>
        <div ref={subRef} className="overflow-hidden text-right">
          <span>CREATIVE DEVELOPER</span>
        </div>
      </div>

      {/* Center Counter */}
      <div
        ref={counterRef}
        className="my-auto flex flex-col items-center justify-center"
      >
        <span
          className="text-8xl md:text-[13rem] font-medium tracking-tight font-display text-white leading-none selection:bg-none"
          style={{ fontVariantNumeric: "all-initials" }}
        >
          <span ref={progressTextRef}>00</span>
        </span>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">
        <span>© 2026</span>
        <span>DESIGNED TO INSPIRE</span>
      </div>
    </div>
  );
}
