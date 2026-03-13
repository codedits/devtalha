import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import type { WhyChooseUsSection } from '@/types/content';

export default function WhyChooseUs({ data }: { data: WhyChooseUsSection }) {
  // Chart data to mimic the upward trending bar chart
  const chartBars = [
    12, 16, 20, 24, 28,
    20, 26, 32, 38, 44,
    36, 46, 54, 62, 70,
    60, 72, 80, 88, 96,
    85, 90, 95, 98, 100
  ];

  return (
    <section className="bg-white text-black font-sans selection:bg-black selection:text-white" id="why-choose-us">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl py-16 sm:py-24 lg:py-32">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="md:w-1/4 lg:w-[20%] shrink-0 pt-3">
            <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground">
              {data.label}
            </span>
          </div>
          <div className="md:w-3/4 lg:w-[80%]">
            <h2 className="text-[1.5rem] sm:text-4xl md:text-4xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] text-black max-w-[50rem] whitespace-pre-line">
              {data.heading}
            </h2>
          </div>
        </div>

        {/* Cards Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Card 1: Main Image / Brand */}
          <div className="relative group min-h-[400px] sm:min-h-[450px] lg:min-h-[480px] bg-[#1a1a1a] overflow-hidden flex flex-col justify-between p-6 sm:p-8 rounded-2xl">
            {/* Background Image */}
            <Image
              src={data.studio_image_url}
              alt="Studio Portrait"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-80"
            />
            {/* Dark Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

            {/* Top Content */}
            <div className="relative z-10 flex justify-between items-start w-full text-white">
              <span className="font-semibold text-xl sm:text-2xl tracking-tight">{data.studio_name}</span>
              {/* Small decorative square */}
              <div className="w-5 h-5 bg-white/20 backdrop-blur-sm border border-white/30" />
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 w-full text-right text-white">
              <span className="text-sm sm:text-base font-medium">{data.studio_since}</span>
            </div>
          </div>

          {/* Card 2: Testimonial */}
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[480px] flex flex-col justify-between rounded-2xl">
            <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
              {/* Avatars */}
              <div className="flex -space-x-3 shrink-0">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User 1" width={44} height={44} sizes="44px" className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
                <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="User 2" width={44} height={44} sizes="44px" className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 3" width={44} height={44} sizes="44px" className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
                <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User 4" width={44} height={44} sizes="44px" className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
              </div>

              {/* Rating */}
              <div className="flex flex-col justify-center">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <span className="text-sm font-medium text-black">Trusted by Founders</span>
              </div>
            </div>

            <p className="text-black text-base sm:text-lg leading-snug font-medium">
              {data.testimonial_text}
            </p>
          </div>

          {/* Card 3: Stats / Chart */}
          <div className="border border-zinc-200 bg-[#f7f7f7] p-6 sm:p-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[480px] flex flex-col relative rounded-2xl">
            <div>
              <h3 className="text-6xl sm:text-7xl lg:text-[5rem] font-medium tracking-tighter text-black leading-none mb-3">
                {data.revenue_stat}
              </h3>
              <p className="text-sm sm:text-base text-black font-medium">
                {data.revenue_label}
              </p>
            </div>

            {/* Chart Area */}
            <div className="mt-auto pt-12 flex flex-col w-full">
              <div className="h-32 sm:h-40 w-full flex items-end justify-between border-b border-zinc-300 pb-2">
                {chartBars.map((height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className="w-[1px] sm:w-[2px] bg-black rounded-t-sm"
                  />
                ))}
              </div>

              {/* Chart Labels */}
              <div className="flex justify-between w-full text-[10px] sm:text-xs text-zinc-500 font-medium mt-3">
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
              </div>
            </div>
          </div>

          {/* Card 4: Info / Scale */}
          <div className="border border-zinc-200 bg-white p-6 sm:p-8 min-h-[400px] sm:min-h-[450px] lg:min-h-[480px] flex flex-col relative overflow-hidden rounded-2xl">
            <div className="relative z-10">
              <h3 className="text-6xl sm:text-7xl lg:text-[5rem] font-medium tracking-tighter text-black leading-none mb-6">
                {data.scale_stat}
              </h3>
              <p className="text-black text-base sm:text-lg leading-snug font-medium pr-4 sm:pr-8">
                {data.scale_description}
              </p>
            </div>

            {/* Decorative Abstract Arcs */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 opacity-80 text-black pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-full h-full">
                <path d="M 10 90 A 80 80 0 0 1 90 10" />
                <path d="M 30 110 A 90 90 0 0 1 110 30" />
                <path d="M -10 70 A 70 70 0 0 1 70 -10" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
