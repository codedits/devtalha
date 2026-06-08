"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlockRevealTextProps {
  text: string;
  className?: string;
  blockColor?: string;
  duration?: number;
  staggerDelay?: number;
  scrub?: boolean | number;
}

export default function BlockRevealText({
  text,
  className = "",
  blockColor = "bg-amber-400",
  duration = 0.35,
  staggerDelay = 0.08,
  scrub = 1.5,
}: BlockRevealTextProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[]>([]);

  useLayoutEffect(() => {
    const measureNode = measureRef.current;
    if (!measureNode) return;

    const calculateLines = () => {
      const words = text.trim().length > 0 ? text.split(/\s+/) : [];

      measureNode.replaceChildren();

      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word;
        measureNode.appendChild(span);

        if (index < words.length - 1) {
          measureNode.appendChild(document.createTextNode(" "));
        }
      });

      const wordSpans = measureNode.querySelectorAll<HTMLSpanElement>("span");
      const groupedLines: string[][] = [];
      let currentLineTop = -1;
      let currentLineIndex = -1;

      wordSpans.forEach((span, index) => {
        const rect = span.getBoundingClientRect();

        if (Math.abs(rect.top - currentLineTop) > 2) {
          currentLineTop = rect.top;
          currentLineIndex += 1;
          groupedLines[currentLineIndex] = [];
        }

        groupedLines[currentLineIndex].push(words[index]);
      });

      setLines(groupedLines.map((lineWords) => lineWords.join(" ")));
      measureNode.replaceChildren();
    };

    calculateLines();

    const resizeObserver = new ResizeObserver(() => {
      calculateLines();
    });

    resizeObserver.observe(wrapperRef.current ?? measureNode);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper || lines.length === 0) return;

    const ctx = gsap.context(() => {
      const lineContainers = wrapper.querySelectorAll<HTMLElement>(".reveal-line-wrapper");
      if (lineContainers.length === 0) return;

      const isScrubbed = scrub !== false;
      const scrubValue = typeof scrub === "number" ? scrub : 1.5;

      if (isScrubbed) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top 95%",
            end: "bottom 60%",
            scrub: scrubValue,
          },
        });

        lineContainers.forEach((lineContainer, index) => {
          const block = lineContainer.querySelector<HTMLElement>(".reveal-block");
          const textElement = lineContainer.querySelector<HTMLElement>(".reveal-text");

          if (!block || !textElement) return;

          const startOffset = index * staggerDelay;

          timeline
            .set(block, { transformOrigin: "left center", scaleX: 0 }, startOffset)
            .set(textElement, { opacity: 0 }, startOffset)
            .to(block, {
              scaleX: 1,
              ease: "power3.inOut",
            }, startOffset)
            .set(textElement, { opacity: 1 }, startOffset + 0.3)
            .set(block, { transformOrigin: "right center" }, startOffset + 0.3)
            .to(block, {
              scaleX: 0,
              ease: "power3.inOut",
            }, startOffset + 0.35);
        });
      } else {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        lineContainers.forEach((lineContainer, index) => {
          const block = lineContainer.querySelector<HTMLElement>(".reveal-block");
          const textElement = lineContainer.querySelector<HTMLElement>(".reveal-text");

          if (!block || !textElement) return;

          const startOffset = index * staggerDelay;

          timeline
            .set(block, { transformOrigin: "left center", scaleX: 0 }, startOffset)
            .set(textElement, { opacity: 0 }, startOffset)
            .to(block, {
              scaleX: 1,
              duration,
              ease: "power4.inOut",
            }, startOffset)
            .set(textElement, { opacity: 1 }, startOffset + duration)
            .set(block, { transformOrigin: "right center" }, startOffset + duration)
            .to(
              block,
              {
                scaleX: 0,
                duration,
                ease: "power4.inOut",
              },
              startOffset + duration + 0.05
            );
        });
      }
    }, wrapper);

    return () => {
      ctx.revert();
    };
  }, [duration, lines, scrub, staggerDelay]);

  const isHexOrRgb =
    blockColor.startsWith("#") ||
    blockColor.startsWith("rgb") ||
    blockColor.startsWith("hsl");

  const blockClassName = isHexOrRgb ? "" : blockColor;
  const blockStyle = isHexOrRgb ? { backgroundColor: blockColor } : {};

  return (
    <span ref={wrapperRef} className={`relative block w-full ${className}`}>
      {/* Screen-reader accessible layout anchor */}
      <span className="block w-full whitespace-normal select-text opacity-0">
        {text}
      </span>

      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 block w-full opacity-0 whitespace-normal"
      />

      {/* Visually animated lines (ignored by screen readers to prevent double-reading) */}
      <span className="absolute inset-0 block w-full pointer-events-none" aria-hidden="true">
        {lines.map((lineText, index) => (
          <span
            key={`${lineText}-${index}`}
            className="reveal-line-wrapper relative block w-full py-0.5 clear-both"
          >
            <span className="reveal-text block select-text opacity-0">
              {lineText}
            </span>

            <span
              className={`reveal-block absolute -top-[8%] -bottom-[8%] left-0 right-0 z-10 ${blockClassName}`}
              style={{
                ...blockStyle,
                transform: "scaleX(0)",
                transformOrigin: "left center",
                willChange: "transform",
              }}
            />
          </span>
        ))}
      </span>
    </span>
  );
}