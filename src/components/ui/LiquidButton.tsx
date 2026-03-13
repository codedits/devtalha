"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  as?: any;
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

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="inline-block"
    >
      <Component
        className={cn(
          "group relative inline-flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] transition-colors focus:outline-none overflow-hidden",
          size === "small" ? "px-6 py-3" : "px-10 py-[18px]",
          rounded === "full" ? "rounded-full" : "rounded-none",
          isPrimary 
            ? "bg-white text-black hover:text-white" 
            : "bg-black text-white hover:text-black border border-white/10",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2 pointer-events-none">
          {children}
        </span>
        
        {/* Liquid Fill Effect */}
        <motion.div
          variants={{
            initial: { y: "100%" },
            hover: { y: 0 }
          }}
          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className={cn(
            "absolute inset-0 pointer-events-none",
            isPrimary ? "bg-black" : "bg-white"
          )}
        />
      </Component>
    </motion.div>
  );
};
