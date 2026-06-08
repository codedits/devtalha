"use client";

import Image from "next/image";
import { isVideoUrl } from "@/lib/media";
import { forwardRef } from "react";

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
    if (!src) return null;

    if (isVideoUrl(src)) {
      return (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
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
