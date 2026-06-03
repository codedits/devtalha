"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

export const LiquidButton = ({
  children,
  className,
  as: Component = "button",
  variant = "primary",
  size = "default",
  rounded = "none",
  ...props
}: LiquidButtonProps & { 
  variant?: "primary" | "secondary";
  size?: "default" | "small";
  rounded?: "none" | "full";
}) => {
  const isPrimary = variant === "primary";
  const [hovered, setHovered] = useState(false);

  return (
    <Component
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none overflow-hidden",
        size === "small" ? "px-6 py-3.5" : "px-10 py-[18px]",
        rounded === "full" ? "rounded-full" : "rounded-none",
        isPrimary 
          ? "bg-white text-black hover:text-white border border-white" 
          : "bg-black text-white hover:text-black border border-white/20 hover:border-white",
        className
      )}
      {...props}
    >
      {/* Button Text */}
      <span className="relative z-20 flex items-center gap-2 pointer-events-none transition-colors duration-300">
        {children}
      </span>
      
      {/* SVG Liquid Waves Background */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <svg 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wave 1 (Back/Ambient Wave) */}
          <motion.path
            animate={{
              d: hovered
                ? [
                    "M0,100 Q50,100 100,100 L100,100 L0,100 Z",
                    "M0,35 Q50,-15 100,35 L100,100 L0,100 Z",
                    "M0,0 Q50,0 100,0 L100,100 L0,100 Z"
                  ]
                : "M0,100 Q50,100 100,100 L100,100 L0,100 Z"
            }}
            transition={{
              duration: 0.65,
              ease: [0.215, 0.61, 0.355, 1],
              times: [0, 0.5, 1]
            }}
            className={cn(
              isPrimary ? "fill-black/30" : "fill-white/30"
            )}
          />

          {/* Wave 2 (Main solid Wave) */}
          <motion.path
            animate={{
              d: hovered
                ? [
                    "M0,100 Q50,100 100,100 L100,100 L0,100 Z",
                    "M0,45 Q50,10 100,45 L100,100 L0,100 Z",
                    "M0,0 Q50,0 100,0 L100,100 L0,100 Z"
                  ]
                : "M0,100 Q50,100 100,100 L100,100 L0,100 Z"
            }}
            transition={{
              duration: 0.75,
              ease: [0.215, 0.61, 0.355, 1],
              times: [0, 0.45, 1],
              delay: 0.05
            }}
            className={cn(
              isPrimary ? "fill-black" : "fill-white"
            )}
          />
        </svg>
      </div>
    </Component>
  );
};
