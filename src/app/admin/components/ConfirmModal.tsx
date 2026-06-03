"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  imagesToPurge?: string[];
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  imagesToPurge = [],
}: ConfirmModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-900 leading-6">{title}</h3>
            <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{message}</p>

            {/* Images to purge section */}
            {imagesToPurge.length > 0 && (
              <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200 p-3">
                <p className="text-xs font-semibold text-zinc-700 mb-2">
                  Also deletes {imagesToPurge.length} associated storage {imagesToPurge.length === 1 ? "file" : "files"}:
                </p>
                <div className="flex gap-2 overflow-x-auto py-1 max-w-full scrollbar-thin">
                  {imagesToPurge.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100"
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        unoptimized
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-row-reverse gap-3 border-t border-zinc-100 pt-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
            {confirmText}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
