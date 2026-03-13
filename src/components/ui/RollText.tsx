"use client";

import React from "react";

interface RollTextProps {
  children: string;
  className?: string;
}

export const RollText: React.FC<RollTextProps> = ({ children, className = "" }) => {
  return (
    <span className={`relative inline-flex flex-col overflow-hidden group/roll py-[0.05em] ${className}`}>
      {/* Container for both text states */}
      <span className="relative transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/roll:-translate-y-full">
        {/* State 1: Normal */}
        <span className="flex items-center">
          {children}
        </span>
        {/* State 2: Hover (comes from below) */}
        <span className="absolute top-full left-0 flex items-center">
          {children}
        </span>
      </span>
    </span>
  );
};
