"use client";

import Image from "next/image";

import { Eye, Loader2, Upload } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  currentUrl: string;
  onUpload: (url: string) => void;
  onProgress?: (progress: number) => void;
  buttonLabel?: string;
};

export function ImageUploader({ currentUrl, onUpload, onProgress, buttonLabel }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    onProgress?.(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const payload = await new Promise<{ url?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");

        xhr.upload.onprogress = (progressEvent) => {
          if (!progressEvent.lengthComputable) return;
          const nextProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setProgress(nextProgress);
          onProgress?.(nextProgress);
        };

        xhr.onload = () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            try {
              const payload = JSON.parse(xhr.responseText) as { error?: string };
              reject(new Error(payload.error ?? "Upload failed"));
            } catch {
              reject(new Error("Upload failed"));
            }
            return;
          }

          try {
            resolve(JSON.parse(xhr.responseText) as { url?: string });
          } catch {
            reject(new Error("Invalid upload response"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload request failed"));
        xhr.send(formData);
      });

      if (payload.url) {
        onUpload(payload.url);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      onProgress?.(0);
      event.target.value = "";
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
          "flex items-center justify-center gap-2 rounded-md border border-dashed px-4 py-2.5 text-xs font-semibold cursor-pointer transition-all",
          uploading
            ? "border-zinc-200 bg-zinc-100 text-zinc-400"
            : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50"
        )}
      >
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {uploading ? `Uploading ${progress}%` : buttonLabel ?? "Upload Image"}
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
      </label>
      {uploading && (
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
