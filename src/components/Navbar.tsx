"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import Link from "next/link";

import { RollText } from "./ui/RollText";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "WORKS", href: "/#work" },
  { label: "SERVICES", href: "/#services" },
  { label: "PROCESS", href: "/#process" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-8 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 pointer-events-none font-sans mix-blend-difference"
      >
        {/* Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white">
            TALHA®
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="pointer-events-auto flex items-center text-white h-12 md:h-[52px] hidden md:flex font-sans">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-bold uppercase tracking-normal transition-opacity whitespace-nowrap"
              >
                <RollText>{link.label}</RollText>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile nav toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden pointer-events-auto text-white px-5 py-2 text-[10px] font-bold tracking-widest flex items-center gap-2"
        >
          {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </motion.header>

      {/* Mobile Menu Overlay — z-[60] to sit above header z-50 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] md:hidden bg-black flex flex-col items-center justify-center p-6"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-medium tracking-tighter text-white hover:text-white/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-8 inline-block bg-white text-black px-10 py-4 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-gray-200 transition-colors"
                >
                  CONTACT US
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
