"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isComplete, setIsComplete] = useState(false);
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

    // Set timeout to trigger exit transition
    const timer = setTimeout(() => {
      setStatus("exiting");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("preloader-complete"));
      }
    }, 1800); // Elegant speed: 1.8s total preloader duration

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

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

  const name = "TALHA IRFAN";

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

      {/* Center Text (Elegant masked slide-up letter transition) */}
      <div className="z-20 pointer-events-auto flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence>
          {status === "active" && (
            <motion.h1
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.035,
                  }
                },
                exit: {
                  opacity: 0,
                  y: -30,
                  transition: {
                    duration: 0.5,
                    ease: [0.76, 0, 0.24, 1]
                  }
                }
              }}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.25em] font-sans text-white leading-none text-center flex items-center justify-center gap-0.5 select-none"
            >
              {name.split("").map((char, index) => {
                if (char === " ") {
                  return <span key={index} className="inline-block w-2 sm:w-4" />;
                }
                return (
                  <span key={index} className="inline-block overflow-hidden py-2 -my-2">
                    <motion.span
                      className="inline-block origin-bottom"
                      variants={{
                        hidden: { y: "105%", opacity: 0 },
                        visible: {
                          y: 0,
                          opacity: 1,
                          transition: {
                            duration: 0.7,
                            ease: [0.215, 0.61, 0.355, 1], // premium bezier
                          }
                        }
                      }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}