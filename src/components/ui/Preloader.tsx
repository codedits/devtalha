"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "こんにちは",
  "你好",
  "السلام علیکم"
];

export default function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"active" | "exiting">("active");

  useEffect(() => {
    // Check if the user has already loaded the site in this session
    const hasVisited = sessionStorage.getItem("portfolio-visited");
    if (hasVisited === "true") {
      setIsComplete(true);
      return;
    }

    // Lock page scroll
    document.body.style.overflow = "hidden";

    // Cycle through greetings at a comfortable, readable speed (380ms)
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex < GREETINGS.length - 1) {
          return prevIndex + 1;
        } else {
          // Reached TALHA, stop cycling
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 380);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, []);

  // When we reach the final word (TALHA), pause and trigger exit
  useEffect(() => {
    if (index === GREETINGS.length - 1) {
      const timer = setTimeout(() => {
        setStatus("exiting");
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("preloader-complete"));
        }
      }, 1000); // Keep TALHA visible for 1.0s

      return () => clearTimeout(timer);
    }
  }, [index]);

  if (isComplete) return null;

  // SVG curved path variants for the curtain exit (U-curve liquid trail)
  const curveVariants = {
    initial: {
      d: "M0 0 L100 0 L100 100 Q50 100 0 100 Z"
    },
    animate: {
      d: "M0 0 L100 0 L100 100 Q50 100 0 100 Z"
    },
    exit: {
      d: [
        "M0 0 L100 0 L100 100 Q50 100 0 100 Z",
        "M0 0 L100 0 L100 0 Q50 30 0 0 Z",
        "M0 0 L100 0 L100 0 Q50 0 0 0 Z"
      ],
      transition: {
        duration: 0.85,
        times: [0, 0.5, 1],
        ease: [0.76, 0, 0.24, 1] as any
      }
    }
  };

  return (
    <div id="preloader-root" className="fixed inset-0 w-full h-full z-[99999] overflow-hidden select-none pointer-events-none touch-none flex items-center justify-center">
      {/* Background SVG Curtain */}
      <svg 
        className="absolute inset-0 w-full h-full fill-[#070707] z-10 pointer-events-auto"
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <motion.path
          variants={curveVariants}
          initial="initial"
          animate={status === "exiting" ? "exit" : "animate"}
          onAnimationComplete={() => {
            if (status === "exiting") {
              setIsComplete(true);
              sessionStorage.setItem("portfolio-visited", "true");
              document.body.style.overflow = "unset";
            }
          }}
        />
      </svg>

      {/* Center Text (Slower, elegant fade cross-transition) */}
      <div className="z-20 pointer-events-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "active" && (
            <motion.h1
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.18,
                ease: "easeInOut"
              }}
              className="text-2xl md:text-4xl font-medium tracking-tight font-sans text-white leading-none text-center flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
              {GREETINGS[index]}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}