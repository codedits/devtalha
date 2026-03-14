"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import type { FooterSection } from "@/types/content";

export default function Footer({ data }: { data?: FooterSection | null }) {
  const backgroundMode = data?.background_mode === "image" ? "image" : "solid";
  const textTheme = data?.text_theme === "dark" ? "dark" : "light";
  const newsletterHeading = data?.newsletter_heading ?? 'Stay connected';
  const newsletterDescription = data?.newsletter_description ?? 'Join our newsletter and stay updated on the latest trends in digital design';
  const brandName = data?.brand_name ?? 'Talha';
  const email = data?.email ?? 'hello@talha.com';
  const footerBackgroundImage = data?.background_image_url?.trim() ?? '';
  const hasBackgroundImage = footerBackgroundImage.length > 0 && backgroundMode === "image";
  const isDarkTextTheme = hasBackgroundImage && textTheme === "dark";

  const headingClass = isDarkTextTheme ? "text-zinc-900" : "text-white";
  const bodyClass = isDarkTextTheme ? "text-zinc-700" : "text-zinc-400";
  const linkClass = isDarkTextTheme
    ? "text-zinc-800 text-[15px] font-medium hover:text-black transition-colors"
    : "text-zinc-300 text-[15px] font-medium hover:text-white transition-colors";
  const metaTitleClass = isDarkTextTheme ? "text-zinc-700" : "text-zinc-500";
  const legalClass = isDarkTextTheme
    ? "w-full flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] tracking-widest text-zinc-700 font-bold uppercase pt-8 border-t border-black/15"
    : "w-full flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] tracking-widest text-zinc-500 font-bold uppercase pt-8 border-t border-white/10";
  const inputClass = isDarkTextTheme
    ? "flex-grow bg-transparent text-zinc-900 rounded-none px-0 py-[18px] text-sm focus:outline-none transition-colors placeholder:text-zinc-600 font-medium"
    : "flex-grow bg-transparent text-white rounded-none px-0 py-[18px] text-sm focus:outline-none transition-colors placeholder:text-zinc-500 font-medium";
  const buttonClass = isDarkTextTheme
    ? "w-full sm:w-auto text-zinc-900 px-4 py-[18px] text-[11px] font-bold uppercase tracking-[0.2em] hover:text-zinc-700 transition-colors"
    : "w-full sm:w-auto text-white px-4 py-[18px] text-[11px] font-bold uppercase tracking-[0.2em] hover:text-white/60 transition-colors";

  return (
    <footer className="w-full px-4 pb-4 cv-auto mt-20 relative z-10 section-dark ">
      <div className="relative w-full bg-[#000000] rounded-[2rem] md:rounded-[3rem] overflow-hidden pt-24 pb-12">
        {hasBackgroundImage ? (
          <>
            <Image
              src={footerBackgroundImage}
              alt="Footer background"
              fill
              priority={false}
              quality={80}
              sizes="100vw"
              className="object-cover"
            />
            <div className={`absolute inset-0 ${isDarkTextTheme ? "bg-white/35" : "bg-black/45"}`} />
            <div className={`absolute inset-0 ${isDarkTextTheme ? "bg-gradient-to-b from-white/10 via-white/25 to-white/50" : "bg-gradient-to-b from-black/15 via-black/35 to-black/65"}`} />
          </>
        ) : null}

        <div className="relative z-10 container mx-auto px-6 md:px-8 max-w-7xl">

        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-16 lg:gap-0 mb-20 lg:mb-32 w-full mx-auto">

          {/* Newsletter (Left) */}
          <div className="w-full lg:max-w-[420px]">
            <h2 className={`text-[36px] font-medium tracking-tight mb-4 ${headingClass}`}>{newsletterHeading}</h2>
            <p className={`text-[16px] leading-[1.6] mb-10 max-w-[340px] ${bodyClass}`}>
              {newsletterDescription}
            </p>

            <form
              className={`flex flex-col sm:flex-row gap-0 w-full border-b ${isDarkTextTheme ? "border-black/20" : "border-white/20"}`}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your Email"
                required
                className={inputClass}
              />
              <button
                type="submit"
                className={buttonClass}
              >
                Submit
              </button>
            </form>
          </div>

          {/* Links (Right) */}
          <div className="flex flex-wrap md:flex-nowrap gap-16 lg:gap-24 xl:gap-32">

            {/* Explore Links */}
            <div className="flex flex-col">
              <h4 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-8 ${metaTitleClass}`}>
                Explore
              </h4>
              <ul className="flex flex-col gap-5">
                <li><a href="#" className={linkClass}>Home</a></li>
                <li><a href="#work" className={linkClass}>Projects</a></li>
                <li><a href="#services" className={linkClass}>Services</a></li>
                <li><a href="#process" className={linkClass}>Process</a></li>
                <li><a href="#contact" className={linkClass}>Contact</a></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="flex flex-col">
              <h4 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-8 ${metaTitleClass}`}>
                Social
              </h4>
              <ul className="flex flex-col gap-5">
                <li><a href="#" className={linkClass}>Twitter / X</a></li>
                <li><a href="#" className={linkClass}>Instagram</a></li>
                <li><a href="#" className={linkClass}>LinkedIn</a></li>
                <li><a href="#" className={linkClass}>GitHub</a></li>
              </ul>
            </div>

            {/* Contact Links */}
            <div className="flex flex-col">
              <h4 className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-8 ${metaTitleClass}`}>
                Contact Us
              </h4>
              <div className="flex flex-col gap-5">
                <a href={`mailto:${email}`} className={linkClass}>{email}</a>
                <span className={linkClass}>Available Worldwide</span>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Section: Massive Typography */}
        <div className="w-full relative flex justify-between items-end mb-12 md:mb-16 select-none ">

          <motion.h1
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`text-[25vw] leading-[0.72] font-medium tracking-[-0.05em] m-0 p-0 ${headingClass}`}
          >
            {brandName}
          </motion.h1>

          <div className="relative pb-[1.5vw] pr-[1vw]">


            <span className={`text-[13vw] leading-[0.72] font-bold m-0 p-0 ${headingClass}`}>
              &reg;
            </span>
          </div>

        </div>

        {/* Bottom Section: Legal & Credits */}
        <div className={legalClass}>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <div className="text-center md:text-right">
            © 2026 TALHA IRFAN — ALL RIGHTS RESERVED
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
