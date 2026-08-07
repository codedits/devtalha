"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-6 py-24 bg-background text-foreground">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-4">
          [ ERROR ]
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-display text-foreground mb-3">
          Something went wrong
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed font-sans">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium text-sm transition-opacity hover:opacity-90"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/20 text-foreground font-medium text-sm transition-colors hover:bg-foreground/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
