"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      <motion.div key={pathname} className="w-full h-full">
        {/* Curtain Intro (Reveals page) */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ originY: 1 }}
          className="fixed inset-0 bg-black z-[100] pointer-events-none flex items-center justify-center"
        >
          <motion.span 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
          >
            TALHA®
          </motion.span>
        </motion.div>

        {/* Content Fade/Slide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
