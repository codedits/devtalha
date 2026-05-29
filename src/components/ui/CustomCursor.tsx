"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorType = "default" | "hover" | "view";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const isVisibleRef = useRef(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth springs for a premium feel
  const springX = useSpring(cursorX, { stiffness: 450, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 450, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // Global listener for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const viewElement = target.closest('[data-cursor="view"]');
      const interactiveElement = target.closest(
        'a, button, [role="button"], input, select, textarea, .cursor-pointer, .roll-text'
      );

      if (viewElement) {
        setCursorType("view");
      } else if (interactiveElement) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Determine cursor styles based on state
  const variants = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: "rgb(255, 255, 255)",
      border: "0px solid rgba(255, 255, 255, 0)",
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(255, 255, 255, 0)",
      border: "1px solid rgba(255, 255, 255, 1)",
    },
    view: {
      width: 68,
      height: 68,
      backgroundColor: "rgb(255, 255, 255)",
      border: "0px solid rgba(255, 255, 255, 0)",
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center overflow-hidden"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
        ...variants[cursorType],
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.6,
      }}
    >
      {/* VIEW text overlay */}
      {cursorType === "view" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="text-black font-sans text-[9px] font-extrabold tracking-[0.25em] select-none uppercase"
        >
          View
        </motion.span>
      )}
    </motion.div>
  );
};
