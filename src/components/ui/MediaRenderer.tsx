"use client";

import Image from "next/image";
import { isVideoUrl } from "@/lib/media";
import { forwardRef, useState, useEffect, useRef } from "react";

type MediaRendererProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  videoClassName?: string;
  onLoad?: () => void;
  imageRef?: React.Ref<HTMLImageElement>;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
};

/**
 * Universal media renderer. Detects whether `src` is a video URL
 * (by file extension) and renders either a Next.js `<Image>` or a
 * muted, looping `<video>`. Drop-in replacement for `<Image>`.
 * Includes advanced lazy-loading performance optimizations for videos.
 */
const MediaRenderer = forwardRef<HTMLVideoElement, MediaRendererProps>(
  function MediaRenderer(
    {
      src,
      alt,
      fill,
      sizes,
      quality,
      priority,
      fetchPriority,
      className,
      videoClassName,
      onLoad,
      imageRef,
      controls,
      muted = true,
      loop = true,
      autoPlay = true,
    },
    videoRef
  ) {
    const internalVideoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(Boolean(priority));

    useEffect(() => {
      if (priority || shouldLoadVideo || !isVideoUrl(src)) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.disconnect();
          }
        },
        { rootMargin: "400px" } // Prefetch 400px before coming into viewport
      );

      const currentVideoEl = internalVideoRef.current;
      if (currentVideoEl) {
        observer.observe(currentVideoEl);
      }

      return () => {
        observer.disconnect();
      };
    }, [src, priority, shouldLoadVideo]);

    if (!src) return null;

    if (isVideoUrl(src)) {
      return (
        <video
          ref={(node) => {
            // Assign to internal ref for observer
            internalVideoRef.current = node;
            // Assign to forwarded ref if present
            if (typeof videoRef === "function") {
              videoRef(node);
            } else if (videoRef) {
              videoRef.current = node;
            }
          }}
          src={shouldLoadVideo ? src : undefined}
          autoPlay={shouldLoadVideo ? autoPlay : false}
          muted={muted}
          loop={loop}
          controls={controls}
          preload={priority ? "auto" : "metadata"}
          playsInline
          onLoadedData={() => onLoad?.()}
          className={videoClassName ?? className ?? (fill ? "absolute inset-0 h-full w-full object-cover" : "")}
        />
      );
    }

    return (
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        quality={quality ?? 80}
        priority={priority}
        fetchPriority={fetchPriority}
        className={className ?? "object-cover"}
        onLoad={() => onLoad?.()}
      />
    );
  }
);

export default MediaRenderer;
