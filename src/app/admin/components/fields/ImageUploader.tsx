"use client";

import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";

import { Eye, Upload, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";

import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  currentUrl: string;
  onSelectFile: (file: File, previewUrl: string) => void;
  onClear?: () => void;
  onDeleteStoredImage?: () => Promise<void>;
  buttonLabel?: string;
  selectedFileName?: string;
  canDeleteStoredImage?: boolean;
  deleteSuccessMessage?: string;
  notify?: (type: "success" | "error", message: string) => void;
};

export function ImageUploader({
  currentUrl,
  onSelectFile,
  onClear,
  onDeleteStoredImage,
  buttonLabel,
  selectedFileName,
  canDeleteStoredImage,
  deleteSuccessMessage,
  notify,
}: ImageUploaderProps) {
  const hasPendingFile = Boolean(selectedFileName?.trim());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onSelectFile(file, previewUrl);
    event.target.value = "";
  };

  const handleDeleteStoredImage = async () => {
    if (!onDeleteStoredImage || !canDeleteStoredImage || isDeleting) return;

    const confirmed = window.confirm("Delete this image from the storage bucket? This action cannot be undone.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDeleteStoredImage();
      notify?.("success", deleteSuccessMessage ?? "Image deleted from storage");
    } catch (error) {
      notify?.("error", error instanceof Error ? error.message : "Image delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      {currentUrl && (
        <div className="relative group overflow-hidden rounded-md border border-zinc-300 bg-zinc-100 h-44 w-full">
          <Image
            src={currentUrl}
            alt="Preview"
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/45 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
            <Eye size={20} className="text-white" />
          </div>
        </div>
      )}
      <label
        className={cn(
          "flex items-center justify-center gap-2 rounded-md border border-dashed px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        )}
      >
        <Upload size={14} />
        {hasPendingFile ? "Change Selected Image" : buttonLabel ?? "Upload Image"}
        <input type="file" accept="image/*" onChange={handleSelect} className="hidden" />
      </label>
      {canDeleteStoredImage ? (
        <button
          type="button"
          onClick={handleDeleteStoredImage}
          disabled={isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {isDeleting ? "Deleting..." : "Delete From Bucket"}
        </button>
      ) : null}
      {hasPendingFile ? (
        <div className="flex items-center justify-between gap-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span className="truncate">Selected: {selectedFileName}</span>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] font-semibold text-amber-900 hover:bg-amber-100"
          >
            <X size={12} />
            Clear
          </button>
        </div>
      ) : null}
      {hasPendingFile ? (
        <p className="text-xs text-amber-700">Image will upload when you click Save.</p>
      ) : (
        <p className="text-xs text-zinc-500">Use this to upload a local file instead of an external URL.</p>
      )}
    </div>
  );
}
