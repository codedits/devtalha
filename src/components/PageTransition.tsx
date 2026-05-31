"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence initial={false} mode="wait">
        {hasMounted ? (
          <motion.div
            key={pathname}
            initial={{ scaleY: 1, opacity: 0.16 }}
            animate={{ scaleY: 0, opacity: 0 }}
            exit={{ scaleY: 1, opacity: 0.08 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 1 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-gradient-to-b from-black/20 via-black/10 to-transparent"
          >
            <motion.span
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0.18 }}
              transition={{ duration: 0.24 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-white/70"
            >
              TALHA®
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative w-full h-full">{children}</div>
    </div>
  );
}
